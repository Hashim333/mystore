import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myContext } from "../Context";
import Navbar from "./Navbar";
import "./Prd.css";
import axios from "axios";
import { BsCartCheckFill } from "react-icons/bs";

import { FcLike } from "react-icons/fc";
import { FiHeart } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { MdRemoveShoppingCart } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
export default function Product() {
  const {
    serverURL,
    // handleAddToCart,
    product,
    wishlist,
    setWishlist,
    cart,
    setCart,
    isInCart,
    currentUserId,setWishlistCount,
    email,
    setCartCount,
    // handleAddToWishlist,
    token,
    isInWishlist,
  } = useContext(myContext);

  const [prd, setPrd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState(""); 
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/products/${id}`);
        setPrd(response.data);
      } catch (error) {
        setError("Failed to fetch product. Please try again.");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, serverURL]);

  const handlebuy = () => {
    if (!token) {
      alert("Login first..");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size before proceeding.");
      return;
    }

  if (!prd) {
    alert("Product data is unavailable.");
    return;
  }
  if (!prd.sellerId) {
    alert("Seller information is missing for this product.");
    return;
  }
    navigate("/ordersuccess", {
      state: {
        productId: prd._id,
        sellerId:prd.sellerId._id,
        size: selectedSize,
        quantity: 1, // Default to 1, or let the user choose
        price: prd.price,
        productName: prd.name,
        image: prd.image,
      },
    });
  };

  
  
  const handleAddToWishlist = async (productId) => {
    const userId = currentUserId;
    if (!token) {
      if (window.confirm("You must log in to add items to the wshlist. Do you want to log in now?")) {
        navigate("/login"); 
        
        return; 
      }
    }
    try {
      const response = await axios.post(`${serverURL}/api/wishlist/add`, {
        userId,
        productId,
      });

      if (response.status === 200) {
        console.log("Item added to wishlist:", response.data);

        
        setWishlist((prevWishlist) => [...prevWishlist, { productId }]);
        setWishlistCount((prevCount) => prevCount + 1);

        
        alert("Product added to wishlist successfully! 🎉");
       
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      if (error.response) {
     
         if (error.response.status === 400) {
          
          alert("Failed to add product. Missing required information.");
        } else if (error.response.status === 404) {
          
          alert("Product not found. Please try again later.");
        } else {
          
          alert(`Failed to add product. ${error.response.data.message}`);
        }
      } else {
        console.error("Network/Unexpected Error:", error);
        alert("Network error or unexpected issue occurred. ❌");
        // toast.error("Failed to add product!");
      }
    }
  };
  const handleRemoveFromWishlist = async (productId) => {
    const userId = currentUserId;
  
    if (!token) {
      if (window.confirm("You must log in to manage your wishlist. Do you want to log in now?")) {
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
  }
  
  const handleAddToCart = async (productId) => {
    const userId = currentUserId;
    
    const size = selectedSize[productId];
    if (!token) {
      if (window.confirm("You must log in to add items to the cart. Do you want to log in now?")) {
        navigate("/login"); 
        
        
        return; 
      }
    }
    if (!selectedSize) {
      alert("Please select a size before adding to the cart.");
      return;
    }
  
    try {
      const response = await axios.post(`${serverURL}/api/cart/add`, {
        userId:currentUserId,
        productId:productId,
        size:selectedSize,
        quantity: 1,
      });
      if (response.status === 200) {
        setCart((prevCart) => {
          const updatedCart = [...prevCart, { productId, size, quantity: 1 }];
  
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
        alert("Failed to add product to cart");
        // toast.error("Failed to add product!");
        // alert("failed to add to cart");
        }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!prd) return <div>Product not found!!!!</div>;

  return (
    <div className="product-page">
      <Navbar />
      <div className="product-container">
        <div className="product-image-container">
          <img src={prd.image} alt={prd.name} className="product-image" />
          {/* Wishlist button */}
          <button
  className="wishlist-overlay "
  onClick={() =>
    isInWishlist(prd._id)
      ? handleRemoveFromWishlist(prd._id)
      : handleAddToWishlist(prd._id)
  }
>
  {isInWishlist(prd._id) ? (
    <FcLike className="heart-icon" />
  ) : (
    <FiHeart className="heart-icon" />
  )}
</button>;

        </div>
        <div className="product-details">
          {" "}
          <h2 className="product-name">{prd.name}</h2>{" "}
          <p className="product-price"><FaRupeeSign />: {prd.price}</p>{" "}
          <p className="product-category">Category: {prd.category}</p>{" "}
          <p className="product-quantity">SubCategory: {prd.subCategory}</p>{" "}
          <p className="product-quantity">description: {prd.description }</p>{" "}
          <p className="product-quantity">tags: {prd.tags}</p>{" "}
          <p className="product-quantity">color: {prd.color}</p>{" "}

{/* Size Selection */}
<div className="product-size-selection">
            <h4>Select Size:</h4>
            <div className="size-options">
              {prd.sizes.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  disabled={sizeObj.stock === 0}
                  className={`size-button ${selectedSize === sizeObj.size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(sizeObj.size)}
                >
                  {sizeObj.size} {sizeObj.stock === 0 ? "(Out of Stock)" : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="product-actions">
          
            {/* <button
              onClick={() => handleWishlist(prd)}
              className={`add-to-wishlist ${
                wishlist.some((wishlistItem) => wishlistItem._id === prd._id)
                  ? "added"
                  : ""
              }`}
            >
              {" "}
              {wishlist.some((wishlistItem) => wishlistItem._id === prd._id) ? (
                <FcLike className="heart-icon" />
              ) : (
                <FiHeart className="heart-icon" />
              )}{" "}
            </button>{" "} */}
            
            {/* <button
              onClick={() => handleAddToCart(prd)}
              className={`add-to-cart-button ${
                cart.some((cartItem) => cartItem.productId === prd._id)
                  ? "added"
                  : ""
              }`}
            >
             
              {cart.some((cartItem) => cartItem.productId === prd._id) ? (
                <MdRemoveShoppingCart className="cart-icon" />
              ) : (
                <FaShoppingCart className="cart-icon" />
              )}
            </button> */}
             <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(prd._id)}
                  >
                    {isInCart(prd._id) ? (
                      <BsCartCheckFill className="cart-icon" />
                    ) : (
                      <FaShoppingCart className="cart-icon" />
                    )}
                  </button>
            <button className="buy-button" onClick={() => handlebuy(prd)}>
              
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
