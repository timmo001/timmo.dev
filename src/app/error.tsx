"use client";
import { type Metadata } from "next";
import Link from "next/link";

import { TextFadeInUpGrab } from "~/components/ui/animations/text";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Error | Aidan Timson (Timmo)",
};

export default function Error() {
  return (
    <>
      <header
        className="h-[50vh] min-h-96 w-full bg-linear-to-b from-violet-900 to-slate-950 p-4"
        role="banner"
      >
        <div
          className="flex h-full w-full max-w-screen flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-8 md:p-16"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        >
          <div
            className="flex flex-wrap items-baseline justify-start text-start"
            role="main"
          >
            <TextFadeInUpGrab>
              <span className="me-6 text-6xl leading-none font-bold tracking-tight text-white">
                There was an error loading this page.
              </span>
            </TextFadeInUpGrab>
          </div>
          <TextFadeInUpGrab>
            <Link href="/">
              <Button className="mt-10 rounded-2xl">Return Home</Button>
            </Link>
          </TextFadeInUpGrab>
        </div>
      </header>
    </>
  );
}
