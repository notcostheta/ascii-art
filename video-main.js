const ascii = new ImageToASCII();
const videoAscii = new VideoToASCII(ascii);

// Time formatting helper
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Video input handler
document.getElementById('videoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        await videoAscii.loadVideo(file);
        
        // Update duration display
        const duration = videoAscii.getDuration();
        document.getElementById('duration').textContent = formatTime(duration);
        document.getElementById('timeSlider').max = duration;
    }
});

// Playback controls
document.getElementById('playBtn').addEventListener('click', () => {
    videoAscii.start();
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    videoAscii.stop();
});

document.getElementById('timeSlider').addEventListener('input', (e) => {
    videoAscii.seek(parseFloat(e.target.value));
    document.getElementById('currentTime').textContent = formatTime(e.target.value);
});

document.getElementById('fpsRange').addEventListener('input', (e) => {
    document.getElementById('fpsValue').textContent = e.target.value;
    videoAscii.setFrameRate(parseInt(e.target.value));
});

// Update time slider during playback
setInterval(() => {
    if (videoAscii.isPlaying) {
        const currentTime = videoAscii.getCurrentTime();
        document.getElementById('timeSlider').value = currentTime;
        document.getElementById('currentTime').textContent = formatTime(currentTime);
    }
}, 1000);

// ASCII parameter control handlers
document.getElementById('scaleSelect').addEventListener('change', (e) => {
    ascii.setScale(e.target.value);
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('widthRange').addEventListener('input', (e) => {
    document.getElementById('widthValue').textContent = e.target.value;
    ascii.setAsciiWidth(parseInt(e.target.value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('brightnessRange').addEventListener('input', (e) => {
    document.getElementById('brightnessValue').textContent = e.target.value;
    ascii.setBrightness(parseInt(e.target.value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('contrastRange').addEventListener('input', (e) => {
    document.getElementById('contrastValue').textContent = e.target.value;
    ascii.setContrast(parseInt(e.target.value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('saturationRange').addEventListener('input', (e) => {
    document.getElementById('saturationValue').textContent = e.target.value;
    ascii.setSaturation(parseInt(e.target.value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('spaceDensityRange').addEventListener('input', (e) => {
    document.getElementById('spaceDensityValue').textContent = e.target.value;
    ascii.setSpaceDensity(parseInt(e.target.value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('edgeDetectionCheck').addEventListener('change', (e) => {
    ascii.setEdgeDetection(e.target.checked);
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('edgeIntensityRange').addEventListener('input', (e) => {
    document.getElementById('edgeIntensityValue').textContent = e.target.value;
    ascii.setEdgeIntensity(parseFloat(e.target.value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('sharpenCheck').addEventListener('change', (e) => {
    ascii.setUseSharpen(e.target.checked);
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('sharpnessRange').addEventListener('input', (e) => {
    const value = parseFloat(e.target.value).toFixed(1);
    document.getElementById('sharpnessValue').textContent = value;
    ascii.setSharpness(parseFloat(value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('ditheringSelect').addEventListener('change', (e) => {
    ascii.setDithering(e.target.value);
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('loopCheck').addEventListener('change', (e) => {
    videoAscii.setLoop(e.target.checked);
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('invertRange').addEventListener('input', (e) => {
    document.getElementById('invertValue').textContent = e.target.value;
    ascii.setInvert(parseInt(e.target.value));
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

// Font size handler
document.getElementById('fontSizeRange').addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    const lineHeight = Math.ceil(size * 1.2); // Keep consistent with VideoToASCII
    
    document.getElementById('fontSizeValue').textContent = size;
    
    // Update preview with proper aspect ratio
    const output = document.getElementById('output');
    output.style.fontSize = `${size}px`;
    output.style.lineHeight = `${lineHeight}px`;
    output.style.letterSpacing = `${size * 0.1}px`; // Add slight letter spacing for better aspect ratio
    
    videoAscii.setFontSize(size);
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

// Color picker handlers
document.getElementById('bgColorPicker').addEventListener('input', (e) => {
    const color = e.target.value;
    videoAscii.setBackgroundColor(color);
    document.getElementById('output').style.backgroundColor = color;
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

document.getElementById('fgColorPicker').addEventListener('input', (e) => {
    const color = e.target.value;
    videoAscii.setForegroundColor(color);
    document.getElementById('output').style.color = color;
    if (!videoAscii.isPlaying) {
        videoAscii.renderFrame();
    }
});

// Export handlers
document.getElementById('exportVideoBtn').addEventListener('click', async () => {
    const progressDiv = document.getElementById('exportProgress');
    const progressBar = progressDiv.querySelector('progress');
    const progressText = progressDiv.querySelector('span');
    
    progressDiv.style.display = 'block';
    videoAscii.stop();

    try {
        const blob = await videoAscii.exportToVideo(progress => {
            progressBar.value = progress;
            progressText.textContent = `${Math.round(progress)}%`;
        });

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-video.webm';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export video');
    } finally {
        progressDiv.style.display = 'none';
    }
});

document.getElementById('exportTextBtn').addEventListener('click', async () => {
    const progressDiv = document.getElementById('exportProgress');
    const progressBar = progressDiv.querySelector('progress');
    const progressText = progressDiv.querySelector('span');
    
    progressDiv.style.display = 'block';
    videoAscii.stop();

    try {
        const frames = await videoAscii.extractFrames(progress => {
            progressBar.value = progress;
            progressText.textContent = `${Math.round(progress)}%`;
        });

        // Create JSON file with frames
        const json = JSON.stringify(frames, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-frames.json';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export frames');
    } finally {
        progressDiv.style.display = 'none';
    }
});
