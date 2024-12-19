const express = require('express');
const router = express.Router();
const Image = require('../Model/imageSchema'); // Correct model name spelling 
router.get('/', async (req, res) => {
    try {
        
        const imageFilenames = await Image.find(); 

        
        console.log('image filenames:', imageFilenames);

        // Return the image filenames in the response
        res.json({ imageFilenames });
    } catch (error) {
        // Handle errors that may occur during file retrieval or database operations
        console.error('Error reading image directory or fetching images:', error);
        res.status(500).json({ error: 'Error reading image directory or fetching images' });
    }
});

module.exports = router;
