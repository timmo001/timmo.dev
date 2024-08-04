import { TextFadeInUp, TextFadeInUpGrab } from "~/components/animations/text";
import { ContactLinks } from "~/components/contactLinks";

export default function Home() {
  return (
    <>
      <header className="h-[50vh] min-h-96 w-full bg-gradient-to-b from-violet-900 to-slate-950 p-4">
        <div
          className="max-w-screen flex h-full w-full flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-16"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        />
      </header>

      <div className="flex w-full flex-col items-center justify-start bg-gradient-to-b from-slate-950 to-gray-950 px-4 py-16">
        <div className="container flex w-full flex-col gap-36">
          <div className="flex w-full flex-col items-center">
            <TextFadeInUpGrab>
              <h3 className="mb-8 text-2xl font-bold leading-snug tracking-tight text-white">
                GitHub Stats
              </h3>
            </TextFadeInUpGrab>
            <TextFadeInUp>
              <iframe
                src="https://stats.timmo.dev/github/stats?background=transparent&padding=0"
                title="Stats"
                height="390"
                width="780"
                style={{ border: 0, background: "transparent !important" }}
              ></iframe>
            </TextFadeInUp>
            <TextFadeInUpGrab>
              <h4 className="mb-4 text-2xl font-normal leading-snug tracking-tight text-white">
                Contribution Graph
              </h4>
            </TextFadeInUpGrab>
            <TextFadeInUp>
              <iframe
                src="https://ghchart.rshah.org/timmo001"
                title="timmo001"
                height="120"
                width="670"
                style={{ border: 0, background: "transparent !important" }}
              ></iframe>
            </TextFadeInUp>
          </div>

          <div className="flex w-full flex-col items-center">
            <TextFadeInUpGrab>
              <h3 className="mb-8 text-2xl font-bold leading-snug tracking-tight text-white">
                Contact
              </h3>
            </TextFadeInUpGrab>
            <TextFadeInUp>
              <div className="flex w-full max-w-screen-md flex-row flex-wrap justify-center gap-x-24 gap-y-16">
                <ContactLinks classes="h-32 w-32 fill-white transition-transform duration-300 ease-in-out hover:scale-110" />
              </div>
            </TextFadeInUp>
          </div>
        </div>
      </div>
    </>
  );
}
