import React, { useState } from "react";
import { Input, InputProps } from "./ui/input";
import { cn } from "@/lib/utils";
import { BotIcon, Eye, EyeOff } from "lucide-react";
import { model } from "./AI/AiModel";

interface PasswordProps extends InputProps {
  setPassword: (value: string) => void;
}

const PasswordAI = React.forwardRef<HTMLInputElement, PasswordProps>(
  ({ className, setPassword, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const prompt =
      "Generate a text that is exactly 8 or more characters long, including at least one number, one uppercase letter, one lowercase letter, and one special character from the set: @, #, %, &. The text should not contain spaces. Text doesn't makes any sense means random text like 'A@qw11rr'";

    async function genetateAIPassword() {
      try {
        setIsPending(true);
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        setPassword(result.response.text());
      } catch (error) {
        console.log("Error generating password :", error);
      } finally {
        setIsPending(false);
      }
    }

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-10", className)}
          //*pe-10 -> so that it wont cross eye icon ,
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
        <button
          className="absolute right-11 top-1/2 -translate-y-1/2 transform"
          title="Generate AI Password"
          onClick={genetateAIPassword}
          disabled={isPending}
        >
          <BotIcon
            className={cn("size-5", {
             "opacity-20" : isPending ,
            })}
          />
        </button>
      </div>
    );
  },
);

PasswordAI.displayName = "PasswordInput";

export { PasswordAI };
