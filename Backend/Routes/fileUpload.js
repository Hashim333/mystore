const express = require('express');
const router = express.Router();
const uploadImage = require('../Config/multerconfig.js');
const Image = require('../Model/imageSchema.js');



router.post('/', uploadImage, async (req, res) => {
    console.log("file",req.file);
    
  if (req.file) {
    // Save file information to the database
    const image = new Image({ filename: req.file.filename });
    await image.save();

    return res.status(200).json({
      success: true,
      message: 'Image uploaded!',
    });
  }

  return res.status(400).json({
    success: false,
    error: 'Image upload failed!',
  });
});

module.exports = router;
