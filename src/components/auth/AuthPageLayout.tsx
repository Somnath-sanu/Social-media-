import Image from "next/image";

interface AuthPageLayoutProps {
  children: React.ReactNode;
  /** Absolute URL for the right panel image */
  panelImageSrc: string;
  panelImageAlt: string;
  /** Path to the blurred full-page background image (from /public) */
  bgImageSrc: string;
  quoteText: string;
  quoteSubtext: string;
  /** Decorative Japanese characters shown as a faint watermark on the right panel */
  kanjiWatermark: string;
  /** Faint kanji shown behind the form on the left panel */
  formKanji: string;
  /** Controls accent gradient and border colors */
  variant?: "blue" | "purple";
  /** Sparkle/icon emoji URL shown beside the top label */
  sparkleIconSrc: string;
  /** Short label shown above the title */
  topLabel: string;
  /** Page heading */
  title: string;
  /** Subtitle below the heading */
  subtitle: React.ReactNode;
}

const VARIANTS = {
  blue: {
    cardBorder: "rgba(79,172,254,0.18)",
    cardShadow:
      "0 32px 80px rgba(0,0,0,0.7),0 0 60px rgba(79,172,254,0.07),inset 0 1px 0 rgba(255,255,255,0.05)",
    labelColor: "rgba(79,172,254,0.85)",
    titleGradient: "linear-gradient(135deg,#4facfe 0%,#c471f5 55%,#f953c6 100%)",
    inputBorder: "rgba(79,172,254,0.18)",
    caretColor: "#4facfe",
    orb1Color: "rgba(79,172,254,0.22)",
    orb2Color: "rgba(249,83,198,0.18)",
    neonBar: "linear-gradient(to right,#4facfe,#f953c6)",
    formKanjiColor: "rgba(79,172,254,0.06)",
    labelTextColor: "rgba(140,165,220,0.75)",
    dividerColor: "rgba(79,172,254,0.3)",
    linkGradient: "linear-gradient(135deg,#4facfe,#f953c6)",
    linkUnderline: "rgba(79,172,254,0.4)",
  },
  purple: {
    cardBorder: "rgba(196,113,245,0.18)",
    cardShadow:
      "0 32px 80px rgba(0,0,0,0.7),0 0 60px rgba(196,113,245,0.07),inset 0 1px 0 rgba(255,255,255,0.05)",
    labelColor: "rgba(196,113,245,0.85)",
    titleGradient:
      "linear-gradient(135deg,#c471f5 0%,#f953c6 55%,#ff6b6b 100%)",
    inputBorder: "rgba(196,113,245,0.18)",
    caretColor: "#c471f5",
    orb1Color: "rgba(196,113,245,0.22)",
    orb2Color: "rgba(79,172,254,0.18)",
    neonBar: "linear-gradient(to right,#c471f5,#f953c6)",
    formKanjiColor: "rgba(196,113,245,0.06)",
    labelTextColor: "rgba(160,140,220,0.75)",
    dividerColor: "rgba(196,113,245,0.3)",
    linkGradient: "linear-gradient(135deg,#c471f5,#4facfe)",
    linkUnderline: "rgba(196,113,245,0.4)",
  },
};

export default function AuthPageLayout({
  children,
  panelImageSrc,
  panelImageAlt,
  bgImageSrc,
  quoteText,
  quoteSubtext,
  kanjiWatermark,
  formKanji,
  variant = "blue",
  sparkleIconSrc,
  topLabel,
  title,
  subtitle,
}: AuthPageLayoutProps) {
  const v = VARIANTS[variant];

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-6 font-nunito"
      style={{ background: "#060b18" }}
    >
      {/* Full-page background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={bgImageSrc}
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.22, filter: "saturate(1.4)" }}
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(145deg,rgba(6,11,24,0.92) 0%,rgba(12,8,28,0.82) 60%,rgba(6,11,24,0.94) 100%)",
          }}
        />
      </div>

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute -left-28 -top-20 h-[480px] w-[480px] animate-pulse-orb rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${v.orb1Color}, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-24 h-[400px] w-[400px] animate-pulse-orb-delay rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${v.orb2Color}, transparent 70%)`,
        }}
      />

      {/* Glass card */}
      <div
        className="relative flex w-full overflow-hidden rounded-2xl"
        style={{
          maxWidth: "62rem",
          minHeight: "40rem",
          maxHeight: "44rem",
          background: "rgba(10,14,28,0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: `1px solid ${v.cardBorder}`,
          boxShadow: v.cardShadow,
        }}
      >
        {/* ── LEFT PANEL (form) ─────────────────────────────── */}
        <div className="relative flex w-full flex-col justify-center overflow-y-auto px-10 py-9 md:w-1/2">
          {/* Faint kanji watermark behind form */}
          <div
            className="pointer-events-none absolute right-4 top-4 select-none font-serif text-6xl font-black leading-none"
            style={{ color: v.formKanjiColor }}
          >
            {formKanji}
          </div>

          {/* Header */}
          <div className="mb-6 space-y-2 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <img
                src={sparkleIconSrc}
                alt=""
                className="h-5 w-5"
                decoding="async"
                loading="lazy"
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: v.labelColor, letterSpacing: "0.18em" }}
              >
                {topLabel}
              </span>
              <img
                src={sparkleIconSrc}
                alt=""
                className="h-5 w-5"
                decoding="async"
                loading="lazy"
              />
            </div>
            <h1
              className="font-outfit text-[2rem] font-extrabold leading-tight"
              style={{
                background: v.titleGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </h1>
            <p className="text-sm" style={{ color: "rgba(160,180,225,0.65)" }}>
              {subtitle}
            </p>
          </div>

          {/* Slot for form content */}
          <div
            className="space-y-4"
            style={
              {
                "--input-border": v.inputBorder,
                "--caret-color": v.caretColor,
                "--label-color": v.labelTextColor,
                "--divider-color": v.dividerColor,
                "--link-gradient": v.linkGradient,
                "--link-underline": v.linkUnderline,
              } as React.CSSProperties
            }
          >
            {children}
          </div>
        </div>

        {/* ── RIGHT PANEL (image) ────────────────────────────── */}
        <div className="relative hidden w-1/2 overflow-hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={panelImageSrc}
            alt={panelImageAlt}
            className="h-full w-full object-cover"
            style={{ filter: "saturate(1.2) brightness(0.82)" }}
            decoding="async"
            loading="lazy"
          />
          {/* Bottom-to-top gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top,rgba(6,11,24,0.95) 0%,rgba(6,11,24,0.3) 45%,rgba(6,11,24,0.08) 100%)",
            }}
          />
          {/* Left-edge blend */}
          <div
            className="absolute inset-y-0 left-0 w-12"
            style={{
              background:
                "linear-gradient(to right,rgba(6,11,24,0.9),transparent)",
            }}
          />

          {/* Floating star */}
          <div className="pointer-events-none absolute left-8 top-8 h-9 w-9 animate-float-star">
            <img
              src="https://cdn.jsdelivr.net/npm/openmoji-named-svgs@latest/color/glowing-star.svg"
              alt=""
              className="h-full w-full"
              decoding="async"
              loading="lazy"
            />
          </div>

          {/* Corner kanji */}
          <div
            className="pointer-events-none absolute right-7 top-7 select-none font-serif font-black leading-none"
            style={{
              fontSize: "2.8rem",
              color: "rgba(255,255,255,0.08)",
            }}
          >
            {kanjiWatermark}
          </div>

          {/* Bottom quote */}
          <div className="absolute bottom-8 left-7 right-7">
            <p
              className="font-outfit text-2xl font-extrabold leading-snug text-white"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
            >
              {quoteText}
            </p>
            <p
              className="mt-2 text-sm italic"
              style={{ color: "rgba(160,185,255,0.65)" }}
            >
              {quoteSubtext}
            </p>
            <div
              className="mt-3 h-0.5 w-24 rounded-full"
              style={{ background: v.neonBar }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
