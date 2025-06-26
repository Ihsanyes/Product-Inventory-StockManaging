import React, { useState } from 'react';
import api from '../services/api';

function ProductForm() {
  const [productDetails, setProductDetails] = useState({
    ProductName: '',
    ProductCode: '',
    HSNCode: '',
    TotalStock: '',
    ProductImage: null,
    variants: [
      { name: 'Color', options: [''] },
      { name: 'Size', options: [''] },
    ],

  });



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!productDetails.ProductName.trim() || !productDetails.ProductCode.trim()) {
      alert('Product Name and Code are required');
      return;
    }

    const formData = new FormData();
    formData.append('ProductName', productDetails.ProductName);
    formData.append('ProductCode', productDetails.ProductCode);
    formData.append('HSNCode', productDetails.HSNCode);
    formData.append('TotalStock', productDetails.TotalStock);
    if (productDetails.ProductImage) {
      formData.append('ProductImage', productDetails.ProductImage);
    }
    formData.append('variants', JSON.stringify(productDetails.variants));

    try {
      await api.post('/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Product created successfully!');
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    }
  };

  console.log(productDetails);

  const handleVariantOptionChange = (variantIndex, optionIndex, value) => {
    const updatedVariants = [...productDetails.variants];
    updatedVariants[variantIndex].options[optionIndex] = value;
    setProductDetails({ ...productDetails, variants: updatedVariants });
  };

  const addVariantOption = (variantIndex) => {
    const updatedVariants = [...productDetails.variants];
    updatedVariants[variantIndex].options.push('');
    setProductDetails({ ...productDetails, variants: updatedVariants });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-24 p-6 bg-white shadow-lg rounded-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Create Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border border-gray-300 rounded p-2 w-full"
          value={productDetails.ProductName}
          onChange={(e) => setProductDetails({ ...productDetails, ProductName: e.target.value })}
          placeholder="Product Name"
          required
        />
        <input
          className="border border-gray-300 rounded p-2 w-full"
          value={productDetails.ProductCode}
          onChange={(e) => setProductDetails({ ...productDetails, ProductCode: e.target.value })}
          placeholder="Product Code"
        />
        <input
          className="border border-gray-300 rounded p-2 w-full"
          value={productDetails.HSNCode}
          onChange={(e) => setProductDetails({ ...productDetails, HSNCode: e.target.value })}
          placeholder="HSN Code"
        />
        <input
          className="border border-gray-300 rounded p-2 w-full"
          type="number"
          value={productDetails.TotalStock}
          onChange={(e) => setProductDetails({ ...productDetails, TotalStock: e.target.value })}
          placeholder="Total Stock"
        />
      </div>

      <input
        type="file"
        hidden
        accept="image/*"
        id="productImage"
        onChange={(e) =>
          setProductDetails({
            ...productDetails,
            ProductImage: e.target.files[0],
          })
        }
      />
      <label
        htmlFor="productImage"
        className="bg-gray-300 p-3 w-fit block text-sm font-medium text-gray-700 rounded cursor-pointer hover:bg-gray-400"
      >
        <p className="text-sm text-gray-600">
          {productDetails.ProductImage?.name ? `Selected: ${productDetails.ProductImage.name}` : 'Add Product Image'}
        </p>
      </label>

      {productDetails.ProductImage && (
        <img
          src={URL.createObjectURL(productDetails.ProductImage)}
          alt="Preview"
          className="w-32 h-32 object-cover rounded"
        />
      )}

      {productDetails.variants.map((variant, variantIndex) => (
        <div key={variantIndex} className="bg-gray-50 p-4 rounded border border-gray-200 space-y-2">
          <label>
            {variant.name}
          </label>

          {variant.options.map((option, optionIndex) => (
            <input
              key={optionIndex}
              className="border border-gray-300 rounded p-2 w-full mt-1"
              value={option}
              onChange={(e) => handleVariantOptionChange(variantIndex, optionIndex, e.target.value)}
              placeholder={`Option ${optionIndex + 1} for ${variant.name}`}
            />
          ))}

          <button
            type="button"
            onClick={() => addVariantOption(variantIndex)}
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            + Add Another Option
          </button>
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}

export default ProductForm;