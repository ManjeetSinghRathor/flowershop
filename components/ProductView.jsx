"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AddProduct } from "@/app/store/CartProductsSlice";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';
import { Loader2 } from "lucide-react";
import { setUser } from "@/app/store/userSlice";
import { setCart } from "@/app/store/CartProductsSlice";

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
    const [productDetails, setProductDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [currentSizeIdx, setCurrentSizeIdx] = useState(0);
    const [delivery_time, setDelivery_time] = useState("");
    const [quantity, setQuantity] = useState(1);
    const pathname = usePathname();
    const [googleLoading, setGoogleLoading] = useState(false);
    const cartProducts = useSelector((state) => state.CartProducts);


    // Helper function for merging
    function mergeCarts(localCart, backendCart) {
        const map = new Map();

        // Add backend cart first
        backendCart.forEach(item => {
            map.set(item.productId, {
                id: item.productId,
                q: item.quantity,
                sizeIdx: item.sizeIdx,
                deliveryTime: item.deliveryTime,
            });
        });

        // Merge local cart
        localCart.forEach(item => {
            const key = item.id;
            if (map.has(key)) {
                map.get(key).q += item.q; // combine quantity
            } else {
                map.set(key, item);
            }
        });

        return Array.from(map.values());
    }

    const handleGoogleLogin = async (response) => {
        setGoogleLoading(true);
        try {
            const { credential } = response;

            // Step 1: Login with Google
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-login`,
                { token: credential },
                { withCredentials: true }
            );

            if (res.data.success) {
                // Step 2: Get user data (including backend cart)
                const userRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`,
                    { withCredentials: true }
                );

                if (userRes?.data?.success) {
                    const userData = userRes.data.data;
                    const backendCart = userData?.cart || [];

                    // Step 3: Get local cart (saved in localStorage or from Redux)
                    const localCart = cartProducts || [];
                    // Step 4: Merge both carts
                    const mergedCart = mergeCarts(localCart, backendCart);

                    // Step 5: Save merged cart to backend
                    const syncRes = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/cart/sync`,
                        {
                            cart: mergedCart.map((item) => ({
                                productId: item.id,
                                quantity: item.q,
                                sizeIdx: item.sizeIdx,
                                deliveryTime: item.deliveryTime,
                            })),
                        },
                        { withCredentials: true }
                    );

                    if (syncRes.data.success) {
                        // Step 6: Update Redux and clear local cart
                        dispatch(setUser(userRes?.data)); // keep user info from /me
                        dispatch(setCart(mergedCart));
                    }
                }
            }
        } catch (err) {
            console.error("Google login failed", err);
        } finally {
            setGoogleLoading(false);
        }
    };


    // 🌐 Your domain
    const baseUrl = "https://bloomsheaven.com";

    // 🧭 Get current page URL dynamically
    const fullUrl = `${baseUrl}${pathname}?${searchParams.toString()}`;

    // 📝 Encoded version for safe sharing
    const encodedUrl = encodeURIComponent(fullUrl);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])

    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");

    const handleSubmitReview = () => {
        if (!userRating || !userReview.trim()) {
            toast.error("Please provide both rating and review text.");
            return;
        }

        // 🔹 Example: send to backend
        // axios.post("/api/reviews", { productId, rating: userRating, review: userReview });

        toast.success("Thank you for your feedback!");
        setUserRating(0);
        setUserReview("");
    };

    const toastStyle = {
        background: "#161616ff",
        color: "#fff",
        borderRadius: "8px",
        fontWeight: 500,
    };

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
                        toast.success("Item added to your cart", {
                            style: toastStyle,
                            icon: "🛒",
                        });
                        dispatch(AddProduct({ id, q: quantity, sizeIdx: currentSizeIdx, deliveryTime: delivery_time }));
                        // Optional: update Redux state with res.data.cart
                    }
                } catch (err) {
                    toast.error("Failed to add item to cart", {
                        style: toastStyle,
                        icon: "✖",
                    });
                    console.error(err);
                }
            } else {
                dispatch(AddProduct({ id, q: quantity, sizeIdx: currentSizeIdx, deliveryTime: delivery_time })); // guest cart in redux
                toast.success("Item added to your cart", {
                    style: toastStyle,
                    icon: "🛒",
                });
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

    if (loading) {
        return (
            <>
            <div className="flex flex-col min-h-screen gap-4 py-2 px-4 sm:px-8 lg:px-24">
            
            <div className="flex flex-col lg:flex-row gap-4">

                {/* Image Skeleton (matches final aspect) */}
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex justify-center max-h-[50vh] lg:max-h-[55vh] flex-shrink-0 aspect-[1]">
                        <div className="relative w-full max-w-2xl aspect-square bg-gray-300 animate-pulse rounded-md" />
                    </div>

                    <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth sm:px-4">
                        <div className="flex flex-col w-full items-start">
                            {/* Skeleton Rows */}
                            {[...Array(1)].map((_, rowIdx) => (
                                <div key={rowIdx} className="flex w-full gap-4">
                                    {[...Array(8)].map((_, idx) => (
                                        <div
                                            key={`row${rowIdx}-${idx}`}
                                            className="min-w-[4rem] min-h-[4rem] flex items-center justify-center snap-center"
                                        >
                                            <div className="flex flex-col gap-2 items-center">
                                                <div className="w-16 h-16 rounded-xl bg-gray-300 animate-pulse shadow-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



                {/* Details Skeleton */}
                <div className="flex flex-col w-full gap-4">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="w-full h-[60px] lg:h-[90px] xxl:h-[120px] bg-gray-300 animate-pulse rounded-md" />
                    ))}
                </div>

            </div>

            <div className="pt-8 pb-12">
                <h2 className="flex font-mono text-xl justify-center sm:text-3xl">
                    You may also like
                </h2>
            </div>
            
            </div>
            </>
        );
    }

    return (
        <div className="w-full min-h-screen py-2 px-1">
            {/* <div className='flex flex-col w-full sm:px-8 lg:px-24'>
                <h1 className="flex flex-col w-full justify-center items-start font-mono sm:text-lg px-2 py-4">
                    <Link href="/" className="hover:underline font-light">
                        Home{" "}{">"}
                    </Link>
                    <span>{productDetails.name}</span>
                </h1>
            </div> */}

            <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-12 px-2 sm:px-8 lg:px-24">
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
                            className={`font-semibold font-serif ${(productDetails.isActive && productDetails.stock > 0) ? "text-green-600" : "text-red-600"
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
                        Order before <span className="font-semibold">7:00pm</span> to get{" "}
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
                        <button disabled={(!productDetails.isActive || productDetails.stock === 0)} onClick={() => handleAddToCart(productDetails._id)} className={`border border-gray-400 py-2 rounded-lg ${(!productDetails.isActive || productDetails.stock === 0) ? "text-gray-400" : "hover:bg-gray-100"}`}>
                            + Add to Cart
                        </button>
                    </div>

                    {/* Full width Buy Now */}
                    <button
                        onClick={() => {
                            router.push(`/cart_products/checkout_?product_id=${productDetails._id}&delivery_time=${encodeURIComponent(delivery_time)}`)
                        }}
                        disabled={(!productDetails.isActive || productDetails.stock === 0)}
                        className={`w-full text-white py-3 rounded-lg transform duration-50 px-4 transition-colors
                            ${(!productDetails.isActive || productDetails.stock === 0) ? "bg-gray-500" : "bg-pink-500 hover:bg-pink-600 active:bg-white active:text-gray-800"}`}
                    >
                        Buy Now
                    </button>

                    <div className="flex flex-col gap-2">
                        <div>
                            <h2 className="font-semibold mb-1">Description:</h2>
                            <p className="text-gray-700 text-sm leading-relaxed tracking-wide px-4">
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

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Content */}
                            {isOpen && (
                                <div className="px-4 py-3 text-sm text-gray-700 space-y-4">
                                    <div className="space-y-3">
                                        <p>
                                            <strong>Q. Do we offer same-day delivery?</strong><br />
                                            Yes! We offer same-day delivery for most flower arrangements and gifts
                                            if the order is placed before <strong>7:00 PM (local time)</strong>.
                                            Orders received after that will be delivered the next day.
                                        </p>

                                        <p>
                                            <strong>Q. Are deliveries available on Sundays or holidays?</strong><br />
                                            Yes, we deliver on Sundays and most public holidays to make your moments special.
                                        </p>

                                        <p>
                                            <strong>Q. How can I track my order?</strong><br />
                                            Once your order is confirmed, you’ll receive a tracking id & link via email or WhatsApp
                                            so you can monitor the delivery status in real time.
                                        </p>

                                        <p>
                                            <strong>Q. What if the recipient is not available?</strong><br />
                                            Our delivery partner will contact the recipient.
                                            If delivery fails, we’ll reschedule it or leave the package with a neighbor or at reception (as per your consent).
                                        </p>

                                        <p>
                                            <strong>Q. Do you charge for delivery?</strong><br />
                                            Standard delivery within city limits is <strong>free</strong> for orders above ₹999.
                                            For distant locations or urgent deliveries, minimal charges may apply.
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isReviewsOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Content */}
                            {isReviewsOpen && (
                                <div className="px-4 py-3 text-sm text-gray-700 space-y-4">
                                    {/* Existing Review Display */}
                                    <div className="flex items-center gap-1 text-gray-500">
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            let fill = 0;
                                            if ((review?.rating || 0) >= i + 1) fill = 1;
                                            else if ((review?.rating || 0) > i && (review?.rating || 0) < i + 1)
                                                fill = 0.5;
                                            return <Star key={i} filled={fill} className="w-4 h-4" />;
                                        })}
                                    </div>

                                    <p className="ml-1">
                                        {review?.rating > 0 ? review.rating : "No Reviews"}
                                    </p>

                                    {/* --- Divider --- */}
                                    <hr className="border-gray-300 my-3" />

                                    <div className="p-2 relative text-sm text-gray-700 space-y-4">

                                        {/* --- Add Review Section --- */}
                                        <h3 className="font-semibold text-gray-800">Add Your Review</h3>

                                        {/* Star Rating Input */}
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setUserRating(i + 1)}
                                                    className="focus:outline-none"
                                                    disabled={!user} // Disable if not logged in
                                                >
                                                    <Star
                                                        filled={userRating > i ? 1 : 0}
                                                        className={`w-6 h-6 transition-colors ${userRating > i ? "text-yellow-400" : "text-gray-300"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Review Input */}
                                        <textarea
                                            value={userReview}
                                            onChange={(e) => setUserReview(e.target.value)}
                                            placeholder="Write your review here..."
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-pink-400 focus:outline-none"
                                            rows={3}
                                            disabled={!user} // Disable if not logged in
                                        ></textarea>

                                        {/* Submit Button */}
                                        <button
                                            onClick={handleSubmitReview}
                                            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!user}
                                        >
                                            Submit Review
                                        </button>

                                        {/* --- Overlay when user is not logged in --- */}
                                        {!user && (
                                            <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] flex flex-col items-center justify-center rounded-lg">
                                                <p className="text-white mb-3 font-medium">Please login to add a review</p>
                                                <div className="flex max-w-xs cursor-pointer">
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleLogin}
                                                        onError={() => setError("Google login failed")}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}

                        </div>

                        {googleLoading &&
                            <div className="fixed inset-0 bg-none flex items-center justify-center">
                                <Loader2 className="animate-spin text-purple-600" size={64} />
                            </div>
                        }

                        <div className="w-full">
                            {/* Header */}
                            <button
                                onClick={() => setIsShareOpen(!isShareOpen)}
                                className="w-full flex justify-between items-center pt-1 text-left font-semibold text-black"
                            >
                                <span>Share This Product On:</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isShareOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Content */}
                            {isShareOpen && (
                                <div className="flex mt-4 px-4 space-x-4">
                                    <div className="flex gap-4 text-3xl justify-center">
                                        {/* 📋 Copy Link Button */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.success("Link copied to clipboard!");
                                            }}
                                            className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <span>🔗</span>

                                        </button>
                                        {/* 💬 WhatsApp Share */}
                                        <a
                                            href={`https://wa.me/?text=Check%20out%20this%20beautiful%20bouquet%20from%20Bloom's%20Heaven!%20${encodedUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-8 h-8"
                                                role="img"
                                                aria-labelledby="whatsappTitle"
                                            >
                                                <title id="whatsappTitle">Share on WhatsApp</title>
                                                <path d="M12.04 2C6.514 2 2 6.49 2 12.02c0 2.123.553 4.196 1.602 6.03L2 22l4.07-1.566A9.964 9.964 0 0012.04 22c5.526 0 10.04-4.49 10.04-9.98C22.08 6.49 17.566 2 12.04 2zm0 18a8.03 8.03 0 01-4.104-1.128l-.294-.176-2.414.93.78-2.351-.192-.303A8.018 8.018 0 014.02 12.02C4.02 7.58 7.61 4 12.04 4c4.428 0 8.02 3.58 8.02 8.02 0 4.42-3.592 7.98-8.02 7.98zm4.434-5.826c-.244-.122-1.444-.712-1.667-.793-.223-.081-.385-.122-.547.122-.162.244-.63.793-.772.956-.142.162-.284.182-.528.061-.244-.122-1.03-.38-1.962-1.213-.726-.648-1.217-1.448-1.36-1.692-.142-.244-.015-.376.107-.498.11-.109.244-.284.366-.426.122-.142.162-.244.244-.406.081-.162.04-.304-.02-.426-.061-.122-.547-1.32-.75-1.808-.197-.473-.397-.409-.547-.416-.142-.007-.304-.01-.466-.01-.162 0-.426.061-.65.304-.223.244-.852.832-.852 2.03 0 1.198.873 2.356.995 2.518.122.162 1.72 2.627 4.166 3.684.582.251 1.037.401 1.39.513.584.186 1.116.16 1.536.097.468-.07 1.444-.59 1.647-1.162.203-.572.203-1.063.142-1.162-.061-.098-.223-.162-.466-.284z" />
                                            </svg>

                                        </a>
                                        <a
                                            href={`https://www.instagram.com/direct/new/?text=${encodeURIComponent(
                                                `Check out this product from Bloom's Heaven 🌸 — ${window.location.href}`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-pink-500 hover:text-pink-600 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-8 h-8"
                                                role="img"
                                                aria-labelledby="instagramTitle"
                                            >
                                                <title id="instagramTitle">Share on Instagram</title>
                                                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.75-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
                                            </svg>

                                        </a>

                                        {/* 📘 Facebook Share */}
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-8 h-8 -ml-1"
                                                role="img"
                                                aria-labelledby="facebookTitle"
                                            >
                                                <title id="facebookTitle">Share on Facebook</title>
                                                <path d="M13 3h4a1 1 0 011 1v3h-3c-.552 0-1 .448-1 1v3h4l-1 4h-3v8h-4v-8H8v-4h2V8c0-2.757 2.243-5 5-5z" />
                                            </svg>

                                        </a>
                                    </div>
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
