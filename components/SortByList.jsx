"use client";

import React, { useEffect } from "react";

const SortList = ({ openSortBy, setOpenSortBy , value, onChange }) => {
    const sortOptions = [
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
        { label: "A → Z", value: "az" },
        { label: "Z → A", value: "za" },
    ];

    useEffect(() => {
            if (openSortBy) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
            return () => {
                document.body.style.overflow = "";
            };
        }, [openSortBy]);

    useEffect(() => {
            const handlePopState = () => {
                // Just close on back button
                if (openSortBy) {
                    setOpenSortBy(false);
                }
            };

            if (openSortBy) {
                // Add history entry when modal opens
                window.history.pushState({ modalOpen: true }, "");
                window.addEventListener("popstate", handlePopState);
            }
    
            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }, [openSortBy]);

    return (
        <div className="flex flex-col gap-2 items-start p-4 bg-white shadow-sm w-full max-w-xl">
            
            <div className="flex items-center justify-between gap-6 w-full">
                <h2 className="text-2xl font-semibold flex items-center w-full gap-2">
                    🌸 Sort By
                </h2>
                <span
                    className="flex w-full justify-end cursor-pointer text-lg"
                    onClick={() => setOpenSortBy(false)}
                >
                    ❌
                </span>
            </div>

            <hr className="flex h-[1px] bg-gray-200 w-full my-3"/>

            {sortOptions.map((option) => {
                const active = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`px-3 py-1 rounded-full border font-medium transition-all duration-200 ${active
                                ? "bg-gray-800 text-white border-gray-800"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export default SortList;