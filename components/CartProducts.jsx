"use client";

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Products } from '@/public/products';
import Link from 'next/link';
import { IncreaseQty, DecreaseQty, removeProduct } from '@/app/store/CartProductsSlice';

const CartProducts = () => {

    const dispatch = useDispatch();
    const cart_product_ids = useSelector((state) => state.CartProducts);
    const [productsImgloaded, setProductsImgLoaded] = useState({});

    // Merge products with cart quantities
    const cart_products = cart_product_ids.map((cartItem) => {
        const product = Products.find((p) => p.id === cartItem?.id);
        return {
            ...product,              // full product details
            quantity: cartItem.q, // quantity from cart
        };
    });

    const handleMinus = (product) => {
        if (product.quantity > 1) {
            dispatch(DecreaseQty(product.id));
        }
    };

    const handlePlus = (product) => {
        dispatch(IncreaseQty(product.id));
    };

    return (
        <div className='flex flex-col gap-2 min-h-[50vh] w-full px-2 sm:px-8 lg:px-24 py-4'>
            <div className='flex w-full items-center justify-between border-t border-b border-gray-300 py-2'>
                <div className='flex flex-col'>
                    <h1 className='font-serif text-2xl font-bold leading-tight'>YOUR CART</h1>
                    {cart_products.length > 0 && <p><span className='font-mono'>Subtotal:</span>{" "}₹<span>1499.00</span></p>}
                </div>
                {cart_products.length > 0 && <button
                    disabled={cart_product_ids.length === 0}
                    onClick={() => {
                        console.log("click")
                    }}
                    className='flex w-fit py-2 px-4 font-semibold bg-black text-white hover:bg-gray-900 hover:cursor-pointer'
                >
                    Check out
                </button>}
            </div>

            <div className='flex flex-col w-full gap-3 pt-2'>
                {cart_products.length > 0 ? (
                    <>
                        {cart_products.map((product) => (
                            <div
                                key={product.id}
                                className="flex gap-3 items-start p-3"
                            >

                                {/* Image */}
                                <Link
                                    href={{
                                        pathname: "/product_view",
                                        query: { id: product.id }, // pass product ID as query param
                                    }}
                                    className="w-20 h-20 relative flex-shrink-0"
                                >
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
                                </Link>

                                {/* Info */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <Link
                                        href={{
                                            pathname: "/product_view",
                                            query: { id: product.id }, // pass product ID as query param
                                        }}
                                    >
                                        <h3 className="font-semibold mb-1 truncate">
                                            {product.name}
                                        </h3>

                                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Price */}
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="font-bold text-yellow-500">
                                                ₹{product.final_price}
                                            </span>
                                            {product.discount > 0 && (
                                                <span className="text-gray-400 line-through">
                                                    ₹{product.price}
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Quantity */}
                                    <div className='flex w-fit py-2'>
                                        <div className="flex items-center justify-around border border-gray-400 rounded-lg w-full">
                                            {/* Minus Button */}
                                            <button
                                                type="button"
                                                className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-l-lg"
                                                onClick={() => handleMinus(product)}
                                            >
                                                -
                                            </button>

                                            {/* Number Input */}
                                            <input
                                                type="number"
                                                min="1"
                                                value={product.quantity}
                                                readOnly
                                                className="w-14 text-center border-x border-gray-400 focus:outline-none"
                                            />

                                            {/* Plus Button */}
                                            <button
                                                type="button"
                                                className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-r-lg"
                                                onClick={() => handlePlus(product)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className='flex justify-between gap-6 py-2'>
                                        <p className='flex text-lg font-mono gap-[2px]'>
                                            <span>₹</span><span>{(product.final_price) * (product.quantity)}.00</span>
                                        </p>
                                        <button
                                            onClick={() => dispatch(removeProduct({ id: product.id }))}
                                            className="ml-2 rounded-full p-1 bg-gray-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-5 h-5 sm:w-6 sm:h-6' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        ))}

                        <div className='flex flex-col border-t border-gray-300 w-full gap-2 py-4'>
                            <div className='flex justify-between font-mono text-xl'>
                                <span>Subtotal</span>
                                <p className='flex text-lg font-mono gap-[2px]'>
                                    <span>₹</span><span>{cart_products.reduce((sum, item) => sum + ((item.final_price) * (item.quantity) || 0), 0)}.00</span>
                                </p>
                            </div>
                            <p className='text-sm text-gray-600'>
                                Tax included. <span className='text-blue-800 underline'>Shipping</span> calculated at checkout.
                            </p>
                            <button
                                disabled={cart_product_ids.length === 0}
                                onClick={() => {
                                    console.log("click")
                                }}
                                className='flex w-full items-center justify-center mt-4 py-2 px-4 font-semibold bg-black text-white hover:bg-gray-900 hover:cursor-pointer'
                            >
                                Check out
                            </button>
                            <Link
                            href={{
                                pathname: "/collection_products",
                                query: { category: "All Products" }, // pass subcategory as query param
                            }}
                            className='flex w-full justify-center text-sm items-center p-1 text-blue-600'
                        >
                            Continue shopping {">"}
                        </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col grow w-full h-full items-center justify-center text-center gap-2">
                        <p className='flex justify-center items-center h-[120px] text-gray-400'>
                            Your Cart is Empty
                        </p>
                        <Link
                            href={{
                                pathname: "/collection_products",
                                query: { category: "All Products" }, // pass subcategory as query param
                            }}
                            className='flex items-center p-1 border text-blue-400'
                        >
                            Continue shopping {">"}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartProducts;