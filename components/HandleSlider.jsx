"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const HandleSlider = () => {
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);


  // Fetch all collections
  const fetchSlides = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slider/`
      );
      if (!res.data.success) throw new Error("Failed to fetch slides");
    console.log(res.data.data);
    
      setSlides(res.data.data); // array of collections
    } catch (err) {
      console.error("Error fetching slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center gap-4 pt-2 px-2 sm:px-8 lg:px-24">
        <div className="grid grid-cols-2 items-center pt-2 pb-4 sm:mb-7 px-2">
          <h1 className="text-xl sm:text-2xl font-bold">Handle Slider</h1>
          <div className="flex w-full justify-end">
            <Link
              href="/add_slide"
              className="flex w-fit bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add New Slide
            </Link>
          </div>
        </div>
        {[...Array(2)].map((_, idx) => (
          <div
            key={idx}
            className="w-full h-[120px] bg-gray-300 animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-24 py-4 bg-gray-100">
      {/* Page Header */}
      <div className="grid grid-cols-2 items-center mb-4 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-bold">Handle Slider</h1>
        <div className="flex w-full justify-end">
          <Link
            href="/add_slide"
            className="flex w-fit bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add New Slide
          </Link>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="flex flex-col gap-6 md:gap-8 py-2">

        {slides.map((item) => (
          <div
            key={item._id}
            className="flex flex-col w-full items-center text-center cursor-pointer relative"
          >

            {/* Actions (checkbox + delete) */}
            <div className="flex w-full items-center justify-end gap-2 mt-2">
              <input
                type="checkbox"
                checked={item.isActive}
                className="w-5 h-5"
                onChange={() =>
                  console.log("Toggle Active:", item._id, item.isActive)
                }
              />

              <button
                onClick={() => console.log("Delete:", item._id)}
                className="flex items-center justify-center p-1 rounded-full border-[1px] border-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 text-red-600' viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" /></svg>
              </button>
              
              <button
                onClick={() => console.log("Delete:", item._id)}
                className="flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-6 h-6 text-black' viewBox="0 0 640 640"><path d="M437.5 91.1C452.5 73.9 474.2 64 497.1 64C540.7 64 576.1 99.4 576.1 143C576.1 165.8 566.2 187.6 549 202.6L347.7 377.8L337 367L273 303L262.2 292.3L437.5 91.1zM225.1 323C226 324 252 350 303 401L316.9 414.9L299.8 489.1C295.9 506.2 282.9 519.8 266 524.5L96.2 572L188.5 479.7C189.7 479.8 190.8 479.9 192 479.9C209.7 479.9 224 465.6 224 447.9C224 430.2 209.7 415.9 192 415.9C174.3 415.9 160 430.2 160 447.9C160 449.1 160.1 450.3 160.2 451.4L67.9 543.8L115.5 374C120.2 357.1 133.8 344.1 150.9 340.2L225.1 323z" /></svg>
              </button>
            </div>

            {/* Collection Image */}
            <div className="w-full flex justify-center relative">

              <img
                src={item.image}
                alt={`Offer ${item.serialNo}`}
                className={`w-full h-full aspect-[7/3] max-h-[240px] max-w-4xl object-cover rounded-xl cursor-pointer p-1`}
              />

            </div>

            <span className="mt-2 text-sm text-gray-700 font-medium w-[200px] break-words">
              {item.link}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
};

export default HandleSlider;
