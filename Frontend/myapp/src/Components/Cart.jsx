import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { myContext } from "../Context";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { FcLike } from "react-icons/fc";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import "./Cart.css";

export default function Cart() {
  const {
    serverURL,
    cart,
    setCart,
    refreshCart,
    currentUserId,
    wishlistCount,
    setCartCount,
  } = useContext(myContext);

  const [cartWithSelection, setCartWithSelection] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch cart items when the component mounts
  useEffect(() => {
    refreshCart();
  }, []);

  // Initialize the cart with selection state whenever `cart` changes
  useEffect(() => {
    setCartWithSelection(cart.map((item) => ({ ...item, product: item.product || {}, selected: false })));
  }, [cart]);

  // Handle individual item selection
  const handleItemSelection = (index) => {
    setCartWithSelection((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Handle "Select All" toggle
  const handleSelectAll = (isChecked) => {
    setCartWithSelection((prevCart) =>
      prevCart.map((item) => ({ ...item, selected: isChecked }))
    );
  };

  // Remove item from cart
  const handleRemoveFromCart = async (productId, size) => {
    try {
      await axios.delete(
        `${serverURL}/api/cart/remove?userId=${currentUserId}&productId=${productId}&size=${size}`
      );
      // setCart((prevCart) =>
      //   prevCart.filter((item) => item.product._id !== productId  && !item.product.size === productId.size)
      // );
      setCart((prevCart) =>
        prevCart.filter(
          (item) => !(item.product._id === productId && item.size === size)
        )
      );
      setCartCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Calculate totals for selected items
  const selectedItems = cartWithSelection.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 1;
    return total + price * quantity;
    
  }, 0);
  const handleIncrement = (index) => {
    setCartWithSelection((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const handleDecrement = (index) => {
    setCartWithSelection((prevCart) =>
      prevCart.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Math.max((item.quantity || 1) - 1, 1),
            }
          : item
      )
    );
  };
  // Handle "Buy Now" click
  const handleBuyNow = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to buy.");
      return;
    }
    // Add increment and decrement functionality for item quantities

    navigate("/checkoutpage", {
      state: {
        selectedItems,
        totalPrice,
      },
    });
  };

  return (
    <div className="cart-wrapper">
      <nav className="cart-navbar">
        <div className="cart-store-icon">
          <Link to="/" className="navbar-brand">
            🛒 MyStore
          </Link>
        </div>
        <div className="navbar-links">
          <div className="link-group">
            <Link to="/wishlist" className="cart-icon-container">
              <FcLike className="heart-icon" />
              {wishlistCount > 0 && (
                <span className="cart-count">{wishlistCount}</span>
              )}
            </Link>
            <Link to="/" className="navbar-link">
              <FaHome /> Home
            </Link>
            <Link to="/about" className="navbar-link">
              <FaInfoCircle /> About
            </Link>
          </div>
        </div>
      </nav>

      <div className="cart-product-list-section">
        <section className="product-list-section">
          <h2>Your Cart</h2>
          <label>
            <input
              type="checkbox"
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            Select All
          </label>
          <p>Total Price for Selected Items: ₹{totalPrice.toFixed(2)}</p>
          <ul className="cart-product-list">
            {cartWithSelection.map((cartItem, index) => (
              <div key={index} className="cart-item">
                <label>
                  <input
                    type="checkbox"
                    checked={cartItem.selected}
                    onChange={() => handleItemSelection(index)}
                  />
                </label>
                <img
                  src={cartItem.product?.image || "/placeholder-image.jpg"}
                  alt={cartItem.product?.name || "Unnamed Product"}
                  className="cart-image"
                />

                <h3>{cartItem.product?.name || "Unnamed Product"}</h3>
                <p>
                  <FaRupeeSign /> {cartItem.product?.price || "0"}
                </p>
                <p>Size: {cartItem.size || "N/A"}</p>
                {/* <p>Stock: {cartItem.stock || "N/A"}</p> */}

                <div className="quantity-controls">
                  <button
                    className="decrement-button"
                    onClick={() => handleDecrement(index)}
                  >
                    -
                  </button>
                  <span>{cartItem.quantity || 1}</span>
                  <button
                    className="increment-button"
                    onClick={() => handleIncrement(index)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() =>
                    handleRemoveFromCart(cartItem.product._id, cartItem.size)
                  }
                  className="remove-from-cart"
                >
                  Remove from Cart
                </button>
              </div>
            ))}
          </ul>
          <button className="buy-now-button" onClick={handleBuyNow}>
            Buy Now
          </button>
        </section>
      </div>
    </div>
  );
}
