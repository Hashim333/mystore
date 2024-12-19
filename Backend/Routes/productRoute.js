const express = require("express");
const router = express.Router();
const productController = require("../Controller/productController");

// Product routes
router.post("/add", productController.addProduct);
router.get("/get", productController.getProduct);
router.get("/get/seller", productController.getsellerProducts);

router.get("/:id",productController.getProductById)
router.put("/update/:id", productController.updateProduct); // Corrected
router.delete("/delete/:id", productController.deleteProduct); // Corrected


router.get("/orders", async (req, res) => {
    const { productId } = req.query;
    
    try {
      const filter = productId ? { "products.productId": productId } : {};
      const orders = await Order.find(filter)
        .populate("userId", "name email")
        .populate("products.productId", "name price image");
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });
  
module.exports = router;
