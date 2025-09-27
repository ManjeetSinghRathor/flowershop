"use client";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";
import { Products, collectionList } from "@/public/products";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";

const trendingProductsID = ["F001", "F002", "F003", "F004", "F005", "F006"];

const slides = [
  {
    id: 1,
    image: "https://source.unsplash.com/800x400/?flower1",
    link: "/product/1",
  },
  {
    id: 2,
    image: "https://source.unsplash.com/800x400/?flower2",
    link: "/product/2",
  },
  {
    id: 3,
    image: "https://source.unsplash.com/800x400/?flower3",
    link: "/product/3",
  },
  {
    id: 4,
    image: "https://source.unsplash.com/800x400/?flower4",
    link: "/product/4",
  },
  {
    id: 5,
    image: "https://source.unsplash.com/800x400/?flower5",
    link: "/product/5",
  },
  {
    id: 6,
    image: "https://source.unsplash.com/800x400/?flower6",
    link: "/product/6",
  },
];

const shopImages = [
  { id: "A1", image: "https://source.unsplash.com/400x400/?bouquet" },
  { id: "A2", image: "https://source.unsplash.com/400x400/?roses" },
  { id: "A3", image: "https://source.unsplash.com/400x400/?lilies" },
  { id: "A4", image: "https://source.unsplash.com/400x400/?tulips" },
];

export default function Home() {
  const [categoryLoaded, setCategoryLoaded] = useState({});
  const [productsImgloaded, setProductsImgLoaded] = useState({});
  const [shopImgLoaded, setShopImgLoaded] = useState({});

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    fade: true,
    cssEase: "linear",
    autoplay: true,
    autoplaySpeed: 4000,
    swipe: true,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {dots}
        </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-8 h-1 bg-white border-[1px] border-[rgb(146,145,145)] rounded-full"></div>
    ),
  };

  const trendingProducts = trendingProductsID.map((id) =>
    Products.find((product) => product.id === id)
  );

  return (
    <div className="font-sans items-center w-full px-2 sm:px-8 lg:px-24">
      {/* <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-white text-green-500 hover:bg-green-600 rounded-full text-5xl">
          <FaWhatsapp />
        </button>
      </div> */}

      <div className="flex w-full justify-center">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-lg py-6 px-2">
          <Slider {...settings}>
            {slides.map((slide) => (
              <div key={slide.id}>
                <a href={slide.link}>
                  <img
                    src={slide.image}
                    alt={`Slide ${slide.id}`}
                    className="w-full min-h-[160px] sm:min-h-[200px] object-cover cursor-pointer"
                  />
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Collection List */}
      <div className="flex flex-col w-full gap-3 py-6 px-2">
        <h2 className="flex font-mono text-2xl justify-center sm:text-3xl">
          Collection List
        </h2>
        {Object.entries(collectionList).map(([category, items]) => (
          <div
            key={category}
            className="flex flex-col gap-4 w-full overflow-hidden py-4"
          >
            <h3 className="font-serif font-semibold text-xl sm:text-2xl mb-1 text-gray-800">
              {category}
            </h3>
            <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 px-2 snap-start snap-always"
                >
                  <Link
                    href={{
                      pathname: "/collection_products",
                      query: { category: item.collection }, // pass subcategory as query param
                    }}
                    className="flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <div className="w-28 h-28 relative">
                      {/* Skeleton */}
                      {!categoryLoaded[item.id] && (
                        <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
                      )}

                      {/* Actual image */}
                      <img
                        className={`w-28 h-28 rounded-full object-cover object-center border border-gray-400 ${
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
                    <div className="text-center text-sm">
                      {item.collection.split(" ").map((word, index) => (
                        <span key={index}>
                          {word}
                          {(index + 1) % 2 === 0 ? <br /> : " "}
                        </span>
                      ))}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* tranding products */}
      <div className="flex flex-col w-full gap-3 py-6 px-2">
        <h2 className="flex font-mono text-2xl justify-center sm:text-3xl">
          Trending Now
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 py-4">
          {/* Example Product Cards */}
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col bg-white shadow-md rounded-lg p-3 h-full cursor-pointer hover:shadow-lg transition"
            >
              <Link
                href={{
                  pathname: "/product_view",
                  query: { id: product.id }, // pass product ID as query param
                }}
              >
                <div className="w-full h-36 mb-2 relative">
                  {/* Skeleton */}
                  {!productsImgloaded[product.id] && (
                    <div className="absolute inset-0 rounded-lg bg-gray-300 animate-pulse" />
                  )}

                  {/* Actual image */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full h-full object-cover rounded-lg ${
                      productsImgloaded[product.id] ? "block" : "hidden"
                    }`}
                    onLoad={() =>
                      setProductsImgLoaded((prev) => ({
                        ...prev,
                        [product.id]: true,
                      }))
                    }
                    onError={() =>
                      setProductsImgLoaded((prev) => ({
                        ...prev,
                        [product.id]: true,
                      }))
                    }
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 flex-1">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-2">
                  <span className="font-semibold">{product.final_price}₹</span>
                  {product.discount > 0 && (
                    <span className="text-gray-400 line-through ml-2">
                      {product.price}₹
                    </span>
                  )}
                </div>
              </Link>

              {/* Buttons at bottom */}
              <div className="mt-auto flex gap-2 pt-3">
                <button className="flex-1 bg-white hover:scale-102 transform duration-200 border-1 border-gray-500 font-semibold py-1 rounded">
                  Buy
                </button>
                <button className="flex gap-[2px] items-center justify-center flex-1 bg-gray-800  hover:scale-102 transform duration-200 text-white py-1 rounded">
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
          <button className="flex items-center gap-1 bg-gray-900 text-white py-1 px-4 rounded">
            <span>View All</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-4 h-4 text-white"
              viewBox="0 0 640 640"
            >
              <path d="M342.6 534.6C330.1 547.1 309.8 547.1 297.3 534.6L137.3 374.6C124.8 362.1 124.8 341.8 137.3 329.3C149.8 316.8 170.1 316.8 182.6 329.3L320 466.7L457.4 329.4C469.9 316.9 490.2 316.9 502.7 329.4C515.2 341.9 515.2 362.2 502.7 374.7L342.7 534.7zM502.6 182.6L342.6 342.6C330.1 355.1 309.8 355.1 297.3 342.6L137.3 182.6C124.8 170.1 124.8 149.8 137.3 137.3C149.8 124.8 170.1 124.8 182.6 137.3L320 274.7L457.4 137.4C469.9 124.9 490.2 124.9 502.7 137.4C515.2 149.9 515.2 170.2 502.7 182.7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* More About Us */}
      <div className="flex flex-col w-full gap-3 py-6 px-2">
        <h2 className="flex font-mono text-2xl justify-center pb-2 sm:text-3xl">
          More About Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 py-4">
          {shopImages.map((item) => (
            <div key={item.id} className="w-full min-h-64 relative">
              {/* Skeleton */}
              {!shopImgLoaded[item.id] && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              )}

              {/* Actual image */}
              <img
                src={item.image}
                alt={`Shop Image ${item.id}`}
                className={`w-full h-full object-cover border-1 border-gray-300 ${
                  shopImgLoaded[item.id] ? "block" : "hidden"
                }`}
                onLoad={() =>
                  setShopImgLoaded((prev) => ({ ...prev, [item.id]: true }))
                }
                onError={() =>
                  setShopImgLoaded((prev) => ({ ...prev, [item.id]: true }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}
