const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createCanvas, loadImage } = require('canvas');
const ImageToASCII = require('../ImageToASCII');

const app = express();
const upload = multer({ limits: { fileSize: 5242880 } }); // 5MB limit
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock document object for ImageToASCII
global.document = {
    getElementById: () => ({
        textContent: '',
        getContext: () => ({
            drawImage: () => {},
            getImageData: () => ({ data: new Uint8Array() }),
            putImageData: () => {}
        })
    })
};

app.post('/convert', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Get parameters from request
        const params = {
            width: parseInt(req.body.width) || 216,
            brightness: parseInt(req.body.brightness) || 77,
            contrast: parseInt(req.body.contrast) || 100,
            saturation: parseInt(req.body.saturation) || 100,
            spaceDensity: parseInt(req.body.spaceDensity) || 3,
            edgeDetection: req.body.edgeDetection === 'true',
            edgeIntensity: parseFloat(req.body.edgeIntensity) || 1.1,
            useSharpen: req.body.useSharpen === 'true',
            sharpness: parseInt(req.body.sharpness) || 9,
            dithering: req.body.dithering || 'FloydSteinberg',
            scale: req.body.scale || 'normal'
        };

        // Create canvas and load image
        const image = await loadImage(req.file.buffer);
        const ascii = new ImageToASCII(
            params.width,
            params.scale,
            params.brightness,
            params.contrast,
            0, // invert
            params.sharpness,
            params.useSharpen,
            params.saturation,
            0, // sepia
            0, // hue
            0, // grayscale
            params.dithering,
            'none', // thresholdType
            128, // thresholdOffset
            params.edgeIntensity,
            params.edgeDetection,
            params.spaceDensity,
            0 // transparentFrame
        );

        // Convert image
        ascii.convert(image);
        const asciiText = ascii.getAsciiText();

        res.json({
            ascii: asciiText,
            params: params
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to convert image' });
    }
});

app.listen(port, () => {
    console.log(`ASCII Art API running on port ${port}`);
});
