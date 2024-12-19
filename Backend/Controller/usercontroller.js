const User = require("../Model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = "hashim123";

const Product=require("../Model/productModel");

// require("dotenv").config();
// const createUser = async (req, res) => {

//   try {
//     const { username, email, password ,banned} = req.body;
//     const user = await User.findOne({
//       email: email,
//     });
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
   
//     if (user) {
//      return res.status(409).json({
//         error: "Email already exists.",
//       });     
//     }
//     let hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({
//       username: username,
//       email: email,
//       password: hashedPassword,
//       banned,
//     });
//     res.send("user created successfully");

   
//   } catch (error) {
//     console.log(error);

//     return  res.status(500).json({success: false,msg: "An error occurred",});
//   }
// };
const createUser = async (req, res) => {
  try {
    const { username, email, password, banned } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, msg: "Email already exists plesae login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      banned: banned || false,
    });
    await newUser.save();

    res.status(201).json({ success: true, msg: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

// const loginUser=async (req, res) => {
//   try{
    
  
//     const { email, password, } = req.body;
//     const user = await User.findOne({ email });  
//     console.log("login",req.body);
    

//     if (!user) return res.status(404).send('User not found');  

//      // Check if user is banned
// if(user.banned){
//   return res.status(403).json({ success:false, msg:"User is banned"});
// }
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return res.status(400).send('Invalid password'); } 

//     const token = jwt.sign({ email:user.email}, jwtSecretKey);
//     res.json({success:true, token,userId:user._id });
// }
//  catch (error){
// console.log(error);
// res.status(500).json({
//   success: false,
//   msg: "An error occurred",
// });
// }
// }
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if user is banned
    if (user.banned) {
      return res.status(403).json({ success: false, msg: "User is banned" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecretKey, {
      expiresIn: "1d", // Optional: Token expiration time
    });

    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};





const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};
const getUserById=async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

const Order = require("../Model/orderModel");

const createOrder = async (req, res) => {
  try {
    const { userId, products, paymentMethod } = req.body;

    if (!userId || !products || !products.length || !paymentMethod) {
      return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (let product of products) {
      const { productId, quantity } = product;
      const productData = await Product.findById(productId);
      if (!productData) {
        return res.status(404).json({ success: false, msg: `Product with ID ${productId} not found` });
      }
      totalAmount += productData.price * quantity;
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json({ success: true, msg: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};
// const newOrder= async (req, res) => {
//   const { userId, products, totalAmount, paymentMethod, shippingAddress } = req.body;

//   try {
//     const newOrder = new Order({
//       userId,
//       products,
//       totalAmount,
//       paymentMethod,
//       shippingAddress,
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: "Failed to create order" });
//   }
// };

const newOrder = async (req, res) => {
  const { userId, products, totalAmount, paymentMethod, shippingAddress } = req.body;

  // Validate incoming data (optional but recommended)
  if (!userId || !products || !totalAmount || !paymentMethod || !shippingAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Products array cannot be empty" });
  }
  // products.forEach(product => {
  //   if (!product.productId ||  !product.quantity || !product.price) {
  //     return res.status(400).json({ error: "Each product must have productId, color, size, quantity, and price" });
  //   }
  // });
  
  try {
    // Create and save the order
    const newOrder = new Order({
      userId,
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        sellerId: product.sellerId, 
        size: product.size, 
        price: product.price,
      })),
      totalAmount,
      paymentMethod,
      shippingAddress,
    });
    // console.log("Received products:", products);

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};


  const userOrder = async (req, res) => {
    const { userId } = req.params; 
    console.log("user",userId)
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      
      const orders = await Order.find({ userId })
      .populate("products.productId")
// 
      //   .sort({ createdAt: -1 }); 

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  };

  const singleOrder= async (req, res) => {
    const { productId,sellerId, size, userId, quantity ,totalAmount,paymentMethod,shippingAddress} = req.body;
    // console.log("Received productId:", productId);
    if (!size) {
      return res.status(400).json({ message: "Size is required" });
    }
    
    try {
      
      // Find the product by ID
      const product = await Product.findById(productId);
      console.log("Found product:", product);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      if (!Array.isArray(product.sizes) || product.sizes.length === 0) {
        return res.status(400).json({ message: "No sizes available for this product" });
      }
      // Find the selected size
      const selectedSize = product.sizes.find((s) => 
        s.size && s.size.toLowerCase() === (size && size.toLowerCase())
      );
      
      if (!selectedSize) return res.status(400).json({ message: "Invalid size selected" });
  
      // Check if there's enough stock
      if (selectedSize.stock < quantity) return res.status(400).json({ message: "Not enough stock available" });
      if (typeof quantity !== 'number' || isNaN(quantity)) {
        return res.status(400).json({ message: "Invalid quantity provided" });
      }
      
      if (typeof selectedSize.stock !== 'number' || isNaN(selectedSize.stock)) {
        return res.status(400).json({ message: "Invalid stock value for the selected size" });
      }
      // Deduct the quantity from stock
      selectedSize.stock -= quantity;
      if (isNaN(selectedSize.stock)) {
        return res.status(500).json({ message: "Stock calculation error" });
      }
 
      await product.save();
  
     
      const newOrder = new Order({
        userId,
        products: [
          {
            productId,
            size,
            quantity,
            sellerId,
            price: totalAmount / quantity, 
          },
        ],
        totalAmount,
        paymentMethod, 
        shippingAddress,
      });
  
      await newOrder.save();
  
      
      res.status(200).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while placing the order", 
        error: error.message 
      });
    }
    
  };
  
const order= async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate(
      "products.productId",
      "name price image"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    order.status = status;
    order.updatedAt = Date.now();

    await order.save();
    res.json({ success: true, msg: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};


// const getOrdersByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const orders = await Order.find({ userId }).populate("products.productId", "name price");
//     if (!orders.length) {
//       return res.status(404).json({ success: false, msg: "No orders found for this user" });
//     }

//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, msg: "An error occurred" });
//   }
// };

// const toggleBanStatus = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, msg: "User not found" });
//     }

//     user.banned = !user.banned;
//     await user.save();

//     res.json({ success: true, banned: user.banned });
//   } catch (error) {
//     console.error("Error toggling ban status:", error);
//     res.status(500).json({ success: false, msg: "An error occurred" });
//   }
// };

const saveNewAddress = async (userId, newAddress) => {
  try {
    // Update the user's savedAddress directly with the new address
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { savedAddress: newAddress }, // Overwrite the savedAddress with the new one
      { new: true, runValidators: true } // Return the updated document and validate it
    );

    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }

    return { success: true, message: "Address updated successfully", user: updatedUser };
  } catch (error) {
    console.error("Error saving address:", error);
    return { success: false, message: "An error occurred while saving the address" };
  }
};

const getSavedAddress = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("savedAddress");

    if (!user || !user.savedAddress) {
      return res.status(404).json({ message: "No saved address found" });
    }

    res.status(200).json({ address: user.savedAddress });
  } catch (error) {
    console.error("Error fetching saved address:", error);
    res.status(500).json({ message: "Server error while fetching address" });
  }
};

// const updateAddress= async (req, res) => {
//   const { userId } = req.params;
//   const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.savedAddress = { addressLine1, addressLine2, city, state, postalCode, country };
//     await user.save();

//     res.status(200).json({ message: "Address saved successfully", address: user.savedAddress });
//   } catch (error) {
//     console.error("Error saving address:", error);
//     res.status(500).json({ message: "Server error while saving address" });
//   }
// };

const updateUserAddress = async (req, res) => {
  try {
    const { userId } = req.params; 
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body; 

   

    if (!userId) {
      return res.status(400).json({ success: false, msg: "User ID is required" });
    }
    if (!addressLine1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({ success: false, msg: "All required address fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    user.savedAddress = {
      addressLine1,
      addressLine2: addressLine2 || "", 
      city,
      state,
      postalCode,
      country,
    };

    // Save the updated user
    await user.save();

    res.status(200).json({ success: true, msg: "Address updated successfully", address: user.savedAddress });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

module.exports={createUser,loginUser,getAllUsers,createOrder,updateOrderStatus,getUserById,userOrder,newOrder,order,singleOrder,getSavedAddress,updateUserAddress,saveNewAddress }
