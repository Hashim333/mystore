const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  // image: { type: String, required: true },
  description: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now },
    }
  ],
  // sizeChart: {
  //   type: Map,
  //   of: String,
  // },
  discount: { type: Number, default: 0 },
  tags: [String],
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      date: { type: Date, default: Date.now }
    }
  ],
  color: { type: String },  
  sizes: [
    {
      size: { type: String, required: true },
      stock: { type: Number, required: true }, 
    }
  ],  
  image: { type: String },  
});

const Product = mongoose.model("Product", productSchema); 
module.exports = Product;
