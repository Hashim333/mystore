import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { myContext } from "../Context";

export default function CheckoutPage({ cartItems, totalAmount }) {
  const { currentUserId } = useContext(myContext);
  const [savedAddress, setSavedAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems, totalPrice } = location.state || { selectedItems: [], totalPrice: 0 };

  // Fetch saved address from the server
  useEffect(() => {
    const fetchSavedAddress = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/address/get/${currentUserId}`);
        setSavedAddress(response.data.address);
        // console.log("Fetched saved address response:", response.data.address);
      } catch (error) {
        console.error("Failed to fetch saved address:", error);
      }
    };

    if (currentUserId) {
      fetchSavedAddress();
    }
  }, [currentUserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  // const handleSaveAddress = async () => {
  //   try {
  //     const response = await axios.post(`http://localhost:5000/api/users/${currentUserId}/address`, shippingAddress);
  //     alert("Address updated successfully!");
  //     setSavedAddress(response.data.address);
  //     setShowAddressForm(false); // Hide the form after saving
  //   } catch (error) {
  //     console.error("Failed to save address:", error);
  //     alert("Failed to save the address. Please try again.");
  //   }
  // };
  const handleSaveAddress = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/users/${currentUserId}/address`, shippingAddress);
      alert("Address updated successfully!");
      setShowAddressForm(false);
  
      // Fetch the updated saved address
      const updatedAddress = await axios.get(`http://localhost:5000/api/users/address/get/${currentUserId}`);
      setSavedAddress(updatedAddress.data.address);
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save the address. Please try again.");
    }
  };
  

  // const handleOrderSubmit = async () => {
  //   if (
  //     !shippingAddress.addressLine1 ||
  //     !shippingAddress.city ||
  //     !shippingAddress.state ||
  //     !shippingAddress.postalCode ||
  //     !shippingAddress.country
  //   ) {
  //     alert("Please fill in all required fields for the shipping address.");
  //     return;
  //   }

  //   const orderData = {
  //     userId: currentUserId,
  //     products: selectedItems.map((item) => ({
  //       productId: item.product._id,
  //       quantity: item.quantity,
  //     })),
  //     totalAmount: totalPrice,
  //     paymentMethod: paymentMethod,
  //     shippingAddress: savedAddress || shippingAddress,
  //   };

  //   try {
  //     const response = await axios.post("http://localhost:5000/api/users/neworder", orderData);
  //     alert("Order placed successfully!");
  //     navigate("/orderpage", { state: { orderId: response.data._id } });
  //   } catch (error) {
  //     console.error("Order creation failed:", error);
  //   }
  // };
  const handleOrderSubmit = async () => {
    const finalShippingAddress = savedAddress || shippingAddress;
  
    if (
      !finalShippingAddress.addressLine1 ||
      !finalShippingAddress.city ||
      !finalShippingAddress.state ||
      !finalShippingAddress.postalCode ||
      !finalShippingAddress.country
    ) {
      alert("Please fill in all required fields for the shipping address.");
      return;
    }
  
    const orderData = {
      userId: currentUserId,
      products: selectedItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        sellerId: item.product.sellerId,
        size: item.size, // Include size
      price: item.product.price,
      })),
      totalAmount: totalPrice,
      paymentMethod: paymentMethod,
      shippingAddress: finalShippingAddress,
    };
    console.log("Order Data being sent to backend:", orderData);
    try {
      const response = await axios.post("http://localhost:5000/api/users/neworder", orderData);
      alert("Order placed successfully!");
      navigate("/orderpage", { state: { orderId: response.data._id } });
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };
  

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      {/* Display Saved Address or Add New Address */}
      <div className="checkout-section">
        <h2 className="section-title">Shipping Address</h2>
        {savedAddress ? (
          <div>
            
            <p><strong>Saved Address:</strong></p> 
            <p>{savedAddress.addressLine1}</p>
            <p>{savedAddress.addressLine2}</p>
            <p>{savedAddress.city}, {savedAddress.state} {savedAddress.postalCode}</p>
            <p>{savedAddress.country}</p>
            <button onClick={() => setShowAddressForm(true)} className="edit-address-button">
              Edit Address
            </button>
          </div>
        ) : (
          <button onClick={() => setShowAddressForm(true)} className="add-address-button">
            Add New Address
          </button>
        )}

        {/* Show Address Form if 'Add New Address' or 'Edit Address' is clicked */}
        {showAddressForm && (
          <div className="form-container">
            <div className="form-group">
              <label>Address Line 1:</label>
              <input
                type="text"
                name="addressLine1"
                value={shippingAddress.addressLine1}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Address Line 2:</label>
              <input
                type="text"
                name="addressLine2"
                value={shippingAddress.addressLine2}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Postal Code:</label>
              <input
                type="text"
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <button onClick={handleSaveAddress} className="save-address-button">
              Save Address
            </button>
            <button onClick={() => setShowAddressForm(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Payment Method Selection */}
      <div className="checkout-section">
        <h2 className="section-title">Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="form-select"
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      <button onClick={handleOrderSubmit} className="checkout-button">
        Place Order
      </button>
    </div>
  );
}
