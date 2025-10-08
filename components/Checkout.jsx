"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setCart } from "@/app/store/CartProductsSlice";
import Image from "next/image";
// deliveryOptions.js

const deliveryOptions = {
    countries: ["India"],

    states: {
        India: ["Karnataka"],
    },

    cities: {
        Karnataka: ["Bangalore"],
        Maharashtra: ["Mumbai", "Pune"],
        Telangana: ["Hyderabad"],
    },

    postalCodes: {
        Bangalore: [
            "560001", "560002", "560003", "560004", "560005", "560008",
            "560010", "560017", "560020", "560025", "560034", "560043",
            "560068", "560076", "560078",
        ],

        Mumbai: [
            "400001", "400002", "400003", "400004", "400005", "400006",
            "400007", "400008", "400009", "400010", "400011", "400012",
            "400013", "400014", "400015", "400016", "400017",
        ],

        Pune: [
            "411001", "411002", "411003", "411004", "411005", "411006",
            "411007", "411008", "411009", "411010", "411011", "411012",
            "411013", "411014", "411015", "411016", "411017",
        ],

        Hyderabad: [
            "500001", "500002", "500003", "500004", "500005", "500006",
            "500007", "500008", "500009", "500010", "500011", "500012",
            "500013", "500014", "500015", "500016", "500017",
        ],
    },
};



export default function CheckoutPage() {
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        street: "",
        city: "Bangalore",
        state: "Karnataka",
        postalCode: "",
        country: "India",
        paymentMethod: "UPI",
    });

    const dispatch = useDispatch();
    const router = useRouter();
    const searchParam = useSearchParams();
    const productId = searchParam.get("product_id");
    const deliveryTime = searchParam.get("delivery_time");
    const [collapsed, setCollapsed] = useState(true);

    const [userAdd, setUserAdd] = useState({});

    // ✅ Fetch cart products from Redux
    const cartProducts = useSelector((state) => state.CartProducts);

    // ✅ Conditionally set cart_product_ids
    const cart_product_ids = (productId && deliveryTime) ? [{ id: productId, q: 1, sizeIdx: 0, deliveryTime: deliveryTime }] : cartProducts;

    const user = useSelector((state) => state?.user?.data);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                fullName: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            }));

            if (user.addresses?.length > 0) {
                // Find the default address, or fallback to first address
                const defaultAddress =
                    user.addresses.find((add) => add.isDefault) || user.addresses[0];

                setUserAdd(defaultAddress);

                // Optionally also prefill the form
                setForm((prev) => ({
                    ...prev,
                    fullName: defaultAddress.fullName || prev.fullName,
                    phone: defaultAddress.phone || prev.phone,
                    street: defaultAddress.street || "",
                    city: defaultAddress.city || "",
                    state: defaultAddress.state || "",
                    postalCode: defaultAddress.postalCode || "",
                    country: defaultAddress.country || "India",
                }));

                setSearch(defaultAddress.postalCode);
            } else {
                setCollapsed(false);
            }
        } else {
            setCollapsed(false);
        }
    }, [user]);


    const fetchLocalCart = async () => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/cart/local`,
                { cart: cart_product_ids }
            );
            if (res.data.success) {
                setCartItems(res.data.cart_products);
            }
        } catch (error) {
            console.error("Error fetching local cart:", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchLocalCart();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleChangeEmail = (e) => {
        const value = e.target.value;
        setForm({ ...form, email: value });

        // Simple regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(value) || value === "") {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    };

    const handleChangePhone = (value) => {
        // Remove all non-numeric characters
        const cleanedValue = value.replace(/\D/g, "");

        // Restrict to max 10 digits
        if (cleanedValue.length <= 10) {
            setForm({ ...form, phone: cleanedValue });

            // Check if exactly 10 digits for valid phone
            if (cleanedValue.length === 10) {
                setIsPhoneValid(true);
            } else {
                setIsPhoneValid(false);
            }
        }
    };

    const calculateTotals = () => {
        const subtotal = cartItems.reduce(
            (acc, item) => acc + item?.sizes[item.sizeIdx]?.finalPrice * item.quantity,
            0
        );
        const discount = cartItems.reduce(
            (acc, item) => acc + (item?.sizes[item.sizeIdx]?.price - item?.sizes[item.sizeIdx]?.finalPrice) * item.quantity,
            0
        );
        const shippingFee = subtotal > 999 ? 0 : 49;
        const total = subtotal + shippingFee;
        return { subtotal, shippingFee, total, discount };
    };

    const { subtotal, shippingFee, total, discount } = calculateTotals();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handlePlaceOrder = async () => {
        // ------------------- VALIDATIONS -------------------
        if (search !== "" && !options.includes(search)) {
            setIsInvalid(true);
            setSearch("");
            toast("❌ Invalid postal code", {
                style: {
                    border: "1px solid #f87171",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    padding: "5px 15px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                },
            });
            return;
        }

        if (
            !form.fullName ||
            !form.phone ||
            !form.street ||
            !form.city ||
            !form.state ||
            !form.postalCode ||
            (!user && !form.email)
        ) {
            toast("❌ Add Shipping Details", {
                style: {
                    border: "1px solid #f87171",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    padding: "5px 15px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                },
            });
            return;
        }

        if (!isPhoneValid) {
            toast("❌ Invalid phone number", {
                style: {
                    border: "1px solid #f87171",  // red border
                    background: "#fee2e2",         // light red background
                    color: "#b91c1c",              // dark red text
                    padding: "5px 15px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                },
            });
            return;
        } else if (!isEmailValid) {
            toast("❌ Invalid email", {
                style: {
                    border: "1px solid #f87171",  // red border
                    background: "#fee2e2",         // light red background
                    color: "#b91c1c",              // dark red text
                    padding: "5px 15px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                },
            });
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setLoading(true);
        try {
            // ------------------- COMMON PAYLOAD -------------------
            const payload = {
                ...(user ? { user: user._id } : { email: form.email }),
                items: cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                    sizeIdx: item.sizeIdx,
                    deliveryTime: item.delivery_time,
                })),
                shippingAddress: {
                    fullName: form.fullName,
                    phone: form.phone,
                    street: form.street,
                    city: form.city,
                    state: form.state,
                    postalCode: form.postalCode,
                    country: form.country,
                },
                paymentMethod: form.paymentMethod,
                subtotal,
                shippingFee,
                totalAmount: total,
                discount,
            };

            // ------------------- IF PAYMENT METHOD = COD -------------------
            if (form.paymentMethod === "COD") {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/add`,
                    payload,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    toast.success("Order placed successfully!");
                    localStorage.removeItem("cart");
                    dispatch(setCart([]));
                    router.replace("/");
                } else {
                    toast.error(res.data.message || "Failed to place order");
                }

                return;
            }

            // ------------------- IF PAYMENT METHOD = ONLINE -------------------
            // 1️⃣ Create Razorpay order on backend
            const orderRes = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/create-razorpay-order`,
                { totalAmount: total },
                { withCredentials: true }
            );

            const razorOrder = orderRes.data.order;

            // 2️⃣ Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: razorOrder.amount,
                currency: "INR",
                name: "Bloom's Heaven",
                description: "Order Payment",
                image: "/favicon.png",
                order_id: razorOrder.id,
                handler: async function (response) {
                    try {
                        // 3️⃣ Verify payment on backend
                        const verifyRes = await axios.post(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/verify-razorpay-payment`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderData: payload,
                            },
                            { withCredentials: true }
                        );

                        if (verifyRes.data.success) {
                            toast.success("Payment successful! 🎉");
                            localStorage.removeItem("cart");
                            dispatch(setCart([]));
                            router.replace("/orders");
                        } else {
                            toast.error("Payment verification failed!");
                        }
                    } catch (err) {
                        console.error("Payment verification failed:", err);
                        toast.error("Error verifying payment");
                    }
                },
                prefill: {
                    name: form.fullName,
                    email: form.email,
                    contact: form.phone,
                },
                theme: { color: "#16a34a" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Error placing order:", err);
            toast.error("Something went wrong during checkout");
        } finally {
            setLoading(false);
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState(form.postalCode || "");
    const [isInvalid, setIsInvalid] = useState(false);
    const dropdownRef = useRef(null);

    const options = deliveryOptions.postalCodes[form.city] || [];
    const filteredOptions = options.filter((code) =>
        code.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (code) => {
        handleChange({ target: { name: "postalCode", value: code } });
        setSearch(code);
        setIsInvalid(false); // reset invalid state
        setIsOpen(false);
    };

    const handleBlur = () => {
        if (!options.includes(search)) {
            setIsInvalid(true); // show red shadow
            setSearch(""); // revert to previous valid value
        } else {
            setIsInvalid(false);
        }
        setIsOpen(false);
    };

    const handleEnterSave = (e) => {
        if (e.key === "Enter") {
            const { name, value } = e.target;
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
            e.target.blur(); // remove focus
        }
    };


    return (
        <div className="min-h-[80vh] bg-gray-50 pb-16 relative">
            {/* Breadcrumb */}
            <div className="flex flex-col w-full bg-white sticky top-14 z-[45] shadow-md sm:px-8 lg:px-24">
                <h1 className="flex w-full justify-start items-center font-mono sm:text-lg px-2 py-4">
                    <Link href="/" className="hover:underline font-light">
                        Home
                    </Link>
                    <span className="mx-1">{">"}</span>
                    <span className="font-medium">Checkout</span>
                </h1>
            </div>

            {/* Main layout */}
            <div className="px-2 sm:px-8 lg:px-24 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left - Form */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div
                        onClick={() => {
                            if (Object.entries(userAdd).length > 0)
                                setCollapsed(true)
                        }}
                        className="flex justify-between items-center cursor-pointer mb-4"
                    >
                        <h2 className="font-mono text-xl">Shipping Details</h2>
                        <span className="text-xl font-bold">
                            {collapsed ? "+" : "--"}
                        </span>
                    </div>

                    {(!collapsed) ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            onKeyDown={handleEnterSave} // <-- here
                            placeholder="Full Name"
                            className="border p-2 rounded"
                        />
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={(e) => handleChangePhone(e.target.value)}
                            onKeyDown={handleEnterSave}
                            placeholder="Phone Number"
                            inputMode="numeric"
                            maxLength={10}
                            className={`border p-2 rounded transition-all duration-200 ${form.phone && form.phone.length !== 10 ? "ring-2 ring-red-400" : ""
                                }`}
                        />



                        {/* Show email for guest users only */}
                        {!user && (
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChangeEmail}
                                onKeyDown={handleEnterSave} // <-- here
                                placeholder="Email Address"
                                className={`border p-2 rounded sm:col-span-2 transition-all duration-200 ${!isEmailValid ? "ring-2 ring-red-500" : ""
                                    }`}
                            />
                        )}

                        <input
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            onKeyDown={handleEnterSave} // <-- here
                            placeholder="Street Address"
                            className="border p-2 rounded sm:col-span-2"
                        />
                        <select
                            name="country"
                            value={form.country}
                            onChange={(e) => {
                                const country = e.target.value;
                                setForm({
                                    ...form,
                                    country,
                                    state: "",
                                    city: "",
                                    postalCode: "",
                                });
                            }}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Country</option>
                            {deliveryOptions.countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>

                        {/* State */}
                        <select
                            name="state"
                            value={form.state}
                            onChange={(e) => {
                                const state = e.target.value;
                                setForm({
                                    ...form,
                                    state,
                                    city: "",
                                    postalCode: "",
                                });
                            }}
                            disabled={!form.country}
                            className={`border p-2 rounded w-full transition-all duration-200 ${!form.country
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-800 hover:border-gray-400"
                                }`}
                        >
                            <option value="">Select State</option>
                            {deliveryOptions.states[form.country]?.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>

                        {/* City */}
                        <select
                            name="city"
                            value={form.city}
                            onChange={(e) => {
                                const city = e.target.value;
                                setForm({
                                    ...form,
                                    city,
                                    postalCode: "",
                                });
                            }}
                            disabled={!form.state}
                            className={`border p-2 rounded w-full transition-all duration-200 ${!form.state
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-800 hover:border-gray-400"
                                }`}
                        >
                            <option value="">Select City</option>
                            {deliveryOptions.cities[form.state]?.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>

                        <div className="relative w-full" ref={dropdownRef}>
                            <input
                                type="text"
                                name="postalCode"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setIsOpen(true);
                                    setIsInvalid(false); // reset shadow while typing
                                }}
                                onFocus={() => setIsOpen(true)}
                                onBlur={handleBlur}
                                disabled={!form.city}
                                placeholder={!form.city ? "Select City first" : "Select Postal Code"}
                                className={`border p-2 rounded w-full transition-all duration-200 ${!form.city
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-800 hover:border-gray-400"
                                    } ${isInvalid ? "ring-2 ring-red-400" : ""}`}
                            />

                            {isOpen && form.city && filteredOptions.length > 0 && (
                                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded border bg-white shadow-lg">
                                    {filteredOptions.map((code) => (
                                        <li
                                            key={code}
                                            className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                            onMouseDown={() => handleSelect(code)} // register before blur
                                        >
                                            {code}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                        :
                        (Object.entries(userAdd).length > 0 &&
                            <div className="grid grid-cols-1 gap-4 px-2 py-2">
                                <div
                                    className={`relative border-1 rounded-lg p-4 gap-1 cursor-pointer transition-all duration-200 ${userAdd.isDefault
                                        ? "border-blue-500 shadow-md"
                                        : "border-gray-300 hover:border-gray-400"
                                        }`}
                                >
                                    <span onClick={() => setCollapsed(false)} className="absolute top-2 right-2 text-xs bg-blue-500 text-white p-1 rounded">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 text-white" viewBox="0 0 640 640"><path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z" /></svg>
                                    </span>
                                    <p className="font-semibold text-gray-800">{userAdd.fullName}</p>
                                    <p className="text-sm text-gray-600">📞 {userAdd.phone}</p>
                                    <p className="text-sm text-gray-700">
                                        {userAdd.street},
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {userAdd.city}({userAdd.postalCode}),
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {userAdd.state}, {userAdd.country}
                                    </p>

                                </div>
                            </div>)}

                    <h2 className="font-mono text-xl mt-8 mb-3">Payment Method</h2>
                    <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    >
                        {/* <option value="COD">Cash on Delivery</option> */}
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                        {/* <option value="NetBanking">Net Banking</option> */}
                        {/* <option value="Wallet">Wallet</option> */}
                    </select>
                </div>

                {/* Right - Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="font-mono text-xl mb-4">Order Summary</h2>
                    {fetching ?
                        <div className="flex flex-col justify-center gap-4 pt-2 px-2 sm:px-8 lg:px-24">
                            {/* Skeleton slides */}
                            {[...Array(2)].map((_, idx) => (
                                <div key={idx} className='flex gap-3 items-start'>
                                    <div
                                        className="w-20 h-20 bg-gray-300 animate-pulse rounded-md"
                                    />
                                    <div
                                        className="w-full h-[120px] bg-gray-300 animate-pulse rounded-md"
                                    />
                                </div>
                            ))}
                        </div> :
                        <div className="flex flex-col gap-3 mb-4 max-h-[300px] overflow-y-auto">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-3 border-b pb-2">
                                    <div className="relative w-16 h-16 rounded overflow-hidden">
                                        <Image
                                            src={item.images[0].imgUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1">
                                        <p className="font-semibold text-gray-700">{item.name}</p>
                                        <div className="flex flex-col sm:flex-row sm:gap-6 text-xs sm:text-sm gap-[2px]">
                                            <div>
                                                <p className="text-gray-800 font-[600]">Size</p>
                                                <p className="text-gray-600">{item.sizes[item.sizeIdx].sizeName}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-800 font-[600]">Delivery Time</p>
                                                <p className="text-gray-600">{item.delivery_time}</p>
                                            </div>
                                        </div>
                                        <div className="border-b border-t border-gray-100 my-1">
                                            <p className="text-gray-500 text-sm">
                                                Qty: {item.quantity} × ₹{item?.sizes[item.sizeIdx].finalPrice}
                                            </p>
                                            <p className="font-medium text-gray-800 text-sm">
                                                ₹{item?.sizes[item.sizeIdx].finalPrice * item.quantity}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>}

                    <div className="mt-4 text-gray-800 font-mono">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            {fetching ? <div
                                className="w-20 h-5 bg-gray-300 animate-pulse rounded-md"
                            /> : <span>₹{subtotal}</span>}
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            {fetching ? <div
                                className="w-16 h-5 bg-gray-300 animate-pulse rounded-md"
                            /> : <span>{shippingFee > 0 ? `₹${shippingFee}` : "Free"}</span>}
                        </div>
                        <hr className="my-3" />
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            {fetching ? <div
                                className="w-20 h-5 bg-gray-300 animate-pulse rounded-md"
                            /> : <span>₹{total}</span>}
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="mt-6 w-full bg-gray-900 text-white py-2 rounded font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}
