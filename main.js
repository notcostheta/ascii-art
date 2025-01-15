const ascii = new ImageToASCII();
let currentImage = null;

// Helper function to update the ASCII art
function updateAsciiArt() {
    if (!currentImage) return;
    ascii.convert(currentImage);
}

// File input handler
document.getElementById('imageInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                currentImage = img;
                updateAsciiArt();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Control handlers
document.getElementById('scaleSelect').addEventListener('change', (e) => {
    ascii.setScale(e.target.value);
    updateAsciiArt();
});

document.getElementById('widthRange').addEventListener('input', (e) => {
    document.getElementById('widthValue').textContent = e.target.value;
    ascii.setAsciiWidth(parseInt(e.target.value));
    updateAsciiArt();
});

document.getElementById('brightnessRange').addEventListener('input', (e) => {
    document.getElementById('brightnessValue').textContent = e.target.value;
    ascii.setBrightness(parseInt(e.target.value));
    updateAsciiArt();
});

document.getElementById('contrastRange').addEventListener('input', (e) => {
    document.getElementById('contrastValue').textContent = e.target.value;
    ascii.setContrast(parseInt(e.target.value));
    updateAsciiArt();
});

document.getElementById('saturationRange').addEventListener('input', (e) => {
    document.getElementById('saturationValue').textContent = e.target.value;
    ascii.setSaturation(parseInt(e.target.value));
    updateAsciiArt();
});

document.getElementById('spaceDensityRange').addEventListener('input', (e) => {
    document.getElementById('spaceDensityValue').textContent = e.target.value;
    ascii.setSpaceDensity(parseInt(e.target.value));
    updateAsciiArt();
});

document.getElementById('edgeDetectionCheck').addEventListener('change', (e) => {
    ascii.setEdgeDetection(e.target.checked);
    updateAsciiArt();
});

document.getElementById('edgeIntensityRange').addEventListener('input', (e) => {
    document.getElementById('edgeIntensityValue').textContent = e.target.value;
    ascii.setEdgeIntensity(parseFloat(e.target.value));
    updateAsciiArt();
});

document.getElementById('ditheringSelect').addEventListener('change', (e) => {
    ascii.setDithering(e.target.value);
    updateAsciiArt();
});

document.getElementById('sharpenCheck').addEventListener('change', (e) => {
    ascii.setUseSharpen(e.target.checked);
    updateAsciiArt();
});

document.getElementById('sharpnessRange').addEventListener('input', (e) => {
    document.getElementById('sharpnessValue').textContent = e.target.value;
    ascii.setSharpness(parseInt(e.target.value));
    updateAsciiArt();
});

// Download button handler
document.getElementById('downloadBtn').addEventListener('click', () => {
    const text = ascii.getAsciiText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    a.click();
    URL.revokeObjectURL(url);
});

// Copy button handler
document.getElementById('copyBtn').addEventListener('click', () => {
    const text = ascii.getAsciiText();
    navigator.clipboard.writeText(text).then(() => {
        alert('ASCII art copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard');
    });
});
