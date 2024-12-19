
const express = require('express');
const router = express.Router();
const Cart = require('../Model/cartModel');
const Product = require('../Model/productModel');
// const express = require('express');
// const router = express.Router();
// const Cart = require('../Model/cartModel'); // Ensure this path is correct
// // const User = require('../Routes/');
// const Product=require('../Model/productModel')




    router.post('/add', async (req, res) => {
        const { userId, productId, size, quantity = 1 } = req.body;

        if (!size) {
            return res.status(400).json({ message: "Size is required" });
        }

        try {
            // Find or create a cart for the user
            let userCart = await Cart.findOne({ userId });
            if (!userCart) {
                userCart = new Cart({ userId, items: [] });
            }

            // Find the product
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            // Check if the size exists and has sufficient stock
            const sizeEntry = product.sizes.find((s) => s.size.toLowerCase() === size.toLowerCase());

                if (!sizeEntry) {
                    return res.status(400).json({ message: `Size '${size}' is not available for this product.` });
                }
            // if (!sizeEntry || sizeEntry.stock < quantity) {
            //     return res.status(400).json({ message: "Insufficient stock for the selected size" });
            // }
            if (sizeEntry.stock < quantity) {
                return res.status(400).json({ message: `Insufficient stock for size: ${size}` });
            }
            // Check if the product with the same size is already in the cart
            const existingCartItem = userCart.items.find(
                (item) => item.product.toString() === productId && item.size === size
            );

            if (existingCartItem) {
                // Product with the same size already in cart
                return res.status(409).json({ message: "Product with selected size already in cart" });
            } else {
                // Add the new product and size to the cart
                userCart.items.push({
                    product,
                    size, // Add size to the cart item
                    quantity,
                });

                // Reduce stock for the selected size
                sizeEntry.stock -= quantity;
            }

            // Save the cart and product updates
            await userCart.save();
            await product.save();

            return res.status(200).json({ message: "Product added to cart", cart: userCart });
        } catch (error) {
            console.error("Error adding to cart:", error);
            return res.status(500).json({ message: "Error adding to cart", error: error.message });
        }
    });







// Route to remove a product from the cart
router.delete('/remove', async (req, res) => {
    const { userId, productId ,size} = req.query; // Get userId and productId from query parameters

    // console.log("Received userId:", userId); // Log userId
    // console.log("Received productId:", productId);
    if (!userId || !productId||!size) {
        return res.status(400).json({ message: "Missing userId or productId" });
    }
    try {
        // Find the user's cart by userId
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            // console.log("Cart not found for user:", userId);
            return res.status(404).json({ message: "Cart not found" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            // console.log("Product not found with id:", productId);
            return res.status(404).send({ message: 'Product not found' });
        }
        // Filter out the item to remove from the cart
        // const updatedItems = cart.items.filter(item => item.product.toString() !== productId&&item.size===size);
        const updatedItems = cart.items.filter(
            (item) => !(item.product.toString() === productId && item.size === size)
          );
          
        // If no items are left after removal, clear the cart
        cart.items = updatedItems.length > 0 ? updatedItems : [];

        // Save the updated cart
        await cart.save();
        console.log("Product removed successfully from cart.");
        // Send success response with updated cart data
        return res.status(200).json({
            message: "Product removed from cart successfully",
            cart: cart.items // Sending only the cart items back in the response
        });
    } catch (error) {
        // Catch and return any errors that occur

        console.log(error)
        return res.status(500).json({
            message: "Error removing item from cart",
            error: error.message
        });
    }
});


    // router.post('/find/:userId', async (req, res) => {
    //     const { userId } = req.body;
        
    //     try {
    //         // Find the cart associated with the userId
    //         const cart = await Cart.findOne({ userId }).populate('items.productId');
    //         // const cart = await Cart.findOne({ userId: mongoose.Types.ObjectId(userId) });

    //         console.log("Searching for cart with userId:", userId);

    //         if (!cart) {
    //             return res.status(404).json({ message: "Cart not found" });
    //         }

    //         res.json({ cart: cart.items }); // Sends the cart items to the frontend
    //     } catch (error) {
    //         console.error("Error fetching cart:", error);
    //         res.status(500).json({ message: "Error fetching cart", error: error.message });
    //     }
    // });
   // Route to fetch the cart for a specific user
   router.get('/find/:userId', async (req, res) => {
    const { userId } = req.params; // Get userId from query parameters

    if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
    }

    try {
        // Find the cart for the given userId and populate product details
        const cart = await Cart.findOne({ userId }).populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Prepare cart data for the frontend
        const cartData = cart.items
        // .map(item => ({
        //     productId: item.productId._id,
        //     productName: item.productId.name, // Assuming Product has a 'name' field
        //     productPrice: item.productId.price, // Assuming Product has a 'price' field
        //     quantity: item.quantity,
        //     total: item.productId.price * item.quantity
        // }));

        return res.status(200).json({
            userId: cart.userId,
            items: cartData,
            totalAmount: cartData.reduce((sum, item) => sum + item.total, 0)
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
});


      
      
      
    
      

  

module.exports = router;





    

