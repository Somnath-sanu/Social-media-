"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  const fallbackSrc = "/avatar-placeholder.png";
  const [src, setSrc] = useState(avatarUrl || fallbackSrc);

  useEffect(() => {
    setSrc(avatarUrl || fallbackSrc);
  }, [avatarUrl]);

  return (
    <Image
      src={src}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      unoptimized={src !== fallbackSrc}
      onError={() => setSrc(fallbackSrc)}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
