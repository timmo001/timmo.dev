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
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-violet-900 to-[#020617] text-white">
          <header
            className="flex min-h-[48rem] w-full items-end justify-start bg-cover bg-center p-8"
            style={{
              backgroundImage: "url('/logo-square-wide-nobackground.png')",
            }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Aidan Timson (
              <span className="text-[hsl(280,100%,70%)]">Timmo</span>)
            </h1>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
