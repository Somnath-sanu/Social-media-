import { Metadata } from "next";
import Link from "next/link";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import SignupForm from "./_components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

const GLOW_CITY_IMAGE =
  "https://images.unsplash.com/photo-1774979300738-5c8c05e1db6b?auto=format&w=800&q=80&fit=crop";

const HEART_ICON =
  "https://cdn.jsdelivr.net/npm/openmoji-named-svgs@latest/color/sparkling-heart.svg";

export default function SignupPage() {
  return (
    <AuthPageLayout
      variant="purple"
      bgImageSrc="/signup-image.jpg"
      panelImageSrc={GLOW_CITY_IMAGE}
      panelImageAlt="Glow city lights by Madeline Liu on Unsplash"
      quoteText="Find your code buddy."
      quoteSubtext="Ship together. Grow together 🚀"
      kanjiWatermark="友達"
      formKanji="登録"
      sparkleIconSrc={HEART_ICON}
      topLabel="Join CodePeers"
      title="Sign Up to CodePeers"
      subtitle={
        <>
          A place where <em>you</em> can find a friend 💫
        </>
      }
    >
      {/* Signup form */}
      <SignupForm />

      {/* Login link */}
      <p
        className="text-center text-sm"
        style={{ color: "rgba(130,150,200,0.65)" }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold underline decoration-[var(--link-underline)] underline-offset-2 transition-opacity hover:opacity-80"
          style={{
            background: "var(--link-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Log in
        </Link>
      </p>
    </AuthPageLayout>
  );
}
