"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";

interface FollowerDetails {
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
  followers?: FollowerDetails[];
}

export default function FollowerCount({
  userId,
  initialState,
  followers,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span className="select-none border-none outline-none">
      {!!followers ? (
        <FollowersDialog followers={followers}>
          <span className={cn("select-none", !!followers && "hover:underline")}>
            Followers:
          </span>{" "}
        </FollowersDialog>
      ) : (
        " Followers: "
      )}

      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}

function FollowersDialog({
  children,
  followers,
}: {
  children: React.ReactNode;
  followers: FollowerDetails[] | undefined;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="scrollbar-thumb-[#2e3d5b] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-[#09090a] scrollbar-thin max-h-52 overflow-y-auto">
        {!!followers &&
          followers.map((user, id) => (
            <DropdownMenuItem key={id}>
              {
                <>
                  <Link href={`/users/${user.username}`}>
                    <div className="flex w-full items-center justify-between gap-3">
                      <UserAvatar
                        avatarUrl={user.avatarUrl}
                        className="size-7"
                      />
                      <p> {user.displayName}</p>
                    </div>
                  </Link>
                </>
              }
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
