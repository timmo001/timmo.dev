import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { ContactLinks } from "~/components/contactLinks";
import { Navigation } from "~/components/navigation";
import { TextFadeInUp } from "~/components/animations/text";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
  title: "Aidan Timson (Timmo)",
  applicationName: "Aidan Timson (Timmo)",
  description: "Personal website for Aidan Timson (Timmo)",
  publisher: "Aidan Timson",
  keywords: [
    "Aidan Timson",
    "Timmo",
    "Personal Website",
    "Software Engineer",
    "Software Developer",
    "Full-Stack Developer",
  ],
  icons: [{ rel: "icon", url: "/logo-letter-square-nobackground.png" }],
  openGraph: {
    siteName: "Aidan Timson (Timmo)",
    images: [{ url: "/og.png" }],
    url: "https://timmo.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TextFadeInUp>
            <div className="absolute flex w-full flex-row flex-wrap justify-between gap-4 px-4 py-2">
              <Navigation />
              <div className="ms-4 flex flex-row items-center gap-x-4">
                <ContactLinks classes="h-7 w-7 fill-white transition-transform duration-300 ease-in-out hover:scale-110" />
              </div>
            </div>
          </TextFadeInUp>
          <main className="flex min-h-screen flex-col items-center justify-start text-white">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
