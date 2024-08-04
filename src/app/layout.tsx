import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ContactLinks } from "~/components/contactLinks";
import { Navigation } from "~/components/navigation";
import { TextFadeInUp } from "~/components/animations/text";
import { ThemeProvider } from "~/components/theme-provider";

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
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TextFadeInUp>
            <div className="absolute flex w-full flex-row justify-between gap-x-4 px-4 py-2">
              <Navigation />
              <div className="flex flex-row items-center gap-x-4">
                <ContactLinks classes="h-8 w-8 fill-white transition-transform duration-300 ease-in-out hover:scale-105" />
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
