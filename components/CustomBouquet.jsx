"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

const flowers = [
  { name: "Red Roses", price: 40, img: "/flowers/red-rose.jpg" },
  { name: "White Lilies", price: 55, img: "/flowers/white-lily.jpg" },
  { name: "Tulips", price: 45, img: "/flowers/tulip.jpg" },
  { name: "Carnations", price: 35, img: "/flowers/carnation.jpg" },
  { name: "Orchids", price: 60, img: "/flowers/orchid.jpg" },
];

const wrappings = [
  { name: "Classic Brown Paper", price: 20, img: "/wrapping/brown.jpg" },
  { name: "Soft Pink Wrap", price: 25, img: "/wrapping/pink.jpg" },
  { name: "Luxury White Silk", price: 35, img: "/wrapping/white.jpg" },
];

const ribbons = [
  { name: "Satin Red Ribbon", price: 10, img: "/ribbon/red.jpg" },
  { name: "Golden Ribbon", price: 12, img: "/ribbon/gold.jpg" },
  { name: "Silver Ribbon", price: 10, img: "/ribbon/silver.jpg" },
];

const CustomBouquet = () => {
  const [selectedFlowers, setSelectedFlowers] = useState({});
  const [selectedWrap, setSelectedWrap] = useState(null);
  const [selectedRibbon, setSelectedRibbon] = useState(null);

  // Increase or decrease flower count
  const toggleFlower = (flower) => {
    setSelectedFlowers((prev) => {
      const current = prev[flower.name]?.count || 0;
      const newCount = current + 1;
      return {
        ...prev,
        [flower.name]: newCount > 10 ? prev[flower.name] : { ...flower, count: newCount },
      };
    });
  };

  const decreaseFlower = (flower) => {
    setSelectedFlowers((prev) => {
      const current = prev[flower.name]?.count || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[flower.name];
        return updated;
      } else {
        return {
          ...prev,
          [flower.name]: { ...flower, count: current - 1 },
        };
      }
    });
  };

  const selectedFlowerList = Object.values(selectedFlowers);

  const total =
    selectedFlowerList.reduce((sum, f) => sum + f.price * f.count, 0) +
    (selectedWrap?.price || 0) +
    (selectedRibbon?.price || 0);

  const handleAddToCart = () => {
    if (!selectedFlowerList.length) {
      toast.error("Please select at least one flower 🌸");
      return;
    }
    toast.success("Custom bouquet added to cart 🛒");
  };

  return (
    <div className="min-h-screen w-full select-none">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="hidden sm:flex justify-center text-2xl lg:text-3xl font-bold text-center text-pink-600 mb-6">
          🌸 Create Your Own Bouquet
        </h1>

        {/* Flowers Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Choose Your Flowers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {flowers.map((flower) => {
              const selected = selectedFlowers[flower.name];
              return (
                <div
                  key={flower.name}
                  className={`relative cursor-pointer border rounded-xl p-3 text-center transition-all bg-white ${selected ? "border-pink-500 bg-pink-50" : "border-gray-200"
                    }`}
                >
                  <div
                    className="relative w-full h-28 sm:h-32 lg:h-36 aspect-[1]"
                    onClick={() => toggleFlower(flower)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      decreaseFlower(flower);
                    }}
                  >
                    <Image
                      src={flower.img}
                      alt={flower.name}
                      fill
                      sizes="(max-width: 640px) 7rem, (max-width: 1024px) 8rem, 9rem"
                      className="object-cover rounded-lg"
                    />

                    {/* Show quantity badge OR + overlay */}
                    {selected && selected.count > 0 ? (
                      <span className="absolute top-1 right-1 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                        {selected.count}
                      </span>
                    ) : (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-white text-3xl font-bold rounded-lg transition-all duration-200 hover:bg-black/30">
                        +
                      </div>
                    )}
                  </div>

                  <p className="mt-2 font-medium text-gray-700">{flower.name}</p>
                  <p className="text-sm text-gray-500">₹{flower.price}</p>
                  {selected && selected.count > 0 && (
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseFlower(flower)}
                        className="bg-gray-200 px-3 rounded text-gray-600 font-bold"
                      >
                        -
                      </button>
                      <span>{selected.count}</span>
                      <button
                        onClick={() => toggleFlower(flower)}
                        className="bg-gray-200 px-3 rounded text-gray-600 font-bold"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Wrapping Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Wrapping Paper
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {wrappings.map((wrap) => (
              <div
                key={wrap.name}
                onClick={() => setSelectedWrap(wrap)}
                className={`cursor-pointer border rounded-xl p-3 text-center transition-all bg-white ${selectedWrap === wrap
                  ? "border-pink-500 bg-pink-100"
                  : "border-gray-200"
                  }`}
              >
                <div
                  className="relative w-full h-28 sm:h-32 lg:h-36 aspect-[1]"
                  onClick={() => setSelectedWrap(wrap)}
                >
                  <Image
                    src={wrap.img}
                    alt={wrap.name}
                    fill
                    sizes="(max-width: 640px) 7rem, (max-width: 1024px) 8rem, 9rem"
                    className="object-cover rounded-lg"
                  />

                  {/* Show badge or + overlay */}
                  {selectedWrap === wrap ? (
                    <span className="absolute top-1 right-1 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                      ✓
                    </span>
                  ) : (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-white text-3xl font-bold rounded-lg transition-all duration-200 hover:bg-black/30">
                      +
                    </div>
                  )}
                </div>

                <p className="mt-2 font-medium text-gray-700">{wrap.name}</p>
                <p className="text-sm text-gray-500">₹{wrap.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ribbon Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pick a Ribbon
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {ribbons.map((ribbon) => (
              <div
                key={ribbon.name}
                onClick={() => setSelectedRibbon(ribbon)}
                className={`cursor-pointer border rounded-xl p-3 text-center transition-all bg-white ${selectedRibbon === ribbon
                  ? "border-pink-500 bg-pink-100"
                  : "border-gray-200"
                  }`}
              >
                <div
                  className="relative w-full h-28 sm:h-32 lg:h-36 aspect-[1]"
                  onClick={() => setSelectedRibbon(ribbon)}
                >
                  <Image
                    src={ribbon.img}
                    alt={ribbon.name}
                    fill
                    sizes="(max-width: 640px) 7rem, (max-width: 1024px) 8rem, 9rem"
                    className="object-cover rounded-lg"
                  />

                  {/* Show badge or + overlay */}
                  {selectedRibbon === ribbon ? (
                    <span className="absolute top-1 right-1 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                      ✓
                    </span>
                  ) : (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-white text-3xl font-bold rounded-lg transition-all duration-200 hover:bg-black/30">
                      +
                    </div>
                  )}
                </div>

                <p className="mt-2 font-medium text-gray-700">{ribbon.name}</p>
                <p className="text-sm text-gray-500">₹{ribbon.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <div className="border-t pt-8 mt-8">

          <div className="bg-pink-50/40 border border-pink-100 rounded-2xl p-5 shadow-sm">
            {/* Flowers Summary */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                🌸 Flowers
              </h3>
              {selectedFlowerList.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {selectedFlowerList.map((f) => (
                    <div
                      key={f.name}
                      className="relative rounded-xl overflow-hidden border border-pink-200"
                    >
                    <div className="relative w-full h-18 aspect-[1] rounded-lg overflow-hidden border border-pink-200">
                      <Image
                        src={f.img}
                        alt={f.name}
                        fill
                        sizes="(max-width: 640px) 7rem, (max-width: 1024px) 8rem, 9rem"
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs sm:text-sm text-center py-1 font-medium">
                        {f.name}
                      </div>
                      <span className="absolute top-1 right-1 bg-pink-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                        {f.count}
                      </span>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No flowers selected</p>
              )}
            </div>

            {/* Wrapping Summary */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                🎁 Wrapping
              </h3>
              {selectedWrap ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-pink-200">
                    <Image
                      src={selectedWrap.img}
                      alt={selectedWrap.name}
                      fill
                      sizes="(max-width: 640px) 7rem, (max-width: 1024px) 8rem, 9rem"
                      className="object-cover"
                    />
                  </div>
                  <p className="font-medium text-gray-700">{selectedWrap.name}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">None selected</p>
              )}
            </div>

            {/* Ribbon Summary */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                🎀 Ribbon
              </h3>
              {selectedRibbon ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-pink-200">
                    <Image
                      src={selectedRibbon.img}
                      alt={selectedRibbon.name}
                      fill
                      sizes="(max-width: 640px) 7rem, (max-width: 1024px) 8rem, 9rem"
                      className="object-cover"
                    />
                  </div>
                  <p className="font-medium text-gray-700">{selectedRibbon.name}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">None selected</p>
              )}
            </div>

            {/* Total + Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-pink-100 pt-5 mt-3">
              <p className="text-2xl font-bold text-pink-600 text-center sm:text-left">
                Total: ₹{total.toFixed(2)}
              </p>
              <div className="flex justify-center sm:justify-end gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm sm:text-base shadow-md"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={() => toast.success('Proceeding to order...')}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm sm:text-base shadow-md"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomBouquet;
