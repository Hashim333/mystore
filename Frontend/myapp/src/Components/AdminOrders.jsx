import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { BiSolidLogInCircle } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";
import { GrAppsRounded } from "react-icons/gr";
import { RiLogoutCircleFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUserAlt, FaInfoCircle } from 'react-icons/fa';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setAdminLogged] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminToken');
    if (loggedIn) {
      setAdminLogged(true);
    }
    fetchOrders();
  }, []);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders');
      console.log(response.data); // Debugging response structure
      setOrders(response.data.orders || []); // Ensure orders is an array
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogedin = () => {
    if (isLoggedIn) {
      localStorage.removeItem('adminToken');
      alert('You have logged out.');
    } else {
      alert('Redirecting to login page.');
    }
  };
// console.log("orderslinkm",orders);

  return (
    <div className='home-wraper'>
      
       <nav className="navbar">
             <div className="store-icon">
               <Link to="/seller" className="navbar-brand">🛒 MyStore</Link>
             </div>
             
             
             
             <div className="navbar-links">
               <div className="link-group">
                
                 <Link to="/ban" className="navbar-link">
                   <MdManageAccounts /> - Users
                 </Link>
                 <Link to="/banseller" className="navbar-link">
                   <MdManageAccounts /> - Seller
                 </Link>
                 {/* <Link to="/adminorder" className="navbar-link">
                   <GrAppsRounded />- Orders
                 </Link> */}
                 {/* <Link to="/cart" className="cart-icon-container">
                   <FaShoppingCart /> 
                   {cartCount >0 &&<span  className='cart-count'>{cartCount}</span> }Cart
                 </Link> */}
                 {/* <Link to="/adminseller" className="navbar-link">
                   <FaUserAlt /> Sellers
                 </Link> */}
                  <Link to="/" className="navbar-link">
                               <FaHome /> Home
                             </Link>
                  <Link to={!isLoggedIn?"/adminlogin":"/adminlogin"} className="navbar-link" onClick={handleLogedin}>
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
     
      <div className="admin-orders">
        <h1>Admin Orders</h1>
        <ul className="order-list">
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <li key={order._id.$oid} className="order-item">
                <div className="order-details">
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>User ID:</strong> {order.userId._id || 'N/A'}</p>
                  <p><strong>User Email:</strong> {order.userId.email || 'N/A'}</p>

                  <p><strong>Order Status:</strong> {order.status}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount || 0}</p>
                  <p><strong>Shipping Address:</strong></p>
                  <ul>
                    <li>{order.shippingAddress?.addressLine1 || 'N/A'}</li>
                    <li>{order.shippingAddress?.addressLine2 || 'N/A'}</li>
                    <li>{order.shippingAddress?.city}, {order.shippingAddress?.state}</li>
                    <li>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</li>
                  </ul>
                  <p><strong>Products:</strong></p>
                  <ul>
                    {order.products.map((product) => (
                      <li key={product._id}>
                        <p><strong>Product ID:</strong> {product.productId}</p>
                        <p><strong>Seller ID:</strong> {product.sellerId}</p>
                        <p><strong>Size:</strong> {product.size}</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))
          ) : (
            <p>No orders available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
 