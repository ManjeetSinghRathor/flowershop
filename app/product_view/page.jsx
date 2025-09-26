import { Suspense } from "react";
import ProductView from "@/components/ProductView";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex w-full justify-center py-2">Loading...</div>}>
      <ProductView />
    </Suspense>
  );
}
