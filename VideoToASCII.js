class VideoToASCII {
    constructor(ascii) {
        this.ascii = ascii;
        this.isPlaying = false;
        this.frameRate = 24;
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    loadVideo(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            this.video.src = url;
            this.video.onloadedmetadata = () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                resolve();
            };
            this.video.onerror = reject;
        });
    }

    start() {
        this.isPlaying = true;
        this.video.play();
        this.render();
    }

    stop() {
        this.isPlaying = false;
        this.video.pause();
    }

    render() {
        if (!this.isPlaying) return;

        // Clear canvas before each frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw current video frame
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Convert frame to ASCII with current settings
        this.ascii.convert(this.canvas);

        // Schedule next frame with proper timing
        setTimeout(() => {
            requestAnimationFrame(() => this.render());
        }, 1000 / this.frameRate);
    }

    renderFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        this.ascii.convert(this.canvas);
    }

    setFrameRate(fps) {
        this.frameRate = fps;
    }

    getCurrentTime() {
        return this.video.currentTime;
    }

    getDuration() {
        return this.video.duration;
    }

    seek(time) {
        this.video.currentTime = time;
    }

    setLoop(enabled) {
        this.video.loop = enabled;
    }

    // New export methods
    async extractFrames(progressCallback) {
        const frames = [];
        this.video.currentTime = 0;
        
        while (this.video.currentTime < this.video.duration) {
            // Wait for frame to be ready
            await new Promise(resolve => {
                this.video.onseeked = resolve;
                if (this.video.currentTime >= this.video.duration) {
                    resolve();
                }
            });

            // Render and store frame
            this.renderFrame();
            frames.push({
                time: this.video.currentTime,
                ascii: this.ascii.getAsciiText()
            });

            // Update progress
            if (progressCallback) {
                const progress = (this.video.currentTime / this.video.duration) * 100;
                progressCallback(progress);
            }

            // Move to next frame
            this.video.currentTime += 1 / this.frameRate;
        }

        return frames;
    }

    async exportToVideo(progressCallback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const stream = canvas.captureStream(this.frameRate);
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000
        });

        const chunks = [];
        mediaRecorder.ondataavailable = e => chunks.push(e.data);

        // Set up promise for completion
        const recordingDone = new Promise(resolve => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };
        });

        // Start recording
        mediaRecorder.start();
        this.video.currentTime = 0;

        while (this.video.currentTime < this.video.duration) {
            await new Promise(resolve => {
                this.video.onseeked = resolve;
                if (this.video.currentTime >= this.video.duration) {
                    resolve();
                }
            });

            // Render frame
            this.renderFrame();
            
            // Draw ASCII output to canvas
            this.drawAsciiToCanvas(canvas, ctx);

            // Update progress
            if (progressCallback) {
                const progress = (this.video.currentTime / this.video.duration) * 100;
                progressCallback(progress);
            }

            // Move to next frame
            this.video.currentTime += 1 / this.frameRate;
        }

        mediaRecorder.stop();
        return recordingDone;
    }

    drawAsciiToCanvas(canvas, ctx) {
        const ascii = this.ascii.getAsciiText();
        const lines = ascii.split('\n');
        const lineHeight = 10;
        const fontSize = 8;

        // Calculate dimensions maintaining aspect ratio
        const originalAspectRatio = this.video.videoWidth / this.video.videoHeight;
        const desiredWidth = lines[0].length * fontSize;
        const desiredHeight = lines.length * lineHeight;
        
        // Adjust canvas size to maintain aspect ratio
        if (desiredWidth / desiredHeight > originalAspectRatio) {
            // Width is too large, adjust based on height
            canvas.height = desiredHeight;
            canvas.width = desiredHeight * originalAspectRatio;
        } else {
            // Height is too large, adjust based on width
            canvas.width = desiredWidth;
            canvas.height = desiredWidth / originalAspectRatio;
        }

        // Scale context to fit ASCII art
        const scale = Math.min(
            canvas.width / desiredWidth,
            canvas.height / desiredHeight
        );

        // Clear and set background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center the ASCII art
        ctx.translate(
            (canvas.width - desiredWidth * scale) / 2,
            (canvas.height - desiredHeight * scale) / 2
        );
        ctx.scale(scale, scale);

        // Draw ASCII text
        ctx.fillStyle = 'white';
        ctx.font = `${fontSize}px monospace`;
        lines.forEach((line, i) => {
            ctx.fillText(line, 0, (i + 1) * lineHeight);
        });

        // Reset transformation
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
