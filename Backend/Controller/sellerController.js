const Seller = require('../Model/sellerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product=require('../Model/productModel');
// Secret for JWT
const JWT_SECRET =  'hashim123';
const Order=require("../Model/orderModel");
// Register Seller
exports.registerSeller = async (req, res) => {
  try {
  const { name, email, password, storeName } = req.body;

  if(!name||!email||!password||!storeName){return res.status(400).json({ success: false, msg: "All fields are required" });}
    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(409).json({success: false, message: 'Seller already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new seller
    const newSeller = await Seller({
      name,
      email,
      password: hashedPassword,
      storeName,
    });
    await newSeller.save();

    res.status(201).json({success: true,
      message: 'Seller registered successfully',
     
    });
  } catch (error) {
    console.error("Error creating seller:", error);
    res.status(500).json({ success:false,message: 'Server error', error: error.message });
  }
};

// Login Seller
exports.loginSeller = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if seller exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: seller._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      seller: {
        sellerId: seller._id,
        name: seller.name,
        email: seller.email,
        storeName: seller.storeName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Seller Profile
exports.getSellerProfile = async (req, res) => {
  try {
    // Fetch the seller's details
    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Fetch products related to this seller
    const products = await Product.find({ sellerId: seller._id });

    res.status(200).json({ seller, products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// exports.getsellerProducts =async (req, res) => {
//   try {
//     const { sellerId } = req.query; // Extract sellerId from the query string.

//     if (!sellerId) {
//       return res.status(400).json({ message: "sellerId is required" });
//     }

//     // Fetch products where the sellerId matches the query parameter.
//     const products = await Product.find({ sellerId: mongoose.Types.ObjectId(sellerId) });

//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Error fetching products", error });
//   } 
// }
// exports.getSellerProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ sellerId: req.params.id });
//     console.log(req.params.id);

//     if (!products.length) {
//       return res.status(404).json({ message: 'No products found for this seller' });
//     }

//     res.status(200).json({ products });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// Update Seller Profile
exports.updateSellerProfile = async (req, res) => {
  const { name, storeName } = req.body;

  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.name = name || seller.name;
    seller.storeName = storeName || seller.storeName;

    const updatedSeller = await seller.save();

    res.status(200).json({ message: 'Profile updated successfully', seller: updatedSeller });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Fetch orders by sellerId
exports.getSellerOrders = async (req, res) => {
  const { sellerId } = req.params;

  console.log("Seller ID:", sellerId);

  if (!sellerId) {
    return res.status(400).json({ error: "Seller ID is required" });
  }

  try {
    const orders = await Order.find({
      "products.sellerId": sellerId, 
    })
      .populate("products.productId")
      .populate("userId", "name email") 
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging log
    const { orderId } = req.params;
    const { status } = req.body;
    console.log("Received status:", status);  
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();

    res.status(200).json({ message: `Order status updated to "${status}".`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update the order status.", error: error.message });
  }
};


exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    await seller.remove();

    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
