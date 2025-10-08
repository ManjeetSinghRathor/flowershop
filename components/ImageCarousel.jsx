"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const sliderRef = useRef(null);

  const minSwipeDistance = 50;

  const prevImage = () => {
    if (isSliding) return;
    slideTo(current === 0 ? images.length - 1 : current - 1);
  };

  const nextImage = () => {
    if (isSliding) return;
    slideTo(current === images.length - 1 ? 0 : current + 1);
  };

  const goToImage = (index) => {
    if (isSliding || index === current) return;
    slideTo(index);
  };

  const slideTo = (index) => {
    setIsSliding(true);
    const slider = sliderRef.current;
    if (!slider) return;

    slider.style.transition = "transform 0.3s ease-in-out";
    slider.style.transform = `translateX(-${index * 100}%)`;

    setTimeout(() => {
      setCurrent(index);
      slider.style.transition = "none";
      slider.style.transform = `translateX(-${index * 100}%)`;
      setIsSliding(false);
    }, 300); // match transition duration
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextImage();
    if (distance < -minSwipeDistance) prevImage();
  };

  return (
    <div className="w-full max-w-2xl mx-auto lg:sticky top-18 z-10">
      {/* Main Carousel */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={sliderRef}
          className="flex w-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="flex items-center justify-center w-full max-h-[50vh] lg:max-h-[55vh] flex-shrink-0 aspect-[1]">
              <img
                src={img.imgUrl}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        >
          <FaChevronLeft size={18} />
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-10"
        >
          <FaChevronRight size={18} />
        </button>
      </div>

      <div className="relative mt-4">
        {/* Horizontal scroll container */}
        <div
          className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-1"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goToImage(idx)}
              className={`flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 ${current === idx ? "border-gray-600" : "border-transparent"
                }`}
            >
              <img
                src={img.imgUrl}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))} 
        </div>

        {/* Right gradient to indicate more items */}
        <div className="absolute top-0 right-0 h-full w-6 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
      </div>


    </div>
  );
}
