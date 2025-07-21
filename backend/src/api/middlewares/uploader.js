const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = req.uploadOptions.destination; 
    cb(null, `./public/uploads/${dest}`);
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    if (!userId) {
      return cb(new Error('User not authenticated.'), false);
    }
    const prefix = req.uploadOptions.prefix;
    const uniqueSuffix = `${prefix}-${userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

function checkFileType(req, file, cb) {
  if (!file.originalname) {
    return cb(new Error('Invalid file: The uploaded file has no name.'));
  }

  const filetypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Error: Only image or PDF files are allowed!'));
  }
}


/**
 * A factory function to create a configured Multer upload middleware.
 * @param {object} options - Configuration for the uploader.
 * @param {string} options.type - The type of upload ('single' or 'array').
 * @param {string} options.fieldName - The name of the form field for the file(s).
 * @param {string} options.destination - The sub-folder inside './public/uploads'.
 * @param {string} options.prefix - A prefix for the filename (e.g., 'avatar', 'page').
 * @param {number} [options.maxCount=5] - The max number of files for an 'array' upload.
 */
const createUploader = (options) => (req, res, next) => {
  // Attach options to the request object so 'storage' can access them
  req.uploadOptions = options; 

  const uploader = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: checkFileType,
  });

  // Depending on the type, configure Multer for a single file or an array of files
  if (options.type === 'single') {
    return uploader.single(options.fieldName)(req, res, next);
  } else if (options.type === 'array') {
    const maxCount = options.maxCount || 5;
    return uploader.array(options.fieldName, maxCount)(req, res, next);
  } else {
    return next(new ApiError(500, 'Invalid uploader type specified.'));
  }
};

module.exports = createUploader;