import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonnenuntergang in München",
  description: "Ein kleines, schönes Sunset-Widget für deinen Balkon in München.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  themeColor: "#f2b654",
  openGraph: {
    title: "Sonnenuntergang von deinem Balkon",
    description:
      "Zeigt dir, wann der nächste schöne Sonnenuntergang von deinem Balkon aus zu sehen ist.",
    url: "https://sunset-in-munich.example", // update to real URL when deployed
    siteName: "Sonnenuntergang von deinem Balkon",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Retro Sonne bei Sonnenuntergang über München",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Sonnenuntergang in München",
    description:
      "Zeigt dir, wann der nächste schöne Sonnenuntergang über München von deinem Balkon aus zu sehen ist.",
    images: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
