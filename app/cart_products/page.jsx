import { Suspense } from "react";
import CartProducts from "@/components/CartProducts";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <CartProducts />
    </Suspense>
  );
}