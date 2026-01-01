"use client";

import React, { useState, useRef } from "react";
import { supabase } from "@/app/utils/supabase";
import axios from "axios";
import toast from "react-hot-toast";

const AddSlide = () => {
    const [slide, setSlide] = useState({
        image: null, // { preview, imgUrl }
        serialNo: "",
        link: "",
    });

    const [imageUploading, setImageUploading] = useState(false);
    const [imageRemoving, setImageRemoving] = useState(false);


    const fileInputRef = useRef();

    // Upload Single Slide Image to Supabase
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

        setSlide((prev) => ({
            ...prev,
            image: newImage,
        }));

        try {
            setImageUploading(true);

            const fileName = `slides/${tempId}`;
            const { error } = await supabase.storage
                .from("slides")
                .upload(fileName, file, {
                    cacheControl: "public, max-age=31536000",
                    upsert: true,
                });

            if (error) throw error;

            const { data: publicData } = supabase.storage
                .from("slides")
                .getPublicUrl(fileName);

            setSlide((prev) => ({
                ...prev,
                image: { ...newImage, imgUrl: publicData.publicUrl },
            }));
        } catch (err) {
            console.error("Supabase upload error:", err.message);
            toast.error("Image upload failed");
        } finally {
            setImageUploading(false);
        }
    };

    // Trigger file picker
    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    // Remove Slide Image (and delete from Supabase if uploaded)
    const removeImage = async () => {
        try {
            setImageRemoving(true);

            if (slide.image?.imgUrl) {
                const urlParts = slide.image.imgUrl.split("/object/public/");
                if (urlParts.length < 2) throw new Error("Invalid Supabase URL");

                let filePath = decodeURIComponent(urlParts[1]);
                if (filePath.startsWith("slides/")) {
                    filePath = filePath.replace(/^slides\//, "");
                }

                const { error } = await supabase.storage
                    .from("slides")
                    .remove([filePath]);

                if (error) throw error;
            }

            setSlide((prev) => ({
                ...prev,
                image: null,
            }));
        } catch (err) {
            console.error("Supabase delete error:", err.message || err);
            toast.error("Failed to remove image");
        } finally {
            setImageRemoving(false);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!slide.image?.imgUrl) {
            toast.error("Please upload an image");
            return;
        }

        try {
            const payload = {
                image: slide.image.imgUrl,
                serialNo: slide.serialNo ? Number(slide.serialNo) : null,
                link: slide.link,
            };

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slider/add`,
                payload,
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );

            if (!res.data.success) throw new Error("Failed to add slide");

            toast.success(res.data.message);
            setSlide({ image: null, serialNo: "", link: "" });
        } catch (err) {
            console.error("Error adding slide:", err);
            toast.error("Failed to add slide");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Add New Slide</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Slide Image */}
                <div className="flex justify-center">
                    {slide.image ? (
                        <div className="relative">
                            <img
                                src={slide.image.preview}
                                alt="preview"
                                className="w-full min-w-[290px] h-[160px] object-cover object-center rounded-md border"
                            />
                            {/* Loader Overlay */}
                            {(imageUploading || imageRemoving) && (
                                <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                                    <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                            {/* Remove Button */}
                            {!imageUploading && !imageRemoving && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-[-8px] right-[-8px] text-red-500 font-bold rounded-full p-[2px] bg-white"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className="w-5 h-5 sm:w-6 sm:h-6"
                                        viewBox="0 0 640 640"
                                    >
                                        <path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            onClick={openFilePicker}
                            className="w-full min-w-[290px] h-[160px] flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-gray-200"
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


                {/* Serial No */}
                <input
                    type="number"
                    placeholder="Serial Number"
                    value={slide.serialNo}
                    onChange={(e) => setSlide({ ...slide, serialNo: e.target.value })}
                    className="border p-2 w-full rounded"
                />

                {/* Link */}
                <input
                    type="text"
                    placeholder="Link"
                    value={slide.link}
                    onChange={(e) => setSlide({ ...slide, link: e.target.value })}
                    className="border p-2 w-full rounded"
                />

                <button
                    type="submit"
                    disabled={imageUploading || imageRemoving}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                    Add Slide
                </button>
            </form>
        </div>
    );
};

export default AddSlide;
