import { Suspense } from "react";
import About from "@/components/About";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-[50vh] w-full justify-center py-2">Loading...</div>}>
      <About />
    </Suspense>
  );
}