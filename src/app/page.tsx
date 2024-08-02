import { TextGrab } from "~/app/_components/animations/text";

export default function Home() {
  return (
    <>
      <header
        className="max-w-screen flex min-h-screen w-full select-none flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-8"
        style={{
          backgroundImage: "url('/logo-square-wide-nobackground.png')",
        }}
      >
        <div className="flex flex-wrap items-baseline justify-start text-start">
          <TextGrab>
            <span className="me-6 text-4xl font-bold leading-none tracking-tight text-white sm:text-[6rem]">
              Aidan Timson
            </span>
          </TextGrab>
          <TextGrab>
            <span className="text-nowrap text-[0.6rem] font-bold leading-none tracking-normal sm:text-[2rem]">
              <span className="text-indigo-500">Timmo</span> /{" "}
              <span className="text-indigo-500">@timmo001</span>
            </span>
          </TextGrab>
        </div>
        <TextGrab>
          <h2 className="text-wrap text-xs font-extrabold leading-snug tracking-tight text-white sm:text-[4rem]">
            Software Developer
          </h2>
        </TextGrab>
      </header>

      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
      </div>
    </>
  );
}
