const express = require('express');
const router = express.Router();
const {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  deleteSeller,
  getSellerOrders,
  getSellerProducts,
  updateOrderStatus,
} = require('../Controller/sellerController');
const{getsellerProduct}=require('../Controller/productController');
Product=require("../Model/productModel");
// Routes
router.post('/register', registerSeller);
router.post('/login', loginSeller);

router.get('/:id', getSellerProfile);
router.put('/update/:id', updateSellerProfile);
router.delete('/:id', deleteSeller);

router.get('/products/:id', getsellerProduct);
router.get('/get/:sellerId',getSellerOrders)
router.post("/updateOrderStatus/:orderId",updateOrderStatus)
// router.get('/seller/products/:sellerId', async (req, res) => {
//   try {
//     const { sellerId } = req.params;
//     const products = await Product.find({ sellerId });
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch products", error });
//   }
// });
module.exports = router;
