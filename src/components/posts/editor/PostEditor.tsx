"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import CharacterCount from "@tiptap/extension-character-count";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";

import "./styles.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { useSubmitPostMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import { model } from "@/components/AI/AiModel";
import { toast, useToast } from "@/components/ui/use-toast";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, Copy, ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

export default function PostEditor() {
  const { user } = useSession();
  const [aiContent, setAiContent] = useState("");
  const [aiQuestion, setAiQuestion] = useState<string>("");
  const [aiResultPending, setAiResultPending] = useState<boolean>(false);

  const [outputImg, setOutputImg] = useState<string | null>(null);

  const limit = 280;

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

  const customPrompt =
    "You are an intelligent AI assistant for CodePeers, a collaborative developer community platform. Your expertise includes: programming languages (JavaScript, Python, Go, Rust, etc.), full-stack development (MERN, MEAN, etc.), cloud platforms (AWS, Azure, GCP), DevOps & infrastructure (Docker, Kubernetes, CI/CD), databases (SQL, NoSQL, Redis), APIs & microservices, mobile development, security best practices, and emerging tech (AI/ML, blockchain, edge computing). You provide concise, practical, and actionable responses optimized for developer engagement—keep answers under 70 words unless more detail is essential. Format code snippets clearly and link to relevant concepts. For off-topic or inappropriate requests, politely redirect: 'I'm here to help with tech & development topics. Feel free to ask about coding, cloud, DevOps, or architecture challenges!' Respond helpfully and professionally to foster community learning.";


  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's new and exciting?",
      }),
      CharacterCount.configure({
        limit,
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  //TODO: Mention users list

  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  }

  async function getAIResult() {
    if (aiQuestion.startsWith("/generate")) {
      const prompt = aiQuestion.split("/generate")[1];

      setOutputImg(encodeURIComponent(prompt));

      return;
    }
    try {
      setAiResultPending(true);
      const result = await model.generateContent(customPrompt + aiQuestion);

      setAiContent(result.response.text());
    } catch (error) {
      console.log("Error generating AI content :", error);
    } finally {
      setAiResultPending(false);
    }
  }

  function onPaste(e: any) {
    const files = Array.from(e.clipboardData.items)
      //@ts-ignore
      .filter((item) => item.kind === "file")
      //@ts-ignore
      .map((item) => item.getAsFile()) as File[];

    // console.log({
    //   files
    // });

    startUpload(files);
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border-b bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <div {...rootProps} className="w-full overflow-x-auto">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full max-w-[800px] resize-none overflow-hidden overflow-y-auto rounded-2xl border bg-gray-100 px-5 py-3 font-mono text-black",
              isDragActive && "outline-dashed dark:outline-white",
            )}
            onPaste={onPaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        <div
          className={`character-count ${editor?.storage.characterCount.characters() === limit ? "character-count--warning" : ""}`}
        >
          <svg height="20" width="20" viewBox="0 0 20 20">
            <circle r="10" cx="10" cy="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke={`${percentage < 90 ? "blue" : "red"}`}
              strokeWidth="10"
              strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
              transform="rotate(-90) translate(-20)"
            />
            <circle r="6" cx="10" cy="10" fill="white" />
          </svg>
        </div>
        <div title="Ask AI" className="">
          <AskAiDialog
            aiContent={aiContent}
            aiResultPending={aiResultPending}
            getAIResult={getAIResult}
            setAiQuestion={setAiQuestion}
            setAiContent={setAiContent}
            aiQuestion={aiQuestion}
          >
            <BotMessageSquare className="size-5 cursor-pointer hover:text-neutral-400" />
          </AskAiDialog>
        </div>
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />

        <LoadingButton
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
          loading={mutation.isPending}
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

/**
 ** mediaIds: attachments.map(a => a.mediaId).filter(Boolean) as string[]
 mediaId can be undefined , .filter(Boolean) will filter all undefined mediaId

 const a = [
  "a" , "b" , undefined , null
]
  const b = a.filter(Boolean)
  // ['a' , 'b']


 */

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/* , video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          console.log(e.target.files);

          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (filename: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}

/**
 * if we pass src with video tag,it will reload the video everytime the component re-render
 */

function AskAiDialog({
  children,
  aiResultPending,
  aiContent,
  getAIResult,
  setAiQuestion,
  setAiContent,
  aiQuestion,
  outputImg,
  setOutputImg,
  imageUrl,
}: {
  children: React.ReactNode;
  aiResultPending: boolean;
  aiContent: string;
  aiQuestion: string;
  getAIResult: () => void;
  setAiQuestion: Dispatch<SetStateAction<string>>;
  setAiContent: Dispatch<SetStateAction<string>>;
  outputImg?: string | null;
  setOutputImg?: Dispatch<SetStateAction<string | null>>;
  imageUrl?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Ask AI 🤖</DialogTitle>
          {/* <DialogDescription>
            Right click,copy image and paste it in the post input to post
            generated image
          </DialogDescription> */}
        </DialogHeader>
        <Copy
          className="size-4 cursor-pointer hover:text-neutral-300"
          onClick={async () => {
            if (!!aiContent) {
              await navigator.clipboard.writeText(aiContent);
              toast({
                description: "Answer copied 🙌",
              });
            }
          }}
        />
        <div className="flex flex-col items-center gap-4">
          <Textarea
            placeholder="What's on your mind today?"
            value={aiContent || aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            className="resize-none"
            rows={4}
            disabled={!!aiContent && true}
            required
            minLength={5}
          />
          {!!outputImg && (
            <Image
              src={imageUrl || ""}
              alt=""
              width={250}
              height={150}
              className="rounded-xl"
            />
          )}

          {!!aiContent || !!outputImg ? (
            <Button
              className="min-w-20"
              onClick={() => {
                setAiContent("");
                setAiQuestion("");
                // setOutputImg(null);
              }}
            >
              Ask again
            </Button>
          ) : (
            <LoadingButton
              onClick={() => {
                getAIResult();
              }}
              disabled={aiResultPending || !aiQuestion.trim()}
              className="min-w-20"
              loading={aiResultPending}
            >
              Go
            </LoadingButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
