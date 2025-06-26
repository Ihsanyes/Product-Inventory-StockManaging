import React, { useState } from 'react';
import api from '../services/api';
import { useLocation } from 'react-router-dom';

function StockManager() {
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('IN');

  const location = useLocation();
  const productInfo = location.state;

  const productName = productInfo?.[0]?.product;
  const productCode = productInfo?.[1]?.productCode;
  const productId = productInfo?.[2]?.productId;


  const handleSubmit = async () => {
    const endpoint = type === 'IN' ? 'add-stock' : 'remove-stock';
    await api.post(`/products/${productId}/${endpoint}/`, {
      quantity,
    });
    alert(`Stock ${type === 'IN' ? 'added' : 'removed'} successfully`);
    setQuantity('');
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-md mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Manage Stock</h3>
      <p className="mb-2 text-gray-600">Product: {productName}</p>
      <p className="mb-4 text-gray-600">Product Code: {productCode}</p>

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || '')}
        placeholder="Quantity"
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        onChange={(e) => setType(e.target.value)}
        value={type}
        className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="IN">Add</option>
        <option value="OUT">Remove</option>
      </select>


      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        Update Stock
      </button>
    </div>
  );
}

export default StockManager;