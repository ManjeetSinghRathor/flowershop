import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {

  const customerLinks = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Contact Us", href: "/contact" },
    { title: "Shipping and Delivery", href: "/shipping-and-delivery" },
    { title: "Return & Refund Policy", href: "/return-refund-policy" },
  ];

  return (
    <div className="list-layout flex flex-col w-full items-center gap-6">
      <footer className="w-full bg-primary pt-2 pb-4 px-4">
        <hr className='w-full h-[1px] bg-gray-600 px-4 mb-6' />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-2">
            <h1 className='flex w-full justify-center text-xl sm:text-2xl font-bold text-center'><img className="h-14 w-auto" src="./favicon.png" alt="" /></h1>
            <p className='text-sm text-gray-500 pl-2 text-center'>Express love, gratitude, and happiness effortlessly with our fresh hand-picked flowers for every occasion.</p>
          </div>

          {/* Student Resources */}
          <div className='flex flex-col items-center'>
            <h4 className="text-lg font-semibold mb-2">
              Customer Service
            </h4>
            <ul className="space-y-2 text-gray-700 text-sm text-center md:text-start">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="anchor-tag a">{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className='flex flex-col items-center sm:items-start'>
            <h4 className="text-lg font-semibold mb-2">Get in Touch</h4>
            <p className="grid grid-cols-[2fr_5fr] text-sm text-gray-800 break-words text-start max-w-xs">
              <span>
                ✉️ Email:{" "}
              </span>
              <a
                href="mailto:bloomsheaven.ltd@gmail.com"
                className="anchor-tag text-gray-700"
              >
                bloomsheaven.ltd@gmail.com
              </a>

              <span>
                📞 Phone:{" "}
              </span>
              <a
                href="tel:+916361132722"
                className="anchor-tag text-gray-700"
              >
                +916361132722
              </a>

              <span>
                📍 Location:{" "}
              </span>
              <a
                href="https://www.google.com/maps?q=12.9474117,77.5995856"
                target='_blank'
                className="anchor-tag text-gray-700"
              >
                7th Cross Rd, Chinnayanpalya, Wilson Garden, 
                Bengaluru, Karnataka 560030
              </a>
            </p>

            <div className="flex mt-4 space-x-4">
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

        <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} FLOWERSHOP.COM. All rights
          reserved. | <Link href="/privacy-policy" className="anchor-tag a">Privacy Policy</Link> | <Link href="/terms-and-conditions" className='a cursor-default'>Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}

export default Footer;