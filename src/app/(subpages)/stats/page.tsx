import { type Metadata } from "next";

import {
  FadeInContainer,
  SlideInContainer,
  ScaleInContainer,
  StaggerContainer,
} from "~/components/ui/animations/containers";
import GitHubStats from "~/components/github/stats";
import GitHubTopLanguages from "~/components/github/topLanguages";
import { getStats, getTopLanguages, USERNAME } from "~/lib/github";
import { getUserData } from "~/server/github";
import { SubpageUI } from "~/components/subpage-ui";

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
    <SubpageUI title="Stats">
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
    </SubpageUI>
  );
}
