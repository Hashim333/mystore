import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { myContext } from "../Context";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaUserAlt,
  FaInfoCircle,
} from "react-icons/fa";
import "./SellerProfile.css";

import { BiSolidLogInCircle } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";

const SellerProfile = () => {
  const { isSellerLogged } = useContext(myContext);
  const { serverURL } = useContext(myContext);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");
  const sellerId = localStorage.getItem("sellerId");

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/seller/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeller(response.data.seller);
        setProducts(response.data.products);
      } catch (err) {
        setError("Failed to fetch seller profile.");
        console.error("Error fetching seller profile:", err);
      }
    };

    if (sellerId) {
      fetchSellerProfile();
    }
  }, [sellerId, serverURL, token]);

  const handleLoginToggle = () => {
    if (isSellerLogged) {
      localStorage.removeItem("token");
      localStorage.removeItem("sellerId");
      alert("You have logged out...");
    } else {
      alert("Redirecting to login page");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="seller-profile-page">
      <nav className="seller-navbar">
        <div className="navbar-brand">
          <Link to="/seller" className="navbar-logo">
            🛒 MyStore
          </Link>
        </div>
        <div className="navbar-links">
          <div className="link-group">
            <Link
              to={!isSellerLogged ? "/sellerlogin" : "/sellerlogin"}
              className="navbar-link"
              onClick={handleLoginToggle}
            >
              {isSellerLogged ? (
                <>
                  <RiLogoutCircleFill /> Logout
                </>
              ) : (
                <>
                  <BiSolidLogInCircle /> Login
                </>
              )}
            </Link>
            <Link to="/about" className="navbar-link">
              <FaInfoCircle /> About
            </Link>
            <Link to="/sellerprofile" className="navbar-link">
              <FaUserAlt /> Profile
            </Link>
          </div>
        </div>
      </nav>
      <div className="seller-profile-content">
        <h2>Seller Profile</h2>
        {seller ? (
          <>
            <div className="seller-info">
              <p>
                <strong>Name:</strong> {seller.name}
              </p>
              <p>
                <strong>Email:</strong> {seller.email}
              </p>
              <p>
                <strong>Store Name:</strong> {seller.storeName}
              </p>
            </div>
            <h3>Your Products</h3>
            {products.length > 0 ? (
             <ul className="product-list">
             {products.map((product) => (
               <li key={product._id} className="product-item">
                 <p>
                   <strong>Name:</strong> {product.name}
                 </p>
                 <p>
                   <strong>Price:</strong> ${product.price.toFixed(2)}
                 </p>
                 <p>
                   <strong>Category:</strong> {product.category}
                 </p>
                 {product.sizes && product.sizes.length > 0 ? (
                   <div>
                     <strong>Sizes and Stock:</strong>
                     <ul>
                       {product.sizes.map((sizeInfo, index) => (
                         <li key={index}>
                           Size: {sizeInfo.size}, Stock: {sizeInfo.stock}
                         </li>
                       ))}
                     </ul>
                   </div>
                 ) : (
                   <p>
                     <strong>Stock:</strong> No sizes available
                   </p>
                 )}
               </li>
             ))}
           </ul>
           
            ) : (
              <p className="no-products-message">No products found.</p>
            )}
          </>
        ) : (
          <p className="no-seller-message">Seller not found.</p>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
