import { Suspense } from "react";
import Profile from "@/components/Profile";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full justify-center py-2">Loading...</div>}>
      <Profile />
    </Suspense>
  );
}
