"use client";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";

const collectionList = {
  "By Occasion": [
    { collection: "Birthday Flowers", image: "./birthday_flowers.png" },
    { collection: "Anniversary Flowers", image: "./anniversary_flowers.png" },
    { collection: "Wedding Flowers", image: "./wedding_flowers.png" },
    { collection: "Get Well Soon", image: "./get_well_soon.png" },
    { collection: "Congratulations", image: "./congratulations.png" },
    { collection: "Love & Romance", image: "./love_romance.png" },
    { collection: "New Baby", image: "./new_baby.png" },
    { collection: "Sympathy & Funeral", image: "./sympathy_funeral.png" },
    { collection: "Thank You", image: "./thank_you.png" },
    { collection: "Housewarming", image: "./housewarming.png" },
  ],

  "By Flower Type": [
    { collection: "Roses", image: "./roses.png" },
    { collection: "Lilies", image: "./lilies.png" },
    { collection: "Orchids", image: "./orchids.png" },
    { collection: "Carnations", image: "./carnations.png" },
    { collection: "Tulips", image: "./tulips.png" },
    { collection: "Gerberas", image: "./gerberas.png" },
    { collection: "Mixed Flowers", image: "./mixed_flowers.png" },
    { collection: "Seasonal Flowers", image: "./seasonal_flowers.png" },
  ],

  "By Arrangement Style": [
    { collection: "Bouquets", image: "./bouquets.png" },
    { collection: "Flower Baskets", image: "./flower_baskets.png" },
    { collection: "Flower Boxes / Hampers", image: "./flower_boxes.png" },
    { collection: "Vase Arrangements", image: "./vase_arrangements.png" },
    {
      collection: "Exotic / Premium Arrangements",
      image: "./exotic_premium.png",
    },
    { collection: "Single Stem Flowers", image: "./single_stem.png" },
  ],

  "By Color Theme": [
    { collection: "Red Flowers", image: "./red_flowers.png" },
    { collection: "White Flowers", image: "./white_flowers.png" },
    { collection: "Pink Flowers", image: "./pink_flowers.png" },
    { collection: "Yellow Flowers", image: "./yellow_flowers.png" },
    { collection: "Mixed Colors", image: "./mixed_colors.png" },
  ],

  "Gift Type": [
    { collection: "Chocolates & Sweets", image: "./chocolates_sweets.png" },
    { collection: "Cakes & Cupcakes", image: "./cakes_cupcakes.png" },
    { collection: "Teddy Bears / Soft Toys", image: "./teddy_softtoys.png" },
    { collection: "Greeting Cards", image: "./greeting_cards.png" },
    { collection: "Perfumes", image: "./perfumes.png" },
    { collection: "Jewelry & Accessories", image: "./jewelry_accessories.png" },
    { collection: "Personalized Gifts", image: "./personalized_gifts.png" },
    { collection: "Plants", image: "./plants.png" },
  ],

  "Combo Collections": [
    { collection: "Flowers + Chocolates", image: "./flowers_chocolates.png" },
    { collection: "Flowers + Cake", image: "./flowers_cake.png" },
    { collection: "Flowers + Teddy", image: "./flowers_teddy.png" },
    { collection: "Flowers + Greeting Card", image: "./flowers_card.png" },
    { collection: "Premium Hampers", image: "./premium_hampers.png" },
  ],

  "Special Collections": [
    { collection: "Same Day Delivery", image: "./same_day.png" },
    { collection: "Midnight Delivery Gifts", image: "./midnight_delivery.png" },
    {
      collection: "Luxury / Premium",
      image: "./luxury_premium.png",
    },
    { collection: "Seasonal Specials", image: "./seasonal_specials.png" },
    { collection: "Corporate Gifting", image: "./corporate_gifting.png" },
    { collection: "Budget-Friendly Options", image: "./budget_friendly.png" },
  ],
};

const trendingProducts = [
  {
    id: "F001",
    name: "Red Rose Bouquet",
    type: "Flower Bouquet",
    flowers: ["Rose"],
    description:
      "A classic bouquet of 12 fresh red roses, perfect for expressing love and romance.",
    price: 799,
    discount: 10,
    final_price: 719,
    currency: "INR",
    stock: 25,
    images: [
      "https://example.com/images/rose_bouquet_1.jpg",
      "https://example.com/images/rose_bouquet_2.jpg",
    ],
    occasions: ["Valentine's Day", "Anniversaries", "Weddings"],
    delivery_time: "1-2 Days",
  },
  {
    id: "F002",
    name: "Spring Tulip Bouquet",
    type: "Flower Bouquet",
    flowers: ["Tulip"],
    description:
      "Bright and colorful tulips hand-arranged in a cheerful bouquet, ideal for spring celebrations.",
    price: 699,
    discount: 5,
    final_price: 664,
    currency: "INR",
    stock: 30,
    images: [
      "https://example.com/images/tulip_bouquet_1.jpg",
      "https://example.com/images/tulip_bouquet_2.jpg",
    ],
    occasions: ["Easter", "Mother's Day"],
    delivery_time: "1-2 Days",
  },
  {
    id: "F003",
    name: "Elegant Lily Arrangement",
    type: "Flower Arrangement",
    flowers: ["Lily"],
    description:
      "A sophisticated bouquet of white lilies in a premium vase, symbolizing purity and elegance.",
    price: 1199,
    discount: 15,
    final_price: 1019,
    currency: "INR",
    stock: 20,
    images: [
      "https://example.com/images/lily_arrangement_1.jpg",
      "https://example.com/images/lily_arrangement_2.jpg",
    ],
    occasions: ["Weddings", "Funerals"],
    delivery_time: "1-3 Days",
  },
  {
    id: "F004",
    name: "Peony Romance Bouquet",
    type: "Flower Bouquet",
    flowers: ["Peony"],
    description:
      "Soft and fragrant peonies arranged elegantly for weddings and anniversaries.",
    price: 1599,
    discount: 10,
    final_price: 1439,
    currency: "INR",
    stock: 15,
    images: [
      "https://example.com/images/peony_bouquet_1.jpg",
      "https://example.com/images/peony_bouquet_2.jpg",
    ],
    occasions: ["Weddings", "Anniversaries"],
    delivery_time: "1-3 Days",
  },
  {
    id: "F005",
    name: "Sunshine Sunflower Vase",
    type: "Flower Arrangement",
    flowers: ["Sunflower"],
    description:
      "A bright sunflower bouquet in a glass vase to add cheer and positivity to any room.",
    price: 499,
    discount: 0,
    final_price: 499,
    currency: "INR",
    stock: 40,
    images: [
      "https://example.com/images/sunflower_vase_1.jpg",
      "https://example.com/images/sunflower_vase_2.jpg",
    ],
    occasions: ["Friendship", "Summer Events"],
    delivery_time: "1-2 Days",
  },
  {
    id: "B001",
    name: "Romantic Mixed Flower Basket",
    type: "Flower Basket",
    flowers: ["Rose", "Lily", "Carnation"],
    description:
      "A charming basket of mixed roses, lilies, and carnations for birthdays or romantic gestures.",
    price: 1499,
    discount: 20,
    final_price: 1199,
    currency: "INR",
    stock: 10,
    images: [
      "https://example.com/images/mixed_basket_1.jpg",
      "https://example.com/images/mixed_basket_2.jpg",
    ],
    occasions: ["Birthdays", "Anniversaries", "Valentine's Day"],
    delivery_time: "1-3 Days",
  },
  {
    id: "B002",
    name: "Luxury Orchid Basket",
    type: "Flower Basket",
    flowers: ["Orchid"],
    description:
      "Exquisite orchids arranged in a decorative basket, perfect for gifting on special occasions.",
    price: 2499,
    discount: 15,
    final_price: 2124,
    currency: "INR",
    stock: 8,
    images: [
      "https://example.com/images/orchid_basket_1.jpg",
      "https://example.com/images/orchid_basket_2.jpg",
    ],
    occasions: ["Special Occasions", "Home Decor"],
    delivery_time: "2-4 Days",
  },
];

const slides = [
  { id: 1, image: "https://source.unsplash.com/800x400/?flower1", link: "/product/1" },
  { id: 2, image: "https://source.unsplash.com/800x400/?flower2", link: "/product/2" },
  { id: 3, image: "https://source.unsplash.com/800x400/?flower3", link: "/product/3" },
  { id: 4, image: "https://source.unsplash.com/800x400/?flower4", link: "/product/4" },
  { id: 5, image: "https://source.unsplash.com/800x400/?flower5", link: "/product/5" },
  { id: 6, image: "https://source.unsplash.com/800x400/?flower6", link: "/product/6" },
];

const shopImages = [
  { id: 1, image: "https://source.unsplash.com/400x400/?bouquet"},
  { id: 2, image: "https://source.unsplash.com/400x400/?roses" },
  { id: 3, image: "https://source.unsplash.com/400x400/?lilies" },
  { id: 4, image: "https://source.unsplash.com/400x400/?tulips" },
]


export default function Home() {
  const [loaded, setLoaded] = useState(false);
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
      <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
    )
  };


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
                  className="flex gap-2 px-2 whitespace-nowrap snap-start snap-always"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-28 h-28 relative">
                      {/* Skeleton */}
                      {!loaded && (
                        <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
                      )}

                      {/* Actual image */}
                      <img
                        className={`w-28 h-28 rounded-full object-cover object-center border border-gray-400 ${
                          loaded ? "block" : "hidden"
                        }`}
                        src={item.image}
                        alt={item.collection}
                        onLoad={() => setLoaded(true)}
                        onError={() => setLoaded(true)}
                      />
                    </div>
                    {item.collection}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* tranding products */}
      <div className="flex flex-col w-full gap-3 py-6 px-2">
        <h2 className="flex font-mono text-2xl justify-center sm:text-3xl">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 py-4">
          {/* Example Product Cards */}
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col bg-white shadow-md rounded-lg p-3 h-full"
            >
              <div className="w-full h-36 mb-2 relative">
                {/* Skeleton */}
                {!loaded && (
                  <div className="absolute inset-0 rounded-lg bg-gray-300 animate-pulse" />
                )}

                {/* Actual image */}
                <img
                  src={product.images[0]}
                alt={product.name}
                  className={`w-full h-full object-cover rounded-lg ${
                    loaded ? "block" : "hidden"
                  }`}
                  onLoad={() => setLoaded(true)}
                  onError={() => setLoaded(true)}
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 text-white" viewBox="0 0 640 640"><path d="M342.6 534.6C330.1 547.1 309.8 547.1 297.3 534.6L137.3 374.6C124.8 362.1 124.8 341.8 137.3 329.3C149.8 316.8 170.1 316.8 182.6 329.3L320 466.7L457.4 329.4C469.9 316.9 490.2 316.9 502.7 329.4C515.2 341.9 515.2 362.2 502.7 374.7L342.7 534.7zM502.6 182.6L342.6 342.6C330.1 355.1 309.8 355.1 297.3 342.6L137.3 182.6C124.8 170.1 124.8 149.8 137.3 137.3C149.8 124.8 170.1 124.8 182.6 137.3L320 274.7L457.4 137.4C469.9 124.9 490.2 124.9 502.7 137.4C515.2 149.9 515.2 170.2 502.7 182.7z"/></svg>
          </button>
        </div>
      </div>

      {/* More About Us */}
      <div className="flex flex-col w-full gap-3 py-6 px-2">
        <h2 className="flex font-mono text-2xl justify-center pb-2 sm:text-3xl">More About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 py-4">
          {shopImages.map((item) => (
            <div key={item.id} className="w-full min-h-64 relative">
              {/* Skeleton */}
              {!loaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse" />
              )}

              {/* Actual image */}
              <img
                src={item.image}
                alt={`Shop Image ${item.id}`}
                className={`w-full h-full object-cover border-1 border-gray-300 ${
                  loaded ? "block" : "hidden"
                }`}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}


    </div>
  );
}
