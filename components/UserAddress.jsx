"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUserAddresses } from '@/app/store/userSlice';


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

const UserAddress = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.data);
  const [userAdd, setUserAdd] = useState([]);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const addRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [adrId, setAdrId] = useState("");


  const [Address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "Bangalore",
    state: "Karnataka",
    postalCode: "",
    country: "India",
    paymentMethod: "UPI",
  });

  const handleChange = (e) => {
    setAddress({ ...Address, [e.target.name]: e.target.value });
  };

  const handleChangePhone = (value) => {
    // Remove all non-numeric characters
    const cleanedValue = value.replace(/\D/g, "");

    // Restrict to max 10 digits
    if (cleanedValue.length <= 10) {
      setAddress({ ...Address, phone: cleanedValue });

      // Check if exactly 10 digits for valid phone
      if (cleanedValue.length === 10) {
        setIsPhoneValid(true);
      } else {
        setIsPhoneValid(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setUserAdd(user?.addresses);
      setAddress((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user])

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(Address.postalCode || "");
  const [isInvalid, setIsInvalid] = useState(false);
  const dropdownRef = useRef(null);
  const [collapsed, setCollapsed] = useState(true);
  const editRef = useRef(null);

  const options = deliveryOptions.postalCodes[Address.city] || [];
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
      setAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
      e.target.blur(); // remove focus
    }
  };

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = collapsed ? original : "hidden";
    return () => (document.body.style.overflow = original);
  }, [collapsed]);

  const handleSetDefault = async (addressId) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/address/${addressId}/default`,
        {},
        { withCredentials: true }
      );
      setUserAdd(res.data.addresses);      
      dispatch(setUserAddresses(res.data.addresses));
      toast.success(res.data.message || "Default address set successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set default address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/address/${addressId}`,
        { withCredentials: true }
      );
      setUserAdd(res.data.addresses);
      dispatch(setUserAddresses(res.data.addresses));
      toast.success(res.data.message || "Address deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete address");
    }
  };

  const saveEditAddress = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/address/${adrId}`,
        Address, // state object with updated address fields
        { withCredentials: true }
      );

      toast.success(res.data.message || "Address updated successfully");
      setUserAdd(res.data.addresses);
      dispatch(setUserAddresses(res.data.addresses));
      setCollapsed(true); // close edit form/modal if you have one
      setAddress((pre) => ({
                ...pre,
                phone: "",
                street: "",
                city: "Bangalore",
                state: "Karnataka",
                postalCode: "",
                country: "India",
                paymentMethod: "UPI",
              }))
      setSearch("");
    } catch (err) {
      console.error("Failed to update address:", err);
      toast.error(err.response?.data?.message || "Failed to update address");
    }
  };


  const handleEditAddress = (address) => {
    setAdrId(address._id)
    setAddress(address);
    setSearch(address.postalCode);
    editRef.current = true;
    setCollapsed(false); // open your modal form prefilled
  };

  const handleAddAddress = async () => {
    if (search !== "" && !options.includes(search)) {
      setIsInvalid(true); // show red shadow
      setSearch(""); // revert to previous valid value
      toast("❌ Invalid postal code", {
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

    if (
      !Address.fullName ||
      !Address.phone ||
      !Address.street ||
      !Address.city ||
      !Address.state ||
      !Address.postalCode ||
      (!user && !Address.email)
    ) {
      toast("❌ Add Shipping Details", {
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
    } else {
      setIsInvalid(false);
    }

    setLoading(true);
    try {
      // Send POST request to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/address`,
        Address,
        {
          withCredentials: true
        }
      );

      if (res.status === 201) {
        toast.success("Address added successfully!");
        setCollapsed(true); // close popup if applicable
        setAddress((pre) => ({
                ...pre,
                phone: "",
                street: "",
                city: "Bangalore",
                state: "Karnataka",
                postalCode: "",
                country: "India",
                paymentMethod: "UPI",
              }));
        setSearch("");
        // Optionally refresh address list
        setUserAdd(res.data.addresses);
        dispatch(setUserAddresses(res.data.addresses));
      }
    } catch (err) {
      console.error("Add address error:", err);
      toast.error(
        err.response?.data?.message || "❌ Failed to add address. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col w-full'>
      <div
        className="flex justify-between items-center cursor-pointer py-4 px-4 sm:px-8 lg:px-24 border-t border-b border-gray-400 bg-white"
        onClick={() => {
          editRef.current = false;
          setCollapsed(!collapsed)
        }}
      >
        <h2 className="font-mono text-xl">User Addresses</h2>
        <span className="text-2xl font-bold">
          {collapsed ? "+" : "-"}
        </span>
      </div>

      {(!collapsed) &&
        <div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex flex-col items-center justify-center px-2 sm:px-8 lg:px-24 z-[60]'>
          <div className='flex w-full items-center justify-between text-center bg-white py-4 px-2 sm:p-6' ref={addRef}>
            <h2 className='font-mono text-xl'>Add New Address</h2>
            <p className='flex cursor-default' onClick={() => {
              setCollapsed(true)
              setAddress((pre) => ({
                ...pre,
                phone: "",
                street: "",
                city: "Bangalore",
                state: "Karnataka",
                postalCode: "",
                country: "India",
                paymentMethod: "UPI",
              }))
            setSearch("");
            }}>❌</p>
          </div>
          <div className='flex flex-col w-full h-[78vh] sm:h-[50vh] overflow-auto bg-white'>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 sm:px-8 lg:px-24 py-4">
              <input
                name="fullName"
                value={Address.fullName}
                onChange={handleChange}
                onKeyDown={handleEnterSave} // <-- here
                placeholder="Full Name"
                className="border p-2 rounded"
              />
              <input
                name="phone"
                value={Address.phone}
                onChange={(e) => handleChangePhone(e.target.value)}
                onKeyDown={handleEnterSave}
                placeholder="Phone Number"
                inputMode="numeric"
                maxLength={10}
                className={`border p-2 rounded transition-all duration-200 ${Address.phone && Address.phone.length !== 10 ? "ring-2 ring-red-400" : ""
                  }`}
              />

              <input
                name="street"
                value={Address.street}
                onChange={handleChange}
                onKeyDown={handleEnterSave} // <-- here
                placeholder="Street Address"
                className="border p-2 rounded sm:col-span-2"
              />

              <select
                name="country"
                value={Address.country}
                onChange={(e) => {
                  const country = e.target.value;
                  setAddress({
                    ...Address,
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
                value={Address.state}
                onChange={(e) => {
                  const state = e.target.value;
                  setAddress({
                    ...Address,
                    state,
                    city: "",
                    postalCode: "",
                  });
                }}
                disabled={!Address.country}
                className={`border p-2 rounded w-full transition-all duration-200 ${!Address.country
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:border-gray-400"
                  }`}
              >
                <option value="">Select State</option>
                {deliveryOptions.states[Address.country]?.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              {/* City */}
              <select
                name="city"
                value={Address.city}
                onChange={(e) => {
                  const city = e.target.value;
                  setAddress({
                    ...Address,
                    city,
                    postalCode: "",
                  });
                }}
                disabled={!Address.state}
                className={`border p-2 rounded w-full transition-all duration-200 ${!Address.state
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:border-gray-400"
                  }`}
              >
                <option value="">Select City</option>
                {deliveryOptions.cities[Address.state]?.map((city) => (
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
                  disabled={!Address.city}
                  placeholder={!Address.city ? "Select City first" : "Select Postal Code"}
                  className={`border p-2 rounded w-full transition-all duration-200 ${!Address.city
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-800 hover:border-gray-400"
                    } ${isInvalid ? "ring-2 ring-red-400" : ""}`}
                />

                {isOpen && Address.city && filteredOptions.length > 0 && (
                  <ul className="absolute z-10 mt-1 max-h-28 w-full overflow-y-auto rounded border bg-white shadow-lg">
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
            <div className='flex w-full justify-center py-2'>
              {/* Submit */}
              <button
                disabled={loading}
                onClick={() => {
                  if (editRef.current) {
                    saveEditAddress()
                  } else {
                    handleAddAddress()
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
              >
                {editRef.current ? "Save Address" : "+Add Address"}
              </button>
            </div>
          </div>
        </div>
      }

      {userAdd?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 sm:px-8 lg:px-24 py-4">
          {userAdd.map((addr, idx) => (
            <div
              key={idx}
              className={`relative border-1 rounded-lg p-4 gap-1 bg-[#fefefe] cursor-pointer transition-all duration-200 ${addr.isDefault
                ? "border-blue-500 shadow-md"
                : "border-gray-300 hover:border-gray-400"
                }`}
              onClick={() => console.log("click")}
            >
              {addr?.isDefault && (
                <span className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-[2px] rounded">
                  Default
                </span>
              )}
              <p className="font-semibold text-gray-800">{addr.fullName}</p>
              <p className="text-sm text-gray-600">📞 {addr.phone}</p>
              <p className="text-sm text-gray-700">
                {addr.street},
              </p>
              <p className="text-sm text-gray-700">
                {addr.city}({addr.postalCode}),
              </p>
              <p className="text-sm text-gray-700">
                {addr.state}, {addr.country}
              </p>

              <div className="flex gap-2 mt-3">
                {!addr.isDefault && (
                  <button
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(addr._id);
                    }}
                    className="text-xs border border-blue-500 text-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white transition-all"
                  >
                    Set Default
                  </button>
                )}

                <button
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(addr);
                  }}
                  className="text-xs border border-gray-400 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-all"
                >
                  Edit
                </button>

                <button
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(addr._id);
                  }}
                  className="text-xs border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

          <div onClick={() => {
            editRef.current = false;
            setCollapsed(false)
          }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center cursor-default">
            <svg
              fill='currentColor'
              className='w-12 h-12 text-gray-400'
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
            </svg>

            <p className="text-gray-500 mb-3">Add address</p>

          </div>

        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 sm:px-8 lg:px-24'>

          <div onClick={() => {
            editRef.current = false;
            setCollapsed(false)
          }}
            className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center cursor-default">
            <svg
              fill='currentColor'
              className='w-12 h-12 text-gray-400'
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z" />
            </svg>

            <p className="text-gray-500 mb-3">Add address</p>

          </div>

        </div>

      )}
    </div>
  )
}

export default UserAddress;