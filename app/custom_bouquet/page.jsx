import { Suspense } from "react";
import CustomBouquet from "@/components/CustomBouquet";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <CustomBouquet />
    </Suspense>
  );
}
