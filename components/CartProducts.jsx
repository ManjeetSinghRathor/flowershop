"use client";

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { IncreaseQty, DecreaseQty, removeProduct } from '@/app/store/CartProductsSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CartProducts = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state?.user?.data);
    const cart_product_ids = useSelector((state) => state.CartProducts);

    const [loading, setLoading] = useState(true);
    const [cart_products, setCartProducts] = useState([]);
    const [clicked, setClicked] = useState(false);

    const fetchLocalCart = async () => {        
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/cart/local`,
                { cart: cart_product_ids }
            );

            if (res.data.success) {
                setCartProducts(res.data.cart_products);
            }
        } catch (error) {
            console.error("Error fetching local cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(cart_product_ids)
            fetchLocalCart();
    }, [cart_product_ids])


    const handleMinus = async (product) => {
        if (product.quantity > 1) {

            if (!user) {
                // Local cart
                dispatch(DecreaseQty({ id: product._id, sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time }));
                return;
            }

            try {
                setClicked(true);
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/cart/decrease/${product._id}`,
                    { sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(DecreaseQty({ id: product._id, sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time }));
                }
            } catch (err) {
                console.error("Failed to decrease cart item:", err);
            } finally {
                setClicked(false);
            }
        }
    };

    const handlePlus = async (product) => {
        if (!user) {
            dispatch(IncreaseQty({ id: product._id, sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time }));
            return;
        }

        try {
            setClicked(true);
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/cart/increase/${product._id}`,
                { sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time },
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(IncreaseQty({ id: product._id, sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time }));
            }
        } catch (err) {
            console.error("Failed to increase cart item:", err);
        } finally {
            setClicked(false);
        }
    };

    const handleRemoveItem = async (product) => {
        if (!user) {
            dispatch(removeProduct({ id: product._id, sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time }));
            return;
        }

        try {
            setClicked(true);
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/cart/delete`,
                { productId: product._id, sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time },
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(removeProduct({ id: product._id, sizeIdx: product.sizeIdx, deliveryTime: product.delivery_time }));
            }
        } catch (err) {
            console.error("Failed to remove cart item:", err);
        } finally {
            setClicked(false);
        }
    };

    return (
        <div className='flex flex-col gap-2 min-h-[50vh] w-full pt-4'>
            <div className='flex w-full items-center justify-between border-t border-b border-gray-300 py-2 sticky top-14 z-[45] bg-white px-2 sm:px-8 lg:px-24'>
                <div className='flex flex-col'>
                    <h1 className='font-serif text-2xl font-bold leading-tight'>YOUR CART</h1>
                    {cart_products?.length > 0 && <div className='flex gap-2'><span className='font-mono'>Subtotal:</span>
                        <p className='flex font-mono gap-[2px]'>
                            <span>₹</span><span>{cart_products.reduce((sum, item) => sum + ((item.sizes[0].finalPrice) * (item.quantity) || 0), 0)}.00</span>
                        </p>
                    </div>}
                </div>
                {cart_products?.length > 0 && <button
                    disabled={cart_product_ids?.length === 0}
                    onClick={() => {
                        router.push("/cart_products/checkout_");
                    }}
                    className='flex w-fit py-2 px-4 font-semibold bg-black text-white hover:bg-gray-900 hover:cursor-pointer'
                >
                    Check out
                </button>}
            </div>

            {loading ?
                <div className="flex flex-col justify-center gap-4 pt-2 px-2 sm:px-8 lg:px-24">
                    {/* Skeleton slides */}
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className='flex gap-3 items-start px-4 py-2'>
                            <div
                                className="w-20 h-20 bg-gray-300 animate-pulse rounded-md"
                            />
                            <div
                                className="w-full h-[120px] bg-gray-300 animate-pulse rounded-md"
                            />
                        </div>
                    ))}
                </div> :
                <div className='flex flex-col w-full gap-3 pt-2 px-2 sm:px-8 lg:px-24'>
                    {cart_products?.length > 0 ? (
                        <>
                            {cart_products.map((product, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-3 items-start p-3"
                                >

                                    {/* Image */}
                                    <Link
                                        href={{
                                            pathname: "/product_view",
                                            query: { id: product._id }, // pass product ID as query param
                                        }}
                                        className="w-20 h-20 relative flex-shrink-0"
                                    >
                                        <div className="relative w-full h-full rounded-md overflow-hidden">
                                            <Image
                                                src={product.images[0].imgUrl}
                                                alt={product.name}
                                                fill
                                                loading='eager'
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>

                                    </Link>

                                    {/* Info */}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <Link
                                            href={{
                                                pathname: "/product_view",
                                                query: { id: product._id }, // pass product ID as query param
                                            }}
                                        >
                                            <h3 className="font-semibold mb-1 truncate">
                                                {product.name}
                                            </h3>

                                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                                                {product.description}
                                            </p>

                                            <div className='flex flex-col sm:flex-row sm:gap-6 text-xs sm:text-sm py-1 gap-[2px]'>
                                                <div>
                                                    <p className='font-[600]'>Size</p>
                                                    <p className='text-gray-600'>{product.sizes[product.sizeIdx].sizeName}</p>
                                                </div>
                                                <div>
                                                    <p className='font-[600]'>Delivery Time</p>
                                                    <p className='text-gray-600'>{product.delivery_time}</p>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="mt-2 flex items-center gap-2">
                                                {product.sizes[product.sizeIdx || 0].discount > 0 && (
                                                    <span className="text-gray-400 line-through">
                                                        ₹{product.sizes[product.sizeIdx].price}
                                                    </span>
                                                )}
                                                <span className="font-bold text-yellow-500">
                                                    ₹{product.sizes[product.sizeIdx || 0].finalPrice}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Quantity */}
                                        <div className='flex w-full max-w-32 py-2 '>
                                            <div className="grid grid-cols-3 border border-gray-400 rounded-lg w-fit">
                                                {/* Minus Button */}
                                                <button
                                                    type="button"
                                                    className="px-3 font-bold text-xl text-gray-600 hover:bg-gray-200 border-1 rounded-l-lg active:text-white transform duration-50"
                                                    disabled={clicked}
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
                                                    className="flex justify-center w-full text-center border-x border-gray-400 focus:outline-none"
                                                />

                                                {/* Plus Button */}
                                                <button
                                                    type="button"
                                                    className="px-3 font-bold text-xl text-gray-600 hover:bg-gray-200 border-1 rounded-r-lg active:text-white transform duration-50"
                                                    disabled={clicked}
                                                    onClick={() => handlePlus(product)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className='flex justify-between gap-6 py-2'>
                                            <p className='flex text-lg font-mono gap-[2px]'>
                                                <span>₹</span><span>{(product.sizes[0].finalPrice) * (product.quantity)}.00</span>
                                            </p>
                                            <button
                                                onClick={() => handleRemoveItem(product)}
                                                disabled={clicked}
                                                className="ml-2 rounded-full p-1 bg-gray-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-5 h-5 sm:w-6 sm:h-6' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            ))}

                            <div className='flex flex-col border-t border-gray-300 w-full gap-2 py-4'>
                                <div className='flex justify-between font-mono text-xl sm:text-2xl font-semibold'>
                                    <span>Subtotal</span>
                                    <p className='flex font-mono gap-[2px]'>
                                        <span>₹</span><span>{cart_products.reduce((sum, item) => sum + ((item.sizes[0].finalPrice) * (item.quantity) || 0), 0)}.00</span>
                                    </p>
                                </div>
                                <p className='text-sm text-gray-600'>
                                    Tax included. <span className='text-blue-800 underline hover:cursor-default'>Shipping</span> calculated at checkout.
                                </p>
                                <button
                                    disabled={cart_product_ids?.length === 0}
                                    onClick={() => {
                                        router.push("/cart_products/checkout_");
                                    }}
                                    className='flex w-full items-center justify-center mt-4 py-2 px-4 font-semibold bg-black text-white hover:bg-gray-900 hover:cursor-pointer'
                                >
                                    Check out
                                </button>
                                <Link
                                    href={{
                                        pathname: "/collection_products",
                                        query: { category: "All Products", id: "68db488464d038f4c3298faa" }, // pass subcategory as query param
                                    }}
                                    className='flex w-full justify-center text-sm items-center p-1 text-blue-600'
                                >
                                    Continue shopping {">"}
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col grow w-full h-full items-center justify-center text-center gap-2">

                            <Image
                                src={"/empty-cart.png"} // fallback image from public/
                                alt="Empty Cart"
                                width={320} // matches Tailwind's w-16
                                height={320}
                                className={`object-cover`}
                            />

                            <p className='flex justify-center items-center text-gray-500'>
                                YOUR CART IS EMPTY
                            </p>

                            <Link
                                href={{
                                    pathname: "/collection_products",
                                    query: { category: "All Products", id: "68db488464d038f4c3298faa" }, // pass subcategory as query param
                                }}
                                className='flex items-center text-sm leading-tight underline text-blue-600'
                            >
                                Continue shopping {">>"}
                            </Link>

                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default CartProducts;