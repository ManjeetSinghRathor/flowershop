"use client";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AddProduct, setCart } from "./store/CartProductsSlice";
import toast from "react-hot-toast";
import axios from "axios";



export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.data);
  const colList = useSelector((state) => state.collectionList.data);

  const [collectionList, setCollection_List] = useState({});
  const [catLoaded, setCatLoaded] = useState(true);

  useEffect(() => {
    if (colList && Object.keys(colList).length > 0) {
      const filtered = {};

      Object.entries(colList).forEach(([categoryName, collections]) => {
        if (categoryName !== "All Products") {
          filtered[categoryName] = collections;
        }
      });

      setCollection_List(filtered);
      setCatLoaded(false);
    }
  }, [colList]);

  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homepageCollections, setHomepageCollections] = useState([]);
  const [colLoading, setColLoading] = useState(true);

  const [categoryLoaded, setCategoryLoaded] = useState({});

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    fade: false,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 4000,
    swipe: true,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex">
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[20px] sm:w-[25px] sm:h-[6px] h-[5px] bg-white border-[1px] border-[rgb(146,145,145)] rounded-full"></div>
    ),
  };

  const handleAddToCart = async (id) => {
    if (user) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/add-to-cart/${id}`,
          {},
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success("Item added to your cart");
          dispatch(AddProduct({ id, q: 1 }));
          // Optional: update Redux state with res.data.cart
        }
      } catch (err) {
        toast.error("Failed to add item to cart");
        console.error(err);
      }
    } else {
      dispatch(AddProduct({ id, q: 1 })); // guest cart in redux
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

      <div className="flex w-full justify-center">
        <div className="relative w-full max-w-4xl overflow-hidden py-4">
          <div className="w-full">
            {loading ? (
              <div className="flex justify-center gap-4">
                {/* Skeleton slides */}
                {[...Array(1)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full max-w-4xl h-[144px] sm:h-[200px] bg-gray-300 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <Slider {...settings}>
                {slides.map((slide, idx) => (
                  <div
                    key={slide._id}
                    className="w-full aspect-[7/3] max-h-[240px]"
                  >
                    <Link href={slide.link || "#"}>
                      <img
                        src={slide.image}
                        alt={`Slide ${idx}`}
                        className="w-full h-full object-cover rounded-xl cursor-pointer p-1"
                      />
                    </Link>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      </div>

      {/* Collection List */}
      <div className="flex flex-col w-full gap-4 sm:gap-6 px-2">
        <h2 className="flex font-mono text-2xl justify-center sm:text-3xl leading-tight">
          Collection List
        </h2>
        {catLoaded ? (
          <div className="flex flex-col gap-4 w-full overflow-hidden py-4">

            {/* <div className="flex w-[100px] h-[28px] relative">
              <div className="absolute inset-0 rounded-md bg-gray-300 animate-pulse" />
            </div> */}

            {/* Row 1 */}
            <div className="flex w-full sm:gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
              {[...Array(9)].map((_, idx) => (
                <div
                  key={`row1-${idx}`}
                  className="min-w-[5rem] min-h-[5rem] sm:min-w-[7rem] sm:min-h-[7rem] flex items-center justify-center snap-start"
                >
                  {/* Skeleton */}
                  <div className="w-18 h-18 sm:w-28 sm:h-28 rounded-full bg-gray-300 animate-pulse" />
                </div>
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex w-full sm:gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
              {[...Array(9)].map((_, idx) => (
                <div
                  key={`row1-${idx}`}
                  className="min-w-[5rem] min-h-[5rem] sm:min-w-[7rem] sm:min-h-[7rem] flex items-center justify-center snap-start"
                >
                  {/* Skeleton */}
                  <div className="w-18 h-18 sm:w-28 sm:h-28 rounded-full bg-gray-300 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          Object.entries(collectionList).map(([category, items]) => (
            <div
              key={category}
              className="flex flex-col gap-2 w-full overflow-hiddens"
            >
              {/* <h3 className="font-serif font-semibold text-xl sm:text-2xl mb-1 text-gray-800">
                {category}
              </h3> */}
              <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 px-2 snap-start snap-always"
                  >
                    <Link
                      href={{
                        pathname: "/collection_products",
                        query: { category: item.collection, id: item.collectionId }, // pass subcategory as query param
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 relative">
                        {/* Skeleton */}
                        {!categoryLoaded[item.id] && (
                          <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
                        )}

                        {/* Actual image */}
                        <img
                          className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover object-center border border-gray-400 ${
                            categoryLoaded[item.id] ? "block" : "hidden"
                          }`}
                          src={item.image}
                          alt={item.collection}
                          onLoad={() =>
                            setCategoryLoaded((prev) => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                          onError={() =>
                            setCategoryLoaded((prev) => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                        />
                      </div>
                      <div className="text-center text-sm max-w-18 sm:max-w-28">
                        {item.collection}
                        {/* {item.collection.split(" ").map((word, index) => (
                          <span key={index}>
                            {word}
                            {(index + 1) % 2 === 0 ? <br /> : " "}
                          </span>
                        ))} */}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {colLoading ? (
        <div className="flex flex-col gap-6 w-full overflow-hidden py-4">
          <div className="flex w-full justify-center">
            <div className="flex w-[120px] sm:w-[160px] h-[42px] sm:h-[48px] relative">
              <div className="absolute inset-0 rounded-md bg-gray-300 animate-pulse" />
            </div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full px-2 gap-4">
            {[...Array(6)].map((_, idx) => (
              <div
                key={`row1-${idx}`}
                className="min-w-[7rem] min-h-[7rem] flex items-center justify-center snap-start"
              >
                {/* Skeleton */}
                <div className="w-full h-56 bg-gray-300 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        homepageCollections?.length > 0 &&
        homepageCollections.map((col) => (
          <div
            key={col.collectionCode}
            className="flex flex-col w-full gap-3 py-4 px-2"
          >
            <h2 className="flex font-mono text-2xl justify-center sm:text-3xl leading-tight">
              {col.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {/* Example Product Cards */}
              {col?.products?.length > 0 &&
                col.products.map((product) => (
                  <div
                    key={product.productCode}
                    className="flex flex-col bg-white shadow-md rounded-lg p-3 h-full cursor-pointer hover:shadow-lg transition"
                  >
                    <Link
                      href={{
                        pathname: "/product_view",
                        query: { id: product._id }, // pass product ID as query param
                      }}
                    >
                      <div className="w-full h-36 mb-2 relative">
                        {/* Actual image */}
                        <img
                          src={product.images[0].imgUrl}
                          alt={product.name}
                          className={`w-full h-full object-cover rounded-lg`}
                        />
                      </div>

                      {/* Product Info */}
                      <h3 className="font-semibold text-lg mb-1">
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
                        <span className="font-semibold">
                          {product.sizes[0].finalPrice}₹
                        </span>
                      </div>
                    </Link>

                    {/* Buttons at bottom */}
                    <div className="mt-auto flex gap-2 pt-3">
                      <button className="flex-1 bg-white hover:scale-102 transform duration-200 border-1 border-gray-500 font-semibold py-1 rounded">
                        Buy
                      </button>
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="flex gap-[2px] items-center justify-center flex-1 bg-gray-800  hover:scale-102 transform duration-200 text-white py-1 rounded"
                      >
                        <span className="text-lg">+</span>{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                  query: { category: col.collection, id: col._id }, // pass product ID as query param
                }}
                className="flex items-center gap-1 bg-gray-900 text-white py-1 px-4 rounded"
              >
                <span>View All</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-4 h-4 text-white"
                  viewBox="0 0 640 640"
                >
                  <path d="M342.6 534.6C330.1 547.1 309.8 547.1 297.3 534.6L137.3 374.6C124.8 362.1 124.8 341.8 137.3 329.3C149.8 316.8 170.1 316.8 182.6 329.3L320 466.7L457.4 329.4C469.9 316.9 490.2 316.9 502.7 329.4C515.2 341.9 515.2 362.2 502.7 374.7L342.7 534.7zM502.6 182.6L342.6 342.6C330.1 355.1 309.8 355.1 297.3 342.6L137.3 182.6C124.8 170.1 124.8 149.8 137.3 137.3C149.8 124.8 170.1 124.8 182.6 137.3L320 274.7L457.4 137.4C469.9 124.9 490.2 124.9 502.7 137.4C515.2 149.9 515.2 170.2 502.7 182.7z" />
                </svg>
              </Link>
            </div>
          </div>
        ))
      )}

      {/* Footer */}
    </div>
  );
}
