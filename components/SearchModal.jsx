import React, { useState, useEffect, useMemo } from 'react'
import Link from "next/link";
import { Products } from '@/public/products';


const SearchModal = ({ setIsSearchOpen, isSearchOpen = false }) => {

    const [query, setQuery] = useState("");
    const [productsImgloaded, setProductsImgLoaded] = useState({});

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


    // 🔍 Search logic
    const results = useMemo(() => {
        if (!query.trim()) return [];

        // if number -> search price ±50
        if (!isNaN(query)) {
            const price = Number(query);
            return Products.filter(
                (p) => p.price >= price - 50 && p.price <= price + 50
            );
        }

        // text search in title + description
        return Products.filter(
            (p) =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.description?.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const limitedResults = results.slice(0, 4); // show only 3-4 results

    return (
        <div
            className={`
          fixed top-0 left-0 z-[1000] h-screen w-full bg-[rgba(0,0,0,0.95)] text-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isSearchOpen ? "-translate-y-0" : "translate-y-full"}
          sm:hidden overflow-y-auto overscroll-contain
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
                <div className="flex items-center bg-white text-black rounded-lg px-3 py-2 mx-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for flowers, gifts, price..."
                        className="w-full outline-none bg-transparent"
                        autoFocus
                    />
                </div>

                {/* Results or popular searches */}
                {query.trim() ? (
                    <div className="flex flex-col gap-3 py-2">
                        {limitedResults.length ? (
                            <>
                                {limitedResults.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={{
                                            pathname: "/product_view",
                                            query: { id: product.id }, // pass product ID as query param
                                        }}
                                        className="flex gap-3 items-start p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                                        onClick={() => setIsSearchOpen(false)}
                                    >
                                        {/* Image */}
                                        <div className="w-20 h-20 relative flex-shrink-0">
                                            {!productsImgloaded[product.id] && (
                                                <div className="absolute inset-0 rounded-md bg-gray-600 animate-pulse" />
                                            )}
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className={`w-full h-full object-cover rounded-md ${productsImgloaded[product.id] ? "block" : "hidden"
                                                    }`}
                                                onLoad={() =>
                                                    setProductsImgLoaded((prev) => ({ ...prev, [product.id]: true }))
                                                }
                                                onError={() =>
                                                    setProductsImgLoaded((prev) => ({ ...prev, [product.id]: true }))
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
                                                    ₹{product.final_price}
                                                </span>
                                                {product.discount > 0 && (
                                                    <span className="text-gray-400 line-through text-xs sm:text-sm">
                                                        ₹{product.price}
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
                            {["Red Roses", "Anniversary", "Birthday", "Bouquets"].map((term) => (
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