import React, { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { myContext } from "./Context";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Seller from "./Components/Seller";
import Cart from "./Components/Cart";
import Displayingimage from "./Components/image/DisplayingImage";
import Fileuploadform from "./Components/image/FileUploadForm";
import Wishlist from "./Components/Wishlist";
import Product from "./Components/Product";
import About from "./Components/About";
import Admin from "./Components/Admin";
import Ban from "./Components/Ban";
import SellerAuth from "./Components/SellerAuth";
import Rough from "./Components/Rough";
import UserProfile from "./Components/UserProfile";
import CheckoutPage from "./Components/CheckoutPage";
import OrdersPage from "./Components/OrdersPage";
import OrderSuccess from "./Components/OrderSuccess";
import SellerProfile from "./Components/SellerProfile";
import AcceptOrders from "./Components/AcceptOrders";
import AdminLogin from "./Components/AdminLogin";
import AdminOrders from "./Components/AdminOrders";
import AdminSeller from "./Components/AdminSeller";
import AdminSellerBan from"./Components/AdminSellerBan";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [product, setProduct] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductName, setEditingProductName] = useState("");
  const [editingProductVariantId, setEditingProductVariantId] = useState(null);

  const [editProductPrice, setEditProductPrice] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductSubCategory, setNewProductSubCategory] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductSubCategory, setEditProductSubCategory] = useState("");
  const [image, setImage] = useState("");
  const [editProductImage, setEditProductImage] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [filteredData, setFilteredData] = useState(product);
  const [wishlistCount, setWishlistCount] = useState(product);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [offers, setOffers] = useState([]);
  const[isSellerLogged,setIsSellerLogged]=useState(false);
  const [editColor, setEditColor] = useState("");
  const [editSizes, setEditSizes] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [newSizes, setNewSizes] = useState([{ size: "", stock: 0 }]);
  const [newStock, setNewStock] = useState(0);
  const [newImage, setNewImage] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newTags, setNewTags] = useState("");
  const [editTags, setEditTags] = useState("");
 const [editImage, setEditImage] = useState("");


  const token = localStorage.getItem("authToken");
  const serverURL = "http://localhost:5000";
 
  const currentUserId = localStorage.getItem("userId");
  console.log("Current User ID:", currentUserId);

  const [newProdId, setProdId] = useState("");
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (authToken && userId) {
      setIsLoggedIn(true);
    }
  }, [token,currentUserId]);
  useEffect(() => {
    const loggedIn = localStorage.getItem("sellerId");
    if(loggedIn){
      setIsSellerLogged(true);
    }
    
  }, []);
  // const navigate = useNavigate();
  
    
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      setCartCount(parsedCart.length); // Update cart count
    }
  }, [token,currentUserId]);

  useEffect(() => { 
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/products/get`);
        console.log("Fetched products:", response.data);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [serverURL,token,currentUserId]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (token && currentUserId) {
        try {
          const response = await axios.get(
            `${serverURL}/api/wishlist/find/${currentUserId}`
          );
          setWishlist(response.data.products || []);
          setWishlistCount(response.data.products.length || 0);
          // localStorage.setItem("wishlist", JSON.stringify(data.products));
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          // setWishlist([]);
        }
      }
    };
    fetchWishlist();
  }, [token, currentUserId]);

  console.log("wishlist", wishlist);

  

  const refreshCart = async () => {
    if (token && currentUserId) {
     
      try {
       
        const response = await axios.get(
          `${serverURL}/api/cart/find/${currentUserId}`
        );
        console.log(`Request URL: ${serverURL}/api/cart/find/${currentUserId}`);

        const cartData = response.data?.items || [];


        if (cartData) {
          setCart(cartData);
          setCartCount(cartData.length);

          // const isInCart = cartData.some(
          //   (cartItem) => cartItem.product.toString() === productId.toString()
          // );
  
          // if (isInCart) {
          //   console.log(`Product ${productId} exists in the cart`);
          // }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCart([]);
      }
    } else {
      console.error("Token or currentUserId is missing");
    }
  };


  
  
  useEffect(() => {
    refreshCart();
    setCartCount(cart.length);
  }, [token,currentUserId]);

  const refreshWishllist = async () => {
    if (token && currentUserId) {
      try {
        const response = await axios.get(
          `${serverURL}/api/wishlist/find/${currentUserId}`
        );
        const wishlistData = response.data;

        if (wishlistData) {
          setWishlist(response.data.products);
          setWishlistCount(response.data.products.length);
          // localStorage.setItem("cart", JSON.stringify(cartData.cart));
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };
  const isInCart = (productId) => {
    console.log("Checking productId:", productId);
    return cart.some((cartItem) => {
      console.log("cartItem.productId:", cartItem.product);
      return cartItem.product?._id?.toString() === productId?.toString();
    });
  };
  
  const isInWishlist = (productId) => {
    return  wishlist.some((wish) => {
      return wish.productId?._id?.toString() === productId?.toString();
    })
  };

  
  
  

  const values = {
    isInWishlist,
    token,
    // handleAddToCart,
    isInCart,
    refreshCart,
    refreshWishllist,
    email,
    setEmail,
    password,
    setPassword,
    product,
    setProduct,
    newProductName,
    setNewProductName,
    newProductPrice,
    setNewProductPrice,
    editingProductId,
    setEditingProductId,
    editingProductVariantId, setEditingProductVariantId,
    editProductName,
    setEditingProductName,
    editProductPrice,
    setEditProductPrice,
    serverURL,
    
    newProductSubCategory,
     setNewProductSubCategory,
    newProductCategory,
    setNewProductCategory,
    editProductCategory,
    setEditProductCategory,
    editProductSubCategory,
     setEditProductSubCategory,
     offers, setOffers,
    editProductImage,
    setEditProductImage,
    wishlist,
    setWishlist,
    newProdId,
    setProdId,
    currentUserId,
    user,
    setUser,
    cart,
    setCart,
    cartCount,
    setCartCount,
    filteredData,
    setFilteredData,
    wishlistCount,
    setWishlistCount,
    isLoggedIn,
    setIsLoggedIn,
    searchQuery,
    setSearchQuery,
    isSellerLogged,setIsSellerLogged,
    editColor, setEditColor,
    editSizes, setEditSizes,
    newColor, setNewColor,
    newSizes, setNewSizes,
    newStock, setNewStock,
    newImage, setNewImage,
    newDescription, setNewDescription,
    editDescription, setEditDescription,
    newTags, setNewTags,
    editTags, setEditTags,
    editImage, setEditImage,
  };

  return (
    <div className="App">
      <BrowserRouter>
        <myContext.Provider value={values}>
          <Routes>
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminorder" element={<AdminOrders />} />
          <Route path="/adminseller" element={<AdminSeller />} />



            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/seller" element={<Seller />} />
            <Route path="/sellerlogin" element={<SellerAuth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/ban" element={<Ban />} />
            <Route path="/banseller" element={<AdminSellerBan />} />


            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/uploading" element={<Fileuploadform />} />
            <Route path="/displaying" element={<Displayingimage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/about" element={<About />} />
            
            <Route path="/rough" element={<Rough />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/checkoutpage" element={<CheckoutPage />} />
            <Route path="/orderpage" element={<OrdersPage />} />
            <Route path="/ordersuccess" element={<OrderSuccess />} />
            <Route path="/sellerprofile" element={<SellerProfile />} />
            <Route path="/acceptorders" element={<AcceptOrders />} />





           




          </Routes>
        </myContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
