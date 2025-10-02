"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddCategory = () => {
  const [category, setCategory] = useState({
    name: "",
    serialNo: "",
    collections: [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCol, setSelectedCol] = useState([]);

  // 🔍 Search collections from backend
  useEffect(() => {
    const fetchCollections = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/search?search=${encodeURIComponent(searchQuery)}`
        );
        
        setSearchResults(res.data);
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchCollections, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // ➕ Add collection to category
  const handleAddCollection = (col) => {
    if (!category.collections.find((c) => c.collectionId === col._id)) {
      setCategory({
        ...category,
        collections: [
          ...category.collections,
            col._id,
        ],
      });

      setSelectedCol([
        ...selectedCol,
          {
            _id: col._id,
            name: col.name,
            collectionCode: col.collectionCode,
            collectionImg: col.image
          },
        ]);

      // console.log(category);
      setSearchQuery("");
    }
  };

  // ❌ Remove collection from category
  const handleRemoveCollection = (collectionId) => {
    setCategory({
     ...category,
     collections: category.collections.filter((c) => c !== collectionId)
    });
    setSelectedCol(selectedCol.filter((c) => c._id !== collectionId))
  };

  // 📤 Submit category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const payload = {
        name: category.name,
        collections: category.collections,
        serialNo: category.serialNo ? Number(category.serialNo) : null,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/category/add`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (!res.data.success) throw new Error("Failed to create category");

      toast.success(res.data.message);

      // Reset form
      setCategory({ name: "", serialNo: "", collections: [] });
      setSearchQuery("");
      setSearchResults([]);
      setSelectedCol([]);
    } catch (err) {
      console.error("Error submitting category:", err);
      toast.error("Failed to create category");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">Add New Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Category Name */}
        <input
          type="text"
          placeholder="Category Name (e.g. Flowers)"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        {/* Serial No */}
        <input
          type="number"
          placeholder="Serial Number"
          value={category.serialNo}
          onChange={(e) => setCategory({ ...category, serialNo: e.target.value })}
          className="border p-2 w-full rounded"
        />

        {/* Collection Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full rounded"
          />

          {searchResults.length > 0 ? (
            <div className="absolute top-full left-0 w-full border rounded mt-1 bg-white shadow-lg max-h-48 overflow-y-auto z-10">
              {loading && <p className="text-gray-500 text-sm px-1 py-2">Searching...</p>}
              {!loading &&
                searchResults.map((col) => (
                  <div
                    key={col._id}
                    className="flex justify-between items-center p-2 border-b hover:bg-gray-100"
                  >
                    <div className="flex gap-2 items-center">
                      <p className="font-medium">{col.name}</p>
                      <p className="text-sm text-gray-500">({col.collectionCode})</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddCollection(col)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          ) : (searchQuery === "" || loading) ?
            <div></div> : <div className="flex text-sm text-gray-600">No Match Found</div>
          }
        </div>

        {/* Selected Collections */}
        {selectedCol.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Selected Collections</h2>
            <ul className="flex flex-wrap gap-4">
              {selectedCol.map((c) => (
                <li
                  key={c._id}
                  className="flex w-fit gap-4 items-center border p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-gray-500">({c.collectionCode})</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCollection(c._id)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit"
        >
          Save Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
