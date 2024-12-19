import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BiSolidLogInCircle } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";
import { RiLogoutCircleFill } from "react-icons/ri";
import { FaHome, FaShoppingCart, FaUserAlt, FaInfoCircle } from 'react-icons/fa';
import { GrAppsRounded } from "react-icons/gr";


export default function AdminSeller() {
  const [sellers, setSellers] = useState([]);
 const [isLoggedIn, setAdminLogged] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminToken');
    if (loggedIn) {
      setAdminLogged(true);
    }
    
  }, []);
  
  const handleLogedin = () => {
    if (isLoggedIn) {
      localStorage.removeItem('adminToken');
      alert('You have logged out.');
    } else {
      alert('Redirecting to login page.');
    }
  };
  // Fetch sellers on component mount
  useEffect(() => {
    fetchSellers();
  }, []);

  // Fetch sellers from the backend
  const fetchSellers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/sellers/get');
      console.log('API Response:', response.data); // Debug log
      setSellers(response.data || []); // Handle empty response or invalid data
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  };

 
  const toggleBanSeller = async (sellerId) => {
    console.log('Toggling ban status for seller ID:', sellerId);
    try {
      const response = await axios.patch(`http://localhost:5000/api/admin/seller/${sellerId}/ban`);
      alert(response.data.msg); 
      fetchSellers(); 
    } catch (error) {
      console.error('Error toggling ban status:', error);
      alert('An error occurred while updating the ban status.');
    }
  };

  return (
    <div className='home-wrapper'>
          <nav className="navbar">
               <div className="store-icon">
                 <Link to="/seller" className="navbar-brand">🛒 MyStore</Link>
               </div>
               
             
               
               <div className="navbar-links">
                 <div className="link-group">
                  
                   <Link to="/ban" className="navbar-link">
                     <MdManageAccounts /> - Users
                   </Link>
                   {/* <Link to="/banseller" className="navbar-link">
                     <MdManageAccounts /> - Seller
                   </Link> */}
                   <Link to="/adminorder" className="navbar-link">
                     <GrAppsRounded />- Orders
                   </Link>
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
      <h1>Admin - Manage Sellers</h1>
      {!sellers.length ? (
        <p>No sellers found.</p>
      ) : (
        <ul>
          {sellers.map((seller) => (
            <li key={seller._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <p><strong>Name:</strong> {seller.name}</p>
              <p><strong>Email:</strong> {seller.email}</p>
              <p><strong>Store Name:</strong> {seller.storeName}</p>
              <p><strong>Status:</strong> {seller.banned ? "Banned" : "Active"}</p>
              <button onClick={() => toggleBanSeller(seller._id)}>
                {seller.banned ? "Unban Seller" : "Ban Seller"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
