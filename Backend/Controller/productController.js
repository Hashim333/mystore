const Product = require("../Model/productModel");
const mongoose = require('mongoose');
// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      subCategory,
      description,
      tags,
      color,
      sizes, // Array of { size, stock }
      image,
      sellerId,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !price ||
      !category ||
      !subCategory ||
      !description ||
      !tags ||
      !color ||
      !sizes ||
      !image
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate sizes
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ message: "Sizes must be a non-empty array" });
    }

    // Check each size entry
    for (const sizeEntry of sizes) {
      if (!sizeEntry.size || !sizeEntry.stock) {
        return res
          .status(400)
          .json({ message: "Each size entry must include 'size' and 'stock'" });
      }
    }

    // Create the product
    const product = new Product({
      name,
      price,
      category,
      subCategory,
      description,
      tags,
      color,
      sizes,
      image,
      sellerId,
    });

    await product.save();

    res.status(201).json({ message: "Product saved successfully!", product });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ message: "Error saving product", error });
  }
};


const getsellerProducts =async (req, res) => {
  try {
    const { sellerId } = req.query; // Extract sellerId from the query string.

    if (!sellerId) {
      return res.status(400).json({ message: "sellerId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid sellerId format" });
    }
    // Fetch products where the sellerId matches the query parameter.
    const products = await Product.find({ sellerId:sellerId });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  } 
}
// Get all products
const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    // console.log('Products fetched successfully:', products);
    console.log(products);  
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};


const getsellerProduct = async (req, res) => {
  try {
    const { sellerId } = req.query; // Extract sellerId from query parameters

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    // Find products where sellerId matches or includes the provided sellerId
    const products = await Product.find({
      sellerId: { $regex: sellerId, $options: "i" }, // Case-insensitive partial match
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this seller." });
    }

    res.status(200).json(products); // Return products
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};


// Update a product by ID
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, price, category, subCategory,description,tags,variants } = req.body;

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { name, price, category, subCategory,description,tags,variants },
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: "Error updating product", error });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      category,
      subCategory,
      description,
      tags,
      color,
      sizes,
      image,
    } = req.body;

    // Update only provided fields
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          price,
          category,
          subCategory,
          description,
          tags,
          color,
          sizes,
          image,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
};


// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};


const getProductById = async(req,res)=>{

  try{

const product=await Product.findById(req.params.id).populate("sellerId");

if(!product) return res.status(404).json({message:"product not found"});
console.log(product); 
res.status(200).json(product)

  }catch(error){

res.status(500).json({error:error.message})

  }

}


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};





module.exports = { addProduct, getProduct, updateProduct, deleteProduct ,getProductById,getAllProducts,getsellerProduct,getsellerProducts};
