import { validateRequest } from "@/auth";
import { Outfit, Nunito } from "next/font/google";
import { redirect } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <div className={`${outfit.variable} ${nunito.variable}`}>{children}</div>
  );
}
