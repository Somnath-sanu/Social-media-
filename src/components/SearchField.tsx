"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;

    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  /**
   * encodeURIComponent(q) -> to escape from special characters like %$#...
   * as they have special meaning in URLs
   *
   * --------//?PROGRESSIVE ENHANCEMENT (Features work without javascrit)
   * method = GET (by default)
   * if js disabled , form action will take care else handleSubmit
   * without action , if js is disabled , if u search something u wont redirected to that page (search page)
   */

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      </div>
    </form>
  );
}
