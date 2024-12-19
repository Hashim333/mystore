import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { myContext } from "../Context";
import "./Seller.css";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaUserAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { FcAcceptDatabase } from "react-icons/fc";
import { BiSolidLogInCircle } from "react-icons/bi";
import { RiLogoutCircleFill } from "react-icons/ri";
import { BsCartCheckFill } from "react-icons/bs";

export default function Seller() {
  const {
    product,
    setProduct,
    newProductName,
    setNewProductName,
    newProductPrice,
    setNewProductPrice,
    editingProductId,
    setEditingProductId,
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
    isSellerLogged,
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
  } = useContext(myContext);

  const sellerId = localStorage.getItem("sellerId");
 

  // New State for additional fields
  
  // const [newDiscount, setNewDiscount] = useState(0);
  // const [editDiscount, setEditDiscount] = useState(0);
 

 

  // States for editing product fields
  
  // const [editStock, setEditStock] = useState(0);
 


  const[products,setProducts]=useState("")
  
  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/get/seller?sellerId=${sellerId}`
      );
      console.log("Seller products:", response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  };
  
  
  useEffect(() => {
    fetchSellerProducts();
  }, [sellerId]);


  
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${serverURL}/api/products/get`);
      console.log("Fetched products:", response.data);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const addSizeStock = () => {
    setNewSizes([...newSizes, { size: "", stock: 0 }]);
  };
  const addSize = () => {
    setEditSizes([...editSizes, { size: "", stock: 0 }]);
  };
  
  const handleNewSizeStockChange = (index, field, value) => {
    const updatedSizes = newSizes.map((item, i) =>
      i === index ? { ...item, [field]: field === "stock" ? parseInt(value) || 0 : value } : item
    );
    setNewSizes(updatedSizes);
  };
  
  // const handleSizeStockChange = (index, field, value, type) => {
  //   const updatedSizes = (type === "new" ? newSizes : editSizes).map((item, i) =>
  //     i === index ? { ...item, [field]: field === "stock" ? parseInt(value) || 0 : value } : item
  //   );
  //   type === "new" ? setNewSizes(updatedSizes) : setEditSizes(updatedSizes);
  // };
  const handleEditSizeStockChange = (index, field, value) => {
    const updatedSizes = editSizes.map((item, i) =>
      i === index ? { ...item, [field]: field === "stock" ? parseInt(value) || 0 : value } : item
    );
    setEditSizes(updatedSizes);
  };
  
  
  
  // Function to remove a size-stock pair
  const removeSizeStock = (index) => {
    const updatedSizes = newSizes.filter((_, i) => i !== index);
    setNewSizes(updatedSizes);
  };
  const removeSize = (index) => {
    const updatedSizes = [...editSizes];
    updatedSizes.splice(index, 1);
    setEditSizes(updatedSizes);
  };
  
  const handleAddProduct = async (event) => {
    event.preventDefault();
    try {
      const newProduct = {
        name: newProductName,
        price: newProductPrice,
        category: newProductCategory,
        subCategory: newProductSubCategory || undefined,
        description: newDescription,
        // discount: newDiscount,
        tags: newTags ? newTags.split(",").map((tag) => tag.trim()) : [],

        sellerId: sellerId,
        color: newColor || undefined,
        sizes: newSizes ,
       
        image: newImage || undefined,
      };

      
      await axios.post(`${serverURL}/api/products/add`, newProduct);

     
      fetchProducts();

      
      setNewProductName("");
      setNewProductPrice("");
      setNewProductCategory("");
      setNewProductSubCategory("");
      setNewDescription("");
      // setNewDiscount(0);
      setNewTags("");
      setNewColor("");
      setNewSizes([{ size: "", stock: 0 }]);
      setNewStock(0);
      setNewImage("");

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert(
        `Failed to add product: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const updateProduct = async (event, id) => {
    event.preventDefault();
    if (editSizes.some(size => !size.size || size.stock < 0)) {
      alert("Please ensure all sizes have valid values and stock is non-negative.");
      return;
    }
    try {
      await axios.put(`${serverURL}/api/products/update/${id}`, {
        // image: editProductImage,
        name: editProductName,
        price: editProductPrice,
        category: editProductCategory,
        subCategory: editProductSubCategory,
        description: editDescription,
        // discount: editDiscount,
        tags: editTags,
        color: editColor,
        sizes: editSizes,
        
        image: editImage,
      });
      fetchProducts();
      cancelEdit();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    // setEditProductImage(product.image);
    setEditingProductName(product.name);
    setEditProductPrice(product.price);
    setEditProductCategory(product.category);
    setEditProductSubCategory(product.subCategory);
    setEditDescription(product.description || "");
    // setEditDiscount(product.discount || 0);
    setEditTags(product.tags || "");
    setEditColor(product.color);
    setEditSizes(product.sizes||[]);
    // setEditStock(product.Stock || 0);
    setEditImage(product.image);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    // setEditProductImage("");
    setEditingProductName("");
    setEditProductPrice("");
    setEditProductCategory("");
    setEditProductSubCategory("");
    setEditDescription("");
    // setEditDiscount(0);
    setEditTags("");
    setEditColor("");
    setEditSizes("");
    // setEditStock(0);
    setEditImage("");
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the product?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`${serverURL}/api/products/delete/${id}`);
      alert("Product has been deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handleLogedin=()=>{
    if(isSellerLogged){
      
      localStorage.removeItem('token');
      localStorage.removeItem('sellerId');
      // localStorage.removeItem('userId');
      // localStorage.removeItem('cart');
      // localStorage.removeItem('wishlist');

      alert("you have logged out...");
      //  navigate("/login");
    }else{
      alert("redirecting to login page")
    }
  }
  return (
    <div className="home-wrapper">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="store-icon">
          <Link to="/seller" className="navbar-brand">
            🛒 MyStore
          </Link>
        </div>
        <div className="navbar-links">
        <div className="link-group">
        <Link to={!isSellerLogged?"/sellerlogin":"/sellerlogin"} className="navbar-link" onClick={handleLogedin}>
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

      {/* Main Content Section */}
      <div className="home-container">
        <h1 className="home-title">Product Management</h1>

        {/* Add Product Form */}
        <div className="add-product-form">
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct}>
            {/* Product Input Fields */}
            <input
              type="text"
              placeholder="Product Name"
              className="form-input"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Product Price"
              className="form-input"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Product Category"
              className="form-input"
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
            />
            <input
              type="text"
              placeholder="Product Sub Category"
              className="form-input"
              value={newProductSubCategory}
              onChange={(e) => setNewProductSubCategory(e.target.value)}
            />
            <input
              type="text"
              placeholder="Product Description"
              className="form-input"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="form-input"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
            />
           
            <input
              type="text"
              placeholder="Color"
              className="form-input"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />           
            <input
              type="text"
              placeholder="Image URL"
              className="form-input"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
<div className="sizes-stock-container">
  <h3>Sizes and Stock</h3>
    {newSizes.map((item, index) => (
    <div key={index} className="size-stock-row">
      <input
        type="text"
        placeholder="Size"
        className="form-input size-input"
        value={item.size}
        onChange={(e) => handleNewSizeStockChange(index, "size", e.target.value)}
      />
      <input
        type="number"
        placeholder="Stock"
        className="form-input stock-input"
        value={item.stock}
        onChange={(e) => handleNewSizeStockChange(index, "stock", e.target.value)}
      />
      <button
        type="button"
        className="remove-button"
        onClick={() => removeSizeStock(index)}
      >
        Remove
      </button>
    </div>
  ))}
  <button type="button" className="add-button" onClick={addSizeStock}>
    Add Size
  </button>
</div>
            <button type="submit" className="form-button">
              Add Product
            </button>
          </form>
        </div>
        {/* Sizes with Stock */}


      </div>
      <h3> Product List</h3>
      <div>
        <ul className="product-list">
        {products && products.length > 0 ? (
  products.map((mappedProduct, index) => (
    <li key={`${mappedProduct._id}-${index}`} className="product-item">
      <div className="product-details">
        {editingProductId === mappedProduct._id ? (
          <form onSubmit={(e) => updateProduct(e, mappedProduct._id)}>
            <input
              type="text"
              placeholder="Product Name"
              value={editProductName}
              onChange={(e) => setEditingProductName(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Product Price"
              value={editProductPrice}
              onChange={(e) => setEditProductPrice(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Product Category"
              value={editProductCategory}
              onChange={(e) => setEditProductCategory(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Product Sub Category"
              value={editProductSubCategory}
              onChange={(e) => setEditProductSubCategory(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Product Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Product Color"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Product Image"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              className="form-input"
            />

            <h3>Sizes and Stock</h3>
            {editSizes.map((size, index) => (
              <div key={index} className="size-stock-row">
                <input
                  type="text"
                  placeholder="Size"
                  value={size.size}
                  onChange={(e) => handleEditSizeStockChange(index, "size", e.target.value)}
                  className="form-input size-input"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={size.stock}
                  onChange={(e) => handleEditSizeStockChange(index, "stock", e.target.value)}
                  className="form-input stock-input"
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="form-button remove-size"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="form-button add-size"
            >
              Add Size
            </button>
            <button type="submit" className="form-button">
              Update Product
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="form-button cancel"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="image-product-container">
              <img
                src={mappedProduct.image}
                alt={`${mappedProduct.name} product`}
                className="product-image"
              />
              <h2>{mappedProduct.name}</h2>
              <p>Color: {mappedProduct.color}</p>
            </div>
            <p>Price: {mappedProduct.price}</p>
            <p>Category: {mappedProduct.category}</p>
            <p>Sub Category: {mappedProduct.subCategory}</p>
            <p>Sizes and Stock:</p>
            <ul>
              {mappedProduct.sizes.map((size, idx) => (
                <li key={idx}>
                  {size.size}: {size.stock}
                </li>
              ))}
            </ul>
            <button
              onClick={() => deleteProduct(mappedProduct._id)}
              className="delete-button"
            >
              Delete
            </button>
            <button
              onClick={() => startEditProduct(mappedProduct)}
              className="edit-button"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </li>
  ))
) : (
  <p>No products found</p>
)}

        </ul>
      </div>
    </div>
    // </div>
  );
}
