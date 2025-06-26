import React, { useState, useEffect,  } from 'react';
import api from '../services/api';
import { useLocation } from 'react-router-dom';


function StockReport() {
  const [records, setRecords] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const location = useLocation();
  const productId = location.state?.productId || '';
  const productName = location.state?.productName || '';
  const productCode = location.state?.productCode || '';
console.log(start, end)


const fetchRecords = async () => {
  try {
    const res = await api.get(`/stock-report/${productId}?start_date=${start}&end_date=${end}`);
    setRecords(res.data);
  } catch (error) {
    console.error('Failed to fetch records:', error);
  }
};
  useEffect(() => {
    fetchRecords();
  }, [start, end]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Stock Report</h2>
      <p className="mb-4 text-gray-600">Product Name: {productName}</p>
      <p className="mb-4 text-gray-600">Product Code: {productCode}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <label className="flex flex-col text-sm text-gray-700">
          Start Date
          <input
            type="datetime-local"
            onChange={(e) => setStart(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex flex-col text-sm text-gray-700">
          End Date
          <input
            type="datetime-local"
            onChange={(e) => setEnd(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <ul className="space-y-3">
        {records.map((r, i) => (
          <li key={i} className="p-3 bg-gray-50 border rounded shadow-sm">
            <span className="font-semibold">{r.transaction_type}</span>: {Number(r.quantity).toFixed(0)} —{'  '}
            <span className="text-sm text-gray-600">
              {new Date(r.timestamp).toLocaleString()}
            </span>
\
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockReport;