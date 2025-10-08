"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import Link from "next/link";
import {
    FaInstagram,
    FaFacebook,
    FaWhatsapp,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AddProduct } from "@/app/store/CartProductsSlice";
import toast from "react-hot-toast";


// const trendingProductsID = ["F001", "F002", "F003", "F004", "F005", "F006"];

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
    const router = useRouter();
    const productId = searchParams.get("id");
    const [review, setReview] = useState({
        rating: 0,
    });
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user?.data);
    const [productDetails, setProductDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentSizeIdx, setCurrentSizeIdx] = useState(0);
    const [delivery_time, setDelivery_time] = useState("");
    const [quantity, setQuantity] = useState(1);


    const handleAddToCart = async (id) => {
        if (quantity > 0) {
            if (user) {
                try {
                    const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/add-to-cart/${id}`,
                        { quantity, sizeIdx: currentSizeIdx, deliveryTime: delivery_time },
                        { withCredentials: true }
                    );
                    if (res.data.success) {
                        toast.success("Item added to your cart");
                        dispatch(AddProduct({ id, q: quantity, sizeIdx: currentSizeIdx, deliveryTime: delivery_time }));
                        // Optional: update Redux state with res.data.cart
                    }
                } catch (err) {
                    toast.error("Failed to add item to cart");
                    console.error(err);
                }
            } else {
                dispatch(AddProduct({ id, q: quantity, sizeIdx: currentSizeIdx, deliveryTime: delivery_time })); // guest cart in redux
                toast.success("Item added to cart (guest)");
            }
        } else {
            toast("⚠️ Please increase the quantity!", {
                style: {
                    border: "1px solid #facc15", // yellow
                    background: "#fef9c3",       // light yellow
                    color: "#713f12",            // dark amber text
                    padding: "5px",
                    borderRadius: "8px",
                    fontSize: "14px"
                },
            });
        }
    };


    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`
                );

                if (res.data.success) {
                    setProductDetails(res.data.data);
                    const product = res.data.data;
                    setDelivery_time(product?.deliveryTime?.[0] || "1-2 days");
                }

            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);


    //   const trendingProducts = trendingProductsID.map((id) =>
    //     Products.find((product) => product.id === id)
    //   );

    const [isOpen, setIsOpen] = useState(false);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(true);
    //   const [productsImgloaded, setProductsImgLoaded] = useState({});

    if (loading) return (<div className="flex flex-col justify-center gap-4 pt-2 px-2 sm:px-8 lg:px-24">
        {/* Skeleton slides */}
        {[...Array(2)].map((_, idx) => (
            <div
                key={idx}
                className="w-full h-[120px] bg-gray-300 animate-pulse rounded-md"
            />
        ))}
    </div>);

    return (
        <div className="w-full min-h-[50vh]">
            <div className='flex flex-col w-full sm:px-8 lg:px-24'>
                <h1 className="flex flex-col w-full justify-center items-start font-mono sm:text-lg px-2 py-4">
                    <Link href="/" className="hover:underline font-light">
                        Home{" "}{">"}
                    </Link>
                    <span>{productDetails.name}</span>
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row px-2 gap-2 sm:gap-4 lg:gap-12 sm:px-8 lg:px-24">
                <div className="lg:min-w-xl">
                    <ImageCarousel images={productDetails?.images} />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 py-2">
                        <p className="text-[20px] lg:text-2xl font-[530]">
                            {productDetails?.name}
                        </p>
                        {/* Stock */}
                        <p
                            className={`text-sm ${(productDetails.isActive && productDetails.stock > 0) ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {(productDetails.isActive && productDetails.stock > 0) ? `In Stock` : "Out of Stock"}
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
                            {productDetails?.sizes[currentSizeIdx].discount > 0 && (
                                <span className="text-gray-500 line-through text-lg">
                                    {productDetails?.sizes[currentSizeIdx].price}₹
                                </span>
                            )}
                            <span className="font-mono font-[500] text-[28px] lg:text-[32px] text-gray-900">
                                {productDetails?.sizes[currentSizeIdx].finalPrice}₹
                            </span>
                            <span className="px-1 leading-tight bg-green-600 text-white">
                                Save {productDetails?.sizes[currentSizeIdx].discount}%
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm font-medium text-gray-600 max-w-xs mx-auto leading-tight">
                        Order before <span className="font-semibold">12:00pm</span> to get{" "}
                        <span className="font-semibold">Same Day Delivery</span>
                    </p>

                    <div className="border-t border-b border-gray-300 sm:grid xl:grid-cols-2 sm:gap-6 py-2">
                        {/* Delivery */}
                        <div className="flex items-center justify-between w-full py-2 text-sm sm:text-md">
                            <label
                                htmlFor="deliveryTime"
                                className="font-semibold text-gray-800"
                            >
                                Delivery Time
                            </label>

                            <select
                                id="deliveryTime"
                                name="deliveryTime"
                                value={delivery_time}
                                onChange={(e) => setDelivery_time(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                            >
                                {/* productDetails.delivery_options */}
                                {(productDetails?.deliveryTime || ["Next Day Delivery"]).map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Size */}
                        <div className="flex items-center justify-between w-full py-2 text-sm sm:text-md">
                            <label
                                htmlFor="Size"
                                className="font-semibold text-gray-800"
                            >
                                Size
                            </label>

                            <select
                                id="Size"
                                name="Size"
                                value={currentSizeIdx}
                                onChange={(e) => setCurrentSizeIdx(parseInt(e.target.value))}
                                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                            >
                                {/* productDetails.delivery_options */}
                                {productDetails?.sizes?.map((option, index) => (
                                    <option key={index} value={index}>
                                        {option.sizeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quantity + Add to Cart row */}
                    <div className="grid grid-cols-2 gap-2 mb-1">
                        {/* Quantity box */}
                        <div className="grid grid-cols-3 border border-gray-400 rounded-lg w-full">
                            {/* Minus Button */}
                            <button
                                type="button"
                                className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 border-1 rounded-l-lg active:text-white transform duration-100"
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
                                value={quantity} // bind state to input value
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="flex justify-center text-center border-x border-gray-400 focus:outline-none"
                            />

                            {/* Plus Button */}
                            <button
                                type="button"
                                className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-200 border-1 rounded-r-lg active:text-white transform duration-100"
                                onClick={() => {
                                    const input = document.getElementById("qtyBox");
                                    input.value = parseInt(input.value) + 1;
                                }}
                            >
                                +
                            </button>
                        </div>

                        {/* Add to Cart button */}
                        <button onClick={() => handleAddToCart(productDetails._id)} className="border border-gray-400 py-2 rounded-lg hover:bg-gray-100">
                            + Add to Cart
                        </button>
                    </div>

                    {/* Full width Buy Now */}
                    <button
                        onClick={() => {
                            router.push(`/cart_products/checkout_?product_id=${productDetails._id}&delivery_time=${encodeURIComponent(delivery_time)}`)
                        }}
                        className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 active:bg-white active:text-gray-800 transform duration-100"
                    >
                        Buy Now
                    </button>

                    <div className="flex flex-col gap-2">
                        <div>
                            <h2 className="font-semibold mb-1">Description:</h2>
                            <p className="text-gray-700 font-serif text-base leading-relaxed tracking-wide px-4 leading-tight">
                                {productDetails.description}
                            </p>
                        </div>

                        {/* Package Details */}
                        <div>
                            <h2 className="font-semibold mb-1">Package Contains:</h2>
                            <ul className="list-disc list-inside px-4 py-1 text-sm text-gray-700">
                                {productDetails?.packContains?.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Occasions */}
                        <div>
                            <h2 className="font-semibold mb-1">Best For:</h2>
                            <ul className="flex flex-wrap px-4 py-1 gap-2 text-sm text-gray-700">
                                {productDetails?.occasions?.map((occ, idx) => (
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
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            What Payment methods are available?
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            What if I receive the product damaged?
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
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            What Payment methods are available?
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            What if I receive the product damaged?
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
            </div>


            <div className="flex flex-col w-full gap-3 pt-12 pb-4 px-4 sm:px-10 lg:px-26 ">
                <h2 className="flex font-mono text-xl justify-center sm:text-3xl">
                    You may also like
                </h2>

                <div className="flex flex-col gap-4 w-full overflow-hidden py-4">
                    {/* <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col bg-white shadow-md rounded-lg p-3 h-full cursor-pointer hover:shadow-lg transition"
              >
                <Link
                  href={{
                    pathname: "/product_view",
                    query: { id: product.id },
                  }}
                >
                  <div className="w-36 h-36 mb-2 relative">

                    {!productsImgloaded[product.id] && (
                      <div className="absolute inset-0 rounded-lg bg-gray-300 animate-pulse" />
                    )}

                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={`w-full h-full object-cover rounded-lg ${
                        productsImgloaded[product.id] ? "block" : "hidden"
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

                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 flex-1">
                    {product.description}
                  </p>

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
          </div> */}
                </div>
            </div>
        </div>
    );
};

export default ProductView;
