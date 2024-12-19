import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "../Context";

function Login() {
  
 
  const{user,setUser ,email, setEmail,
    password, setPassword,setIsLogedIn,} =useContext(myContext)
  const navigate = useNavigate();
  // axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/users/login", {
      email,
      password,
   }, { timeout: 5000 })

      .then((res) => {
        console.log("login: " + JSON.stringify(res.data));

        if (res.data.success) {
          console.log("resdata", res.data);
          localStorage.setItem("authToken", res.data.token);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userId", res.data.userId);
          console.log("authToken", localStorage.getItem("authToken"));
          console.log("res", res.data.user);
          setUser(res.data.user);
          navigate("/");
          setIsLogedIn(true)

          alert("login successfull")
        }

        if (!res.data.success) {
          alert("Enter valid credentials...!");
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            alert("Incorrect password");
          } else if (err.response.status === 404) {
            alert("User not found");
          } else {
            alert("An error occurred. Please try again.");
          }
        } else {
          console.error("Error during login:",err);
          // alert("Network error or server is not responding.");
        }
      });
    }

  console.log("user", user);

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>

        {/* <p>
          Not Registered..? Please
          <Link to="/signup"style={{textDecoration: "none",fontWeight: "bold",color: "black",
            }}>
            {" "}
            Sign Up
          </Link>
        </p> */}

        <p>
          Forgot Password?
          <Link
            to="/forgotpassword"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "black",
            }}
          >
            {" "}
            Click here...
          </Link>
        </p>

        <Link
          to="/signup"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
