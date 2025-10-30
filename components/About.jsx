import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 sm:px-8 text-gray-800 leading-relaxed">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-3">
          About Bloom’s Heaven
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Bringing happiness, one bouquet at a time — because every flower we
          deliver carries a story, an emotion, and a smile.
        </p>
      </div>

      {/* Image and Intro */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-md">
          <Image
            src="/about-flowers.jpg"
            alt="Bloom’s Heaven Flowers"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-pink-500">
            Who We Are
          </h2>
          <p className="text-gray-700">
            <strong>Bloom’s Heaven</strong> is an online flower and gifting
            store dedicated to spreading joy through the art of fresh floral
            design. Founded with love and passion for nature’s beauty, we offer
            hand-crafted bouquets, elegant arrangements, and thoughtful gifts
            that help you express your emotions effortlessly.
          </p>
          <p className="mt-3 text-gray-700">
            From birthdays to weddings, from “thank you” to “I love you” — our
            flowers speak the language of care and connection.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-pink-50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-semibold mb-3 text-pink-600 text-center">
          Our Mission
        </h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          Our mission is simple — to make every special moment more memorable
          with the freshness of handpicked flowers and heartfelt service. We
          believe that gifting flowers is more than a gesture; it’s a way to
          share love, appreciation, and happiness in its purest form.
        </p>
      </div>

      {/* Our Promise */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <Image
            src="/freshness.png"
            alt="Fresh Flowers"
            width={60}
            height={60}
            className="mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-pink-600 mb-2">
            Always Fresh
          </h3>
          <p className="text-gray-700 text-sm">
            We use only the freshest, hand-picked blooms to ensure your bouquets
            arrive vibrant and full of life.
          </p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <Image
            src="/care.png"
            alt="Care and Craftsmanship"
            width={60}
            height={60}
            className="mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-pink-600 mb-2">
            Crafted with Care
          </h3>
          <p className="text-gray-700 text-sm">
            Every arrangement is designed by skilled florists with love and
            attention to detail.
          </p>
        </div>

        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
          <Image
            src="/delivery.png"
            alt="Timely Delivery"
            width={60}
            height={60}
            className="mx-auto mb-3"
          />
          <h3 className="text-lg font-semibold text-pink-600 mb-2">
            Timely Delivery
          </h3>
          <p className="text-gray-700 text-sm">
            We value your emotions — that’s why we ensure your flowers reach on
            time, every time.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-3 text-pink-500 text-center">
          Our Story
        </h2>
        <p className="text-gray-700 max-w-4xl mx-auto text-center">
          What started as a small passion for floral art has grown into a
          full-fledged online flower shop loved by hundreds of happy customers.
          Our journey began with a belief that every flower holds a story — and
          every customer deserves to be part of it. Today, Bloom’s Heaven stands
          for trust, creativity, and heartfelt service across every order.
        </p>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-pink-100 rounded-2xl py-10">
        <h2 className="text-2xl font-semibold mb-2 text-pink-600">
          Let’s Stay Connected 🌸
        </h2>
        <p className="text-gray-700 mb-4">
          Have a question or want a custom bouquet? We’d love to hear from you!
        </p>
        <a
          href="https://wa.me/916361132722"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition inline-block"
        >
          Chat on WhatsApp
        </a>
      </div>

      <p className="text-sm text-gray-500 mt-10 text-center">
        © {new Date().getFullYear()} Bloom’s Heaven. All rights reserved.
      </p>
    </div>
  );
};

export default About;
