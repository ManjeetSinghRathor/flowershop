"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/utils/supabase";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";


// Dummy products (replace this with API call)
const allProducts = [
    {
        id: "1",
        productCode: "F002",
        name: "Spring Tulip Bouquet",
        type: "Flower Bouquet",
        price: 699,
        images: ["https://example.com/images/tulip_bouquet_1.jpg"],
    },
    {
        id: "2",
        productCode: "R001",
        name: "Romantic Roses",
        type: "Flower Bouquet",
        price: 999,
        images: ["https://example.com/images/rose_bouquet.jpg"],
    },
];

const AddCollection = () => {
    const [collection, setCollection] = useState({
        collectionCode: "",
        name: "",
        image: "",
        products: [],
    });

    const fileInputRef = useRef();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [imageUploading, setImageUploading] = useState(false);
    const [imageRemoving, setImageRemoving] = useState(false);


    // 🔍 Search functionality
    useEffect(() => {
        const fetchProducts = async () => {
            if (searchQuery.trim() === "") {
                setSearchResults([]);
                return;
            }

            try {
                setLoading(true);
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search/add-to-collection?search=${encodeURIComponent(searchQuery)}`
                );
                setSearchResults(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        // debounce: wait 400ms after typing before calling API
        const delayDebounce = setTimeout(fetchProducts, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // ➕ Add product to collection
    const handleAddProduct = (product) => {
        if (!collection.products.find((p) => p._id === product._id)) {
            setCollection({
                ...collection,
                products: [...collection.products, product],
            });

            setSearchQuery("");
        }
    };

    // ❌ Remove product from collection
    const handleRemoveProduct = (productId) => {
        setCollection({
            ...collection,
            products: collection.products.filter((p) => p._id !== productId),
        });
    };

    // Upload Single Image to Supabase
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const tempId = Date.now() + "_" + file.name;

        // Preview immediately
        const newImage = {
            tempId,
            preview: URL.createObjectURL(file),
            imgUrl: null,
        };

        setCollection((prev) => ({
            ...prev,
            image: newImage,
        }));

        try {
            setImageUploading(true);

            const fileName = `collections/${tempId}`;
            const { error } = await supabase.storage
                .from("collections")
                .upload(fileName, file, {
                    cacheControl: "public, max-age=31536000",
                    upsert: true,
                });

            if (error) throw error;

            const { data: publicData } = supabase.storage
                .from("collections")
                .getPublicUrl(fileName);

            setCollection((prev) => ({
                ...prev,
                image: { ...newImage, imgUrl: publicData.publicUrl },
            }));
        } catch (err) {
            console.error("Supabase upload error:", err.message);
        } finally {
            setImageUploading(false);
        }

    };

    // Open file picker
    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    // Remove Image (and delete from Supabase if uploaded)
    const removeImage = async () => {
        try {
            setImageRemoving(true);

            if (collection.image?.imgUrl) {
                const urlParts = collection.image.imgUrl.split("/object/public/");
                if (urlParts.length < 2) throw new Error("Invalid Supabase URL");

                let filePath = decodeURIComponent(urlParts[1]);
                if (filePath.startsWith("collections/")) {
                    filePath = filePath.replace(/^collections\//, "");
                }

                const { error } = await supabase.storage
                    .from("collections")
                    .remove([filePath]);

                if (error) throw error;
            }

            setCollection((prev) => ({
                ...prev,
                image: "",
            }));
        } catch (err) {
            console.error("Supabase delete error:", err.message || err);
        } finally {
            setImageRemoving(false);
        }
    };


    // 📤 Submit collection
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 🧹 Clean image: keep only the Supabase URL
            const payload = {
                collectionCode: collection.collectionCode,
                name: collection.name,
                image: collection.image?.imgUrl || "", // backend expects a string
                products: collection.products.map((p) => p._id), // only send product IDs
            };

            // Send POST request to backend
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/add`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (!res.data.success) {
                throw new Error("Failed to create collection");
            }

            console.log("✅ Collection saved:", res.data);

            toast.success(res.data.message);

            // Reset form
            setCollection({
                collectionCode: "",
                name: "",
                image: "",
                products: [],
            });

        } catch (err) {
            console.error("❌ Error submitting collection:", err);
            alert("Error creating collection");
        }
    };


    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-center w-full px-2 pb-4 gap-1">
                <h1 className="text-2xl font-bold text-center">
                    Add New Collection
                </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">

                {/* Collection Image */}
                <div className="flex w-full items-center justify-center">
                    <div className="flex items-center gap-4">
                        {collection.image ? (
                            <div className="relative">
                                <img
                                    src={collection.image.preview}
                                    alt="preview"
                                    className="w-32 h-32 object-cover object-center rounded-full border border-gray-300"
                                />
                                {/* Uploading Overlay */}
                                {(imageUploading || imageRemoving) && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                {/* Remove Button */}
                                {!imageUploading && !imageRemoving && (
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-[-4] right-[-4] text-red-500 font-bold rounded-full p-[2px] bg-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 640 640">
                                            <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={openFilePicker}
                                className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full cursor-pointer hover:bg-gray-200"
                            >
                                <span className="text-3xl font-bold text-gray-400">+</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                        )}
                    </div>
                </div>


                {/* Collection Code */}
                <input
                    type="text"
                    placeholder="Collection Code (e.g. BLMHVN0001)"
                    value={collection.collectionCode}
                    onChange={(e) =>
                        setCollection({ ...collection, collectionCode: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                    required
                />

                {/* Collection Name */}
                <input
                    type="text"
                    placeholder="Collection Name (e.g. Birthday Flowers)"
                    value={collection.name}
                    onChange={(e) =>
                        setCollection({ ...collection, name: e.target.value })
                    }
                    className="border p-2 w-full rounded"
                    required
                />

                {/* Product Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border p-2 w-full rounded"
                    />

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full border rounded mt-1 bg-white shadow-lg max-h-48 overflow-y-auto z-10">
                            {loading && <p className="text-gray-500 text-sm px-1 py-2">Searching...</p>}
                            {!loading && searchResults.map((p) => (
                                <div
                                    key={p.productCode}
                                    className="flex justify-between items-center p-2 border-b"
                                >
                                    <div className="flex gap-2 items-center">
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-sm text-gray-500">
                                            ({p.productCode})
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAddProduct(p)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Products */}
                {collection.products.length > 0 && (
                    <div className="mt-4">
                        <h2 className="font-semibold mb-2">Selected Products</h2>
                        <ul className="flex flex-wrap gap-4 ">
                            {collection.products.map((p) => (
                                <li
                                    key={p.productCode}
                                    className="flex w-fit gap-4 items-center border p-2 rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-sm text-gray-500">
                                            ({p.productCode})
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(p.id)}
                                        className="text-red-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-5 h-5 sm:w-6 sm:h-6' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={imageUploading || imageRemoving}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-fit"
                >
                    Save Collection
                </button>
            </form>
        </div>
    );
};

export default AddCollection;
