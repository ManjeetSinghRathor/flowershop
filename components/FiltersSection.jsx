"use client";
import React, { useMemo, useState, useEffect } from "react";

const FiltersSection = ({ collection_products = [], openFilters, setOpenFilters, onFilter }) => {
  // ✅ extract unique filter options from your collection_products
  const filterOptions = useMemo(() => {
    const flowers = new Set();
    const colors = new Set();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    collection_products.forEach((product) => {
      product.flowers?.forEach((f) => flowers.add(f));
      product.colors?.forEach((c) => colors.add(c));

      product.sizes?.forEach((s) => {
        if (s.finalPrice) {
          minPrice = Math.min(minPrice, s.finalPrice);
          maxPrice = Math.max(maxPrice, s.finalPrice);
        }
      });
    });

    return {
      flowers: [...flowers],
      colors: [...colors],
      priceRange: [
        minPrice === Infinity ? 0 : minPrice,
        maxPrice === -Infinity ? 0 : maxPrice,
      ],
    };
  }, [collection_products]);

  // ✅ filter state
  const [selected, setSelected] = useState({
    flowers: [],
    colors: [],
    price: filterOptions.priceRange,
  });

  // ✅ handle selection
  const toggleSelection = (type, value) => {
    setSelected((prev) => {
      const current = new Set(prev[type]);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [type]: [...current] };
    });
  };

  // ✅ handle price range
  const handlePriceChange = (e, index) => {
    const newPrice = [...selected.price];
    newPrice[index] = Number(e.target.value);
    setSelected((prev) => ({ ...prev, price: newPrice }));
  };

  // ✅ apply filters
  const applyFilters = () => {
    const filtered = collection_products.filter((p) => {
      // flower filter
      const flowerMatch =
        selected.flowers.length === 0 ||
        p.flowers?.some((f) => selected.flowers.includes(f));

      // color filter
      const colorMatch =
        selected.colors.length === 0 ||
        p.colors?.some((c) => selected.colors.includes(c));

      // price filter
      const minPrice = selected.price[0];
      const maxPrice = selected.price[1];
      const priceMatch = p.sizes?.some(
        (s) => s.finalPrice >= minPrice && s.finalPrice <= maxPrice
      );

      return flowerMatch && colorMatch && priceMatch;
    });

    onFilter?.(filtered); // send back filtered list
  };

      useEffect(() => {
            if (openFilters) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
            return () => {
                document.body.style.overflow = "";
            };
        }, [openFilters]);

      useEffect(() => {
                  const handlePopState = () => {
                      // Just close on back button
                      if (openFilters) {
                          setOpenFilters(false);
                      }
                  };
      
                  if (openFilters) {
                      // Add history entry when modal opens
                      window.history.pushState({ modalOpen: true }, "");
                      window.addEventListener("popstate", handlePopState);
                  }
          
                  return () => {
                      window.removeEventListener("popstate", handlePopState);
                  };
              }, [openFilters]);

  return (
    <div className="p-4 bg-white shadow-sm w-full max-w-xl" onClick={(e)=>e.stopPropagation()}>
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-2xl font-semibold flex items-center w-full gap-2">
          🌸 Filters
        </h2>
        <span
          className="flex w-full justify-end cursor-pointer text-lg"
          onClick={() => setOpenFilters(false)}
        >
          ❌
        </span>
      </div>

      <hr className="flex h-[1px] bg-gray-200 w-full my-3"/>

      {/* By Flowers */}
      <div className="mb-4">
        <h3 className="font-mono font-[300] mb-1">By Flowers</h3>
        <div className="flex flex-wrap gap-2">
          {filterOptions.flowers.map((f) => (
            <button
              key={f}
              onClick={() => toggleSelection("flowers", f)}
              className={`px-3 py-1 rounded-full border ${selected.flowers.includes(f)
                  ? "bg-pink-500 text-white"
                  : "bg-white"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* By Color */}
      <div className="mb-4">
        <h3 className="font-mono font-[300] mb-1">By Color</h3>
        <div className="flex flex-wrap gap-2">
          {filterOptions.colors.map((c) => (
            <button
              key={c}
              onClick={() => toggleSelection("colors", c)}
              className={`px-3 py-1 rounded-full border ${selected.colors.includes(c)
                  ? "bg-blue-500 text-white"
                  : "bg-white"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* By Price */}
      <div className="mb-4">
        <h3 className="font-mono font-[300] mb-1">By Price</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={selected.price[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-20 border rounded p-1 text-center"
          />
          <span>–</span>
          <input
            type="number"
            value={selected.price[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-20 border rounded p-1 text-center"
          />
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Range: ₹{filterOptions.priceRange[0]} – ₹{filterOptions.priceRange[1]}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="bg-black text-white px-4 py-2 mt-2 rounded-md hover:bg-gray-800"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FiltersSection;