const fs =require('fs').promises;
const multer=require("multer");
const path=require("path")
const MIME_TYPES={
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png',
    'image/gif':'gif',

};
const dir='public/uploads/images';
// const dir = path.join(__dirname, 'public/uploads/images');
console.log('Directory path:', dir); // Log the directory path

const storage=multer.diskStorage({
    destination:async(req,file,callback)=>{
        try{
            await fs.mkdir(dir,{ recursive: true });
            callback(null,dir);

        }catch (error){
            console.error('Error creating directory:', error);
            callback(error);

        }
    },
    filename:(req,file,callback)=>{
        const name=file.originalname.split(' ').join('_');
        const extension=MIME_TYPES[file.mimetype];

        if (!extension) {
            return callback(new Error('Invalid file type'), false);
        }
        callback(null,Date.now()+'.'+extension);
    }
});
const fileFilter=(req,file,cb)=>{
    if(!MIME_TYPES[file.mimetype]){
        cb('File must be an image',false)
    }else{
        cb (null,true);
    }
};
module.exports=multer({
    storage:storage,
    limits:{fileSize:2000000},
    fileFilter,
}).single('image');
// const fs = require('fs').promises;
// const multer = require('multer');
// const path =require("path")
// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png',
//     'image/gif': 'gif'
// };

// const dir = path.join(__dirname, 'public/uploads/images');


// const storage = multer.diskStorage({
//     destination: async (req, file, callback) => {
//         try {
//             // Ensure directory exists
//             await fs.mkdir(dir, { recursive: true });
//             callback(null, dir);
//         } catch (error) {
//             callback(error); // Pass only the error if directory creation fails
//         }
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIME_TYPES[file.mimetype];

//         // Ensure extension is valid
//         if (!extension) {
//             return callback(new Error('Invalid file type'), false);
//         }

//         callback(null, Date.now() + '_' + name + '.' + extension);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (!MIME_TYPES[file.mimetype]) {
//         return callback(new Error('File must be an image'), false);
//     }
//     cb(null, true);
// };

// module.exports = multer({
//     storage: storage,
//     limits: { fileSize: 2000000 }, // Max file size 2MB
//     fileFilter: fileFilter,
// }).single('image');
