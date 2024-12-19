import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { myContext } from "../Context";
import "./UseProfile.css";
import { FcLike } from "react-icons/fc";
import { GoListOrdered } from "react-icons/go";
import {
  FaHome,
  FaShoppingCart,
  FaUserAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const UserProfile = () => {
  const{currentUserId,serverURL,wishlistCount,cartCount}=useContext(myContext);
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  // const serverURL = "http://localhost:5000"; 
  console.log("Server URL:", serverURL);
  console.log("Current User ID:", currentUserId);
  // const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
     
      try {
        const response = await axios.get(`${serverURL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          
        });
        
        setUser(response.data.user);
      } catch (err) {
        // setError("Failed to fetch user data.");
      } 
    };
    console.log("Authorization Token:", token);
 
    
    const fetchUserOrders = async () => {
      try {
       
        const response = await axios.get(`${serverURL}/api/users/order/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    if (userId) {
      fetchUserDetails();
      fetchUserOrders();
    }
  }, [userId, token]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="seller-profile-wrapper">
       <nav className="cart-navbar">
        <div className="cart-store-icon">
          <Link to="/" className="navbar-brand">
            🛒 MyStore
          </Link>
        </div>
        <div className="navbar-links">
          <div className="link-group">
          <Link to="/cart" className="cart-icon-container">
            <FaShoppingCart /> 
            {cartCount >0 &&<span  className='cart-count'>{cartCount}</span> }Cart
          </Link>
            <Link to="/wishlist" className="cart-icon-container">
              <FcLike className="heart-icon" />
              {wishlistCount > 0 && (
                <span className="cart-count">{wishlistCount}</span>
              )}
            </Link>
            {/* <Link to="/" className="navbar-link">
              <FaHome /> Home
            </Link> */}
            <Link to="/about" className="navbar-link">
              <FaInfoCircle /> About
            </Link>
            <Link to="/orderpage" className="navbar-link">
            <GoListOrdered />Orders
            </Link>
            
          </div>
        </div>
      </nav>
    <div className="user-profile-container">
      <h2>User Profile</h2>
      {user ? (
        <>
          <div className="user-details">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> {user.banned ? "Banned" : "Active"}</p>
          </div>
          {/* <h3>Your Orders</h3> */}
          {/* {orders.length > 0 ? (
            <ul className="order-list">
              {orders.map((order) => (
                <li key={order._id}>
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <p><strong>Status:</strong> {order.status || "Pending"}</p>
                  <p><strong>Products:</strong></p>
                  <ul>
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.productId.name} (x{product.quantity})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )} */}
        </>
      ) : (
        <p>User not found.</p>
      )}
    </div>
    </div>
  );
};

export default UserProfile;
