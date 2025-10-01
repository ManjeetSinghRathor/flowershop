"use client";

import React, { useEffect, useRef } from 'react'
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";


const LoginPopup = ({ setOpenLoginPopup }) => {

    // const user = useSelector((state)=> state?.user?.data);
    const dispatch = useDispatch();
    const router = useRouter();
    const modalRef = useRef(null);

    // Close on outside click
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            setOpenLoginPopup(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

    const handleGoogleLogin = async (response) => {
        try {
            const { credential } = response;
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-login`, { token: credential }, { withCredentials: true });

            if (res.data.success) {

                toast.success(res.data.message);

                const userRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, { withCredentials: true });

                if (userRes?.data?.success) {

                    dispatch(setUser(userRes?.data));
                    // setIsOpen(false);

                    const userData = userRes.data.data; // <-- the actual user object

                    // Convert backend cart to Redux format, if cart exists
                    const formattedCart = userData?.cart?.map((item) => ({
                        id: item.productId,
                        q: item.quantity,
                        sizeIdx: item.sizeIdx,
                        deliveryTime: item.deliveryTime
                    })) || [];

                    // Update Redux
                    dispatch(setCart(formattedCart));

                    router.push("/profile");
                }
            }
        } catch (err) {
            console.error("Google login failed", err);
        }
    };

    return (
        <div className='fixed top-0 left-0 z-[600] flex h-screen w-full items-center justify-center bg-[rgba(0,0,0,0.65)]'>
            
            <div ref={modalRef} className='flex flex-col relative items-center gap-4 bg-[#141C2E] pt-10 px-6 rounded-sm min-h-[40vh]'>

                <div className='absolute top-1 right-1' onClick={()=>setOpenLoginPopup(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white"
                        fill="currentColor" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                </div>

                <h1 className="flex items-center gap-1 sm:min-w-[285px] px-2 py-1 border border-[#2751ab] rounded-full">
                    <Image
                        src="/favicon.png"
                        alt="BsH"
                        width="auto"
                        height={36}
                        priority
                    />
                </h1>

                <div className='flex flex-col grow items-center justify-center gap-4'>
                    <h2 className='flex text-lg text-center'>
                        Sign up to your account
                    </h2>

                    {/* Google Login */}
                    <div className='flex w-full justify-center'>
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setError("Google login failed")}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LoginPopup;