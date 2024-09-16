import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import CommentMoreButton from "./CommentMoreButton";
import { useSession } from "@/app/(main)/SessionProvider";

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useSession();

  const authUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const admins = authUsername?.split(" ");
  const isAdmin = admins?.some((admin) => admin === user.username)!;

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {(comment.user.id === user.id || isAdmin) && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-50 transition-opacity sm:opacity-0 sm:group-hover/comment:opacity-100"
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
