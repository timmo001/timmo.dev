import { TextTypewriter } from "~/components/ui/animations/text";
import {
  FadeInContainer,
  ScaleInContainer,
} from "~/components/ui/animations/containers";
import { SpinnerLoader, PulseLoader } from "~/components/ui/animations/loading";

export default function Loading() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-linear-to-b from-violet-900 to-slate-950 p-4">
      <FadeInContainer className="relative z-10">
        <div className="flex flex-col items-center gap-8">
          <ScaleInContainer delay={0.2}>
            <SpinnerLoader size={64} color="#6366f1" />
          </ScaleInContainer>
          <TextTypewriter
            text="Loading..."
            className="text-4xl font-semibold text-white"
          />
          <FadeInContainer delay={0.8}>
            <p className="text-center text-lg text-gray-300">
              Please wait while we load the content.
            </p>
          </FadeInContainer>
          <FadeInContainer delay={1.2}>
            <PulseLoader size={8} color="#818cf8" />
          </FadeInContainer>
        </div>
      </FadeInContainer>
    </div>
  );
}
