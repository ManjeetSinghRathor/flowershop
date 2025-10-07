"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";


const FloatingButton = () => {
  const [position, setPosition] = useState(null); // null until set
  const [dragging, setDragging] = useState(false);
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const offset = useRef({ x: 0, y: 0 });

  // ✅ Set starting position once window is ready
  useLayoutEffect(() => {
    const startX = window.innerWidth - 80;
    const startY = window.innerHeight - 100;
    setPosition({ x: startX, y: startY });
  }, []);

  // 🖱️ Desktop drag
  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newX = Math.min(Math.max(0, e.clientX - offset.current.x), window.innerWidth - 70);
    const newY = Math.min(Math.max(0, e.clientY - offset.current.y), window.innerHeight - 70);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    snapToEdge();
  };

  // 📱 Mobile long-press drag
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const timer = setTimeout(() => {
      setIsTouchDragging(true);
      offset.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
    }, 250);
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e) => {
    if (!isTouchDragging) return;
    const touch = e.touches[0];
    const newX = Math.min(Math.max(0, touch.clientX - offset.current.x), window.innerWidth - 70);
    const newY = Math.min(Math.max(0, touch.clientY - offset.current.y), window.innerHeight - 70);
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer);
    if (isTouchDragging) {
      setIsTouchDragging(false);
      snapToEdge();
    }
  };

  const handleTouchCancel = handleTouchEnd;

  const snapToEdge = () => {
    const snapX = position.x < window.innerWidth / 2 ? 10 : window.innerWidth - 70;
    setPosition((prev) => ({ ...prev, x: snapX }));
  };

  // 💫 Opacity: 0.75 when dragging, 0 when unmounted or not ready
  const opacity = !position ? 0 : dragging || isTouchDragging ? 0.75 : 1;

  if (!position) return null; // hide until position calculated

  return (
    <Link
      href={"/shipping_orders"}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        left: position.x,
        top: position.y,
        opacity,
        transition:
          dragging || isTouchDragging
            ? "none"
            : "opacity 0.2s ease, left 0.25s ease, top 0.25s ease",
      }}
      className="fixed z-[40] w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500  text-white flex items-center justify-center cursor-pointer select-none shadow-lg active:scale-95 touch-none"
    >
      <Image
        src="/cargo_3045670.png"
        alt="Floating Icon"
        width={56}
        height={56}
        className="object-cover pointer-events-none select-none"
        draggable={false}
      />
    </Link>
  );
};

export default FloatingButton;
