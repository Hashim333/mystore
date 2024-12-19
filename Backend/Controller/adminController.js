// const Admin=require("../Model/adminModel");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const jwtSecretKey = "hashim123";

const adminEmail = "admin@gmail.com";  // Hardcoded email
const adminPassword = "1234";  // Hardcoded password

// Admin login function
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the provided email matches the hardcoded admin email
    if (email !== adminEmail) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the provided password matches the hardcoded password
    if (password !== adminPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token if login is successful
    const token = jwt.sign(
      { email: adminEmail, role: "admin" }, // Use the hardcoded email and role
      process.env.JWT_SECRET || "defaultSecretKey", // Use environment variable or fallback value
      { expiresIn: "1h" }
    );

    // Respond with success and the token
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};





const Order = require("../Model/orderModel");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'email');
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};
const Seller=require("../Model/sellerModel");
const getAllSellers =async(req,res)=>{

  try{
    const sellers=await Seller.find();
    res.status(200).json(sellers);
  }catch(eroor){
    res.status(500).json({error:'An error occurred while fetching sellers.'})
  }
}
const User=require("../Model/userModel");
const toggleBanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    user.banned = !user.banned;
    await user.save();
    res.json({ success: true, msg: `User ${user.banned ? "banned" : "unbanned"}` });
  } catch (error) {
    console.error("Error toggling ban status:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};
const toggleBanSeller = async (req, res) => {
  try {
    const { sellerId } = req.params; 
    const seller = await Seller.findById(sellerId); 

    if (!seller) {
      return res.status(404).json({ success: false, msg: "Seller not found" }); // 
    }

    // Toggle the `banned` status
    seller.banned = !seller.banned;
    await seller.save(); // Save the updated seller status to the database

    res.json({ 
      success: true, 
      msg: `Seller ${seller.banned ? "banned" : "unbanned"}` 
    }); // Send a success response
  } catch (error) {
    console.error("Error toggling ban status for seller:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

  module.exports = { adminLogin ,getAllOrders,getAllSellers,toggleBanUser,toggleBanSeller};
