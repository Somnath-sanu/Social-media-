import { Metadata } from "next";
import Link from "next/link";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import LoginForm from "./_components/LoginForm";
import GoogleSignInButton from "./google/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Login",
};

const TOKYO_NIGHT_IMAGE =
  "https://images.pexels.com/photos/2341282/pexels-photo-2341282.jpeg?auto=compress&cs=tinysrgb&w=800&q=80";

const SPARKLE_ICON =
  "https://cdn.jsdelivr.net/npm/openmoji-named-svgs@latest/color/sparkles.svg";

export default function Page() {
  return (
    <AuthPageLayout
      variant="blue"
      bgImageSrc="/login-image.jpg"
      panelImageSrc={TOKYO_NIGHT_IMAGE}
      panelImageAlt="Tokyo night city by Aleksandar Pasaric on Pexels"
      quoteText="Code. Connect. Create."
      quoteSubtext="Join devs who understand your grind 🌙"
      kanjiWatermark="東京"
      formKanji="ログイン"
      sparkleIconSrc={SPARKLE_ICON}
      topLabel="Welcome to CodePeers"
      title="Login to CodePeers"
      subtitle="Your anime dev community awaits ✨"
    >
      {/* Google sign-in */}
      <GoogleSignInButton />

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(to right,transparent,var(--divider-color),transparent)",
          }}
        />
        <span
          className="text-xs font-semibold"
          style={{ color: "rgba(130,150,200,0.6)" }}
        >
          OR
        </span>
        <div
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(to left,transparent,var(--divider-color),transparent)",
          }}
        />
      </div>

      {/* Login form */}
      <LoginForm />

      {/* Sign up link */}
      <p
        className="text-center text-sm"
        style={{ color: "rgba(130,150,200,0.65)" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold underline decoration-[var(--link-underline)] underline-offset-2 transition-opacity hover:opacity-80"
          style={{
            background: "var(--link-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Sign up
        </Link>
      </p>
    </AuthPageLayout>
  );
}
