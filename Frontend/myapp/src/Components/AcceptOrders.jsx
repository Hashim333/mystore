import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { FcAcceptDatabase } from "react-icons/fc";
import { BiSolidLogInCircle } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { myContext } from "../Context";

export default function AcceptOrders() {
  const { isSellerLogged } = useContext(myContext);
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({}); // Track selected statuses for orders
  const sellerId = localStorage.getItem("sellerId"); // Get sellerId from localStorage

  const handleLogedin = () => {
    if (isSellerLogged) {
      localStorage.removeItem("token");
      localStorage.removeItem("sellerId");
      alert("You have logged out...");
    } else {
      alert("Redirecting to login page");
    }
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/seller/get/${sellerId}`
        );
        setOrders(response.data); // Save orders in state
      } catch (error) {
        console.error("Failed to fetch seller orders:", error);
      }
    };

    if (sellerId) fetchOrders();
  }, [sellerId]);

  // Handle order status update
  // const handleUpdateStatus = async (orderId) => {
  //   const updatedStatus = statusUpdate[orderId]; // Get selected status
  //   if (!updatedStatus) {
  //     alert("Please select a status before updating.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/api/seller/updateOrderStatus/${orderId}`,
  //       { status: updatedStatus }
  //     );
  //     alert(`Order ${orderId} status updated to ${updatedStatus}.`);

  //     // Update the local state to reflect the status change
  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order._id === orderId ? { ...order, status: updatedStatus } : order
  //       )
  //     );

  //     // Clear the selected status after update
  //     setStatusUpdate((prevStatus) => ({
  //       ...prevStatus,
  //       [orderId]: "",
  //     }));
  //   } catch (error) {
  //     console.error("Failed to update order status:", error);
  //     alert("Failed to update the order status. Please try again.");
  //   }
  // };
  
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!newStatus) {
      alert("Please select a status before updating.");
      return;
    }
  
    try {
      console.log("Updating status:", { orderId, newStatus });  
      const response = await axios.post(
        `http://localhost:5000/api/seller/updateOrderStatus/${orderId}`,
        { status: newStatus }
      );
      alert(`Order status updated to "${newStatus}".`);
  
      // Update the local state to reflect the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setStatusUpdate((prevStatus) => ({
        ...prevStatus,
        [orderId]: "",
      }));
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update the order status. Please try again.");
    }
  };
  

  // Handle dropdown change
  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdate((prevStatus) => ({
      ...prevStatus,
      [orderId]: newStatus,
    }));
  };

  return (
    <div className="product-page">
      <nav className="navbar">
        <div className="store-icon">
          <Link to="/seller" className="navbar-brand">
            🛒 MyStore
          </Link>
        </div>
        <div className="navbar-links">
          <div className="link-group">
            <Link
              to={!isSellerLogged ? "/sellerlogin" : "/sellerlogin"}
              className="navbar-link"
              onClick={handleLogedin}
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
            <Link to="/acceptorders" className="navbar-link">
              <FcAcceptDatabase /> Orders
            </Link>
            <Link to="/sellerprofile" className="navbar-link">
              <FaUserAlt /> Profile
            </Link>
          </div>
        </div>
      </nav>
      <div className="product-container">
        <div className="cart-product-list">
          <div className="order-list">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="order-section">
                  <div className="order-header">
                    <h4>Order ID: {order._id}</h4>
                    <p>Total Amount: ${order.totalAmount}</p>
                    <p>Status: {order.status}</p>
                  </div>
                  <h5>Products:</h5>
                  <ul className="product-list">
                    {order.products
                      .filter((product) => product.sellerId === sellerId)
                      .map((product) => (
                        <li key={product.productId._id} className="product-item">
                          <p><strong>Product Name:</strong> {product.productId.name}</p>
                          <p><strong>Price:</strong> ${product.price}</p>
                          <p><strong>Quantity:</strong> {product.quantity}</p>
                          <p><strong>Size:</strong> {product.size}</p>
                        </li>
                      ))}
                  </ul>
                  {/* Dropdown and Update Button */}
                  <div className="status-update-section">
                    <label htmlFor={`status-${order._id}`}>Update Status:</label>
                    <select
                      id={`status-${order._id}`}
                      value={statusUpdate[order._id] || ""}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="status-dropdown"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      className="update-status-button"
                      onClick={() => handleUpdateStatus(order._id, statusUpdate[order._id])}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-orders">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
