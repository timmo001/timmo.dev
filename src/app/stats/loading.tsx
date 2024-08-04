import { TextFadeInUpGrab } from "~/components/animations/text";

export default async function Loading() {
  return (
    <>
      <header
        className="h-[50vh] min-h-96 w-full bg-gradient-to-b from-violet-900 to-slate-950 p-4"
        role="banner"
      >
        <div
          className="max-w-screen flex h-full w-full flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-8 md:p-16"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        >
          <div
            className="flex flex-wrap items-baseline justify-start text-start"
            role="main"
          >
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
