"use client";

// import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from "react-redux";
import { setUser, logout } from "@/app/store/userSlice";
import { setCart } from "@/app/store/CartProductsSlice";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { Loader2 } from "lucide-react";


export default function Overlays({ setIsOpen, isOpen = false }) {
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const swipeRef = useRef(null);
    const [openLoginPopup, setOpenLoginPopup] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const user = useSelector((state) => state.user?.data || null);
    const cartProducts = useSelector((state) => state.CartProducts);
    const updatedCollectionList = useSelector((state) => state.collectionList.data);

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


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest(".close-icon")) return;

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false); // Close the sidebar if clicked outside
            }
        };

        // Attach event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Track touch start
    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].clientX;
    };

    // Track touch end
    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        handleSwipe();
    };

    // Detect swipe
    const handleSwipe = () => {
        const diff = touchStartX.current - touchEndX.current;

        if (diff > 120) {
            // Swipe left detected
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const menuEl = swipeRef.current;
        if (!menuEl) return;

        menuEl.addEventListener("touchstart", handleTouchStart);
        menuEl.addEventListener("touchend", handleTouchEnd);

        return () => {
            menuEl.removeEventListener("touchstart", handleTouchStart);
            menuEl.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    const [openCategory, setOpenCategory] = useState(null);

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    useEffect(() => {
        const handlePopState = () => {
            // Just close on back button
            if (isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Add history entry when modal opens
            window.history.pushState({ modalOpen: true }, "");
            window.addEventListener("popstate", handlePopState);
        }

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isOpen]);

    const handleLogout = async () => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });

        if (res.data?.success) {
            localStorage.removeItem("cartProducts");
            dispatch(setCart([]));
            dispatch(logout());
        }
    }

    return (
        <aside
            className={`
          fixed top-0 left-0 z-[100] w-full h-full bg-[rgba(0,0,0,0.7)] text-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto overscroll-contain
        `}
            ref={swipeRef}
        >
            {googleLoading &&
                <div className="fixed inset-0 z-50 bg-none flex items-center justify-center pointer-events-auto">
                    <Loader2 className="animate-spin text-purple-600" size={64} />
                </div>
            }

            <div className="flex flex-col h-full grow justify-between w-60 sm:w-64 bg-[#fff9eb]" ref={menuRef}>
                <div className="flex flex-col w-60 sm:w-64 bg-[#fff9eb] overflow-y-auto">
                    {user != null &&
                        <div className="flex flex-col p-2">
                            <div className="flex w-full p-1 items-center justify-center">
                                <Image
                                    src={user?.profile?.avatarUrl || "/cat.png"} // fallback image from public/
                                    alt="User Avatar"
                                    width={64}
                                    height={64}
                                    className="rounded-full border object-cover"
                                    loading="lazy"
                                    priority={false}
                                />
                            </div>
                            <p className="flex text-black text-center items-center justify-center gap-2 pb-1 rounded-sm">
                                Hello, {user?.name.split(" ")[0]}!
                            </p>

                            <Link
                                href={"/profile"}
                                onClick={() => {
                                    setTimeout(() => {
                                        setIsOpen(false);
                                    }, 300)
                                }}
                                className="w-full flex justify-center items-center px-2 gap-2 text-blue-600 hover:text-blue-700 hover:underline bg-white py-1"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />

                                    <circle
                                        cx="12"
                                        cy="9"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />

                                    <path
                                        d="M6 18c0-3.3 3-5 6-5s6 1.7 6 5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span>Account</span><span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-4 h-4 text-blue-600"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </span>
                            </Link>
                        </div>}

                    {user === null && <div className="w-full max-w-md mx-auto flex items-center justify-center px-4 pt-4 pb-2">
                        <img className="h-12 w-auto" src="./favicon.png" alt="" />
                    </div>}

                    <div className="w-full max-w-md mx-auto p-4">
                        {Object.entries(updatedCollectionList).map(([category, items]) => (
                            <div key={category} className="mb-2 border rounded-lg overflow-hidden">
                                {/* Category header */}
                                <button
                                    className="w-full flex justify-between items-center py-3 px-2 bg-[#fff6eb]"
                                    onClick={() => toggleCategory(category)}
                                >
                                    <span className="font-serif text-gray-800 text-[15px] sm:text-[16px] pr-2">{category}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${openCategory === category ? "rotate-180" : ""
                                            }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {/* Collapsible content */}
                                {openCategory === category && (
                                    <div className="grid grid-cols-2 gap-3 p-3 bg-white">
                                        {items.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={{
                                                    pathname: "/collection_products",
                                                    query: { category: item.collection, id: item.collectionId }, // pass subcategory as query param
                                                }}
                                                className="flex flex-col items-center text-center cursor-pointer"
                                                onClick={() => setTimeout(() => {
                                                    setIsOpen(false)
                                                }, 300)}
                                            >
                                                <div className="w-16 h-16 relative">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.collection}
                                                        width={64} // matches Tailwind w-16
                                                        height={64} // matches Tailwind h-16
                                                        className="rounded-full border object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <span className="mt-1 text-sm text-gray-700">
                                                    {item.collection}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`flex flex-col items-center justify-center h-[96px] w-full sm:w-64`}>
                    {/* Google Login */}
                    <div className={`flex w-full h-[8vh] items-center justify-center text-center text-gray-600 bg-white hover:bg-gray-100 px-4 py-2 cursor-pointer`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-gray-700 mb-[3px]" viewBox="0 0 640 640"><path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" /></svg>
                        <Link
                            href={"/track_order"}
                            className="leading-tight"
                            onClick={() => {
                                setTimeout(() => {
                                    setIsOpen(false)
                                }, 300)
                            }}
                        >
                            Track Your Order
                        </Link>
                    </div>
                    <div className='flex w-full h-full justify-center items-center bg-gray-800'>
                        {user == null ?
                            <div className="flex max-w-xs cursor-pointer">
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={() => setError("Google login failed")}
                                />
                            </div>
                            :
                            <p className="flex text-black text-center items-center font-serif justify-center gap-2 py-1 px-6  rounded-sm bg-white cursor-default" onClick={handleLogout}>
                                <span><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 text-black" viewBox="0 0 640 640"><path d="M352 64C352 46.3 337.7 32 320 32C302.3 32 288 46.3 288 64L288 320C288 337.7 302.3 352 320 352C337.7 352 352 337.7 352 320L352 64zM210.3 162.4C224.8 152.3 228.3 132.3 218.2 117.8C208.1 103.3 188.1 99.8 173.6 109.9C107.4 156.1 64 233 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 233 532.6 156.1 466.3 109.9C451.8 99.8 431.9 103.3 421.7 117.8C411.5 132.3 415.1 152.2 429.6 162.4C479.4 197.2 511.9 254.8 511.9 320C511.9 426 425.9 512 319.9 512C213.9 512 128 426 128 320C128 254.8 160.5 197.1 210.3 162.4z" /></svg></span><span>Logout</span>
                            </p>
                        }
                    </div>
                </div>
            </div>

            {
                openLoginPopup &&
                <LoginPopup setOpenLoginPopup={setOpenLoginPopup} />
            }

        </aside>
    );
}
