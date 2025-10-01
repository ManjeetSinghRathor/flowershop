"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { supabase } from "@/app/utils/supabase";
import toast from "react-hot-toast";

const AddProduct = () => {
    // --- State: Product details ---
    const [product, setProduct] = useState({
        productCode: "",      // Unique product identifier
        name: "",             // Product name
        description: "",      // Product description
        currency: "INR",      // Default currency
        stock: 0,             // Available stock
        deliveryTime: [],     // Delivery time info
        flowers: [],          // Array of flower types
        packContains: [],     // Array of items in pack
        colors: [],           // Array of colors
        occasions: [],        // Array of occasions
        tags: [],             // Array of tags
        sizes: [],            // Array of size objects
        images: [],           // Array of image objects (preview, URL, default)
        videos: [],           // Array of video URLs
    });

    // --- Refs ---
    const fileInputRef = useRef(null);       // File input reference for triggering upload

    // --- State: Uploaded Image URLs (for cleanup if unsaved) ---
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

    // --- State: Current array input values for flowers, colors, etc. ---
    const [currentArrayInput, setCurrentArrayInput] = useState({
        flowers: "",
        packContains: "",
        colors: "",
        occasions: "",
        tags: "",
        deliveryTime: "",
    });

    // -------------------------
    // --- IMAGE HANDLERS ------
    // -------------------------

    // Handle file selection and upload to Supabase
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        for (let file of files) {
            // 1. Create temporary preview object
            const tempId = Date.now() + "_" + file.name;
            const newImage = {
                tempId,
                preview: URL.createObjectURL(file),
                isDefault: false,
                imgUrl: null,
            };

            // Add preview immediately to state
            setProduct((prev) => ({
                ...prev,
                images: [...prev.images, newImage],
            }));

            // 2. Upload file to Supabase storage
            const fileName = `products/${tempId}`;
            const { error } = await supabase.storage.from("products").upload(fileName, file);

            if (error) {
                console.error("Supabase upload error:", error);
                continue;
            }

            // 3. Get public URL
            const { data: publicData } = supabase.storage
                .from("products")
                .getPublicUrl(fileName);

            // 4. Update state with uploaded image URL
            setProduct((prev) => ({
                ...prev,
                images: prev.images.map((img) =>
                    img.tempId === tempId ? { ...img, imgUrl: publicData.publicUrl } : img
                ),
            }));

            // Track uploaded URLs for potential cleanup
            setUploadedImageUrls((prev) => [...prev, publicData.publicUrl]);
        }
    };

    // Cleanup unsaved images on page unload
    useEffect(() => {
        const handleBeforeUnload = async (e) => {
            if (uploadedImageUrls.length > 0) {
                e.preventDefault();
                e.returnValue =
                    "You have uploaded images that aren’t saved yet. If you leave, they will be deleted.";

                // Delete uploaded images from Supabase if not saved
                for (let url of uploadedImageUrls) {
                    try {
                        const urlParts = url.split("/object/public/");
                        if (urlParts.length < 2) throw new Error("Invalid Supabase URL");

                        let filePath = decodeURIComponent(urlParts[1]);
                        if (filePath.startsWith("products/")) {
                            filePath = filePath.replace(/^products\//, "");
                        }

                        await supabase.storage.from("products").remove([filePath]);

                    } catch (err) {
                        console.error("Cleanup error:", err);
                    }
                }

                // Reset local image state
                setProduct((prev) => ({
                    ...prev,
                    images: [],
                }));
                setUploadedImageUrls([]);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [uploadedImageUrls]);

    // Trigger file picker
    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    // Set selected image as main/default
    const handleMainImage = (index) => {
        setProduct((prev) => ({
            ...prev,
            images: prev.images.map((img, i) => ({
                ...img,
                isDefault: i === index,
            })),
        }));
    };

    // Remove image from state & Supabase
    const removeImage = async (index) => {
        const imgToRemove = product.images[index];

        if (imgToRemove?.imgUrl) {
            try {
                const urlParts = imgToRemove.imgUrl.split("/object/public/");
                if (urlParts.length < 2) throw new Error("Invalid Supabase URL");

                let filePath = decodeURIComponent(urlParts[1]);
                if (filePath.startsWith("products/")) {
                    filePath = filePath.replace(/^products\//, "");
                }

                const { error } = await supabase.storage.from("products").remove([filePath]);
                if (error) throw error;
                console.log("Deleted from Supabase:", filePath);
            } catch (err) {
                console.error("Supabase delete error:", err.message || err);
            }
        }

        setProduct((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // -------------------------
    // --- ARRAY HANDLERS -----
    // -------------------------

    // Add item to any array (flowers, colors, tags, etc.)
    const handleArrayAdd = (field) => {
        if (!currentArrayInput[field]) return;
        setProduct((prev) => ({
            ...prev,
            [field]: [...prev[field], currentArrayInput[field]],
        }));
        setCurrentArrayInput((prev) => ({ ...prev, [field]: "" }));
    };

    // Remove item from any array
    const handleArrayRemove = (field, index) => {
        setProduct((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    // -------------------------
    // --- SIZE HANDLERS ------
    // -------------------------

    // Add a new size option
    const addSize = () => {
        setProduct((prev) => ({
            ...prev,
            sizes: [
                ...prev.sizes,
                { sizeName: "", price: 0, finalPrice: 0, discount: 0, isDefault: false },
            ],
        }));
    };

    // Update a size's value and recalculate discount
    const updateSize = (index, field, value) => {
        const newSizes = [...product.sizes];
        if (field === "price" || field === "finalPrice") {
            value = Number(value);
        }
        newSizes[index][field] = value;

        // Recalculate discount %
        if (newSizes[index].price > 0 && newSizes[index].finalPrice >= 0) {
            const discount = ((newSizes[index].price - newSizes[index].finalPrice) / newSizes[index].price) * 100;
            newSizes[index].discount = Math.round(discount);
        } else {
            newSizes[index].discount = 0;
        }

        setProduct((prev) => ({ ...prev, sizes: newSizes }));
    };

    // Mark a size as default
    const setDefaultSize = (index) => {
        setProduct((prev) => ({
            ...prev,
            sizes: prev.sizes.map((s, i) => ({ ...s, isDefault: i === index })),
        }));
    };

    // Remove a size
    const removeSize = (index) => {
        setProduct((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index),
        }));
    };

    // -------------------------
    // --- FORM SUBMISSION -----
    // -------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Ensure at least one image is default
            const hasDefault = product.images.some((img) => img.isDefault);
            const images = product.images.map((img, i) => ({
                imgUrl: img.imgUrl || (typeof img === "string" ? img : ""),
                isDefault: hasDefault ? img.isDefault : i === 0,
            }));

            const payload = {
                ...product,
                images,
            };

            // Send POST request to backend
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/add`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success("Product added successfully!");

                // Reset form
                setProduct({
                    productCode: "",
                    name: "",
                    description: "",
                    currency: "INR",
                    stock: 0,
                    deliveryTime: [],
                    flowers: [],
                    packContains: [],
                    colors: [],
                    occasions: [],
                    tags: [],
                    sizes: [],
                    images: [],
                    videos: [],
                });
                setUploadedImageUrls([]);
            } else {
                toast.error("Failed: " + res.data.message);
            }
        } catch (err) {
            console.error("Add Product failed", err.message);
            alert(err.message);
        }
    };

    // Render input with add/remove functionality for array fields
    const renderArrayInput = (field, placeholder) => (
        <div className="mb-4">
            <label className="font-semibold">{placeholder}</label>
            <div className="flex gap-2 mt-1">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="border p-2 rounded flex-1"
                    value={currentArrayInput[field]}
                    onChange={(e) =>
                        setCurrentArrayInput((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleArrayAdd(field)}
                />
                <button
                    type="button"
                    className="bg-blue-500 text-white px-3 rounded"
                    onClick={() => handleArrayAdd(field)}
                >
                    +
                </button>
            </div>
            <div className="flex flex-wrap mt-2 gap-2">
                {product[field].map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
                    >
                        <span>{item}</span>
                        <button
                            type="button"
                            onClick={() => handleArrayRemove(field, index)}
                            className="text-red-500 font-bold"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-6 sm:h-6' viewBox="0 0 640 640">
                                <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    // -------------------------
    // --- JSX RENDERING -------
    // -------------------------

    return (
        <div className="min-h-screen bg-gray-100 px-2 sm:px-8 lg:px-24 py-4">
            <div className="flex justify-center w-full px-2 pb-4 gap-1">
                <h1 className="text-2xl font-bold text-center">
                    Add New Product
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                        e.preventDefault();
                    }
                }}
                className="space-y-4 bg-white py-6 px-4 rounded shadow-md"
            >
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Product Code (Unique)"
                        className="border p-2 rounded"
                        value={product.productCode}
                        onChange={(e) => setProduct({ ...product, productCode: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="border p-2 rounded"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                    />
                </div>

                <textarea
                    placeholder="Description"
                    className="border p-2 rounded w-full"
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-4">
                    {/* Arrays */}
                    {renderArrayInput("flowers", "Flowers")}
                    {renderArrayInput("packContains", "Pack Contains")}
                    {renderArrayInput("colors", "Colors")}
                    {renderArrayInput("occasions", "Occasions")}
                    {renderArrayInput("deliveryTime", "Delivery Time")}
                    {renderArrayInput("tags", "Tags")}
                </div>


                {/* Sizes */}
                <div className="mb-4">
                    <h2 className="font-semibold mb-2">Sizes</h2>
                    <button type="button" onClick={addSize} className="bg-green-500 text-white px-3 py-1 rounded mb-2">
                        Add Size
                    </button>
                    {product.sizes.map((size, index) => (
                        <div key={index} className="flex gap-2 items-center mb-2 flex-wrap">
                            <input
                                type="text"
                                placeholder="Size Name"
                                className="border p-1 rounded flex-1"
                                value={size.sizeName}
                                onChange={(e) => updateSize(index, "sizeName", e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                className="border p-1 rounded w-20"
                                value={size.price === 0 ? "" : size.price}   // ✅ show empty instead of 0
                                onChange={(e) => updateSize(index, "price", e.target.value === "" ? "" : Number(e.target.value))}
                            />

                            <input
                                type="number"
                                placeholder="Final Price"
                                className="border p-1 rounded w-20"
                                value={size.finalPrice === 0 ? "" : size.finalPrice}   // ✅ show empty instead of 0
                                onChange={(e) => updateSize(index, "finalPrice", e.target.value === "" ? "" : Number(e.target.value))}
                            />

                            <span className="w-20">Discount: {size.discount}%</span>

                            <button
                                type="button"
                                className={`px-2 py-1 rounded ${size.isDefault ? "bg-green-500 text-white" : "bg-gray-200"}`}
                                onClick={() => setDefaultSize(index)}
                            >
                                {size.isDefault ? "Default" : "Set Default"}
                            </button>
                            <button type="button" onClick={() => removeSize(index)} className="text-red-500 font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 640 640">
                                    <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Images */}
                <div>
                    <h2 className="font-semibold mb-2">Images</h2>
                    <div className="flex flex-wrap gap-4">
                        {product.images.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img.preview}
                                    alt="preview"
                                    className="w-28 h-28 object-contain object-center rounded-md border border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleMainImage(index)}
                                    className={`absolute bottom-1 left-1 px-2 py-1 text-xs rounded ${img.isDefault ? "bg-green-500 text-white" : "bg-gray-200"}`}
                                >
                                    {img.isDefault ? "Main" : "Set Main"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 text-red-500 font-bold bg-white rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-6 sm:h-6' viewBox="0 0 640 640">
                                        <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                                </button>
                            </div>
                        ))}

                        {/* + Upload Box */}
                        <div
                            onClick={openFilePicker}
                            className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-200"
                        >
                            <span className="text-3xl font-bold text-gray-400">+</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded mt-4">
                    Save Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
