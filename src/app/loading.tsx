import { TextFadeInUpGrab } from "~/components/animations/text";

export default function Home() {
  return (
    <>
      <header
        className="h-screen w-full bg-linear-to-b from-violet-900 to-slate-950 p-4"
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
              <span className="me-6 text-8xl leading-none font-bold tracking-tight text-white">
                Page loading...
              </span>
            </TextFadeInUpGrab>
          </div>
        </div>
      </header>
    </>
  );
}
