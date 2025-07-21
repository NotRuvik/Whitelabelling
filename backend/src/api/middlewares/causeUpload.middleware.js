const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

// Storage and file type check logic remains the same
const storage = multer.diskStorage({
    destination: './public/uploads/causes',
    filename: function(req, file, cb) {
        cb(null, `cause-${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    if (filetypes.test(path.extname(file.originalname).toLowerCase()) && filetypes.test(file.mimetype)) {
        return cb(null, true);
    } else {
        cb(new ApiError(400, 'Error: You can only upload image files!'));
    }
}

// ✨ FIX: Use .fields() to define both 'mainImage' (single) and 'otherImages' (multiple).
const causeUpload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => checkFileType(file, cb)
}).fields([
    { name: 'mainImage', maxCount: 1 },
    // Tell multer to accept an array of up to 4 files for the 'otherImages' field
    { name: 'otherImages', maxCount: 4 } 
]);

module.exports = causeUpload;