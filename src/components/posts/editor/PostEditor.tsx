"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";

import "./styles.css";
import { useEffect, useState } from "react";

import { useSubmitPostMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import { model } from "@/components/AI/AiModel";
import { useToast } from "@/components/ui/use-toast";

export default function PostEditor() {
  const { user } = useSession();
  const [aiContent, setAiContent] = useState(false);
  const [aiQuestion, setAiQuestion] = useState<string>("");
  const [aiResultPending, setAiResultPending] = useState<boolean>(false);

  const mutation = useSubmitPostMutation();

  const { toast } = useToast();

  const customPrompt =
    "You are an AI assistant specialized in computer science and technology. Your role is to answer user questions about computer-related topics, such as programming languages (e.g., MERN stack), cloud computing (e.g., AWS), DevOps practices, computer architecture,data storage , blockchain,etc. Your responses should be informative, concise, and limited to 60-70 words.If the users question is not about these topics or involves personal, sensitive, or inappropriate content, respond with a polite and friendly message indicating that the question is not valid. For example: 'I'm here to help with questions related to computer science and technology. Please ask about topics like programming, cloud computing, or computer systems. For other queries, consider reaching out to the appropriate resources.'";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's new and exciting?",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  useEffect(() => {
    if (input.startsWith("@AI")) {
      setAiContent(true);
      setAiQuestion(input.split("@AI")[1]);
    }
  }, [input]);

  function onSubmit() {
    mutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  }

  async function getAIResult() {
    if (!aiQuestion.trim()) {
      toast({
        description: "Invalid Question",
        variant: "destructive",
      });
      return;
    }

    try {
      setAiResultPending(true);
      const result = await model.generateContent(customPrompt + aiQuestion);

      editor?.commands.setContent(result.response.text());
      setAiContent(false);
    } catch (error) {
      console.log("Error generating AI content :", error);
    } finally {
      setAiResultPending(false);
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
        {aiContent ? (
          <LoadingButton
            onClick={getAIResult}
            disabled={!input.trim()}
            className="min-w-20"
            loading={aiResultPending}
          >
            Get AI result
          </LoadingButton>
        ) : (
          <LoadingButton
            onClick={onSubmit}
            disabled={!input.trim()}
            className="min-w-20"
            loading={mutation.isPending}
          >
            Post
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
