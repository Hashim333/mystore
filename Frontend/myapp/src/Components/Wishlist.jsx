import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myContext } from "../Context";
import axios from "axios";
import { FcLike } from "react-icons/fc"; // Heart icon
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import { MdRemoveShoppingCart } from "react-icons/md";
import { BsCartCheckFill } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaHome,
  FaShoppingCart,
  FaUserAlt,
  FaInfoCircle,
} from "react-icons/fa";
export default function Wishlist() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const {
    // handleAddToCart,
    newProdId,
    setProdId,
    wishlist,
    setWishlist,
    cartCount,
    setCartCount,
    product,
    isInCart,
    setProduct,
    serverURL,
    currentUserId,
    cart,
    refreshWishllist,
    setCart,
    wishlistCount,
    setWishlistCount,
    filteredData,
    isLOgedIn,
    setIsLogedIn,
    user,
    setUse,
    email,
    setEmail,
    isInWishlist,
    password,
    setPassword,
    refreshCart,
  } = useContext(myContext);

  const [selectedSize, setSelectedSize] = useState({});
  useEffect(() => {
    refreshCart();
    setCartCount(cart.length);
  }, [token, currentUserId]);

  const handleSizeChange = (productId, size) => {
    setSelectedSize((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };
  const handleAddToCart = async (productId) => {
    const userId = currentUserId;
    // setProdId(productId);
    if (!token) {
      if (
        window.confirm(
          "You must log in to add items to the cart. Do you want to log in now?"
        )
      ) {
        navigate("/login");
        // <link to={'/sellerlogin'}></link>
        return;
      }
    }
    const size = selectedSize[productId];
    if (!selectedSize) {
      alert("Please select a size before adding to the cart.");
      return;
    }
    try {
      const response = await axios.post(`${serverURL}/api/cart/add`, {
        userId,
        productId,
        size,
        quantity: 1,
      });

      if (response.status === 200) {
        // setCart((prevCart) => [...prevCart, { productId, quantity: 1 }]);
        setCart((prevCart) => {
          const updatedCart = [...prevCart, { productId, size, quantity: 1 }];

          // // Save the updated cart to localStorage
          // localStorage.setItem("cart", JSON.stringify(updatedCart));

          return updatedCart;
        });
        setCartCount((prevCount) => prevCount + 1);
        alert("Product added to cart successfully");
        // toast.success("Product added to cart!");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Product already exists in the cart!");
      } else {
        console.log(error);
        // alert("Failed to add product to cart");
        toast.error("Failed to add product!");
        alert("failed to add to cart");
      }
    }
  };

  const renderSizeOptions = (sizes) => {
    console.log("Sizes data:", sizes);
    if (!sizes || sizes.length === 0) {
      return <option disabled>No sizes available</option>;
    }

    return sizes
      .filter((size) => size.stock > 0)
      .map((size, index) => (
        <option key={index} value={size.size}>
          {size.size}
          {/* (Stock: {size.stock}) */}
        </option>
      ));
  };

  const handleRemoveFromWishlist = async (productId) => {
    const userId = currentUserId;

    if (!token) {
      if (
        window.confirm(
          "You must log in to manage your wishlist. Do you want to log in now?"
        )
      ) {
        navigate("/login");
        return;
      }
    }

    try {
      const response = await axios.delete(`${serverURL}/api/wishlist/remove`, {
        params: {
          userId,
          productId,
        },
      });

      if (response.status === 200) {
        console.log("Item removed from wishlist:", response.data);

        // Update wishlist state dynamically
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.productId !== productId)
        );
        setWishlistCount((prevCount) => prevCount - 1);

        // Success alert
        alert("Product removed from wishlist successfully!");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      // toast.error("Failed to remove product!");
    }
  };

  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);
  useEffect(() => {
    refreshWishllist(); // Fetch the cart initially
  }, [token, currentUserId]);

  return (
    <div>
      <nav className="cart-navbar">
        <div className="cart-store-icon">
          <Link to="/" className="navbar-brand">
            🛒 MyStore
          </Link>
        </div>

        <div className="navbar-links">
          <div className="link-group">
            {/* <Link to="/wishlist" className="navbar-link">
              <FcLike className="heart-icon" />
            </Link> */}
            {/* <Link to="/" className="navbar-link">
              <FaHome /> Home
            </Link> */}
            <Link to="/about" className="navbar-link">
              <FaInfoCircle /> About
            </Link>
            <Link to="/cart" className="cart-icon-container">
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              Cart
            </Link>
            <Link to="/profile" className="navbar-link">
              <FaUserAlt /> Profile
            </Link>
          </div>
        </div>
      </nav>
      <div className="product-list-section">
        <h2>All Products</h2>
        <ul className="product-list">
          {wishlist.map((item) => (
            <li key={item._id} className="product-item">
              <Link to={`/product/${item.productId._id}`}>
                <div>
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="product-image"
                  />
                  <button
                    className="wishlist-overlay "
                    onClick={() => handleRemoveFromWishlist(item.productId._id)}
                  >
                    {/* {isInWishlist(prd._id) ? ( */}
                    <FcLike className="heart-icon" />

                    {/* <FiHeart className="heart-icon" /> */}
                    {/* )} */}
                  </button>
                  
                </div>
                <h2>{item.productId.name}</h2>
                <p>
                  <FaRupeeSign />: {item.productId.price}
                </p>
                <p>Category: {item.productId.category}</p>
                <p>Quantity: {item.productId.quantity}</p>
                </Link>
                <label htmlFor="sizeSelect">Select Size:</label>
                <select
                  id={`size-select-${item.productId._id}`}
                  defaultValue=""
                  value={selectedSize[item.productId._id] || ""}
                  onChange={(e) => handleSizeChange(item.productId._id, e.target.value)}
                >
                  <option value="" disabled>
                    Choose a size
                  </option>
                  {renderSizeOptions(item.productId.sizes)}
                </select>

                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(item.productId._id)}
                >
                  {isInCart(item.productId._id) ? (
                    <BsCartCheckFill className="cart-icon" />
                  ) : (
                    <FaShoppingCart className="cart-icon" />
                  )}
                </button>
              
            </li>
          ))}
        </ul>

        {/* <ul className="product-list">
  {wishlist && wishlist.products && wishlist.products.length > 0 ? (
    wishlist.products.map((item) => (
      <li key={item._id} className="product-item">
        <img src={item.productId.image} alt={item.productId.name} className="product-image" />
        <h2>{item.productId.name}</h2>
        <p>Price: {item.productId.price}</p>
        <p>Category: {item.productId.category}</p>
        <p>Quantity: {item.productId.quantity}</p>
        <button
          onClick={() => handleAddToCart(item)}
          className={`add-to-cart-button ${
            cart.some((cartItem) => cartItem.productId === item._id) ? 'added' : ''
          }`}
        >
          {cart.some((cartItem) => cartItem.productId === item._id) ? (
            <MdRemoveShoppingCart className="cart-icon" />
          ) : (
            <FaShoppingCart className="cart-icon" />
          )}
        </button>
      </li>
    ))
  ) : (
    <p>Your wishlist is empty.</p>
  )}
</ul> */}
      </div>
    </div>
  );
}
