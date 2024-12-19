import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { myContext } from '../Context';
import axios from 'axios';
import "./Adm.css";
import { Link } from 'react-router-dom';
import { FcLike } from 'react-icons/fc'; // Heart icon
import { FaHome, FaShoppingCart, FaUserAlt, FaInfoCircle } from 'react-icons/fa';
import { BiSolidLogInCircle } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";
import { GrAppsRounded } from "react-icons/gr";
import { RiLogoutCircleFill } from "react-icons/ri";
export default function Admin() {
   useEffect(() => {
      const loggedIn = localStorage.getItem("adminToken");
      if(loggedIn){
        setAdminLogged(true);
      }
      
    }, []);
   const [isLoggedIn, setAdminLogged] = useState(false);
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
        newProductQuantity,
        setNewProductQuantity,
        newProductCategory,
        setNewProductCategory,
        editProductCategory,
        setEditProductCategory,
        editProductSubCategory,
        setEditProductSubCategory,
        image,
        editDescription,
        setEditDescription,
        editTags,
        setEditTags,
        setImage,
        editImage,
        setEditImage,
        editColor,
        setEditColor,
        editProductImage,
        setEditProductImage,
        wishlist,
        setWishlist,
        currentUserId,
        
        searchQuery, setSearchQuery,
        filteredData, setfilteredData,
        wishlistCount,setwishlistCount ,
        // editColor, setEditColor,
    editSizes, setEditSizes,
    newColor, setNewColor,
    newSizes, setNewSizes,
    newStock, setNewStock,
    newImage, setNewImage,
    newDescription, setNewDescription,
    // editDescription, setEditDescription,
    newTags, setNewTags,
    // editTags, setEditTags,
    // editImage, setEditImage,
      } = useContext(myContext);
      useEffect(() => {
        if (!editSizes) {
          setEditSizes([]); // Initialize as an empty array
        }
      }, [editSizes, setEditSizes]);
      const handleEditSizeStockChange = (index, field, value) => {
        const updatedSizes = editSizes.map((item, i) =>
          i === index ? { ...item, [field]: field === "stock" ? parseInt(value) || 0 : value } : item
        );
        setEditSizes(updatedSizes);
      };

      const removeSize = (index) => {
        const updatedSizes = [...editSizes];
        updatedSizes.splice(index, 1);
        setEditSizes(updatedSizes);
      };
      
      const addSize = () => {
        setEditSizes([...editSizes, { size: "", stock: 0 }]);
      };

      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${serverURL}/api/products/get`);
          console.log('Fetched products:', response.data);
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching products:',error);
        }
      };
    const updateProduct = async (event, id) => {
        event.preventDefault();
        try {
          await axios.put(`${serverURL}/api/products/update/${id}`, {
            image: editProductImage,
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
          console.error('Error updating product:', error);
        }
      };

      const startEditProduct = (product) => {
        setEditingProductId(product._id);
        setEditProductImage(product.image);
        setEditingProductName(product.name);
        setEditColor(product.color);
        setEditDescription(product.description || "");
        setEditImage(product.image);
        setEditTags(product.tags || "");
        setEditProductPrice(product.price);
        setEditProductCategory(product.category);
        setEditProductSubCategory(product.subCategory);
        setEditSizes(product.sizes || []); // Ensure sizes are loaded here
      };
      
      const cancelEdit = () => {
        setEditingProductId(null);
        setEditProductImage('');
        setEditingProductName('');
        setEditProductPrice('');
        setEditProductCategory('');
       
        setEditProductSubCategory("");
    setEditDescription("");
    // setEditDiscount(0);
    setEditTags("");
    setEditColor("");
    setEditSizes("");
    // setEditStock(0);
    setEditImage("");
      };

      const deleteProduct=async(id)=>{
        const confirmDelete=window.confirm('are you sure you want to delete the product?');
        if(!confirmDelete){
          return;
        }
        try{
          await axios.delete(`${serverURL}/api/products/delete/${id}`);
          alert('Product has been deleted successfully');
          fetchProducts();
    
        }catch(error){
          console.error('error deleting product:',error);
          
        }
      };
      function handleSearch(e) {
        const query = e.target.value;
        setSearchQuery(query);
    
        if (query.trim() === "") {
          // Reset to original product list
          setfilteredData(product);
        } else {
          const filtered = product.filter(product => {
            const { name, price, category } = product;
            return (
              name.toLowerCase().includes(query.toLowerCase()) ||
              price.toString().includes(query) ||
              category.toLowerCase().includes(query.toLowerCase())
            );
          });
          setfilteredData(filtered);
        }
      }
      const handleLogedin=()=>{
        if(isLoggedIn){
          
          localStorage.removeItem('adminToken');
          
    
          alert("you have logged out...");
         
        }else{
          alert("redirecting to login page")
        }
      }
    //   const productsToDisplay = product.length > 0 ? filteredData : product;
    const productsToDisplay = searchQuery ? filteredData : product;

  return (
    <div className='home-wrapper'>
       <nav className="navbar">
      <div className="store-icon">
        <Link to="/seller" className="navbar-brand">🛒 MyStore</Link>
      </div>
      
      <input 
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="🔎 Search here..."
        className="search-input"
      />
      
      <div className="navbar-links">
        <div className="link-group">
         
          <Link to="/ban" className="navbar-link">
            <MdManageAccounts /> - Users
          </Link>
          <Link to="/banseller" className="navbar-link">
            <MdManageAccounts /> - Seller
          </Link>
          <Link to="/adminorder" className="navbar-link">
            <GrAppsRounded />- Orders
          </Link>
          {/* <Link to="/cart" className="cart-icon-container">
            <FaShoppingCart /> 
            {cartCount >0 &&<span  className='cart-count'>{cartCount}</span> }Cart
          </Link> */}
          {/* <Link to="/adminseller" className="navbar-link">
            <FaUserAlt /> Sellers
          </Link> */}
           <Link to="/" className="navbar-link">
                        <FaHome /> Home
                      </Link>
           <Link to={!isLoggedIn?"/adminlogin":"/adminlogin"} className="navbar-link" onClick={handleLogedin}>
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
        <div className='admin-prd'>
        <ul className="product-list">
  {productsToDisplay.length > 0 ? (
    productsToDisplay.map((product) => (
      <li key={product._id} className="product-item">
        <div className="product-details">
          {editingProductId === product._id ? (
            <form onSubmit={(e) => updateProduct(e, product._id)}>
             
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
                placeholder="Product SubCategory"
                value={editProductSubCategory}
                onChange={(e) => setEditProductSubCategory(parseInt(e.target.value) || '')}
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
              <img src={product.image} alt={product.name} className="product-image" />
              <h2>{product.name}</h2>
              <p>Price: {product.price}</p>
              <p>Category: {product.category}</p>
              <p>SubCategory: {product.subCategory}</p>
              <button onClick={() => deleteProduct(product._id)} className="delete-button">
                Delete
              </button>
              <button
                onClick={() => startEditProduct(product)}
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
  )
}
