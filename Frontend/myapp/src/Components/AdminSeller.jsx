import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BiSolidLogInCircle } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";
import { RiLogoutCircleFill } from "react-icons/ri";
// import { FaUserAlt } from 'react-icons/fa';
import { FaHome, FaShoppingCart, FaUserAlt, FaInfoCircle } from 'react-icons/fa';
import { GrAppsRounded } from "react-icons/gr";

import "./Adm.css";
export default function AdminSeller() {
  const [sellers, setSellers] = useState([]);
  const [isLoggedIn, setAdminLogged] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminToken');
    if (loggedIn) {
      setAdminLogged(true);
    }
    fetchSellers();
  }, []);

  // Fetch all sellers from the backend
  const fetchSellers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/sellers/get');
      console.log(response.data); // Debugging response structure
      setSellers(response.data || []); // Ensure sellers is an array
    } catch (error) {
      console.error('Error fetching sellers:', error);
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

  return (
    <div className="home-wraper">
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
               <Link to="/adminorder" className="navbar-link">
                 <GrAppsRounded />- Orders
               </Link>
               {/* <Link to="/cart" className="cart-icon-container">
                 <FaShoppingCart /> 
                 {cartCount >0 &&<span  className='cart-count'>{cartCount}</span> }Cart
               </Link> */}
               <Link to="/adminseller" className="navbar-link">
                 <FaUserAlt /> Sellers
               </Link>
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

      <div className="admin-sellers">
        <h1>Admin - Sellers</h1>
        <ul className="seller-list">
          {Array.isArray(sellers) && sellers.length > 0 ? (
            sellers.map((seller) => (
              <li key={seller._id} className="seller-item">
                <div className="seller-details">
                  <p><strong>Seller Name:</strong> {seller.name}</p>
                  <p><strong>Email:</strong> {seller.email}</p>
                  <p><strong>Store Name:</strong> {seller.storeName}</p>
                  <p><strong>Banned:</strong> {seller.banned ? 'Yes' : 'No'}</p>
                  <p><strong>Created At:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
                </div>
              </li>
            ))
          ) : (
            <p>No sellers available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
