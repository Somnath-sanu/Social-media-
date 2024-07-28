"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "../actions";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function PostEditor() {
  const { user } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin'?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function onSubmit() {
    try {
      setLoading(true);
      await submitPost(input);
      editor?.commands.clearContent();
    } catch (error) {
      console.log("Error Submitting post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border-b bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full max-w-[840px] overflow-hidden overflow-y-auto rounded-2xl bg-gray-100 px-5 py-3 font-mono text-black"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!input.trim() || loading}
          className="min-w-20"
        >
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Post
        </Button>
      </div>
    </div>
  );
}
