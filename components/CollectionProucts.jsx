"use client";

import React, { useState, useMemo } from 'react'
import { Products } from '@/public/products';
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const collection_products_ids = {
    // By Occasion
    "Birthday Flowers": ["B001", "F002"],
    "Anniversary Flowers": ["F001", "F004", "B001"],
    "Wedding Flowers": ["F003", "F004"],
    "Get Well Soon": ["F005"],
    Congratulations: ["B002", "F005"],
    "Love & Romance": ["F001", "F004", "B001"],
    "New Baby": ["F002", "F005"],
    "Sympathy & Funeral": ["F003"],
    "Thank You": ["F005", "B002"],
    Housewarming: ["B002", "F005"],

    // By Flower Type
    Roses: ["F001", "B001"],
    Lilies: ["F003", "B001"],
    Orchids: ["B002"],
    Carnations: ["B001"],
    Tulips: ["F002"],
    Gerberas: [],
    "Mixed Flowers": ["B001"],
    "Seasonal Flowers": ["F005", "F004"],

    // By Arrangement Style
    Bouquets: ["F001", "F002", "F004"],
    "Flower Baskets": ["B001", "B002"],
    "Flower Boxes / Hampers": [],
    "Vase Arrangements": ["F003", "F005"],
    "Exotic / Premium Arrangements": ["F003", "B002", "F004"],
    "Single Stem Flowers": [],

    // By Color Theme
    "Red Flowers": ["F001"],
    "White Flowers": ["F003"],
    "Pink Flowers": ["F004"],
    "Yellow Flowers": ["F005"],
    "Mixed Colors": ["B001", "B002", "F002"],
};

const CollectionProducts = () => {

    const searchParams = useSearchParams();
    const category = searchParams.get("category"); // e.g. "Birthday Flowers"
    const [loadedMap, setLoadedMap] = useState({});


    // Get product IDs for the category
    const productIds = collection_products_ids[category] || [];

    // Get full product objects
    const collection_products = useMemo(() => {
        return Products.filter((p) => productIds.includes(p.id));
    }, [productIds]);

    return (
        <div className="px-2 sm:px-8 lg:px-24 min-h-screen">
            <div className='flex flex-col w-full bg-white sticky top-14 z-[5] shadow-md'>
                <h1 className="flex w-full justify-start items-center font-mono sm:text-lg px-2 py-4">
                    <Link href="/" className="hover:underline font-light">
                        Home
                    </Link>
                    {category && (
                        <>
                            <span className="mx-1">{">"}</span>
                            <span className="font-medium">{category}</span>
                        </>
                    )}
                </h1>

                <div className='grid grid-cols-2 px-2 pb-4 font-mono sm:text-lg'>
                    <div className='flex justify-start gap-3 sm:gap-4 sm:px-4'>
                        <span className='flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-5 sm:h-5 text-black' viewBox="0 0 640 640"><path d="M96 128C78.3 128 64 142.3 64 160C64 177.7 78.3 192 96 192L182.7 192C195 220.3 223.2 240 256 240C288.8 240 317 220.3 329.3 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L329.3 128C317 99.7 288.8 80 256 80C223.2 80 195 99.7 182.7 128L96 128zM96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L342.7 352C355 380.3 383.2 400 416 400C448.8 400 477 380.3 489.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L489.3 288C477 259.7 448.8 240 416 240C383.2 240 355 259.7 342.7 288L96 288zM96 448C78.3 448 64 462.3 64 480C64 497.7 78.3 512 96 512L150.7 512C163 540.3 191.2 560 224 560C256.8 560 285 540.3 297.3 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L297.3 448C285 419.7 256.8 400 224 400C191.2 400 163 419.7 150.7 448L96 448z" /></svg>
                            Filters
                        </span>
                        <span className='flex gap-1 items-center whitespace-nowrap'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-5 sm:h-5 text-black' viewBox="0 0 640 640"><path d="M470.6 566.6L566.6 470.6C575.8 461.4 578.5 447.7 573.5 435.7C568.5 423.7 556.9 416 544 416L480 416L480 96C480 78.3 465.7 64 448 64C430.3 64 416 78.3 416 96L416 416L352 416C339.1 416 327.4 423.8 322.4 435.8C317.4 447.8 320.2 461.5 329.3 470.7L425.3 566.7C437.8 579.2 458.1 579.2 470.6 566.7zM214.6 73.4C202.1 60.9 181.8 60.9 169.3 73.4L73.3 169.4C64.1 178.6 61.4 192.3 66.4 204.3C71.4 216.3 83.1 224 96 224L160 224L160 544C160 561.7 174.3 576 192 576C209.7 576 224 561.7 224 544L224 224L288 224C300.9 224 312.6 216.2 317.6 204.2C322.6 192.2 319.8 178.5 310.7 169.3L214.7 73.3z" /></svg>
                            Sort By
                        </span>
                    </div>
                    <div className='flex justify-end gap-3 sm:gap-4'>
                        <span className='flex gap-1 items-center'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                role="img"
                                aria-labelledby="grid2Title"
                                className="icon-grid-2 w-5 h-5 sm:w-6 sm:h-6"
                            >
                                <title id="grid2Title">Grid menu</title>
                                <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                                    <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" />
                                    <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" />
                                    <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" />
                                    <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" />
                                </g>
                            </svg>

                        </span>
                        <span className='flex gap-1 items-center whitespace-nowrap'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-6 h-6 sm:w-7 sm:h-7 text-black' viewBox="0 0 640 640"><path d="M104 112C90.7 112 80 122.7 80 136L80 184C80 197.3 90.7 208 104 208L152 208C165.3 208 176 197.3 176 184L176 136C176 122.7 165.3 112 152 112L104 112zM256 128C238.3 128 224 142.3 224 160C224 177.7 238.3 192 256 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L256 128zM256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L256 288zM256 448C238.3 448 224 462.3 224 480C224 497.7 238.3 512 256 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L256 448zM80 296L80 344C80 357.3 90.7 368 104 368L152 368C165.3 368 176 357.3 176 344L176 296C176 282.7 165.3 272 152 272L104 272C90.7 272 80 282.7 80 296zM104 432C90.7 432 80 442.7 80 456L80 504C80 517.3 90.7 528 104 528L152 528C165.3 528 176 517.3 176 504L176 456C176 442.7 165.3 432 152 432L104 432z" /></svg>
                        </span>
                    </div>
                </div>

            </div>

            {collection_products.length === 0 ? (
                <div className='flex w-full items-center py-4'>
                    <img className='object-cover object-center' src="./no_product.png" alt="No Product Available" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
                    {collection_products.map((product) => {
                        return (<div
                            key={product.id}
                            className="flex flex-col bg-white shadow-md rounded-lg p-3 h-full"
                        >
                            <div className="w-full h-36 mb-2 relative">
                                {/* Skeleton */}
                                {!loadedMap[product.id] && (
                                    <div className="absolute inset-0 rounded-lg bg-gray-300 animate-pulse" />
                                )}

                                {/* Actual image */}
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className={`w-full h-full object-cover rounded-lg ${loadedMap[product.id] ? "block" : "hidden"
                                        }`}
                                    onLoad={() => setLoadedMap(prev => ({ ...prev, [product.id]: true }))}
                                    onError={() => setLoadedMap(prev => ({ ...prev, [product.id]: true }))}
                                />
                            </div>

                            {/* Product Info */}
                            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 flex-1">
                                {product.description}
                            </p>

                            {/* Price */}
                            <div className="mt-2">
                                <span className="font-semibold">{product.final_price}₹</span>
                                {product.discount > 0 && (
                                    <span className="text-gray-400 line-through ml-2">
                                        {product.price}₹
                                    </span>
                                )}
                            </div>

                            {/* Buttons at bottom */}
                            <div className="mt-auto flex gap-2 pt-3">
                                <button className="flex-1 bg-white hover:scale-102 transform duration-200 border-1 border-gray-500 font-semibold py-1 rounded">
                                    Buy
                                </button>
                                <button className="flex gap-[2px] items-center justify-center flex-1 bg-gray-800  hover:scale-102 transform duration-200 text-white py-1 rounded">
                                    <span className="text-lg">+</span>{" "}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 640 640"
                                    >
                                        <path d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 480 384 501.5 384 528C384 554.5 405.5 576 432 576z" />
                                    </svg>
                                </button>
                            </div>
                        </div>);
})}
                </div>
            )}
        </div>
    );

}

export default CollectionProducts;