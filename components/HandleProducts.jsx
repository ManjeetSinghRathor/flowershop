"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

function EditableCell({ value: initialValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue && value !== "") {
      onSave(value); // call parent function to update
    } else {
      setValue(initialValue);
    }
  };

  return (
    <td className="p-2" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="number"
          className="rounded p-1 w-14"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.target.blur(); // save on enter
            if (e.key === "Escape") {
              setValue(initialValue);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        value
      )}
    </td>
  );
}

const HandleProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Load products from API
  const fetchProducts = useCallback(async () => {
    if (!hasMore || loading) return; // prevent double calls

    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/all/list?page=${page}&limit=20`
      );

      if (res.data.success) {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const filtered = res.data.products.filter(
            (p) => !existingIds.has(p._id)
          );
          return [...prev, ...filtered];
        });

        setHasMore(res.data.hasMore);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]); // ✅ include loading too

  // Infinite scroll observer
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchProducts] // ✅ include loading here too
  );


  const fetchSearch = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/products/search/query?q=${encodeURIComponent(query)}`
      );

      if (res.data.success) {
        setProducts(res.data.results);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query === "") {
      // reset state
      setProducts([]);
      setPage(1);
      setHasMore(true);

      // ✅ force fresh fetch for page=1
      (async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/all/list?page=1&limit=20`
          );
          if (res.data.success) {
            setProducts(res.data.products);
            setHasMore(res.data.hasMore);
            setPage(2); // ✅ next page will be 2
          }
        } catch (err) {
          console.error(err);
          toast.error("Failed to load products");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      fetchSearch();
    }
  }, [query]);


  // Toggle isActive
  const toggleActive = async (id, current) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}/toggleActive`
      );
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isActive: !current } : p))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}/stock`,
        { stock: newStock }
      );
      if (res.data.success) {
        toast.success("Stock updated");
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, stock: newStock } : p
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stock");
    }
  };


  // Delete product
  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Product deleted successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-24 py-4 sm:p-6 bg-gray-100">
      <div className="grid grid-cols-2 items-center mb-4 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-bold">Handle Products</h1>
        <div className="flex w-full justify-end">
          <Link
            href="/add_product"
            className="flex w-fit bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex w-full pb-4">
        <div className="flex w-full max-w-[350px] px-2 gap-1 items-center border-[1px] border-gray-400 rounded-full">
          <label htmlFor="searchBox">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 sm:w-7 sm:h-7 text-black"
              fill="currentColor"
              viewBox="0 0 640 640"
            >
              <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
            </svg>
          </label>
          <input
            id="searchBox"
            type="text"
            placeholder="Search products by name, code, tags, flowers..."
            className="p-2 w-full outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.trim() && (
            <p className="flex w-fit text-black p-1 rounded-full bg-gray-200">
              <button onClick={() => setQuery("")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-4 h-4"
                  viewBox="0 0 640 640"
                >
                  <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                </svg>
              </button>
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Active</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, index) => (
                <tr
                  key={product._id}
                  className="border-b"
                  ref={index === products?.length - 1 ? lastProductRef : null}
                >
                  <td className="p-2">{product.productCode}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      className="flex w-5 h-5"
                      onChange={() =>
                        toggleActive(product._id, product.isActive)
                      }
                    />
                  </td>
                  <EditableCell value={product.stock} onSave={(newValue) => updateStock(product._id, newValue)} />

                  <td className="p-2 flex gap-2">
                    <Link
                      href={`/handle_products/edit_product?id=${product._id}`}
                      className="px-2 py-1 bg-yellow-400 rounded text-white"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="px-2 py-1 bg-red-500 rounded text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products?.length === 0 && <p className="mt-4">No products found.</p>}
        </div>
      )}
    </div>
  );
};

export default HandleProducts;
