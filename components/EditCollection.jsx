"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/app/utils/supabase";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const EditCollection = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // <-- get collectionId from URL
    const fileInputRef = useRef();

    const [collection, setCollection] = useState({
        collectionCode: "",
        name: "",
        image: "",
        products: [],
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [queryLoaded, setQueryLoaded] = useState(false);

    // 🔹 Fetch existing collection when component loads
    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/${id}/collection-details`,
                    { withCredentials: true }
                );

                if (!res.data.success) throw new Error("Collection not found");
                
                // prefill state with existing collection
                setCollection({
                    collectionCode: res.data.collection.collectionCode,
                    name: res.data.collection.name,
                    image: res.data.collection.image
                        ? { preview: res.data.collection.image, imgUrl: res.data.collection.image }
                        : "",
                    products: res.data.collection.products || [],
                });
            } catch (err) {
                console.error("Error loading collection:", err);
                toast.error("Failed to load collection");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCollection();
    }, [id]);

    // 🔍 Search functionality (same as AddCollection)
    useEffect(() => {
        const fetchProducts = async () => {
            if (searchQuery.trim() === "") {
                setSearchResults([]);
                return;
            }

            setQueryLoaded(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search/add-to-collection?search=${encodeURIComponent(searchQuery)}`
                );
                setSearchResults(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setQueryLoaded(false);
            }
        };

        const delayDebounce = setTimeout(fetchProducts, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleAddProduct = (product) => {
        if (!collection.products.find((p) => p._id === product._id)) {
            setCollection({
                ...collection,
                products: [...collection.products, product],
            });
            setSearchQuery("");
        }
    };

    const handleRemoveProduct = (productId) => {
        setCollection({
            ...collection,
            products: collection.products.filter((p) => p._id !== productId),
        });
    };

    // Upload image (same logic as AddCollection)
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const tempId = Date.now() + "_" + file.name;
        const newImage = {
            tempId,
            preview: URL.createObjectURL(file),
            imgUrl: null,
        };

        setCollection((prev) => ({ ...prev, image: newImage }));

        console.log(newImage);

        const fileName = `collections/${tempId}`;
        const { error } = await supabase.storage.from("collections").upload(fileName, file);

        if (error) {
            console.error("Supabase upload error:", error.message);
            return;
        }

        const { data: publicData } = supabase.storage.from("collections").getPublicUrl(fileName);

        setCollection((prev) => ({
            ...prev,
            image: { ...newImage, imgUrl: publicData.publicUrl },
        }));
    };

    const openFilePicker = () => fileInputRef.current.click();

    const removeImage = async () => {
        if (collection.image?.imgUrl) {
            try {
                const urlParts = collection.image.imgUrl.split("/object/public/");
                if (urlParts.length < 2) throw new Error("Invalid Supabase URL");
                let filePath = decodeURIComponent(urlParts[1]);
                if (filePath.startsWith("collections/")) {
                    filePath = filePath.replace(/^collections\//, "");
                }
                await supabase.storage.from("collections").remove([filePath]);
                
            } catch (err) {
                console.error("Supabase delete error:", err.message || err);
            }
        }
        setCollection((prev) => ({ ...prev, image: "" }));
    };

    // 📤 Submit updated collection
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                collectionCode: collection.collectionCode,
                name: collection.name,
                image: collection.image?.imgUrl || "",
                products: collection.products.map((p) => p._id),
            };

            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/${id}`,
                payload,
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            if (!res.data.success) throw new Error("Failed to update collection");

            toast.success(res.data.message || "Collection updated!");
        } catch (err) {
            console.error("Error updating collection:", err);
            toast.error("Update failed");
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <div className="flex justify-center w-full px-2 pb-4 gap-1">
                    <h1 className="text-2xl font-bold text-center">Edit Collection</h1>
                </div>
                <div className="flex flex-col items-center gap-4 w-full items-center">
                    <div
                        className="w-28 h-28 bg-gray-300 animate-pulse rounded-full mx-auto"
                    />
                    <div
                        className="w-full h-9 bg-gray-300 animate-pulse rounded-lg mx-auto"
                    />
                    <div
                        className="w-full h-9 bg-gray-300 animate-pulse rounded-lg mx-auto"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-center w-full px-2 pb-4 gap-1">
                <h1 className="text-2xl font-bold text-center">Edit Collection</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                {/* Image */}
                <div className="flex w-full items-center justify-center">
                    <div className="flex items-center gap-4">
                        {(collection.image && collection.image !== "") ? (
                            <div className="relative">
                                <img
                                    src={collection.image.preview || collection.image.imgUrl}
                                    alt="preview"
                                    className="w-32 h-32 object-cover object-center rounded-full border border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-[-4] right-[-4] text-red-500 font-bold rounded-full p-[2px] bg-white"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
                                </button>
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

                {/* Fields */}
                <input
                    type="text"
                    placeholder="Collection Code"
                    value={collection?.collectionCode}
                    onChange={(e) => setCollection({ ...collection, collectionCode: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Collection Name"
                    value={collection?.name}
                    onChange={(e) => setCollection({ ...collection, name: e.target.value })}
                    className="border p-2 w-full rounded"
                    required
                />

                {/* Product search and selected products (same as AddCollection) */}
                {/* ... reuse your search and selected products UI here ... */}
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
                    {searchResults?.length > 0 && (
                        <div className="absolute top-full left-0 w-full border rounded mt-1 bg-white shadow-lg max-h-48 overflow-y-auto z-10">
                            {queryLoaded && <p className="text-gray-500 text-sm px-1 py-2">Searching...</p>}
                            {!queryLoaded && searchResults?.map((p) => (
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
                                        onClick={() => handleRemoveProduct(p._id)}
                                        className="text-red-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-5 h-5 sm:w-6 sm:h-6' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-fit">
                    Update Collection
                </button>
            </form>
        </div>
    );
};

export default EditCollection;
