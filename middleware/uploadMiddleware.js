// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const profileUploadDir = path.join(__dirname, '../uploads/profiles');
// const serviceUploadDir = path.join(__dirname, '../uploads');

// // Ensure directories exist
// if (!fs.existsSync(profileUploadDir)) {
//     fs.mkdirSync(profileUploadDir, { recursive: true });
// }
// if (!fs.existsSync(serviceUploadDir)) {
//     fs.mkdirSync(serviceUploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isProfilePhoto = req.originalUrl.includes('/auth/upload-photo');
//         cb(null, isProfilePhoto ? profileUploadDir : serviceUploadDir);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only image files are allowed!"), false);
//     }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;


const multer = require('multer');
const path = require('path');
const fs = require('fs');

const profileUploadDir = path.join(__dirname, '../uploads/profiles');
const serviceUploadDir = path.join(__dirname, '../uploads');

// Ensure directories exist
if (!fs.existsSync(profileUploadDir)) {
    fs.mkdirSync(profileUploadDir, { recursive: true });
}
if (!fs.existsSync(serviceUploadDir)) {
    fs.mkdirSync(serviceUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isProfilePhoto = req.originalUrl.includes('/auth/upload-photo');
        cb(null, isProfilePhoto ? profileUploadDir : serviceUploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

