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
    { title: "Home", href: "/home" },
    { title: "About Us", href: "/about" },
    { title: "Contact Us", href: "/contact" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms and Conditions", href: "/terms-and-conditions" },
    { title: "Return & Refund Policy", href: "/return-refund-policy" },
  ];

  return (
    <div className="list-layout flex flex-col w-full items-center gap-6">
      <footer className="w-full bg-primary py-8 px-4">
        <hr className='w-full h-[1px] bg-gray-600 px-4 mb-8'/>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-2">
            <h1 className='flex w-full justify-center text-xl sm:text-2xl font-bold text-center'>FLOWERSHOP.COM</h1>
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
            <p className="text-sm text-gray-800 break-words text-center">
              Email:{" "}
              <a
                // href="mailto:support@flowershop.com"
                className="anchor-tag text-gray-700"
              >
                support@flowershop.com
              </a>
            </p>

            <p className="text-sm text-gray-800">
              Phone:{" "}
              <a
                href="tel:+91XXXXXXXXXX"
                className="anchor-tag text-gray-700"
              >
                +91 xxx xxxx xxx
              </a>
            </p>

            <p className="text-sm text-gray-800">
              Location:{" "}
              <a
                href="https://www.google.com/maps/place/Your+Location"
                className="anchor-tag text-gray-700"
              >
                Your Address Here
              </a>
            </p>

            <div className="flex mt-4 space-x-4">
              <a
                href="https://www.instagram.com/graduate.mentors/?igsh=bjgxczU1Y2M2M3px#"
                className="text-pink-500 hover:text-pink-600 transition-colors text-3xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.instagram.com/graduate.mentors/?igsh=bjgxczU1Y2M2M3px#"
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
          reserved. | <span className='a cursor-default'>Privacy Policy</span> | <span className='a cursor-default'>Terms of Service</span> | <span className='a cursor-default'>Return & Refund Policy</span>
        </div>
      </footer>
    </div>
  )
}

export default Footer;