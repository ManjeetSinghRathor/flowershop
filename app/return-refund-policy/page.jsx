import { Suspense } from "react";
import RRPolicy from "@/components/RRPolicy";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <RRPolicy />
    </Suspense>
  );
}
