import { Suspense } from "react";
import TnCPolicy from "@/components/TnCPolicy";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <TnCPolicy />
    </Suspense>
  );
}