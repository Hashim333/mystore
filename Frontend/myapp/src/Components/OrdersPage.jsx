import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { myContext } from "../Context";
import { BsCartCheckFill } from "react-icons/bs";
import { BiSolidLogInCircle } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { FaShoppingCart, FaUserAlt, FaInfoCircle } from "react-icons/fa";

const OrderPage = () => {
    const{currentUserId,wishlistCount,cartCount,isLoggedIn}=useContext(myContext)
  const [orders, setOrders] = useState([]);
 const navigate=useNavigate();  
  

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("authToken"); 
            const response = await axios.get(
                `http://localhost:5000/api/users/order/${userId}`
            );

            setOrders(response.data); // Store orders in state
        
        } catch (err) {
            console.error(err);
            
            
        }
    };

    fetchOrders(); // Fetch orders on component mount
}, [currentUserId]);

console.log("orders",orders)
  
const handleLogedin=()=>{
  if(isLoggedIn){
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');

    alert("you have logged out...");
     navigate("/login");
  }else{
    alert("redirecting to login page")
  }
}
  return (
    <div className="home-wraper">

 <nav className="navbar">
      <div className="store-icon">
        <Link to="/" className="navbar-brand">🛒 MyStore</Link>
      </div>
      
      {/* <input 
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="🔎 Search here..."
        className="search-input"
      /> */}
      
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
    
    <div className="wrap-order-page">
      <h1>Your Orders</h1>
      {orders.map((order) => (
        <div key={order._id} className="orerpage">
          <h3>Order ID: {order._id}</h3>
          <p>Total Amount: ${order.totalAmount}</p>
          <p>Status: {order.status}</p>
          <ul>
            {order.products.map((product) => (
              <li key={product.productId._id}>
                <img src={product.productId.image} alt={product.productId.name} />
                <p>{product.productId.name}</p>
                <p>Quantity: {product.quantity}</p>
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
    </div>
  );
};

export default OrderPage;
