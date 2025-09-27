"use client";

import React, { useState, useMemo } from "react";
import { Products } from "@/public/products";
import { useSearchParams } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import Link from "next/link";
import {
    FaInstagram,
    FaFacebook,
    FaWhatsapp,
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";


const trendingProductsID = ["F001", "F002", "F003", "F004", "F005", "F006"];

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
                strokeWidth="0.3"
            />
        </svg>
    );
};

const ProductView = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");
    const [review, setReview] = useState({
        rating: 0,
    });

    const productDetails = Products.find(
        (product) => product.id.toString() === productId.toString()
    );

    const trendingProducts = trendingProductsID.map((id) =>
        Products.find((product) => product.id === id)
    );

    const [isOpen, setIsOpen] = useState(false);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(true);
    const [productsImgloaded, setProductsImgLoaded] = useState({});

    return (
        <div className="w-full px-2 sm:px-8 lg:px-24 min-h-[50vh]">
            <div className="flex flex-col w-full gap-1 pb-2">
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
                <div className="flex flex-col gap-2 py-2">
                    {/* Stock */}
                    <p
                        className={`text-sm ${productDetails.stock > 0 ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {productDetails.stock > 0 ? `In Stock` : "Out of Stock"}
                    </p>

                    {/* Reviews */}
                    <div className="flex items-center gap-1 text-gray-500">
                        {Array.from({ length: 5 }).map((_, i) => {
                            let fill = 0;
                            if ((review?.rating || 0) >= i + 1) fill = 1; // full star
                            else if (
                                (review?.rating || 0) > i &&
                                (review?.rating || 0) < i + 1
                            )
                                fill = 0.5; // half star
                            return <Star key={i} filled={fill} className="w-4 h-4" />;
                        })}
                        <span className="ml-1">
                            {review?.rating > 0 ? review.rating : "No Reviews"}
                        </span>
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

                {/* Delivery */}
                <div className="flex items-center justify-between w-full py-2 border-t border-b border-gray-300 text-sm">
                    <label htmlFor="deliveryTime" className="font-medium text-gray-800">
                        Delivery Time
                    </label>

                    <select
                        id="deliveryTime"
                        name="deliveryTime"
                        className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                        defaultValue={productDetails.delivery_time}
                    >
                        {/* productDetails.delivery_options */}
                        {["same day delivery"].map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quantity + Add to Cart row */}
                <div className="grid grid-cols-2 gap-2 mb-1">
                    {/* Quantity box */}
                    <div className="flex items-center justify-around border border-gray-400 rounded-lg w-full">
                        {/* Minus Button */}
                        <button
                            type="button"
                            className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-l-lg"
                            onClick={() => {
                                const input = document.getElementById("qtyBox");
                                if (input.value > 1) input.value = parseInt(input.value) - 1;
                            }}
                        >
                            -
                        </button>

                        {/* Number Input */}
                        <input
                            id="qtyBox"
                            type="number"
                            min="1"
                            defaultValue="1"
                            className="flex justify-center w-14 text-center border-x border-gray-400 focus:outline-none"
                        />

                        {/* Plus Button */}
                        <button
                            type="button"
                            className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-r-lg"
                            onClick={() => {
                                const input = document.getElementById("qtyBox");
                                input.value = parseInt(input.value) + 1;
                            }}
                        >
                            +
                        </button>
                    </div>

                    {/* Add to Cart button */}
                    <button className="border border-gray-400 py-2 rounded-lg hover:bg-gray-100">
                        Add to Cart
                    </button>
                </div>

                {/* Full width Buy Now */}
                <button className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-red-700 sticky top-14 z-[45]">
                    Buy Now
                </button>

                <div className="flex flex-col gap-4 pt-4">
                    <div>
                        <p className="text-gray-600">{productDetails.description}</p>
                    </div>

                    {/* Package Details */}
                    <div>
                        <h2 className="font-semibold mb-1">Package Contains:</h2>
                        <ul className="list-disc list-inside px-4 py-1 text-sm text-gray-700">
                            {productDetails.packContains.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Occasions */}
                    <div>
                        <h2 className="font-semibold mb-1">Best For:</h2>
                        <ul className="flex flex-wrap px-4 py-1 gap-2 text-sm text-gray-700">
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

                    <div className="w-full">
                        {/* Header */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex justify-between items-center pt-1 text-left font-semibold text-black"
                        >
                            <span>Shipping and Delivery:</span>
                            {isOpen ? (
                                <FaChevronUp className="text-gray-500" />
                            ) : (
                                <FaChevronDown className="text-gray-500" />
                            )}
                        </button>

                        {/* Content */}
                        {isOpen && (
                            <div className="px-4 py-3 text-sm text-gray-700 space-y-4">
                                <div>
                                    <p className="font-medium">
                                        Can I get my order delivered earlier?
                                    </p>
                                    <p>
                                        We ship the order within 24–48 hours after you place the
                                        order. All our items are <b>READY IN STOCK</b>. We have more
                                        than 2000 SKU ready to ship. The rest of the time is taken
                                        by the courier companies. Therefore, it will take{" "}
                                        <b>4 to 5 days</b> to get the order delivered to you.
                                    </p>
                                    <p>
                                        <b>Please note:</b> In case you are in DELHI/ NCR we can try
                                        and deliver your order <b>next day itself</b>.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        What Payment methods are available?
                                    </p>
                                    <p>
                                        You can pay via Credit Cards, Debit Cards, Netbanking,
                                        Mobile Wallets or Cash on Delivery.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        What if I receive the product damaged?
                                    </p>
                                    <p>
                                        In case you receive the product damaged, you will have to
                                        share the photo and order ID on any of our WhatsApp numbers{" "}
                                        <b>8800393540 / 43 / 36</b>. We will send you{" "}
                                        <b>FREE REPLACEMENT</b> of the product.{" "}
                                        <b>NO QUESTIONS ASKED.</b>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        {/* Header */}
                        <button
                            onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                            className="w-full flex justify-between items-center pt-1 text-left font-semibold text-black"
                        >
                            <span>Customer Reviews:</span>
                            {isReviewsOpen ? (
                                <FaChevronUp className="text-gray-500" />
                            ) : (
                                <FaChevronDown className="text-gray-500" />
                            )}
                        </button>

                        {/* Content */}
                        {isReviewsOpen && (
                            <div className="px-4 py-3 text-sm text-gray-700 space-y-4">
                                <div>
                                    <p className="font-medium">
                                        Can I get my order delivered earlier?
                                    </p>
                                    <p>
                                        We ship the order within 24–48 hours after you place the
                                        order. All our items are <b>READY IN STOCK</b>. We have more
                                        than 2000 SKU ready to ship. The rest of the time is taken
                                        by the courier companies. Therefore, it will take{" "}
                                        <b>4 to 5 days</b> to get the order delivered to you.
                                    </p>
                                    <p>
                                        <b>Please note:</b> In case you are in DELHI/ NCR we can try
                                        and deliver your order <b>next day itself</b>.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        What Payment methods are available?
                                    </p>
                                    <p>
                                        You can pay via Credit Cards, Debit Cards, Netbanking,
                                        Mobile Wallets or Cash on Delivery.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">
                                        What if I receive the product damaged?
                                    </p>
                                    <p>
                                        In case you receive the product damaged, you will have to
                                        share the photo and order ID on any of our WhatsApp numbers{" "}
                                        <b>8800393540 / 43 / 36</b>. We will send you{" "}
                                        <b>FREE REPLACEMENT</b> of the product.{" "}
                                        <b>NO QUESTIONS ASKED.</b>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full">
                        {/* Header */}
                        <button
                            onClick={() => setIsShareOpen(!isShareOpen)}
                            className="w-full flex justify-between items-center pt-1 text-left font-semibold text-black"
                        >
                            <span>Share This Product On:</span>
                            {isShareOpen ? (
                                <FaChevronUp className="text-gray-500" />
                            ) : (
                                <FaChevronDown className="text-gray-500" />
                            )}
                        </button>

                        {/* Content */}
                        {isShareOpen && (
                            <div className="flex px-4 mt-4 space-x-4">
                                <a
                                    href="https://www.instagram.com/graduate.mentors/?igsh=bjgxczU1Y2M2M3px#"
                                    className="text-pink-500 hover:text-pink-600 transition-colors text-3xl"
                                >
                                    <FaInstagram />
                                </a>
                                <a
                                    href="https://www.instagram.com/graduate.mentors/?igsh=bjgxczU1Y2M2M3px#"
                                    className="text-green-500 hover:text-green-600 transition-colors text-3xl"
                                >
                                    <FaWhatsapp />
                                </a>
                                <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-700 transition-colors text-3xl"
                                >
                                    <FaFacebook />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full gap-3 pt-12 pb-4 px-2">
                <h2 className="flex font-mono text-xl justify-center sm:text-3xl">
                    You may also like
                </h2>

                <div className="flex flex-col gap-4 w-full overflow-hidden py-4">
                    <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
                        {/* Example Product Cards */}
                        {trendingProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col bg-white shadow-md rounded-lg p-3 h-full cursor-pointer hover:shadow-lg transition"
                            >
                                <Link
                                    href={{
                                        pathname: "/product_view",
                                        query: { id: product.id }, // pass product ID as query param
                                    }}
                                >
                                    <div className="w-36 h-36 mb-2 relative">
                                        {/* Skeleton */}
                                        {!productsImgloaded[product.id] && (
                                            <div className="absolute inset-0 rounded-lg bg-gray-300 animate-pulse" />
                                        )}

                                        {/* Actual image */}
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className={`w-full h-full object-cover rounded-lg ${productsImgloaded[product.id] ? "block" : "hidden"
                                                }`}
                                            onLoad={() =>
                                                setProductsImgLoaded((prev) => ({
                                                    ...prev,
                                                    [product.id]: true,
                                                }))
                                            }
                                            onError={() =>
                                                setProductsImgLoaded((prev) => ({
                                                    ...prev,
                                                    [product.id]: true,
                                                }))
                                            }
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-600 flex-1">
                                        {product.description}
                                    </p>

                                    {/* Price */}
                                    <div className="mt-2">
                                        <span className="font-semibold">
                                            {product.final_price}₹
                                        </span>
                                        {product.discount > 0 && (
                                            <span className="text-gray-400 line-through ml-2">
                                                {product.price}₹
                                            </span>
                                        )}
                                    </div>
                                </Link>

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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
