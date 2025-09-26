import { Suspense } from "react";
import ProductView from "@/components/ProductView";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductView />
    </Suspense>
  );
}
