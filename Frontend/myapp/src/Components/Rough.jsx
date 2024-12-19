import { useContext } from "react";
import { myContext } from "../Context";

export default function Rough() {
  const { product } = useContext(myContext);

  return (
    <div>
      {product.map((item, productIndex) => (
        <div key={productIndex} className="product-container">
          <h3>{item.name}</h3>
          <p>Price: {item.price}</p>
          <p>Category: {item.category}</p>

          <h4>Variants:</h4>
          {item.variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="variant-container">
              <p>Color: {variant.color}</p>
              <p>Size: {variant.size}</p>
              <p>Stock: {variant.stock}</p>
              <img 
                src={variant.image} 
                alt={`${variant.color} variant`} 
                className="variant-image" 
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          ))}

          <hr />
        </div>
      ))}
    </div>
  );
}
