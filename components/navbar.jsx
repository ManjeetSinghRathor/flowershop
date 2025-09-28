"use client";

import React, { useState, useEffect, useRef } from "react";
import Overlays from './Overlays';
import SearchModal from "./SearchModal";
import Link from "next/link";
import { useSelector } from "react-redux";

const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [isSearchOpen, setIsSearchOpen] = useState(false);

      const saved_cart_products = useSelector((state)=>state.CartProducts);

    return (
        <div className="sticky top-0 z-50 bg-white">
            <div className="w-full h-14 bg-white shadow-md flex items-center justify-between px-2 sm:px-8 lg:px-24 py-4">
                <div className='flex'>
                    <button className='flex bg-none outline-none p-1 items-center justify-center' onClick={() => setIsOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="currentColor" viewBox="0 0 640 640"><path d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z" /></svg>
                    </button>
                    <button className='flex bg-none outline-none p-1 items-center justify-center' onClick={() => setIsSearchOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="currentColor" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>
                    </button>
                </div>
                <div className='flex justify-center grow flex-1 text-xl sm:text-2xl font-bold text-center'>
                    <h1 className="mr-5"><img className="h-10 w-auto" src="./favicon.png" alt="" /></h1>
                </div>
                <div>
                    <Link href={"/cart_products"} className='flex bg-none outline-none p-1 items-center justify-center relative'>
                        {(saved_cart_products && saved_cart_products.length > 0) && 
                        <p className="absolute top-[-2] right-[-2] w-[16px] h-[16px] bg-red-600 rounded-full flex justify-center items-center text-white"><span className="mt-[3px] text-[10px]">{saved_cart_products.reduce((sum, item) => sum + (item.q || 0),0)}</span></p>
                        }
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="currentColor" viewBox="0 0 640 640"><path d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 480 384 501.5 384 528C384 554.5 405.5 576 432 576z" /></svg>
                    </Link>
                </div>
            </div>

            <Overlays
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                // handleLogout={handleLogout}
            />

            <SearchModal 
                setIsSearchOpen={setIsSearchOpen}
                isSearchOpen={isSearchOpen}
            />
        </div>
    )
}

export default Navbar;