"use client";

import Link from "next/link";
import React, { useState } from "react";

const Footer = () => {
  const [openSection, setOpenSection] = useState('contact');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const customerLinks = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    // { title: "Contact Us", href: "/contact" },
    { title: "Custom Bouquet", href: "/custom_bouquet" },
    { title: "Shipping and Delivery", href: "/shipping-and-delivery" },
    { title: "Return & Refund Policy", href: "/return-refund-policy" },
  ];

  return (
    <div className="list-layout flex flex-col w-full items-center gap-6">
      <footer className="w-full bg-primary pt-2 px-4">
        <hr className="w-full h-[1px] bg-gray-600 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-2">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start md:pl-4 gap-2">
            <h1 className="flex justify-center w-full text-xl sm:text-2xl max-w-xs font-bold">
              <img className="h-14 w-auto" src="./favicon.png" alt="" />
            </h1>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Express love, gratitude, and happiness effortlessly with our
              fresh hand-picked flowers for every occasion.
            </p>
          </div>

          {/* Customer Service - Collapsible */}
          <div className="flex flex-col items-center md:items-start">
            <button
              onClick={() => toggleSection("customer")}
              className="flex justify-between items-center w-full md:cursor-default text-lg font-semibold mb-1 md:mb-3"
            >
              Customer Service
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-5 h-5 md:hidden transition-transform duration-300 ${openSection === "customer" ? "rotate-180" : ""
                  }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <ul
              className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-700 text-sm text-center md:text-left ${openSection === "customer" ? "max-h-64 opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
                }`}
            >
              {customerLinks.map((link, index) => (
                <li key={index} className="my-2">
                  <Link href={link.href} className="anchor-tag hover:underline">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch - Collapsible */}
          <div className="flex flex-col items-center md:items-start">
            <button
              onClick={() => toggleSection("contact")}
              className="flex justify-between items-center w-full md:cursor-default text-lg font-semibold mb-2 md:mb-3"
            >
              Get in Touch
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-5 h-5 md:hidden transition-transform duration-300 ${openSection === "contact" ? "rotate-180" : ""
                  }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>

            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out text-sm text-gray-800 ${openSection === "contact" ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
                }`}
            >
              <p className="grid grid-cols-[2fr_5fr] gap-y-1 break-words max-w-xs mb-2">
                <span>✉️ Email:</span>
                <a
                  href="mailto:bloomsheaven.ltd@gmail.com"
                  className="anchor-tag text-gray-700 hover:underline"
                >
                  bloomsheaven.ltd@gmail.com
                </a>

                <span>📞 Phone:</span>
                <a
                  href="tel:+916361132722"
                  className="anchor-tag text-gray-700 hover:underline"
                >
                  +91 63611 32722
                </a>

                <span>📍 Location:</span>
                <a
                  href="https://www.google.com/maps?q=12.9474117,77.5995856"
                  target="_blank"
                  className="anchor-tag text-gray-700 hover:underline"
                >
                  7th Cross Rd, Chinnayanpalya, Wilson Garden, Bengaluru, Karnataka 560030
                </a>
              </p>

              <div className="flex mt-2 space-x-4 justify-center md:justify-start">
                <a
                  href="https://www.instagram.com/blooms_heaven_?utm_source=qr&igsh=MXRva3g1eGRuOXp4MQ=="
                  className="text-pink-500 hover:text-pink-600 transition-colors text-3xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.75-.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
                  </svg>

                </a>
                <a
                  href="https://wa.me/916361132722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600 transition-colors text-3xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M12.04 2C6.514 2 2 6.49 2 12.02c0 2.123.553 4.196 1.602 6.03L2 22l4.07-1.566A9.964 9.964 0 0012.04 22c5.526 0 10.04-4.49 10.04-9.98C22.08 6.49 17.566 2 12.04 2zm0 18a8.03 8.03 0 01-4.104-1.128l-.294-.176-2.414.93.78-2.351-.192-.303A8.018 8.018 0 014.02 12.02C4.02 7.58 7.61 4 12.04 4c4.428 0 8.02 3.58 8.02 8.02 0 4.42-3.592 7.98-8.02 7.98zm4.434-5.826c-.244-.122-1.444-.712-1.667-.793-.223-.081-.385-.122-.547.122-.162.244-.63.793-.772.956-.142.162-.284.182-.528.061-.244-.122-1.03-.38-1.962-1.213-.726-.648-1.217-1.448-1.36-1.692-.142-.244-.015-.376.107-.498.11-.109.244-.284.366-.426.122-.142.162-.244.244-.406.081-.162.04-.304-.02-.426-.061-.122-.547-1.32-.75-1.808-.197-.473-.397-.409-.547-.416-.142-.007-.304-.01-.466-.01-.162 0-.426.061-.65.304-.223.244-.852.832-.852 2.03 0 1.198.873 2.356.995 2.518.122.162 1.72 2.627 4.166 3.684.582.251 1.037.401 1.39.513.584.186 1.116.16 1.536.097.468-.07 1.444-.59 1.647-1.162.203-.572.203-1.063.142-1.162-.061-.098-.223-.162-.466-.284z" />
                  </svg>

                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 transition-colors text-3xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M13 3h4a1 1 0 011 1v3h-3c-.552 0-1 .448-1 1v3h4l-1 4h-3v8h-4v-8H8v-4h2V8c0-2.757 2.243-5 5-5z" />
                  </svg>

                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-6 border-t border-gray-700 py-2">
          © {new Date().getFullYear()} Bloom’s Heaven. All rights reserved. |{" "}
          <Link href="/privacy-policy" className="anchor-tag hover:underline">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link
            href="/terms-and-conditions"
            className="anchor-tag hover:underline"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
