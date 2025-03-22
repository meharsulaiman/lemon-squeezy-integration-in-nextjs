"use client";

import { Suspense } from "react";
import ThankYouContent from "./ThankYouContent";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
