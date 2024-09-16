import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import React from "react";
import Comments from "./Comments";

export const metadata: Metadata = {
  title: "Comments",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold font-serif pb-4">Comments</h1>
          <Comments />
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}
