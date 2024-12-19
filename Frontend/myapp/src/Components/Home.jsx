import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../Context";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserAlt, FaInfoCircle } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import "./Home.css";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRupeeSign } from "react-icons/fa";
import Carousel from "./Carousel";

/* Include these in your main CSS file */
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import Slider from 'react-slick';
import OffersSlider from "./OffersSlider ";

export default function Home() {
  // const navigate = useNavigate();
  // const [newProdId,setProdId]=useState('')

  const {
    // newProdId,setProdId,
    product,
    isInWishlist,
    setProduct,
    refreshCart,
    // handleAddToCart,
    isInCart,
    serverURL,
    wishlist,
    setWishlist,
    currentUserId,
    cart,
    setCart,
    setCartCount,
    setWishlistCount,
    filteredData,
    user,
    isLOgedIn,
    offers, setOffers,
  } = useContext(myContext);
  const [selectedSize, setSelectedSize] = useState({});

  const token = localStorage.getItem("authToken");
  const navigate=useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const currentUserId = localStorage.getItem("userId");

    if (!token || !currentUserId) {
      console.error("Token or currentUserId is missing");
      // Optionally redirect to login
    }
  }, []);

  useEffect(() => {
    refreshCart(); // Fetches cart data every time Cart component mounts
  }, [token, currentUserId]);

  
  const handleSizeChange = (productId, size) => {
    setSelectedSize((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };
  console.log("nothing:",selectedSize);
  
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
        size,
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

 
  
  const handleAddToWishlist = async (productId) => {
    const userId = currentUserId;
    if (!token) {
      if (window.confirm("You must log in to add items to the wshlist. Do you want to log in now?")) {
        navigate("/login"); 
        // <link to={'/sellerlogin'}></link>
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

        // Update wishlist state dynamically
        setWishlist((prevWishlist) => [...prevWishlist, { productId }]);
        setWishlistCount((prevCount) => prevCount + 1);

        // Success alert
        alert("Product added to wishlist successfully! 🎉");
        // toast.success("Product added to wishlist!");
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      if (error.response) {
      //   if (error.response.status === 409) {
      //     // Conflict - Already in Wishlist
      //     alert("Product already exists in the wishlist!");
        // } 
         if (error.response.status === 400) {
          // Bad Request - Missing data
          alert("Failed to add product. Missing required information.");
        } else if (error.response.status === 404) {
          // Product Not Found
          alert("Product not found. Please try again later.");
        } else {
          // Other server-side errors
          alert(`Failed to add product. ${error.response.data.message}`);
        }
      } else {
        console.error("Network/Unexpected Error:", error);
        // alert("Network error or unexpected issue occurred. ❌");
        toast.error("Failed to add product!");
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
      toast.error("Failed to remove product!");
    }
  }
 
  

  // Check if a product is in the cart

  const productsToDisplay = filteredData.length > 0 ? filteredData : product;

  return (
    <div className="home-wrapper">
      <Navbar />
      
      <section className="hero-section">
      <Carousel/>
      </section>
      <section className="product-list-section">
        {productsToDisplay.length === 0 ? (
          <div>No products to display</div>
        ) : (
          <ul className="product-list">
            {productsToDisplay.map((item) => {
              return (
                <div key={item._id} className="product-item">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.image}
                      alt={`Variant - ${item.color}`}
                      className="variant-image"
                    />
                    <h2>{item.name}</h2>
                    <p><FaRupeeSign />: {item.price}</p>
                    <p>Category: {item.category}</p>

                    {/* <p>Color: {item.color}</p> */}
                    {/* <p>Size: {item.size}</p> */}
                    {/* <p>Stock: {item.stock}</p> */}
                  </Link>
                  <button
  className="add-to-wishlist"
  onClick={() =>
    isInWishlist(item._id)
      ? handleRemoveFromWishlist(item._id)
      : handleAddToWishlist(item._id)
  }
>
  {isInWishlist(item._id) ? (
    <FcLike className="heart-icon" />
  ) : (
    <FiHeart className="heart-icon" />
  )}
</button>
<label htmlFor="sizeSelect">Select Size:</label>
<select id={`size-select-${item._id}`} defaultValue="" value={selectedSize[item._id] || ""}
  onChange={(e) => handleSizeChange(item._id, e.target.value)}>
              <option value="" disabled>
                Choose a size
              </option>
              {renderSizeOptions(item.sizes)}
            </select>
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(item._id)}
                  >
                    {isInCart(item._id) ? (
                      <BsCartCheckFill className="cart-icon" />
                    ) : (
                      <FaShoppingCart className="cart-icon" />
                    )}
                  </button>
                </div>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
