"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AddProduct } from "@/app/store/CartProductsSlice";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import FiltersSection from './FiltersSection';
import SortList from './SortByList';


const SearchProducts = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.data);

  const [products, setProducts] = useState([]);
  const [gridMenu, setGridMenu] = useState(true);
  const [sortValue, setSortValue] = useState("newest");
  const [openFilters, setOpenFilters] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  const [openSortBy, setOpenSortBy] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleSort = (val) => {
    setSortValue(val); // keep track of selected sort option

    // Get the source array: filteredProducts if any, otherwise all products
    const sourceArray = filteredProducts?.length ? [...filteredProducts] : [...products];

    let sortedArray = [];

    switch (val) {
      case "price_asc":
        sortedArray = sourceArray.sort((a, b) => {
          const aPrice = Math.min(...a.sizes.map((s) => s.finalPrice));
          const bPrice = Math.min(...b.sizes.map((s) => s.finalPrice));
          return aPrice - bPrice;
        });
        break;

      case "price_desc":
        sortedArray = sourceArray.sort((a, b) => {
          const aPrice = Math.min(...a.sizes.map((s) => s.finalPrice));
          const bPrice = Math.min(...b.sizes.map((s) => s.finalPrice));
          return bPrice - aPrice;
        });
        break;

      case "newest":
        sortedArray = sourceArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "oldest":
        sortedArray = sourceArray.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;

      case "az":
        sortedArray = sourceArray.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "za":
        sortedArray = sourceArray.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      default:
        sortedArray = sourceArray;
        break;
    }

    // Update filteredProducts if filters are applied, otherwise update collection_products display
    if (filteredProducts?.length) {
      setFilteredProducts([...sortedArray]);
    } else {
      setFilteredProducts([...sortedArray]); // still set filteredProducts so display uses this sorted list
    }
  };

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const observer = useRef();

  const handleAddToCart = async (id, deliveryTime) => {
    if (user) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/add-to-cart/${id}`,
          { deliveryTime },
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success("Item added to your cart");
          dispatch(AddProduct({ id, q: 1, deliveryTime }));
        }
      } catch {
        toast.error("Failed to add item to cart");
      }
    } else {
      dispatch(AddProduct({ id, q: 1, deliveryTime }));
      toast.success("Item added to cart (guest)");
    }
  };

  const fetchSearchProducts = useCallback(async () => {
    if (!query.trim() || !hasMoreRef.current || loadingRef.current) return;

    loadingRef.current = true;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/query/search-products?q=${encodeURIComponent(
          query
        )}&page=${pageRef.current}&limit=8`
      );

      if (res.data.success) {
        const newProducts = res.data.data || [];
        console.log(res.data.totalCount, newProducts.length);
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          return [...prev, ...newProducts.filter((p) => !existingIds.has(p._id))];
        });

        hasMoreRef.current = newProducts.length >= 8;
        pageRef.current += newProducts.length >= 8 ? 1 : 0;
      }
    } catch (err) {
      console.error("Search fetch failed:", err);
    } finally {
      loadingRef.current = false;
    }
  }, [query]);

  const lastProductRef = useCallback(
    (node) => {
      if (loadingRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          fetchSearchProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchSearchProducts]
  );

  useEffect(() => {
    setProducts([]);
    pageRef.current = 1;
    hasMoreRef.current = true;

    if (query.trim()) fetchSearchProducts();
  }, [query, fetchSearchProducts]);

  useEffect(() => {
    console.log("Products updated:", products);
    console.log("Filtered Products:", filteredProducts);
  }, [products, filteredProducts]);

  return (
    <div className="min-h-screen">
      <div className='flex flex-col w-full bg-white sticky top-14 z-[45] shadow-md sm:px-8 lg:px-24'>

         <div className='flex justify-around items-center gap-6 px-2 py-2 font-mono sm:text-lg'>
          {/* <div className='flex justify-start gap-3 sm:gap-4'> */}
            {
              filterApplied ?
                <p className='flex gap-1 items-center cursor-pointer bg-gray-200 rounded-full px-[2px] '>
                  <span className="flex w-full items-center gap-1" onClick={() => setOpenFilters(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-5 sm:h-5' viewBox="0 0 640 640"><path d="M96 128C78.3 128 64 142.3 64 160C64 177.7 78.3 192 96 192L182.7 192C195 220.3 223.2 240 256 240C288.8 240 317 220.3 329.3 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L329.3 128C317 99.7 288.8 80 256 80C223.2 80 195 99.7 182.7 128L96 128zM96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L342.7 352C355 380.3 383.2 400 416 400C448.8 400 477 380.3 489.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L489.3 288C477 259.7 448.8 240 416 240C383.2 240 355 259.7 342.7 288L96 288zM96 448C78.3 448 64 462.3 64 480C64 497.7 78.3 512 96 512L150.7 512C163 540.3 191.2 560 224 560C256.8 560 285 540.3 297.3 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L297.3 448C285 419.7 256.8 400 224 400C191.2 400 163 419.7 150.7 448L96 448z" /></svg>
                    Filters
                  </span>

                  <button
                    onClick={() => {
                      setFilteredProducts([]);
                      setFilterApplied(false);
                    }}
                    className='border-[1px] border-gray-300 p-1 rounded-full'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4' viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" /></svg>
                  </button>
                </p> :
                <span className='flex gap-1 items-center cursor-pointer' onClick={() => setOpenFilters(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-5 sm:h-5' viewBox="0 0 640 640"><path d="M96 128C78.3 128 64 142.3 64 160C64 177.7 78.3 192 96 192L182.7 192C195 220.3 223.2 240 256 240C288.8 240 317 220.3 329.3 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L329.3 128C317 99.7 288.8 80 256 80C223.2 80 195 99.7 182.7 128L96 128zM96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L342.7 352C355 380.3 383.2 400 416 400C448.8 400 477 380.3 489.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L489.3 288C477 259.7 448.8 240 416 240C383.2 240 355 259.7 342.7 288L96 288zM96 448C78.3 448 64 462.3 64 480C64 497.7 78.3 512 96 512L150.7 512C163 540.3 191.2 560 224 560C256.8 560 285 540.3 297.3 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L297.3 448C285 419.7 256.8 400 224 400C191.2 400 163 419.7 150.7 448L96 448z" /></svg>
                  Filters
                </span>
            }
            <span className='flex gap-1 items-center whitespace-nowrap cursor-pointer' onClick={() => setOpenSortBy(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className='w-4 h-4 sm:w-5 sm:h-5 text-black' viewBox="0 0 640 640"><path d="M470.6 566.6L566.6 470.6C575.8 461.4 578.5 447.7 573.5 435.7C568.5 423.7 556.9 416 544 416L480 416L480 96C480 78.3 465.7 64 448 64C430.3 64 416 78.3 416 96L416 416L352 416C339.1 416 327.4 423.8 322.4 435.8C317.4 447.8 320.2 461.5 329.3 470.7L425.3 566.7C437.8 579.2 458.1 579.2 470.6 566.7zM214.6 73.4C202.1 60.9 181.8 60.9 169.3 73.4L73.3 169.4C64.1 178.6 61.4 192.3 66.4 204.3C71.4 216.3 83.1 224 96 224L160 224L160 544C160 561.7 174.3 576 192 576C209.7 576 224 561.7 224 544L224 224L288 224C300.9 224 312.6 216.2 317.6 204.2C322.6 192.2 319.8 178.5 310.7 169.3L214.7 73.3z" /></svg>
              Sort By
            </span>
          </div>

      </div>

      <div className={`fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-start justify-end z-999 transition-all duration-500 ${openFilters ? "-translate-x-0" : "translate-x-[100%]"}`} onClick={() => setOpenFilters(false)}>
        <div className='flex w-full max-w-sm h-screen bg-white overflow-y-auto'>
          <FiltersSection
            collection_products={products}
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
            onFilter={(filteredList) => {
              setFilteredProducts(filteredList); // update products on main screen
              setOpenFilters(false); // close modal after applying filters
              setFilterApplied(true);
            }}
          />
        </div>
      </div>

      <div className={`fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-start justify-end z-999 transition-all duration-500 ${openSortBy ? "-translate-x-0" : "translate-x-[100%]"}`} onClick={() => setOpenSortBy(false)}>
        <div className='flex w-full max-w-sm h-screen bg-white overflow-y-auto'>
          <SortList
            openSortBy={openSortBy}
            setOpenSortBy={setOpenSortBy}
            value={sortValue}
            onChange={handleSort}
          />
        </div>
      </div>

       <h1 className="flex w-full justify-start items-center font-mono sm:text-lg px-2 sm:px-8 lg:px-24 pt-4">
        <Link href="/" className="hover:underline font-light">
          Home
        </Link>
        <>
          <span className="mx-1">{">"}</span>
          <span className="font-medium">{query}</span>
          {(filterApplied ? filteredProducts : products).length > 0 &&
            <span className="font-light">{"("}{(filterApplied ? filteredProducts : products).length}{")"}</span>
          }
        </>
      </h1>

      {/* Results */}
      {(!loadingRef.current && !hasMoreRef.current && (filterApplied ? filteredProducts : products)?.length === 0) && (
        <div className='flex w-full px-2 sm:px-8 lg:px-24 items-center justify-center py-4'>
          <div className="relative w-full h-[50vh] rounded-lg overflow-hidden">
            <Image
              src="/no_product.png"
              alt="No Product Available"
              fill
              className="object-contain"
              decoding="async"
              sizes="100vw"
            />
          </div>
        </div>
      )}

      <div
        className={`px-4 sm:px-8 lg:px-24 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4`}
      >
        {(filterApplied ? filteredProducts : products).map((product, i) => {
          const isLast = i === (filterApplied ? filteredProducts : products).length - 1;
          return (
            <div
              key={product._id}
              ref={isLast ? lastProductRef : null}
              className="flex flex-col bg-white shadow-md rounded-lg h-full hover:scale-102 transition duration-500"
            >
              <Link
                href={{
                  pathname: "/product_view",
                  query: { id: product._id },
                }}
              >
                <div className="relative w-full aspect-square mb-2 overflow-hidden">

                  <Image
                    src={product.images[0].imgUrl}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {!product.isActive || product.stock === 0 ? (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-bold">
                      OUT OF STOCK
                    </div>
                  ) : null}
                </div>

                <div className="px-2">
                  <h3 className="font-semibold sm:text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <div className="mt-1">
                    {product.sizes[0].discount > 0 && (
                      <span className="text-gray-400 line-through mr-2">
                        {product.sizes[0].price}₹
                      </span>
                    )}
                    <span className="font-semibold">{product.sizes[0].finalPrice}₹</span>
                  </div>
                </div>

              </Link>

              <div className="flex gap-2 p-2">
                <button
                  disabled={!product.isActive || product.stock === 0}
                  onClick={() =>
                    router.push(
                      `/cart_products/checkout_?product_id=${product._id}&delivery_time=${encodeURIComponent(
                        product.deliveryTime[0]
                      )}`
                    )
                  }
                  className={`flex-1 bg-white transform duration-200 border font-semibold py-1 rounded ${(!product.isActive || product.stock === 0) ? "border-gray-300" : "hover:scale-102 active:scale-98 border-gray-500"}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => handleAddToCart(product._id, product.deliveryTime[0])}
                  disabled={(!product.isActive || product.stock === 0)}
                  className={`flex gap-[2px] items-center justify-center flex-1 text-white transform duration-200 py-1 rounded ${(!product.isActive || product.stock === 0) ? "bg-gray-500" : "bg-gray-800 hover:scale-102 active:scale-98"}`}
                >
                  <span className="text-lg">+</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="currentColor"
                    viewBox="0 0 640 640"
                  >
                    <path d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 480 384 501.5 384 528C384 554.5 405.5 576 432 576z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>


      {/* Loading Skeleton */}
      {(hasMoreRef.current) && (
        <div className="flex justify-center py-6 text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default SearchProducts;
