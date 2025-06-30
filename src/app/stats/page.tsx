import { type Metadata } from "next";

import { TextWave } from "~/components/animations/text";
import {
  FadeInContainer,
  SlideInContainer,
  ScaleInContainer,
  StaggerContainer,
} from "~/components/animations/containers";
import GitHubStats from "~/components/github/stats";
import GitHubTopLanguages from "~/components/github/topLanguages";
import { getStats, getTopLanguages, USERNAME } from "~/lib/github";
import { getUserData } from "~/server/github";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stats | Aidan Timson (Timmo)",
  description: "Aggregated stats for Aidan Timson (Timmo/timmo001)",
};

export default async function Stats() {
  const { user } = await getUserData(USERNAME);
  const [githubStats, githubTopLanguages] = await Promise.all([
    getStats(user),
    getTopLanguages(user),
  ]);
  return (
    <>
      <header
        className="relative h-[50vh] min-h-96 w-full overflow-hidden bg-linear-to-b from-violet-900 to-slate-950 p-4"
        role="banner"
      >
        <div
          className="relative z-10 flex h-full w-full max-w-screen flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-8 md:p-16"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        >
          <div className="flex flex-wrap items-baseline justify-start text-start">
            <TextWave
              text="Stats"
              className="me-6 text-8xl leading-none font-bold tracking-tight text-white"
            />
            <SlideInContainer direction="right" delay={1}>
              <span className="text-4xl leading-none font-bold tracking-normal text-nowrap">
                <span className="text-indigo-500">Timmo</span> /{" "}
                <span className="text-indigo-500">@timmo001</span>
              </span>
            </SlideInContainer>
          </div>
        </div>
      </header>

      <div
        className="flex w-full flex-col items-center justify-start bg-linear-to-b from-slate-950 to-gray-950 px-4 py-16"
        role="main"
      >
        <div className="container flex w-full flex-col items-center gap-16 text-center">
          <section>
            <StaggerContainer staggerDelay={0.1}>
              <div className="grid grid-cols-2 gap-12 leading-snug tracking-tight sm:grid-cols-3 md:grid-cols-4">
                <GitHubStats data={githubStats} />
              </div>
            </StaggerContainer>
          </section>

          <section>
            <FadeInContainer delay={0.3}>
              <h3 className="mb-4 text-2xl leading-snug font-normal tracking-tight text-white">
                Top Languages
              </h3>
            </FadeInContainer>
            <ScaleInContainer delay={0.5}>
              <div className="grid grid-cols-3 gap-4 leading-snug tracking-tight sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                <GitHubTopLanguages data={githubTopLanguages} />
              </div>
            </ScaleInContainer>
          </section>

          <section>
            <FadeInContainer delay={0.7}>
              <h3 className="mb-4 text-2xl leading-snug font-normal tracking-tight text-white">
                Contribution Graph
              </h3>
            </FadeInContainer>
            <SlideInContainer direction="up" delay={0.9}>
              <iframe
                src="https://ghchart.rshah.org/timmo001"
                title="timmo001"
                height="120"
                width="670"
                style={{ border: 0, background: "transparent !important" }}
              ></iframe>
            </SlideInContainer>
          </section>
        </div>
      </div>
    </>
  );
}
