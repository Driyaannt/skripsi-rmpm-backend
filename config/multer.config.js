// config/multer.config.js
const multer = require('multer');
const path = require('path');

module.exports = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.xlsx', '.xls'].includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file Excel yang diperbolehkan'), false);
        }
    }
});