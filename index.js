const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();

const uploadDir = path.join(__dirname, 'public', 'records', 'pics');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage with automatic file extension
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg'; // Default to '.jpg' if no extension
        cb(null, `${Date.now()}${ext}`);
    }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    cb(null, allowedTypes.includes(file.mimetype) ? true : new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
};

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    res.json({ message: "Image uploaded successfully!", filename: req.file.filename, filePath: `/records/pics/${req.file.filename}` });
});

// Endpoint to list all files
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to scan directory: " + err });
        }
        const fileList = files.map(file => ({
            name: file,
            path: `/records/pics/${file}` // Full filename with extension
        }));
        res.json(fileList);
    });
});

// Serve portfolio page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

// Start the server
const PORT = process.env.PORT || 25701;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
