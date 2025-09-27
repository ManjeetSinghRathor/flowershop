"use client";

// import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { GoogleLogin } from '@react-oauth/google';
// import { useSelector, useDispatch } from "react-redux";
import { updatedCollectionList } from "@/public/products";
import Link from "next/link";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // ✅ react-icons


export default function Overlays({ setIsOpen, isOpen = false }) {
    const menuRef = useRef(null);
    const swipeRef = useRef(null);
    const [categoryLoaded, setCategoryLoaded] = useState({});    

    const handleGoogleLogin = async (response) => {
        try {
            const { credential } = response;
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-login`, { token: credential }, { withCredentials: true });

            if (res.data.success) {
                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, { withCredentials: true });
                // dispatch(setUser({ user: userRes.data }));

                // if (!userRes.data?.status?.isSuspended) {
                //     router.push("/profile");
                // }
            }

        } catch (err) {
            console.error("Google login failed", err);
        }
    };


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

        if (diff > 50) {
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

    return (
        <aside
            className={`
          fixed top-0 left-0 z-[1000] w-full h-full bg-[rgba(0,0,0,0.95)] text-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto overscroll-contain
        `}
            ref={swipeRef}
        >
            <div className="flex flex-col h-full grow justify-between w-56 sm:w-64 bg-white" ref={menuRef}>
                <div className="flex w-56 sm:w-64 bg-white overflow-y-auto">
                    <div className="w-full max-w-md mx-auto p-4">
                        {Object.entries(updatedCollectionList).map(([category, items]) => (
                            <div key={category} className="mb-2 border rounded-lg overflow-hidden">
                                {/* Category header */}
                                <button
                                    className="w-full flex justify-between items-center py-3 px-2 bg-gray-100 hover:bg-gray-200"
                                    onClick={() => toggleCategory(category)}
                                >
                                    <span className="font-serif text-gray-800 text-[15px] sm:text-[18px]">{category}</span>
                                    {openCategory === category ? (
                                        <FaChevronUp className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <FaChevronDown className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>

                                {/* Collapsible content */}
                                {openCategory === category && (
                                    <div className="grid grid-cols-2 gap-3 p-3 bg-white">
                                        {items.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={{
                                                    pathname: "/collection_products",
                                                    query: { category: item.collection }, // pass subcategory as query param
                                                }}
                                                className="flex flex-col items-center text-center cursor-pointer"
                                                onClick={() => setTimeout(()=>{
                                                    setIsOpen(false)
                                                },300)}
                                            >
                                                <div className="w-16 h-16 relative">
                                                    {/* Skeleton */}
                                                    {!categoryLoaded[item.id] && (
                                                        <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
                                                    )}

                                                    <img
                                                        src={item.image}
                                                        alt={item.collection}
                                                        className={`w-16 h-16 rounded-full border object-cover ${categoryLoaded[item.id] ? "block" : "hidden"}`}
                                                        onLoad={() => setCategoryLoaded(prev => ({ ...prev, [item.id]: true }))}
                                                        onError={() => setCategoryLoaded(prev => ({ ...prev, [item.id]: true }))}
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

                <div className="flex flex-col items-center justify-center h-[85px] w-56 sm:w-64">
                    {/* Google Login */}
                    <div className="flex w-full h-[8vh] items-center justify-center text-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-gray-700 mb-[3px]" viewBox="0 0 640 640"><path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>
                        <Link 
                        href={"/track_order"} 
                        className="leading-tight" 
                        onClick={()=>{
                            setTimeout(()=>{
                                setIsOpen(false)
                            },300)
                        }}
                        >
                            Track Your Order
                        </Link>
                    </div>
                    <div className='flex w-full h-full justify-center items-center bg-gray-800'>
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setError("Google login failed")}
                        />
                    </div>
                </div>
            </div>

        </aside>
    );
}
