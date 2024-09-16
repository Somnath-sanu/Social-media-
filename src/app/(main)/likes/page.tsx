import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import React from "react";
import Likes from "./Likes";

export const metadata: Metadata = {
  title: "Likes",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="pb-4 text-center font-serif text-2xl font-bold">
            Likes
          </h1>
          <Likes />
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
}
