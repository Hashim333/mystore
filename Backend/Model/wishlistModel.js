const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
  userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
       required: true },
       products: [
        {
          productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
          },
          addedAt: { 
            type: Date, 
            default: Date.now   
          } // Track when the product was added
        }
      ]
}, { timestamps: true });
wishlistSchema.index({ userId: 1 });
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
