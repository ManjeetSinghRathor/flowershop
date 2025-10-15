import { Suspense } from "react";
import PrivacyPolicy from "@/components/PrivacyPolicy";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <PrivacyPolicy />
    </Suspense>
  );
}
