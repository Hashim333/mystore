const express = require('express');
const router = express.Router();

const offers = [
  {
    title: 'Winter Sale',
    description: 'Get up to 50% off on winter collections!',
    image: 'https://i.pinimg.com/236x/92/1e/93/921e93d7a9cf44af2c94cf79e263f91c.jpg',
  },
  {
    title: 'New Year Deals',
    description: 'Special offers for the new year!',
    image: 'https://i.pinimg.com/236x/3f/cc/0b/3fcc0bd5113b1ad705c374093227e5c3.jpg',
  },
  // Add more offers as needed
];

router.get('/api/offers', (req, res) => {
  res.json(offers);
});

module.exports = router;
