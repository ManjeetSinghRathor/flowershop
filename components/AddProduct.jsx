"use client";

import React, { useState, useRef } from "react";

const AddProduct = () => {
    const [product, setProduct] = useState({
        productCode: "",
        name: "",
        description: "",
        currency: "INR",
        stock: 0,
        deliveryTime: "",
        flowers: [],
        packContains: [],
        colors: [],
        occasions: [],
        tags: [],
        sizes: [],
        images: [],
        videos: [],
    });

    const fileInputRef = useRef(null);
    const [currentArrayInput, setCurrentArrayInput] = useState({
        flowers: "",
        packContains: "",
        colors: "",
        occasions: "",
        tags: "",
    });

    // --- Image handlers ---
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            isDefault: false,
        }));
        setProduct((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleMainImage = (index) => {
        setProduct((prev) => ({
            ...prev,
            images: prev.images.map((img, i) => ({
                ...img,
                isDefault: i === index,
            })),
        }));
    };

    const removeImage = (index) => {
        setProduct((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // --- Array handlers ---
    const handleArrayAdd = (field) => {
        if (!currentArrayInput[field]) return;
        setProduct((prev) => ({
            ...prev,
            [field]: [...prev[field], currentArrayInput[field]],
        }));
        setCurrentArrayInput((prev) => ({ ...prev, [field]: "" }));
    };

    const handleArrayRemove = (field, index) => {
        setProduct((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    // Add size
    const addSize = () => {
        setProduct((prev) => ({
            ...prev,
            sizes: [
                ...prev.sizes,
                { sizeName: "", price: 0, finalPrice: 0, discountPercent: 0, isDefault: false },
            ],
        }));
    };

    // Update size
    const updateSize = (index, field, value) => {
        const newSizes = [...product.sizes];
        if (field === "price" || field === "finalPrice") {
            value = Number(value);
        }
        newSizes[index][field] = value;

        // Calculate discount %
        if (newSizes[index].price > 0 && newSizes[index].finalPrice >= 0) {
            const discount = ((newSizes[index].price - newSizes[index].finalPrice) / newSizes[index].price) * 100;
            newSizes[index].discountPercent = Math.round(discount);
        } else {
            newSizes[index].discountPercent = 0;
        }

        setProduct((prev) => ({ ...prev, sizes: newSizes }));
    };

    // Set default size
    const setDefaultSize = (index) => {
        setProduct((prev) => ({
            ...prev,
            sizes: prev.sizes.map((s, i) => ({ ...s, isDefault: i === index })),
        }));
    };

    // Remove size
    const removeSize = (index) => {
        setProduct((prev) => ({
            ...prev,
            sizes: prev.sizes.filter((_, i) => i !== index),
        }));
    };


    // --- Form submission ---
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Product Data:", product);
        // call your API to save the product here
    };

    // --- Render ---
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-6 sm:h-6' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Add New Product
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-md">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Product Code"
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

                {/* Arrays */}
                {renderArrayInput("flowers", "Flowers")}
                {renderArrayInput("packContains", "Pack Contains")}
                {renderArrayInput("colors", "Colors")}
                {renderArrayInput("occasions", "Occasions")}
                {renderArrayInput("tags", "Tags")}

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
                                value={size.price}
                                onChange={(e) => updateSize(index, "price", e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Final Price"
                                className="border p-1 rounded w-20"
                                value={size.finalPrice}
                                onChange={(e) => updateSize(index, "finalPrice", e.target.value)}
                            />
                            <span className="w-20">Discount: {size.discountPercent}%</span>

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
                                    className={`absolute bottom-1 left-1 px-2 py-1 text-xs rounded ${img.isDefault ? "bg-green-500 text-white" : "bg-gray-200"
                                        }`}
                                >
                                    {img.isDefault ? "Main" : "Set Main"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 text-red-500 font-bold bg-white rounded-full"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-6 sm:h-6' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
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

                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded mt-4">
                    Save Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
