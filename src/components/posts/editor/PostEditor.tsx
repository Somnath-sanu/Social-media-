"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import CharacterCount from "@tiptap/extension-character-count";


import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/UserAvatar";

import "./styles.css";
import { useEffect, useRef, useState } from "react";

import { useSubmitPostMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import { model } from "@/components/AI/AiModel";
import { useToast } from "@/components/ui/use-toast";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";

export default function PostEditor() {
  const { user } = useSession();
  const [aiContent, setAiContent] = useState(false);
  const [aiQuestion, setAiQuestion] = useState<string>("");
  const [aiResultPending, setAiResultPending] = useState<boolean>(false);

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

  useEffect(() => {
    if (input.startsWith("@AI")) {
      setAiContent(true);
      setAiQuestion(input.split("@AI")[1]);
    }

    return () => {
      setAiContent(false);
    };
  }, [input]);

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

  function onPaste(e: any) {
    const files = Array.from(e.clipboardData.items)
      //@ts-ignore
      .filter((item) => item.kind === "file")
      //@ts-ignore
      .map((item) => item.getAsFile()) as File[];
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
            disabled={!input.trim() || isUploading}
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
