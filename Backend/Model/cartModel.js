const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [
        { 
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true,},
            size: { type: String, required: true },
            quantity: { type: Number,
                 required: true,
                  default: 1 ,
                  min: [1, 'Quantity must be at least 1']},
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
