"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";


const HandleCollections = () => {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [query, setQuery] = useState("");

  const fetchSearch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/search?search=${encodeURIComponent(query)}`
        );
        
        setCollections(res.data);
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
  };


  // Fetch all collections
  const fetchCollections = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/collections-details`
      );
      if (!res.data.success) throw new Error("Failed to fetch collections");
      setCollections(res.data.data); // array of collections
    } catch (err) {
      console.error("Error fetching collections:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (query.trim()) {
      fetchSearch();
    } else {
      fetchCollections();
    }
  }, [query])

  const deleteCollection = async (id) => {
  if (!window.confirm("Are you sure you want to delete this collection?")) return;

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/${id}`,
      { withCredentials: true } // ✅ ensures auth cookies/JWT are sent
    );

    if (res.data.success) {
      toast.success("Collection deleted successfully");
      fetchCollections(); // 🔄 refresh list if you pass function
    } else {
      toast.error(res.data.message || "Failed to delete collection");
    }
  } catch (err) {
    console.error("Delete collection error:", err);
    toast.error("Error deleting collection");
  }
};

  // Toggle isActive
  const toggleActive = async (id, current) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/${id}/toggleActive`,
        {},
        {  withCredentials: true }
      );
      if (res.data.success) {
        setCollections((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isActive: !current } : p))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };


  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-24 py-4 bg-gray-100">
      {/* Page Header */}
      <div className="grid grid-cols-2 items-center mb-4 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-bold">Handle Collections</h1>
        <div className="flex w-full justify-end">
          <Link
            href="/add_collection"
            className="flex w-fit bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add New Collection
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
            placeholder="Search collection by name, code..."
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

      {
        loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 py-4">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
              className="w-24 h-24 bg-gray-300 animate-pulse rounded-full mx-auto"
            />
            <div
              className="w-full max-w-22 h-6 bg-gray-300 animate-pulse rounded-full mx-auto"
            />
            </div>
          ))}
        </div>
        ) :
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 py-2">
        {collections.map((item) => (
          <div
            key={item._id}
            className="flex flex-col items-center text-center cursor-pointer relative"
          >

            {/* Actions (checkbox + delete) */}
            <div className="flex w-full items-center justify-between mt-2">
              <input
                type="checkbox"
                checked={item.isActive}
                className="w-5 h-5"
                onChange={() =>
                        toggleActive(item._id, item.isActive)
                      }
              />
              <button
                onClick={() => deleteCollection(item._id)}
                className="flex items-center justify-center p-1 rounded-full border-[1px] border-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 text-red-600' viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" /></svg>
              </button>
            </div>

            {/* Collection Image */}
            <Link href={`/handle_collections/edit_collection?id=${item._id}`} className="w-24 h-24 relative">

              <img
                src={item.image || null}
                alt={item.name}
                className={`w-24 h-24 rounded-full border object-cover`}
              />

              {/* Hover overlay */}
              <div className="flex items-center justify-center absolute inset-0 z-[5] bg-[rgba(0,0,0,0.1)] rounded-full opacity-0 hover:opacity-100 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-7 h-7 text-white"
                  viewBox="0 0 640 640"
                >
                  <path d="M437.5 91.1C452.5 73.9 474.2 64 497.1 64C540.7 64 576.1 99.4 576.1 143C576.1 165.8 566.2 187.6 549 202.6L347.7 377.8L337 367L273 303L262.2 292.3L437.5 91.1zM225.1 323C226 324 252 350 303 401L316.9 414.9L299.8 489.1C295.9 506.2 282.9 519.8 266 524.5L96.2 572L188.5 479.7C189.7 479.8 190.8 479.9 192 479.9C209.7 479.9 224 465.6 224 447.9C224 430.2 209.7 415.9 192 415.9C174.3 415.9 160 430.2 160 447.9C160 449.1 160.1 450.3 160.2 451.4L67.9 543.8L115.5 374C120.2 357.1 133.8 344.1 150.9 340.2L225.1 323z" />
                </svg>
              </div>

              <div className='flex items-center justify-center absolute inset-0 z-[5] bg-[rgba(0,0,0,0.1)] rounded-full'> <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-7 h-7 text-white' viewBox="0 0 640 640"><path d="M437.5 91.1C452.5 73.9 474.2 64 497.1 64C540.7 64 576.1 99.4 576.1 143C576.1 165.8 566.2 187.6 549 202.6L347.7 377.8L337 367L273 303L262.2 292.3L437.5 91.1zM225.1 323C226 324 252 350 303 401L316.9 414.9L299.8 489.1C295.9 506.2 282.9 519.8 266 524.5L96.2 572L188.5 479.7C189.7 479.8 190.8 479.9 192 479.9C209.7 479.9 224 465.6 224 447.9C224 430.2 209.7 415.9 192 415.9C174.3 415.9 160 430.2 160 447.9C160 449.1 160.1 450.3 160.2 451.4L67.9 543.8L115.5 374C120.2 357.1 133.8 344.1 150.9 340.2L225.1 323z" /></svg> </div>

            </Link>

            {/* Collection Name */}
            <span className="mt-2 text-sm text-gray-700 font-medium">
              {item.name}
            </span>

            {/* Collection Name */}
            <span className="text-sm text-gray-700 font-medium">
              ({item.collectionCode})
            </span>

          </div>
        ))}

      </div>}      
    </div>
  );
};

export default HandleCollections;
