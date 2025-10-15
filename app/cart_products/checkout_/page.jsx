import { Suspense } from "react";
import CheckoutPage from "@/components/Checkout";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}