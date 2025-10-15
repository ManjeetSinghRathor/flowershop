import { Suspense } from "react";
import UserWishlist from "@/components/UserWishlist";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <UserWishlist />
    </Suspense>
  );
}
