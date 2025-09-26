
"use client";

import React, { useState, useMemo } from 'react'
import { Products } from '@/public/products';
import { useSearchParams } from "next/navigation";
import ImageCarousel from '@/components/ImageCarousel';
import Link from 'next/link';

const Star = ({ filled = 0, className = "w-6 h-6" }) => {
    // filled: 1 = full, 0.5 = half, 0 = empty
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="half-grad" x1="0" x2="100%" y1="0" y2="0">
                    <stop offset="50%" stopColor="#facc15" /> {/* yellow-400 */}
                    <stop offset="50%" stopColor="white" />
                </linearGradient>
            </defs>

            <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.844 
           1.48 8.283L12 18.896l-7.416 4.537 
           1.48-8.283L0 9.306l8.332-1.151z"
                fill={
                    filled === 1
                        ? "#facc15" // full gold
                        : filled === 0.5
                            ? "url(#half-grad)" // half fill
                            : "white" // empty bg
                }
                stroke="black"
                strokeWidth="0.2"
            />
        </svg>
    );
};


const ProductView = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");
    const [review, setReview] = useState({
        rating: 3.5,
    })

    const productDetails = Products.find(
        (product) => product.id.toString() === productId.toString()
    );

    return (
        <div className='w-full px-2 sm:px-8 lg:px-24 min-h-screen'>
            <div className='flex flex-col w-full gap-1 pb-2'>
                <h1 className="flex w-full justify-start items-center font-mono sm:text-lg pt-4">
                    <Link href="/" className="hover:underline font-light">
                        Home
                    </Link>
                    <>
                        <span className="mx-1">{">"}</span>
                    </>
                </h1>
                <h1 className="font-serif text-xl font-[600]">{productDetails.name}</h1>
            </div>
            <div>
                <ImageCarousel images={productDetails.images} />
            </div>

            <div className="flex flex-col gap-4 mt-2">

                <div className='flex flex-col gap-1 py-2'>
                    {/* Stock */}
                    <p className="text-sm text-gray-500">
                        {productDetails.stock > 0
                            ? `In Stock`
                            : "Out of Stock"}
                    </p>

                    {/* Reviews */}
                    <div className="flex items-center gap-1 text-gray-500">
                        {Array.from({ length: 5 }).map((_, i) => {
                            let fill = 0;
                            if ((review?.rating || 0) >= i + 1) fill = 1; // full star
                            else if ((review?.rating || 0) > i && (review?.rating || 0) < i + 1) fill = 0.5; // half star
                            return <Star key={i} filled={fill} className="w-4 h-4" />;
                        })}
                        <span className='ml-1'>{review?.rating > 0 ? review.rating : "No Reviews"}</span>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center gap-2">
                        {productDetails.discount > 0 && (
                            <span className="text-gray-500 line-through text-lg">
                                {productDetails.price}₹
                            </span>
                        )}
                        <span className="font-mono text-2xl text-red-600">
                            {productDetails.final_price}₹
                        </span>
                        <span className="px-1 leading-tight bg-green-600 text-white">
                            Save {productDetails.discount}%
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-red-700">
                        Buy Now
                    </button>
                    <button className="flex-1 border border-gray-400 py-2 rounded-lg hover:bg-gray-100">
                        Add to Cart
                    </button>
                </div>

                <div className='flex flex-col gap-3 pt-4'>

                    {/* Delivery */}
                    <p className="text-sm text-gray-700 border-1 border-gray-500 rounded-md w-fit px-2">
                        <span className="font-semibold">Delivery Time: </span>
                        {productDetails.delivery_time}
                    </p>
                    
                    <div>
                        <h2 className="font-semibold mb-1">Description:</h2>
                        <p className="text-gray-600">{productDetails.description}</p>
                    </div>

                    {/* Package Details */}
                    <div>
                        <h2 className="font-semibold mb-1">Package Contains:</h2>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                            {productDetails.packContains.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>


                    {/* Occasions */}
                    <div>
                        <h2 className="font-semibold mb-1">Best For:</h2>
                        <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                            {productDetails.occasions.map((occ, idx) => (
                                <li
                                    key={idx}
                                    className="bg-gray-100 px-2 py-1 rounded-md border"
                                >
                                    {occ}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Care Instructions */}
                    {/* <div>
                    <h2 className="font-semibold mb-1">Care Instructions:</h2>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        {productDetails.care_instructions.map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                        ))}
                    </ul>
                </div> */}

                    {/* Add Ons */}
                    {productDetails.addOns && (
                        <div>
                            <h2 className="font-semibold mb-1">Available Add-Ons:</h2>
                            <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
                                {productDetails.addOns.map((addon, idx) => (
                                    <li
                                        key={idx}
                                        className="bg-pink-100 px-2 py-1 rounded-md border border-pink-300"
                                    >
                                        {addon}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>

        </div>

    )
}

export default ProductView;