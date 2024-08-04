import { TextFadeInUpGrab } from "~/components/animations/text";

export default function Home() {
  return (
    <>
      <header className="h-screen w-full bg-gradient-to-b from-violet-900 to-slate-950 p-4">
        <div
          className="max-w-screen flex h-full w-full flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-16"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        >
          <div className="flex flex-wrap items-baseline justify-start text-start">
            <TextFadeInUpGrab>
              <span className="me-6 text-8xl font-bold leading-none tracking-tight text-white">
                Page loading...
              </span>
            </TextFadeInUpGrab>
          </div>
        </div>
      </header>
    </>
  );
}
