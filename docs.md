### [server.js](file:///d%3A/Code/asciithing/api/server.js)
Create an Express.js server to handle the API requests.

```javascript


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
```

### package.json
Create a package.json file for the API dependencies.

```json


Made changes.

{
  "name": "ascii-art-api",
  "version": "1.0.0",
  "description": "API for ASCII art conversion",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "canvas": "^2.11.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

To use the API:

1. Install dependencies:
```bash
cd api
npm install
```

2. Start the server:
```bash
npm start
```

3. Make API requests:

Example using cURL:
```bash
curl -X POST \
  http://localhost:3000/convert \
  -H 'Content-Type: multipart/form-data' \
  -F 'image=@/path/to/image.jpg' \
  -F 'width=216' \
  -F 'brightness=77' \
  -F 'contrast=100' \
  -F 'saturation=100' \
  -F 'spaceDensity=3' \
  -F 'edgeDetection=true' \
  -F 'edgeIntensity=1.1' \
  -F 'useSharpen=true' \
  -F 'sharpness=9' \
  -F 'dithering=FloydSteinberg' \
  -F 'scale=normal'
```

Example using fetch in JavaScript:
```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('width', '216');
formData.append('brightness', '77');
// ... add other parameters

fetch('http://localhost:3000/convert', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data.ascii));
```

The API accepts all the same parameters as the web interface and returns the ASCII art as text. The response includes both the ASCII art and the parameters used for the conversion.

Made changes.