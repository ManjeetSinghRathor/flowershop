"use client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AddProduct, setCart } from "./store/CartProductsSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import FloatingButton from "@/components/FloatingButton";
import Image from "next/image";
import AnimatedFakeInput from "@/components/AnimatedInput";
import SearchModal from "@/components/SearchModal";

const categories = [
  {
    name: "BOUQUET",
    href: "/bouquet",
    image: "/bouquets-min.png",
  },
  {
    name: "CAKE",
    href: "/cake",
    image: "/cakes-min.png",
  },
  {
    name: "PLANTS",
    href: "/plants",
    image: "/plants-min.png",
  },
  {
    name: "SUBSCRIPTION",
    href: "/subscription",
    image: "/subscription-min.png",
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user?.data);
  const colList = useSelector((state) => state.collectionList.data);
  const isDragging = useRef(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [collectionList, setCollection_List] = useState({});
  const [catLoaded, setCatLoaded] = useState(true);

  useEffect(() => {
    if (colList && Object.keys(colList).length > 0) {
      const filtered = {};

      Object.entries(colList).forEach(([categoryName, collections]) => {
        if (categoryName !== "All Products") {
          filtered[categoryName] = [...collections].reverse(); // 🔁 reverse per category
        }
      });

      setCollection_List(filtered);
      setCatLoaded(false);
    }
  }, [colList]);

  const [slides, setSlides] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [loading, setLoading] = useState(true);
  const [homepageCollections, setHomepageCollections] = useState([]);
  const [colLoading, setColLoading] = useState(true);

  useLayoutEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 724) {
        setSlidesToShow(1); // Mobile / Tablet
      } else if (width < 1224) {
        setSlidesToShow(2); // Desktop
      } else {
        setSlidesToShow(3);
      }
    };

    // Run once before first paint
    updateSlides();

    // Listen for resizes
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    fade: false,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 4000,
    swipe: true,
    arrows: true,
    slidesToShow,

    appendDots: (dots) => {
      const activeIndex = dots.findIndex((dot) =>
        dot.props.className.includes("slick-active")
      );

      let visibleDots = [];

      if (dots.length <= 3) {
        visibleDots = dots;
      } else {
        if (activeIndex === 0) {
          visibleDots = [dots[0], dots[1], dots[2]];
        } else if (activeIndex === dots.length - 1) {
          visibleDots = [
            dots[dots.length - 3],
            dots[dots.length - 2],
            dots[dots.length - 1],
          ];
        } else {
          visibleDots = [
            dots[activeIndex - 1],
            dots[activeIndex],
            dots[activeIndex + 1],
          ];
        }
      }

      return (
        <div>
          <ul className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex">
            {visibleDots}
          </ul>
        </div>
      );
    },

    customPaging: (i) => (
      <div className="group relative w-[8px] h-[8px] rounded-full transition-all duration-500 border-[1px] border-gray-400"></div>
    ),
  };

  const toastStyle = {
    background: "#161616ff",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: 500,
  };

  const handleAddToCart = async (id, deliveryTime) => {
    if (user) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/add-to-cart/${id}`,
          { deliveryTime },
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success("Item added to your cart", {
            style: toastStyle,
            icon: "🛒",
          });
          dispatch(AddProduct({ id, q: 1, deliveryTime }));
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
      dispatch(AddProduct({ id, q: 1, deliveryTime })); // guest cart in redux
      toast.success("Item added to cart (guest)");
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/slider/`
      );

      if (res.data.success) {
        setSlides(res.data.data); // assuming your state is const [slides, setSlides] = useState([]);
      } else {
        console.error("Failed to fetch slides:", res.data.message);
        toast.error(res.data.message || "Failed to fetch slides");
      }
    } catch (err) {
      console.error("Error fetching slides:", err);
      toast.error("Error fetching slides");
    } finally {
      setLoading(false);
    }
  };

  const fetchHomepageCollections = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/homepage-collections`
      );

      if (res.data.success) {
        setHomepageCollections(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching homepage collections:", error);
    } finally {
      setColLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
    fetchHomepageCollections();
  }, []);

  return (
    <div className="font-sans items-center w-full px-2 sm:px-8 lg:px-24">
      {/* <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-white text-green-500 hover:bg-green-600 rounded-full text-5xl">
          <FaWhatsapp />
        </button>
      </div> */}

      <div className="flex justify-center pt-4 px-2">
        <div className="w-full mx-auto">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full"
            aria-label="Open search"
          >
            <div className="flex items-center gap-2 bg-white border border-black/20 rounded-md px-3 py-2 shadow-sm cursor-text">
              {/* Search Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6 text-black/70"
                fill="currentColor"
                viewBox="0 0 640 640"
              >
                <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
              </svg>

              {/* Fake Input */}
              <div className="flex-1 text-left text-black/50 select-none sm:pl-1">
                <AnimatedFakeInput />
              </div>

              {/* Mic Icon (visual only) */}
              <div className="flex items-center rounded-full text-black/70">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="9" y="2" width="6" height="12" rx="3" />

                  <rect x="11" y="14" width="2" height="4" />

                  <rect x="8" y="18" width="8" height="2" rx="1" />

                  <path
                    d="M6 11a6 6 0 0 0 12 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      <SearchModal
        setIsSearchOpen={setIsSearchOpen}
        isSearchOpen={isSearchOpen}
      />

      {catLoaded ? (
        <section className="w-full px-4 sm:px-6 lg:px-16 pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl aspect-[3/2]"
              >
                {/* Image Skeleton */}
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />

                {/* Glass Label Skeleton */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-6 sm:w-32 sm:h-7 rounded-lg bg-gray-200 animate-pulse shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full px-4 sm:px-6 lg:px-16 pt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/2]"
              >
                {/* Background Image */}
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority={false}
                />

                {/* Glass Overlay */}
                <div className="absolute inset-0 border border-white/30 flex items-center justify-center transition-all duration-300">
                  <div className="flex items-center justify-center px-1 rounded-xl bg-black/20 group-hover:bg-black/30 group-hover:py-1 group-hover:px-2 transition-all duration-300">
                    <span className="text-white text-md sm:text-xl font-semibold tracking-widest drop-shadow-lg">
                      {item.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex w-full justify-center">
        <div className="relative w-full overflow-hidden py-4">
          <div className="w-full">
            {loading ? (
              <div className="flex justify-center gap-4">
                {/* Skeleton slides */}
                {[...Array(1)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full h-[144px] sm:h-[184px] bg-gray-300 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <Slider {...settings}>
                {slides.map((slide, idx) => {
                  const handleMouseDown = () => {
                    isDragging.current = false;
                  };

                  const handleMouseMove = () => {
                    isDragging.current = true;
                  };

                  const handleClick = (e) => {
                    if (!isDragging.current) {
                      router.push(slide.link);
                    }
                  };

                  return (
                    <div
                      key={slide._id}
                      className="w-full aspect-[9/4] p-1"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onTouchStart={handleMouseDown}
                      onTouchMove={handleMouseMove}
                    >
                      <div
                        onClick={handleClick}
                        className="relative w-full h-full cursor-pointer bg-white"
                      >
                        <Image
                          src={slide.image}
                          alt={`Offer ${idx + 1}`}
                          fill
                          className="object-cover object-center sm:rounded-xs"
                          loading={idx === 0 ? "eager" : "lazy"} // first image preloads
                          fetchPriority={idx === 0 ? "high" : "auto"} // prioritize only first
                          decoding="async"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          priority={idx === 0} // ensures first is optimized early
                        />
                      </div>
                    </div>
                  );
                })}
              </Slider>
            )}
          </div>
        </div>
      </div>

      {/* Collection List */}
      <div className="flex flex-col w-full gap-4 sm:gap-6 px-2 mt-2">
        <h2 className="flex justify-center font-mono text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 relative">
            Bouquet Collection
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full animate-pulse"></span>
        </h2>

        <div className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth sm:px-4">
          {catLoaded ? (
            <div className="flex flex-col gap-6 w-full py-4 items-start">
              {/* Skeleton Rows */}
              {[...Array(2)].map((_, rowIdx) => (
                <div key={rowIdx} className="flex w-full gap-2 sm:gap-4">
                  {[...Array(10)].map((_, idx) => (
                    <div
                      key={`row${rowIdx}-${idx}`}
                      className="min-w-[5rem] min-h-[5rem] sm:min-w-[7rem] sm:min-h-[7rem] lg:min-w-[8rem] lg:min-h-[8rem] flex items-center justify-center snap-center"
                    >
                      <div className="flex flex-col gap-[5px] items-center">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl bg-gray-300 animate-pulse shadow-sm" />
                        <div className="w-15 h-5 sm:w-24 sm:h-5 lg:w-28 lg:h-5 rounded-xl bg-gray-300 animate-pulse shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            Object.entries(collectionList).map(([category, items]) => (
              <div
                key={category}
                className="flex flex-col gap-3 w-full py-[6px] sm:py-2"
              >
                {/* Category Title */}
                {/* Uncomment if you want section titles */}
                {/* <h3 className="font-serif font-semibold text-lg sm:text-xl mb-2 text-gray-800">
          {category}
        </h3> */}

                <div
                  className="flex w-full gap-2 sm:gap-6 lg:gap-8 justify-start"
                  style={{
                    scrollSnapType: "x mandatory",
                    scrollBehavior: "smooth",
                  }}
                >
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="snap-center flex-shrink-0 transition-transform duration-500 hover:scale-[1.05]"
                    >
                      <Link
                        href={{
                          pathname: "/collection_products",
                          query: {
                            category: item.collection,
                            id: item.collectionId,
                          },
                        }}
                        className="flex flex-col items-center gap-1 space-x-1 cursor-pointer"
                      >
                        {/* Image Container */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl border border-gray-300 overflow-hidden bg-white">
                          <Image
                            src={item.image}
                            alt={item.collection}
                            fill
                            className="object-cover object-center transition-transform duration-500 hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 640px) 4.5rem, (max-width: 1024px) 6rem, 7rem"
                          />
                        </div>

                        {/* Text */}
                        <div className="flex justify-center text-center text-gray-600 font-[400] text-[12px] sm:text-[14px] lg:text-[18px] lg:mt-1 text-gray-800 leading-tight max-w-[4.8rem] sm:max-w-[5.4rem] lg:max-w-[6.5rem]">
                          {item.collection}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {catLoaded ? (
        <div className="flex w-full justify-center">
          <div className="w-full aspect-[3] mt-2 mb-2 px-2 relative max-w-lg sm:hidden">
            <div className="absolute inset-0 mx-2 rounded-md bg-gray-300 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="w-full aspect-[3] mt-5 mb-2 px-2 relative max-w-lg sm:hidden">
          {/* Actual image */}
          <Link href={"/custom_bouquet"}>
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              {/* Skeleton placeholder */}
              {/* <div className="absolute inset-0 rounded-xl bg-gray-300 animate-pulse shadow-sm" /> */}

              {/* Optimized image */}
              <Image
                src="/custom_bouquet_-min.png"
                alt="Make a Custom Bouquet Now!"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                className="object-cover object-center scale-120"
                priority
                decoding="async"
              />
            </div>
          </Link>
        </div>
      )}

      {colLoading ? (
        <div className="flex flex-col gap-6 w-full overflow-hidden py-4">
          <div className="flex w-full justify-center">
            <div className="flex w-[160px] h-[42px] sm:h-[48px] relative">
              <div className="absolute inset-0 rounded-md bg-gray-300 animate-pulse" />
            </div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full px-2 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={`row1-${idx}`}
                className="min-w-[7rem] min-h-[7rem] flex items-center justify-center snap-start"
              >
                {/* Skeleton */}
                <div className="w-full h-56 sm:h-84 lg:h-104 bg-gray-300 animate-pulse rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        homepageCollections?.length > 0 &&
        homepageCollections.map((col) => (
          <div
            key={col.collectionCode}
            className="flex flex-col w-full gap-3 py-4"
          >
            <Link
              href={{
                pathname: "/collection_products",
                query: { category: col.name, id: col._id }, // pass product ID as query param
              }}
            >
              <h2 className="flex justify-center font-mono text-2xl sm:text-3xl mt-2 mb-1 text-gray-800 font-semibold animate-bounce">
                🌸 {col.name} 🌸
              </h2>
            </Link>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-6 pb-1 sm:py-2 px-2 gap-4">
              {/* Example Product Cards */}
              {col?.products?.length > 0 &&
                col.products.map((product) => (
                  <div
                    key={product.productCode}
                    className={`flex flex-col bg-white shadow-md rounded-lg h-full cursor-pointer hover:shadow-lg hover:scale-102 transition duration-500`}
                  >
                    <Link
                      href={{
                        pathname: "/product_view",
                        query: { id: product._id }, // pass product ID as query param
                      }}
                    >
                      <div className="w-full aspect-[1] mb-2 relative">
                        {/* Actual image */}
                        <div className="relative w-full h-full overflow-hidden">
                          <Image
                            src={product.images[0].imgUrl}
                            alt={product.name}
                            fill
                            className="object-cover object-center transition-transform duration-500 hover:scale-110"
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>

                        {product.isActive &&
                          product.stock > 0 &&
                          product.sizes[0]?.discount > 0 && (
                            <div className="absolute z-[20] top-0 left-0 px-1 py-[2px] bg-[rgba(0,0,0,0.5)]">
                              <p className="text-sm font-semibold text-white">
                                {product.sizes[0]?.discount}% OFF
                              </p>
                            </div>
                          )}

                        {(!product.isActive || product.stock === 0) && (
                          <div className="flex items-center justify-center absolute inset-0 z-[30] bg-[rgba(0,0,0,0.3)] rounded-lg transition">
                            <p className="text-center font-extrabold text-xl bg-gradient-to-br from-red-200 via-red-100 to-white bg-clip-text text-transparent drop-shadow-md">
                              <span>OUT</span>
                              <br />
                              <span>OF STOCK</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="px-2">
                        {/* Product Info */}
                        <h3 className="font-semibold sm:text-lg mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 flex-1 line-clamp-3">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="mt-2">
                          {product.sizes[0].discount > 0 && (
                            <span className="text-gray-400 line-through mr-2">
                              {product.sizes[0].price}₹
                            </span>
                          )}
                          <span className="font-bold text-lg">
                            {product.sizes[0].finalPrice}₹
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Buttons at bottom */}
                    <div
                      className={`mt-auto flex gap-2 p-2 ${
                        !product.isActive || product.stock === 0
                          ? "text-gray-400"
                          : "text-black"
                      }`}
                    >
                      <button
                        onClick={() => {
                          router.push(
                            `/cart_products/checkout_?product_id=${
                              product._id
                            }&delivery_time=${encodeURIComponent(
                              product.deliveryTime[0]
                            )}`
                          );
                        }}
                        disabled={!product.isActive || product.stock === 0}
                        className={`flex-1 bg-white transform transform duration-500 border-1 font-semibold py-1 rounded ${
                          !product.isActive || product.stock === 0
                            ? "border-gray-300"
                            : "hover:scale-102 active:scale-98 border-gray-500"
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() =>
                          handleAddToCart(product._id, product.deliveryTime[0])
                        }
                        disabled={!product.isActive || product.stock === 0}
                        className={`flex gap-[2px] items-center justify-center flex-1 transform duration-500 text-white py-1 rounded ${
                          !product.isActive || product.stock === 0
                            ? "bg-gray-500"
                            : "bg-gray-800 hover:scale-101 active:scale-98"
                        }`}
                      >
                        <span className="text-lg">+</span>{" "}
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
                ))}
            </div>

            <div className="flex justify-center">
              <Link
                href={{
                  pathname: "/collection_products",
                  query: { category: col.name, id: col._id }, // pass product ID as query param
                }}
                className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-1.5 px-4 rounded-lg shadow-sm hover:bg-gray-100 active:scale-95 transition-all duration-500"
              >
                <span>View All</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-4 h-4"
                  viewBox="0 0 640 640"
                >
                  <path d="M342.6 534.6C330.1 547.1 309.8 547.1 297.3 534.6L137.3 374.6C124.8 362.1 124.8 341.8 137.3 329.3C149.8 316.8 170.1 316.8 182.6 329.3L320 466.7L457.4 329.4C469.9 316.9 490.2 316.9 502.7 329.4C515.2 341.9 515.2 362.2 502.7 374.7L342.7 534.7zM502.6 182.6L342.6 342.6C330.1 355.1 309.8 355.1 297.3 342.6L137.3 182.6C124.8 170.1 124.8 149.8 137.3 137.3C149.8 124.8 170.1 124.8 182.6 137.3L320 274.7L457.4 137.4C469.9 124.9 490.2 124.9 502.7 137.4C515.2 149.9 515.2 170.2 502.7 182.7z" />
                </svg>
              </Link>
            </div>
          </div>
        ))
      )}

      {user?.role === "admin" && <FloatingButton />}
    </div>
  );
}
