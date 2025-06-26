import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="bg-gray-200 text-black p-4 flex flex-col sm:flex-row items-center sm:justify-between px-4  w-full z-10 shadow-md">
      <div className="text-lg font-bold mb-2 sm:mb-0 w-full sm:w-auto text-center sm:text-left">
        Product Inventory
      </div>
      <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
        <Link
          to="/"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Product List
        </Link>

        <Link
          to="/products/new"
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Add Product
        </Link>
      </div>
    </div>
  );
}

export default Navbar;