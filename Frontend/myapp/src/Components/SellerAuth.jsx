import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { myContext } from '../Context';
import "./SellerProfile.css";
const SellerAuth = () => {
  const { setIsSellerLogged } = useContext(myContext);
  const navigate = useNavigate();
  const [form, setForm] = useState('register'); // 'register' or 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/seller/register`,
        { name, email, password, storeName },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage({ type: 'success', text: response.data.message });
      setForm('login');
    } catch (error) {
      handleError(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/seller/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage({ type: 'success', text: response.data.message });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('sellerId', response.data.seller.sellerId);
      setIsSellerLogged(true);
      navigate('/seller');
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const { status, data } = error.response;
      setMessage({ type: 'error', text: data.message || `Error: ${status}` });
    } else if (error.request) {
      setMessage({ type: 'error', text: 'Network error: Please check your connection' });
    } else {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    }
  };

  return (
    <div className="seller-auth-container">
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      {form === 'register' ? (
        <form className="seller-auth-form" onSubmit={handleRegister}>
          <h2 className="seller-auth-title">Register</h2>
          <input
            type="text"
            className="seller-auth-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="seller-auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="seller-auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            className="seller-auth-input"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
          <button type="submit" className="seller-auth-button">
            Register
          </button>
          <p className="switch-auth-mode" onClick={() => setForm('login')}>
            Already have an account? Login
          </p>
        </form>
      ) : (
        <form className="seller-auth-form" onSubmit={handleLogin}>
          <h2 className="seller-auth-title">Login</h2>
          <input
            type="email"
            className="seller-auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="seller-auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="seller-auth-button">
            Login
          </button>
          <p className="switch-auth-mode" onClick={() => setForm('register')}>
            Don't have an account? Register
          </p>
        </form>
      )}
    </div>
  );
};

export default SellerAuth;
