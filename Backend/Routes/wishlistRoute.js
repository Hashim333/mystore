const express = require("express");
const router = express.Router();
const Wishlist = require("../Model/wishlistModel");
const Product = require("../Model/productModel");
const mongoose=require("mongoose")

// Add product to wishlist
router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing userId or productId" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid userId or productId" });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const existingWishlistItem = wishlist.products.some(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingWishlistItem) {
      return res.status(409).send({ message: "Product already in wishlist", productId });
    }else{

    // Ensure productId is added to the wishlist correctly
    wishlist.products.push({ productId: productId });  // Explicitly using `productId: productId`
}
    await wishlist.save();

    return res.status(200).send({
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).send({ message: "Error adding to wishlist", error: error.message });
  }
});


// Remove product from wishlist
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.query;

  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
      await wishlist.save();
      res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing product from wishlist", error });
  }
});

// Get wishlist for a user
router.get("/find/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate("products.productId");

    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }

    res.status(200).json({ products: wishlist.products });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
});

module.exports = router;
