const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png)$/i)) { // Case-insensitive extension check
      return cb(new Error('Only PNG files are allowed!'));
    }
    cb(null, true);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-screenshot', upload.single('screenshot'), (req, res) => {
  const screenshot = req.file;
  if (!screenshot) {
    return res.status(400).send('No screenshot uploaded or invalid file type.');
  }

  console.log('Screenshot saved successfully:', screenshot.filename);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});