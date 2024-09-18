import { Copy, Share } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { PostData } from "@/lib/types";

export default function ShareButton({ post }: { post: PostData }) {
  const { toast } = useToast();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant={"ghost"}
            size={"icon"}
            title="share post"
            className="flex select-none items-center gap-2 size-5 bg-transparent"
            asChild
          >
            <Share className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${window.location.origin}/posts/${post.id}`,
              );
              toast({
                description: "Copied to clipboard",
              });
            }}
            suppressHydrationWarning
          >
            <span className="flex select-none items-center gap-3">
              <Copy className="size-4" />
              Copy link
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
