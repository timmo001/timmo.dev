import {
  TextFadeInUp,
  TextFadeInUpGrab,
} from "~/app/_components/animations/text";

export default function Home() {
  return (
    <>
      <header className="h-screen w-full p-4">
        <div
          className="max-w-screen flex h-full w-full flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-16"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        >
          <div className="flex flex-wrap items-baseline justify-start text-start">
            <TextFadeInUpGrab>
              <span className="me-6 text-8xl font-bold leading-none tracking-tight text-white">
                Aidan Timson
              </span>
            </TextFadeInUpGrab>
            <TextFadeInUpGrab>
              <span className="text-nowrap text-4xl font-bold leading-none tracking-normal">
                <span className="text-indigo-500">Timmo</span> /{" "}
                <span className="text-indigo-500">@timmo001</span>
              </span>
            </TextFadeInUpGrab>
          </div>
          <TextFadeInUpGrab>
            <h2 className="mt-4 text-wrap text-3xl font-semibold leading-snug tracking-tight text-white">
              Software Developer
            </h2>
          </TextFadeInUpGrab>
        </div>
      </header>

      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16">
        <div className="grid-row grid gap-x-4 gap-y-24 sm:grid-cols-1 md:grid-cols-2">
          <TextFadeInUpGrab>
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-white">
              About Me
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="text-lg font-normal leading-relaxed tracking-normal text-white">
              I am a developer with a passion for creating and maintaining
              software. I have experience in full-stack development and have
              worked on a variety of projects.
              <br />
              <br />
              I'm a tinkerer, who has a vast interest for technology, automation
              and software. I'm always looking to improve my skills and learn
              new things.
            </p>
          </TextFadeInUp>
        </div>
      </div>
    </>
  );
}
