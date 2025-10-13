"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const AddCollectionModal = ({ isAddColOpen, setIsAddColOpen, catId, onCollectionAdded }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

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

    // ➕ Add Collection to Category
    const handleAddCollection = async (collectionId) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/categories/${catId}/add-collection`,
                { collectionId },
                { withCredentials: true }
            );

            if (res.status === 200) {
                if (onCollectionAdded) onCollectionAdded(res.data); // callback for parent
                setIsAddColOpen(false); // close modal
            }
        } catch (err) {
            console.error("Error adding collection:", err.response?.data || err.message);
        }
    };

        useEffect(() => {
        if (isAddColOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isAddColOpen]);

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] w-full flex items-start justify-center p-4 z-[50]">
            <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg">
                <div className="flex w-full justify-between items-center py-2 mb-2">
                    <h2 className="text-xl font-semibold">Add Collection</h2>
                    <button className='flex items-center justify-center text-center' onClick={() => setIsAddColOpen(false)}>
                         <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-6 h-6 text-red-600' viewBox="0 0 640 640">
                         <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                         </svg>
                       </button>
                </div>

                <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                {searchResults.length > 0 ? (
                    <div className="border rounded mt-2 bg-white shadow-lg max-h-48 overflow-y-auto">
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
                                        onClick={() => handleAddCollection(col._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                    </div>
                ) : (searchQuery === "" || loading) ? (
                    <div></div>
                ) : (
                    <div className="flex text-sm text-gray-600 mt-2">No Match Found</div>
                )}
            </div>
        </div>
    );
};

export default AddCollectionModal;