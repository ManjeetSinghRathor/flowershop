import React, { useState, useEffect, useMemo } from 'react'
import Link from "next/link";
import { Products } from '@/public/products';
import axios from 'axios';

const SearchModal = ({ setIsSearchOpen, isSearchOpen = false }) => {

    const [query, setQuery] = useState("");
    const [productsImgloaded, setProductsImgLoaded] = useState({});
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSearchOpen]);

    function highlightText(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, "gi"); // case-insensitive
        const parts = text.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-gray-800 text-gray-500 font-[600] rounded-sm px-0.5">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    }


    useEffect(() => {
        const fetchSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search/query?q=${encodeURIComponent(query)}`
                );

                if (res.data.success) {
                    setResults(res.data.results);
                }
            } catch (err) {
                console.error("Search failed:", err);
            }
        };

        fetchSearch();
    }, [query]);

    useEffect(() => {
        const handlePopState = () => {
            // Just close on back button
            if (isSearchOpen) {
                setIsSearchOpen(false);
            }
        };

        if (isSearchOpen) {
            // Add history entry when modal opens
            window.history.pushState({ modalOpen: true }, "");
            window.addEventListener("popstate", handlePopState);
        }

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isSearchOpen]);

    return (
        <div
            className={`
          fixed top-0 left-0 z-[1000] h-screen w-full bg-[rgba(0,0,0,0.95)] text-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isSearchOpen ? "-translate-y-0" : "translate-y-full"} overflow-y-auto overscroll-contain
        `}
        >
            <div className="flex flex-col h-full w-full gap-2 p-2">
                <div className='flex justify-between text-lg'>
                    <span className='font-mono'>Search For Products</span>
                    <button onClick={() => setIsSearchOpen(false)} className="ml-2">
                        ✕
                    </button>
                </div>
                {/* 🔎 Search input */}
                {/* Search Bar */}
                <div className="flex w-full py-2">
                    <div className="flex w-full px-2 gap-1 items-center border-[1px] border-gray-400 rounded-full bg-white">
                        <label htmlFor="searchBox"><svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="currentColor" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg></label>
                        <input
                            id="searchBox"
                            type="text"
                            placeholder="Search products by name, code, tags, flowers..."
                            className="p-2 w-full text-black outline-none"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query.trim() && 
                        <p className='flex w-fit text-black p-1 rounded-full bg-gray-200'>
                            <button onClick={() => setQuery("")}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
                            </button>
                        </p>}
                    </div>
                </div>

                {/* Results or popular searches */}
                {query.trim() ? (
                    <div className="flex flex-col gap-3 py-2">
                        {results.length ? (
                            <>
                                {results.map((product) => (
                                    <Link
                                        key={product._id}
                                        href={{
                                            pathname: "/product_view",
                                            query: { id: product._id }, // pass product ID as query param
                                        }}
                                        className="flex gap-3 items-start p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                                        onClick={() => setIsSearchOpen(false)}
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 relative flex-shrink-0">
                                            {!productsImgloaded[product._id] && (
                                                <div className="absolute inset-0 rounded-md bg-gray-600 animate-pulse" />
                                            )}
                                            <img
                                                src={product.images[0].imgUrl}
                                                alt={product.name}
                                                className={`w-full h-full object-cover rounded-md ${productsImgloaded[product._id] ? "block" : "hidden"
                                                    }`}
                                                onLoad={() =>
                                                    setProductsImgLoaded((prev) => ({ ...prev, [product._id]: true }))
                                                }
                                                onError={() =>
                                                    setProductsImgLoaded((prev) => ({ ...prev, [product._id]: true }))
                                                }
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <h3 className="font-semibold text-white text-sm sm:text-base mb-1 truncate">
                                                {highlightText(product.name, query)}
                                            </h3>

                                            <p className="text-xs text-gray-300 line-clamp-2">
                                                {highlightText(product.description, query)}
                                            </p>

                                            {/* Price */}
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="font-bold text-yellow-400 text-sm sm:text-base">
                                                    ₹{product?.sizes[0]?.finalPrice}
                                                </span>
                                                {product?.sizes[0]?.discount > 0 && (
                                                    <span className="text-gray-400 line-through text-xs sm:text-sm">
                                                        ₹{product?.sizes[0]?.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>

                                ))}

                                {/* View All */}
                                {results.length > 4 && (
                                    <Link
                                        href={`/search?query=${query}`}
                                        onClick={() => setIsSearchOpen(false)}
                                        className="block text-center mt-3 py-2 bg-yellow-500 text-black rounded-lg font-medium"
                                    >
                                        View All Results ({results.length})
                                    </Link>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-400">No results found for "{query}"</p>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Popular Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {["Love and Romance", "Anniversary", "Birthday", "Wedding", "Roses Bouquet"].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setQuery(term)}
                                    className="px-3 py-1 rounded-full bg-gray-700 hover:bg-gray-600 transition text-sm"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchModal;