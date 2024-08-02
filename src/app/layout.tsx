import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Aidan Timson (Timmo)",
  description: "Personal website for Aidan Timson (Timmo)",
  keywords: [
    "Aidan Timson",
    "Timmo",
    "Personal Website",
    "Software Engineer",
    "Software Developer",
    "Full-Stack Developer",
  ],
  icons: [{ rel: "icon", url: "/logo-letter-square-nobackground.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
