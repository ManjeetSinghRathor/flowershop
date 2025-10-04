"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";


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
    <div className="p-2" onDoubleClick={handleDoubleClick}>
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
    </div>
  );
}


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

  // Delete slide
  const deleteSlide = async (id) => {
    if (!confirm("Are you sure you want to delete this poster?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slider/${id}`, { withCredentials: true });
      setSlides((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Toggle active
  const toggleSlide = async (id) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slider/${id}/toggle`, {}, { withCredentials: true });
      setSlides((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: res.data.data.isActive } : s))
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const updateSerialNo = async (id, newValue) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slider/${id}/serial`,
        { serialNo: newValue },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("SerialNo updated");
        setSlides((prev) =>
        prev.map((s) => (s._id === id ? { ...s, serialNo: res.data.data.serialNo } : s))
      );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update serial no.");
    }
  }


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
            <div className="flex w-full items-center justify-between gap-2 mt-2">

              <EditableCell value={item.serialNo} onSave={(newValue) => updateSerialNo(item._id, newValue)} />

              <input
                type="checkbox"
                checked={item.isActive}
                className="w-5 h-5"
                onChange={() => toggleSlide(item._id)}
              />

              <button
                onClick={() => deleteSlide(item._id)}
                className="flex items-center justify-center p-1 rounded-full border-[1px] border-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 text-red-600' viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" /></svg>
              </button>

            </div>

            {/* Collection Image */}
            <div className="w-full flex justify-center relative bg-white">

              <img
                src={item.image}
                alt={`Offer ${item.serialNo}`}
                className={`w-full h-full aspect-[9/4] max-h-[240px] object-cover object-top sm:object-contain cursor-pointer p-1`}
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
