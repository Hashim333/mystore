import React, { useContext, useState } from 'react';
import "./Home.css";
import { Link, useNavigate } from 'react-router-dom';
import { FcLike } from 'react-icons/fc'; // Heart icon
import { FaHome, FaShoppingCart, FaUserAlt, FaInfoCircle } from 'react-icons/fa'; 
import { myContext } from '../Context';
import { BiSolidLogInCircle } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";
export default function Navbar() {
  const { product,isLoggedIn, filteredData, setFilteredData,cartCount,wishlistCount,setwishlistCount ,searchQuery, setSearchQuery} = useContext(myContext);
  
const navigate=useNavigate()
  function handleSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      // Reset to original product list
      setFilteredData(product);
    } else {
      const filtered = product.filter(product => {
        const { name, price, category,subCategory,tag } = product;
        return (
          name.toLowerCase().includes(query.toLowerCase()) ||
          price.toString().includes(query) ||
          subCategory.toString().includes(query.toLowerCase())||
          category.toLowerCase().includes(query.toLowerCase())||
          tag.toLowerCase().includes(query.toLowerCase())
          // product.variant?.some((variant)=>variant.color.toLowerCase().includes(query.toLowerCase()))

        );
      });
      setFilteredData(filtered);
    }
  }

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
  console.log("Filtered Data:", filteredData);

  return (
    <nav className="navbar">
      <div className="store-icon">
        <Link to="/" className="navbar-brand">🛒 MyStore</Link>
      </div>
      
      <input 
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="🔎 Search here..."
        className="search-input"
      />
      
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
          <Link to={!isLoggedIn?"/login":"/login"} className="navbar-link" onClick={handleLogedin}>
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
  );
}
