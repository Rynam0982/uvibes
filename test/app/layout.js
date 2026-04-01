import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "KnowledgeShare — Plateforme de partage de connaissances B2B",
  description:
    "Une plateforme simple pour permettre à vos équipes d'échanger conseils, bonnes pratiques et retours d'expérience au quotidien.",
  keywords: "knowledge sharing, partage de connaissances, collaboration, B2B SaaS, entreprise",
  openGraph: {
    title: "KnowledgeShare — Transformez l'expérience collaborateur",
    description:
      "Une plateforme simple pour permettre à vos équipes d'échanger conseils, bonnes pratiques et retours d'expérience au quotidien.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
