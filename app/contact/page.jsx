import { Suspense } from "react";
import ContactUs from "@/components/ContactUs";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <ContactUs />
    </Suspense>
  );
}
