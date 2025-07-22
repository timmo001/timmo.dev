import { SlideInContainer } from "~/components/ui/animations/containers";
import { TextWave } from "~/components/ui/animations/text";

export function SubpageUI({
  children,
  title,
  showSubtitle = true,
}: {
  children: React.ReactNode;
  title: string;
  showSubtitle?: boolean;
}) {
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
              text={title}
              className="me-6 text-8xl leading-none font-bold tracking-tight text-white"
            />
            {showSubtitle && (
              <SlideInContainer direction="right" delay={1}>
                <span className="text-4xl leading-none font-bold tracking-normal text-nowrap">
                  <span className="text-indigo-500">Timmo</span> /{" "}
                  <span className="text-indigo-500">@timmo001</span>
                </span>
              </SlideInContainer>
            )}
          </div>
        </div>
      </header>

      <div
        className="flex w-full flex-col items-center justify-start bg-linear-to-b from-slate-950 to-gray-950 px-4 py-16"
        role="main"
      >
        {children}
      </div>
    </>
  );
}
