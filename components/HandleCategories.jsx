"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

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

function EditableNameCell({ value: initialValue, onNameSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue && value !== "") {
      onNameSave(value); // call parent function to update
    } else {
      setValue(initialValue);
    }
  };

  return (
    <div className="underline" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          className="font-serif text-lg sm:text-xl rounded p-1 w-24"
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
        <h2 className='font-serif text-lg sm:text-xl rounded p-1'>
          {value}
        </h2>
      )}
    </div>
  );
}


const HandleCategories = () => {
  const [categoryLoaded, setCategoryLoaded] = useState({});
  const [loaded, setLoaded] = useState(true);

  const [updatedCollectionList, setUpdatedCollection] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/category`
      );
      if (!res.data.success) throw new Error("Failed to fetch categories");

      const categories = res.data.data;
      const collectionListTemp = {};

      categories.forEach((cat) => {
        const categoryName = cat.name;

        if (!collectionListTemp[categoryName]) {
          collectionListTemp[categoryName] = {
            collections: [],
            _id: "",
            serialNo: "",
            isActive: cat.isActive ?? false, // optional
          };
        }

        // push collections
        cat?.collections.forEach((col) => {
          collectionListTemp[categoryName].collections.push({
            collectionId: col._id,
            id: col.collectionCode,
            collection: col.name,
            image: col.image,
            isActive: col.isActive
          });
        });

        // assign category details
        collectionListTemp[categoryName]._id = cat._id;
        collectionListTemp[categoryName].serialNo = cat.serialNo;
        collectionListTemp[categoryName].isActive = cat.isActive ?? true;
      });

      console.log(collectionListTemp);
      setUpdatedCollection(collectionListTemp);

    } catch (err) {
      console.error("Error fetching categories:", err);
      return {};
    } finally {
      setLoaded(false);
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  const updateSerialNo = async (id, newSerialNo) => {
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collections/category/${id}/stock`,
        { serialNo: newSerialNo }
      );
      if (res.data.success) {
        toast.success("SerialNO. updated");
        setUpdatedCollection((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, serialNo: newSerialNo } : p
          )
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update serial no.");
    }
  };

  if (loaded) {
    return (
      <div className="flex flex-col justify-center gap-4 pt-2 px-2 sm:px-8 lg:px-24">
        <div className="grid grid-cols-2 items-center pt-2 pb-4 sm:mb-7 px-2">
          <h1 className="text-xl sm:text-2xl font-bold">Handle Categories</h1>
          <div className="flex w-full justify-end">
            <Link
              href="/add_category"
              className="flex w-fit bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add New Category
            </Link>
          </div>
        </div>

        {/* Skeleton slides */}
        {[...Array(2)].map((_, idx) => (
          <div
            key={idx}
            className="w-full h-[120px] bg-gray-300 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-24 py-4 sm:p-6 bg-gray-100">
      <div className="grid grid-cols-2 items-center mb-4 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-bold">Handle Categories</h1>
        <div className="flex w-full justify-end">
          <Link
            href="/add_category"
            className="flex w-fit bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add New Category
          </Link>
        </div>
      </div>

      <div className="w-full mx-auto py-4">
        {Object.entries(updatedCollectionList).map(([categoryName, categoryObj]) => (
          <div key={categoryObj._id} className="mb-2 border rounded-lg overflow-hidden">

            {/* Category header */}
            <div className="w-full flex justify-between items-center py-2 px-2 bg-gray-100 hover:bg-gray-200">
              <div className='flex items-center gap-2'>
                <EditableCell
                  value={categoryObj.serialNo}
                  onSave={(newValue) => updateSerialNo(categoryObj._id, newValue)}
                />
                <EditableNameCell
                  value={categoryName}
                  onNameSave={(newValue) => updateSerialNo(categoryObj._id, newValue)}
                />
              </div>
                
              <div className='flex items-center gap-3'>
                
                <input
                  type="checkbox"
                  checked={categoryObj.isActive}
                  className="flex w-5 h-5"
                  onChange={() =>
                    toggleActive(categoryObj._id, categoryObj.isActive)
                  }
                />
                <button
                  onClick={() => {
                    console.log("Click!")
                  }}
                  className="p-1 text-black rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-5 h-5 text-red-600' viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>                </button>
              </div>
            </div>

            {/* Collections */}
            <div className='flex gap-4 w-full overflow-hidden bg-white'>
              <div className="flex w-full gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth p-3">

                {categoryObj.collections.map((item) => (
                  <div key={item.id} className="flex flex-col items-center text-center cursor-pointer relative">
                    <div className="w-20 h-20 relative">
                      {!categoryLoaded[item.id] && (
                        <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
                      )}
                      <img
                        src={item.image}
                        alt={item.collection}
                        className={`w-20 h-20 rounded-full border object-cover ${categoryLoaded[item.id] ? "block" : "hidden"}`}
                        onLoad={() => setCategoryLoaded(prev => ({ ...prev, [item.id]: true }))}
                        onError={() => setCategoryLoaded(prev => ({ ...prev, [item.id]: true }))}
                      />
                    </div>
                    <span className="mt-1 text-sm text-gray-700">
                      {item.collection.split(" ").map((text, idx) => (
                        <React.Fragment key={idx}>{text}<br /></React.Fragment>
                      ))}
                    </span>

                    <div className='flex w-23 items-center justify-end absolute top-[-8] z-[5]'> <button className='flex items-center justify-center p-[2px] rounded-full border-[1px] border-red-200 text-center'> <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 text-red-600' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg> </button> </div>
                  </div>
                ))}

                {/* Add new collection */}
                <div className="flex text-center cursor-pointer relative px-3">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full border-[1px] border-gray-400 text-4xl text-gray-700">
                    +
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}

export default HandleCategories