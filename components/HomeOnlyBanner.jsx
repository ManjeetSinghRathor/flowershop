"use client";

import { usePathname } from "next/navigation";

export default function HomeOnlyBanner() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <p className="font-serif flex flex-col w-full justify-center items-center text-center text-xs sm:text-sm px-4 py-3">
      <span className="text-red-600 font-semibold">
        🚚 We currently deliver only across Bangalore 🌸
      </span>
    </p>
  );
}
