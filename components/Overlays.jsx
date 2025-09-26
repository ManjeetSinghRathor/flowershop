"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";

export default function Overlays({ setIsOpen, isOpen = false }) {
    // const user = useSelector((state) => state.user);
    const menuRef = useRef(null);

    // const menuLinks = useMemo(() => {
    //     const baseLinks = [
    //         { href: "/profile", label: "My Profile" },
    //         { href: "/quiz", label: "Quizzes" },
    //         { href: "/notes", label: "Notes" },
    //         { href: "/practice", label: "Practice" },
    //         { href: "/lectures", label: "Lectures" },
    //         { href: "/reports", label: "Reports" },
    //         { href: "/about", label: "About" },
    //         { href: "/contact", label: "Contact" },
    //         { href: "/", label: "Home" },
    //     ];

    //     if (!user.data) return baseLinks;

    //     const extraLinks = [];

    //     if (user?.data?.role === "admin") {
    //         extraLinks.push(
    //             { href: "/addQuiz", label: "Add Quiz" }
    //         );
    //         extraLinks.push({ href: "/contentAccess", label: "Handle Content" });
    //         extraLinks.push(
    //             { href: "/userAccess", label: "All Users" }
    //         );
    //     }

    //     return [...baseLinks, ...extraLinks];
    // }, [user]);

    // const pathname = usePathname();
    // const isActive = (href) => pathname === href;

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
    const menuEl = menuRef.current;
    if (!menuEl) return;

    menuEl.addEventListener("touchstart", handleTouchStart);
    menuEl.addEventListener("touchend", handleTouchEnd);

    return () => {
      menuEl.removeEventListener("touchstart", handleTouchStart);
      menuEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);


    return (
        <aside
            className={`
          fixed top-0 left-0 z-[1000] h-screen w-full bg-[rgba(0,0,0,0.5)] text-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:hidden overflow-y-auto overscroll-contain
        `}
        >
            <div className="flex h-full w-56 bg-white" ref={menuRef}>

            </div>
            {/* <div className="logo-spot flex flex-col gap-2 w-full h-[100px] items-center justify-center pt-6">
                <h2 className="rounded-[100%] bg-white text-white">
                    <img
                        src={`${user?.data?.profile?.avatarUrl || "/cat.png"}`}
                        alt="GM"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </h2>
                {!user ? <h3 className="text-white">xoxo</h3> : <h3 className="text-white">{user?.data?.name}</h3>}
            </div> */}

            {/* <nav className="flex flex-col gap-4 px-2 pt-6 pb-20">
                {menuLinks.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`block px-4 py-2 rounded-md hover:bg-[rgba(255,255,255,0.1)] ${isActive(href) ? "bg-[rgba(255,255,255,0.1)]" : ""
                            }`}
                        onClick={() => setIsOpen(false)}
                    >
                        {label}
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                    Logout
                </button>

            </nav> */}

        </aside>
    );
}
