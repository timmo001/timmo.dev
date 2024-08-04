import { TextFadeInUp, TextFadeInUpGrab } from "~/components/animations/text";
import { ContactLinks } from "~/components/contactLinks";
import GitHubStats from "~/components/github/stats";
import GitHubTopLanguages from "~/components/github/topLanguages";
import { getStats, getTopLanguages, USERNAME } from "~/lib/github";
import { getUserData } from "~/server/github";

export const dynamic = "force-dynamic";

export default async function Stats() {
  const { user } = await getUserData(USERNAME);
  const [githubStats, githubTopLanguages] = await Promise.all([
    getStats(user),
    getTopLanguages(user),
  ]);
  return (
    <>
      <header className="h-[50vh] min-h-96 w-full bg-gradient-to-b from-violet-900 to-slate-950 p-4">
        <div
          className="max-w-screen flex h-full w-full flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-16"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        >
          <div className="flex flex-wrap items-baseline justify-start text-start">
            <TextFadeInUpGrab>
              <span className="me-6 text-8xl font-bold leading-none tracking-tight text-white">
                Stats
              </span>
            </TextFadeInUpGrab>
            <TextFadeInUpGrab>
              <span className="text-nowrap text-4xl font-bold leading-none tracking-normal">
                <span className="text-indigo-500">Timmo</span> /{" "}
                <span className="text-indigo-500">@timmo001</span>
              </span>
            </TextFadeInUpGrab>
          </div>
        </div>
      </header>

      <div className="flex w-full flex-col items-center justify-start bg-gradient-to-b from-slate-950 to-gray-950 px-4 py-16">
        <div className="container flex w-full flex-col items-center gap-16 text-center">
          <section>
            <TextFadeInUp>
              <div className="grid grid-cols-4 gap-12">
                <GitHubStats data={githubStats} />
              </div>
            </TextFadeInUp>
          </section>

          <section>
            <TextFadeInUpGrab>
              <h3 className="mb-4 text-2xl font-normal leading-snug tracking-tight text-white">
                Top Languages
              </h3>
            </TextFadeInUpGrab>
            <div className="grid grid-cols-6 gap-4">
              <GitHubTopLanguages data={githubTopLanguages} />
            </div>
          </section>

          <section>
            <TextFadeInUpGrab>
              <h3 className="mb-4 text-2xl font-normal leading-snug tracking-tight text-white">
                Contribution Graph
              </h3>
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
          </section>
        </div>
      </div>
    </>
  );
}
