import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Card Sorting Digital — Arquitetura de Informação INEMA",
  description:
    "Ferramenta de Card Sorting digital para definição da arquitetura de menus e fluxos do novo sistema ambiental do INEMA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${jakarta.className} antialiased bg-slate-50 min-h-screen text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
