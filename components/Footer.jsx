"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

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
              <FiChevronDown
                className={`md:hidden transition-transform duration-300 ${
                  openSection === "customer" ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-700 text-sm text-center md:text-left ${
                openSection === "customer" ? "max-h-64 opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
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
              <FiChevronDown
                className={`md:hidden transition-transform duration-300 ${
                  openSection === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out text-sm text-gray-800 ${
                openSection === "contact" ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
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
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/916361132722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600 transition-colors text-3xl"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 transition-colors text-3xl"
                >
                  <FaFacebook />
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
