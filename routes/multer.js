const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    cb(null, uniqueFilename + path.extname(file.originalname));
  },
  fileFilter: function (req, file, cb) {
    // Check if the file is a video
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime']; // Add more as needed
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'), false);
    }
  },
});

module.exports = multer({ storage: storage });
