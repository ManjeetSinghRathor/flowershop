"use client";

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50; // minimum swipe length (px)

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index) => {
    setCurrent(index);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null); // reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      // swipe left
      nextImage();
    }

    if (distance < -minSwipeDistance) {
      // swipe right
      prevImage();
    }
  };

  return (
    <div className="w-full h-fit max-w-2xl mx-auto lg:sticky top-0 z-10">
      {/* Main Carousel */}
      <div
        className="relative w-full aspect-[1] max-h-[40vh] md:max-h-[50vh] rounded-xl overflow-hidden shadow-lg border-1 backdrop-blur-md p-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="w-full h-full object-contain transition-all duration-300"
        />

        {/* Left Arrow */}
        {/* <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
        >
          <FaChevronLeft size={16} />
        </button> */}
        {/* Right Arrow */}
        {/* <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
        >
          <FaChevronRight size={16} />
        </button> */}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 justify-center gap-4 pt-6 pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`h-16 w-auto rounded-lg overflow-hidden border-1 ${
              current === index ? "border-gray-400" : "border-transparent"
            } transition-all duration-200`}
          >
            <img
              src={img}
              alt={`Thumb ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
