import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom'

function ProductList() {
  const [products, setProducts] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageUrl, setPageUrl] = useState('/products/');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(pageUrl);
        console.log('Fetched products:', res.data);
        setProducts(res.data.results);
        setNext(res.data.next);
        setPrevious(res.data.previous);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [pageUrl]);

  const handleNext = () => {
    if (next) setPageUrl(new URL(next).pathname + new URL(next).search);
  };

  const handlePrevious = () => {
    if (previous) setPageUrl(new URL(previous).pathname + new URL(previous).search);
  };

  return (
    <>
      <div className="p-6">

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <>
            {products.map((p) => (

              <div key={p.id} className="flex flex-col sm:flex-row items-start gap-4 border border-gray-300 rounded p-4 mb-6 shadow-sm">

                  <div className="flex-shrink-0">
                    <img
                      className="w-25 h-30 object-cover rounded"
                      src={`http://localhost:8000${p.ProductImage || '/default.jpg'}`}
                      alt={p.ProductName || 'Product'}
                    />
                  </div>

                  <div>
                    <strong className="block text-lg text-gray-800">{p.ProductName}</strong>
                    <p className="text-sm text-gray-600">— Stock: {Number(p.TotalStock).toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Product Code: {p.ProductCode}</p>
                    <p className="text-sm text-gray-600">
                      Created Date: {new Date(p.CreatedDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      {p.variants?.map((v, index) => (
                        <div key={index} className="flex items-center">
                          {v.name}:
                          {v.options?.map((o, index) => (
                            <span key={index}> {o.value}, </span>
                          ))}
                        </div>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 mt-2">HSN Code: {p.HSNCode}</p>
                  </div>
                {/* </Link> */}
                <div className='flex flex-col sm:flex-col items-start gap-2 mt-4 sm:mt-0'>

                <Link
                  to={`/products/${p.id}/stock`}
                  state={[{ product: p.ProductName }, { productCode: p.ProductCode }, { productId: p.id }]}
                  className="bg-blue-400 text-white px-4 py-2 w-40 text-center rounded hover:bg-gray-100 hover:text-black transition"
                >
                  Manage Stock
                </Link>
                <Link
                  to={`/stock-report/${p.id}`}
                  state={{ productId: p.id, productName: p.ProductName , productCode: p.ProductCode }}
                  className="bg-blue-400 text-white px-4 py-2 w-40 text-center rounded hover:bg-gray-100 hover:text-black transition"
                >
                  View Stock Report
                </Link>
                </div>
              </div>

            ))}

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevious}
                disabled={!previous}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-200"
                aria-label="Previous Page"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!next}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-200"

                aria-label="Next Page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ProductList;
