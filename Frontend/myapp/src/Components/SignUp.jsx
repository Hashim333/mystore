import { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { myContext } from "../Context";
// import PopUp from "./PopUp";

function Signup() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const{user,setUser}=useContext(myContext)
  
  
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post("http://localhost:5000/api/users/signup", {
        username,
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        alert("Registration successful!");
       
       
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        // Redirect after 3 seconds
      })

      .catch((err) => {
        if (err.response) {
          // Show alert for specific errors (like incorrect password, etc.)
          if (err.response.status === 400) {
            window.alert("Invalid credentials. Please check your email or password.");
          } else if (err.response.status === 404) {
            window.alert("User not found. Please sign up.");
          } else {
            window.alert("An unexpected error occurred. Please try again.");
          }
        } else {
          window.alert("An error occurred. Please try again.");
        }
      })
      .finally(() => setLoading(false)); // Stop loading when request is done
  };

  

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
              value={username}
            />
          </div>

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
              value={email}
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
              value={password}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p>
          Already Have an Account?
          <Link
            to="/login"
            style={{
              textDecoration: "None",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Please Login Here
          </Link>
        </p>

        <Link
          to="/login"
          className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
        >
          Login
        </Link>
      </div>

     
    </div>
  );
}

export default Signup;
