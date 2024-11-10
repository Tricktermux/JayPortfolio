
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const uploadDir = path.join(__dirname, 'public', 'records', 'pics');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    res.json({ message: "Image uploaded successfully!", filename: req.file.filename, filePath: `/records/pics/${req.file.filename}` });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

const PORT = process.env.PORT || 25701;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
