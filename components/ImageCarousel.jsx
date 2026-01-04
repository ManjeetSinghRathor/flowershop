"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const sliderRef = useRef(null);

  const minSwipeDistance = 50;

  const slideTo = (index) => {
    if (isSliding) return;
    setIsSliding(true);

    const slider = sliderRef.current;
    slider.style.transition = "transform 0.35s ease";
    slider.style.transform = `translate3d(-${index * 100}%, 0, 0)`;

    setTimeout(() => {
      setCurrent(index);
      slider.style.transition = "none";
      setIsSliding(false);
    }, 350);
  };

  const prevImage = () =>
    slideTo(current === 0 ? images.length - 1 : current - 1);

  const nextImage = () =>
    slideTo(current === images.length - 1 ? 0 : current + 1);

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
      {/* MAIN IMAGE */}
      <div
        className="relative w-full aspect-square overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={sliderRef}
          className="flex h-full will-change-transform"
          style={{ transform: `translate3d(-${current * 100}%, 0, 0)` }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center w-full h-full flex-shrink-0"
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={img.imgUrl}
                  alt={`Image ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={90}
                priority={idx === 0}
                placeholder="blur"
                blurDataURL="/blur-placeholder.png"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white px-2 py-1 rounded-full"
        >
          ◀
        </button>

        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white px-2 py-1 rounded-full"
        >
          ▶
        </button>
      </div>

      {/* THUMBNAILS */}
      <div className="relative mt-4">
        <div className="flex gap-2 overflow-x-auto px-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => slideTo(idx)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition
                ${current === idx ? "border-gray-700" : "border-transparent"}`}
            >
              <Image
                src={img.imgUrl}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                quality={60}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>

        {/* Fade hint */}
        <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
