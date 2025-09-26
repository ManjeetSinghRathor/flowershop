import { Suspense } from "react";
import CollectionProducts from "@/components/CollectionProucts";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionProducts />
    </Suspense>
  );
}
