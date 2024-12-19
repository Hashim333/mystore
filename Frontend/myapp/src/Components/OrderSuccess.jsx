import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FcLike } from "react-icons/fc";
import { FaShoppingCart, FaUserAlt, FaInfoCircle } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { BiSolidLogInCircle } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";


import { myContext } from "../Context";
import "./OrderSuccess.css";
const OrderSuccess = () => {
  const { currentUserId,wishlistCount,cartCount,isLoggedIn } = useContext(myContext); // Retrieve current user ID from context
  const location = useLocation();
  const navigate = useNavigate();

  // Extract product data from location state
  const { productId,sellerId, productName, image, size, quantity, price } = location.state || {};

  // State for shipping address
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Handle input change for the shipping address
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  useEffect(() => {
    if (!productId) {
      console.error("Product data is missing.");
      alert("Product information is missing. Please try again.");
      navigate("/"); // Redirect to a safe route
    }
  }, [productId, navigate]);
  
  // Handle place order functionality
  const handlePlaceOrder = async () => {
    if (!productId) {
        alert("Product information is missing. Cannot place order.");
        return;
      }
    // Validate shipping address fields
    if (
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      alert("Please fill in all required fields for the shipping address.");
      return;
    }

    // Prepare order data
    const orderData = {
      userId: currentUserId,
      productId:productId,
      sellerId:sellerId,
   
          quantity:quantity,
    
          size: size,
   
      totalAmount: price * quantity, 
      paymentMethod:paymentMethod,
      shippingAddress:shippingAddress,
    };
    console.log("Order data being sent:", orderData);

    try {
      // Post order data to the server
      const response = await axios.post("http://localhost:5000/api/users/singleOrder", orderData);

      if (response.status === 200) {
        alert("Order placed successfully!");
        navigate("/orderpage", { state: { order: response.data } });
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  const handleLogedin=()=>{
    if(isLoggedIn){
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');

      alert("you have logged out...");
      //  navigate("/login");
    }else{
      alert("redirecting to login page")
    }
  }
  return (
    <div className="home-wrapper">
      <nav className="navbar">
      <div className="store-icon">
        <Link to="/" className="navbar-brand">🛒 MyStore</Link>
      </div>
      
      {/* <input 
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="🔎 Search here..."
        className="search-input"
      /> */}
      
      <div className="navbar-links">
        <div className="link-group">
          <Link to="/wishlist" className="cart-icon-container">
            <FcLike className="heart-icon" />
            {wishlistCount > 0 &&<span className='cart-count'>{wishlistCount}</span>}
          </Link>
         
          <Link to="/about" className="navbar-link">
            <FaInfoCircle /> About
          </Link>
          <Link to="/cart" className="cart-icon-container">
            <FaShoppingCart /> 
            {cartCount >0 &&<span  className='cart-count'>{cartCount}</span> }Cart
          </Link>
          <Link to="/userprofile" className="navbar-link">
            <FaUserAlt /> Profile
          </Link>
          <Link to={!isLoggedIn?"/login":"login"} className="navbar-link" onClick={handleLogedin}>
          {isLoggedIn ? (
        <>
          <RiLogoutCircleFill /> Logout
        </>
      ) : (
        <>
          <BiSolidLogInCircle /> Login
        </>
      )}
          </Link>
        </div>
      </div>
    </nav>
    <div className="s-order-page">
      <h2>Order Summary</h2>
      <img src={image} alt={productName} style={{ width: "200px", height: "auto" }} />
      <p>Product Name: {productName}</p>
      <p>Size: {size}</p>
      <p>Quantity: {quantity}</p>
      <p>Total Price: ₹{price * quantity}</p>
      <p>{productId}</p>

      <h3>Shipping Address</h3>
      <form>
        <div>
          <label>Address Line 1:</label>
          <input
            type="text"
            name="addressLine1"
            value={shippingAddress.addressLine1}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address Line 2:</label>
          <input
            type="text"
            name="addressLine2"
            value={shippingAddress.addressLine2}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={shippingAddress.state}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={shippingAddress.country}
            onChange={handleInputChange}
            required
          />
        </div>
      </form>

      <h3>Payment Method</h3>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Credit Card">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </select>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
    </div>
  );
};

export default OrderSuccess;
