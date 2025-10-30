"use client";

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';


const Profile = () => {

    const user = useSelector((state) => state.user?.data);
    const [userImg, setUserImg] = useState("/cat.png");
    const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const [newName, setNewName] = useState(user?.name || "");
    const [updatedName, setUpdatedName] = useState(user?.name || "XOXO")
    const [nameLoading, setNameLoading] = useState(false);

    useEffect(()=>{
        if(user?.name){
            setUpdatedName(user.name);
            setNewName(user.name);
        }
    },[user]);

  const handleSubmit = async () => {
    if (!newName.trim()) return toast.error("Name cannot be empty!");
    try {
      setNameLoading(true);
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/updateName/${user._id}`, { name: newName }, { withCredentials: true });
      toast.success("Profile name updated successfully!");
      setUpdatedName(newName);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update name");
    } finally {
      setNameLoading(false);
    }
  };

    function formatDate(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    useEffect(() => {
        if (user && user !== null) {
            setUserImg(user?.profile.avatarUrl);
            setLoading(false);
        }
    }, [user])


    if (!user || user === null) {
        return (
            <div className="min-h-screen flex flex-col gap-4 py-4 px-4 sm:px-8 lg:px-24">
                {/* Skeleton slides */}
                <div
                    className="w-full h-[120px] bg-gray-300 animate-pulse rounded-md"
                />

                <div className='grid grid-cols-2 gap-6'>
                    <div
                        className="w-full h-12 bg-gray-300 animate-pulse rounded-md"
                    />
                </div>

                <div className='grid grid-cols-2 gap-6'>
                    {[...Array(2)].map((_, idx) => (
                    <div
                        key={idx}
                        className="w-full h-[100px] bg-gray-300 animate-pulse rounded-md"
                    />
                ))}
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen flex flex-col gap-4 px-2 sm:px-8 lg:px-24 py-4 py-4'>

            {/* User Details Card */}
            <div className="relative flex flex-col gap-4 rounded-lg p-6 bg-gradient-to-r from-[#f6f6f6] to-[#fafafa]">
                <div className="flex items-center gap-4">
                    {loading && <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse" />}
                    <Image
                        src={userImg || "/cat.png"} // fallback image from public/
                        alt="User Avatar"
                        width={64} // matches Tailwind's w-16
                        height={64}
                        className={`rounded-full border ${loading ? "hidden" : "block"} object-cover`}
                    />
                    <div>
                        <h2 className="text-lg font-semibold">{updatedName}</h2>
                        <p className="text-gray-700 text-sm sm:text-md flex flex-wrap">
                            <span>{user?.email.split("@")[0]}</span>
                            <span>@gmail.com</span>
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                            Joined: {formatDate(user?.createdAt)}
                        </p>
                    </div>
                </div>
                <div className="absolute -top-2 right-2">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-4 p-1 bg-indigo-600 text-sm text-white rounded hover:bg-indigo-700"
                    >
                        <svg className="w-4 h-4 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] sm:w-[400px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Change Profile Name
            </h2>

            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border w-full p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter new name"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={nameLoading}  
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
              >
                {nameLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

            <div className='flex flex-col gap-4 sm:grid md:grid-cols-2'>
                {(user?.role === "admin") && <div className="flex flex-col gap-4 px-2">
                    <h2 className='text-xl sm:text-2xl font-semibold font-serif'>
                        Admin Section:
                    </h2>
                    <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-6 px-4 text-sm'>
                        <Link href={"/shipping_orders"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/cargo_3045670.png"}
                                alt="Shipping Orders"
                                width={48}
                                height={48}
                            />
                            Shipping <br />Orders
                        </Link>
                        <Link href={"/handle_products"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/product_9504576.png"}
                                alt="Product Icon"
                                width={48}
                                height={48}
                            />
                            Handle <br />Products
                        </Link>
                        <Link href={"/handle_collections"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/folder_444886.png"}
                                alt="Collection Icon"
                                width={48}
                                height={48}
                            />
                            Handle <br />Collections
                        </Link>

                        <Link href={"/handle_categories"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/application_9710836.png"}
                                alt="Categories Icon"
                                width={48}
                                height={48}
                            />
                            Handle <br />Categories
                        </Link>
                        <Link href={"/handle_slider"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/slides_8491233.png"}
                                alt="Slides Icon"
                                width={48}
                                height={48}
                            />
                            Handle <br />Slider
                        </Link>
                    </div>
                </div>}

                <div className="flex flex-col gap-4 px-2">
                    <h2 className='text-xl sm:text-2xl font-semibold font-serif'>
                        User Section:
                    </h2>
                    <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-6 px-4 text-sm'>
                        <Link href={"/user_orders"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/free-shipping_18293534.png"}
                                alt="Orders Icon"
                                width={48}
                                height={48}
                            />
                            Orders
                        </Link>
                        {/* <Link href={"/user_wishlist"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/wishlist_12894029.png"}
                                alt="Wishlist Icon"
                                width={48}
                                height={48}
                            />
                            Wishlist
                        </Link> */}
                        <Link href={"/user_address"} className='flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-gradient-to-r from-[#f6f6f6] to-[#fafafa] min-w-30'>
                            <Image
                                src={"/location_icon.png"}
                                alt="Location Icon"
                                width={48}
                                height={48}
                            />
                            Address
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;