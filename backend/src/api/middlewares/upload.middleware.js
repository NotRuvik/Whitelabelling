const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/apiError');

const storage = multer.diskStorage({
    destination: './public/uploads/avatars',
    filename: function(req, file, cb){
      const userId = req.user.userId || req.user.id || req.user._id;

      if (!userId) {
          return cb(new Error('Could not determine user ID for filename from token.'));
      }

      cb(null, 'avatar-' + userId + '-' + Date.now() + path.extname(file.originalname));
    }
});

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb(new ApiError(400, 'Error: Images Only!'));
    }
}


const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('profilePhoto');

module.exports = upload;