import Link from "next/link";
import { 
  TextFadeInUp, 
  TextFadeInUpGrab, 
  TextTypewriter, 
  TextWave,
  TextSlideInLeft,
  TextSlideInRight,
  TextGlow 
} from "~/components/animations/text";
import { 
  FadeInContainer, 
  SlideInContainer, 
  ScaleInContainer, 
  StaggerContainer 
} from "~/components/animations/containers";
import { StarField, GeometricShapes } from "~/components/animations/particles";
import { ContactLinks } from "~/components/contactLinks";

export default function Home() {
  return (
    <>
      <header
        className="relative h-screen w-full bg-linear-to-b from-violet-900 to-slate-950 p-4 overflow-hidden"
        role="banner"
      >
        <StarField count={100} />
        <GeometricShapes count={8} />
        <div
          className="flex h-full w-full max-w-screen flex-col items-start justify-end bg-contain bg-center bg-no-repeat p-8 md:p-16 relative z-10"
          style={{
            backgroundImage: "url('/logo-wide-nobackground.png')",
          }}
        >
          <div className="flex flex-wrap items-baseline justify-start text-start">
            <TextWave
              text="Aidan Timson"
              className="me-6 text-8xl leading-none font-bold tracking-tight text-white"
            />
            <SlideInContainer direction="right" delay={1}>
              <span className="text-4xl leading-none font-bold tracking-normal text-nowrap">
                <span className="text-indigo-500">Timmo</span> /{" "}
                <span className="text-indigo-500">@timmo001</span>
              </span>
            </SlideInContainer>
          </div>
          <TextTypewriter
            text="Software Developer"
            className="mt-4 text-3xl leading-snug font-semibold tracking-tight text-wrap text-white"
          />
        </div>
      </header>

      <div
        className="flex w-full flex-col items-center justify-start bg-linear-to-b from-slate-950 to-gray-950 px-4 py-16"
        role="main"
      >
        <StaggerContainer className="grid-row container grid gap-x-4 gap-y-36 px-2 sm:grid-cols-1 md:grid-cols-2" staggerDelay={0.2}>
          <TextSlideInLeft>
            <h3 className="text-3xl leading-snug font-bold tracking-tight text-white">
              About Me
            </h3>
          </TextSlideInLeft>
          <FadeInContainer delay={0.3}>
            <p className="text-start text-xl leading-relaxed font-normal tracking-normal text-white">
              My name is Aidan, but you might know me better as{" "}
              <a
                className="text-indigo-500 hover:text-indigo-400 transition-colors"
                href="https://github.com/timmo001"
                target="_blank"
                aria-label="GitHub profile"
              >
                Timmo
              </a>{" "}
              or{" "}
              <a
                className="text-indigo-500 hover:text-indigo-400 transition-colors"
                href="mailto:aidan@timmo.dev"
                target="_blank"
                aria-label="GitHub profile"
              >
                @timmo001
              </a>
              .
              <br />
              <br />
              I am a full-stack software developer with a passion for creating
              and maintaining software. I have experience in full-stack
              development and have worked on a variety of projects.
              <br />
              <br />
              I&apos;m a tinkerer, who has a vast interest for technology, automation
              and software. I am always looking to improve my skills and learn
              new things, whether that be a new programming language, framework
              or technology.
            </p>
          </FadeInContainer>
          <TextFadeInUpGrab>
            <h3 className="text-3xl leading-snug font-bold tracking-tight text-white">
              Personal Projects / Open-Source Contributions
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="text-start text-xl leading-relaxed font-normal tracking-normal text-white">
              I am very passionate about open-source projects and the
              open-source community. Alongside my own personal projects, I have
              contributed to projects such as{" "}
              <a
                className="text-indigo-500"
                href="https://www.home-assistant.io"
                target="_blank"
                aria-label="Home Assistant website"
              >
                Home Assistant
              </a>
              , the{" "}
              <a
                className="text-indigo-500"
                href="https://github.com/hassio-addons"
                target="_blank"
                aria-label="Home Assistant Community Add-ons GitHub repository"
              >
                Home Assistant Community Add-ons
              </a>{" "}
              project and others.
              <br />
              <br />
              For a comprehensive view of my contributions to open-source
              projects and other creations, please visit my website and{" "}
              <a
                className="text-indigo-500"
                href="https://github.com/timmo001"
                target="_blank"
                aria-label="GitHub profile"
              >
                GitHub
              </a>{" "}
              profile.
            </p>
          </TextFadeInUp>
          <TextFadeInUp>
            <h4 className="mb-3 text-2xl leading-snug font-bold tracking-tight text-white">
              System Bridge
            </h4>
            <p className="text-start text-xl leading-relaxed font-normal tracking-normal text-white">
              System Bridge is a desktop application for controlling and
              monitoring your desktops. The app is designed to be
              cross-platform, easy to install and use, and directly integrate
              with Home Assistant or your own application via its websocket API.
              System Bridge started as a node application using electron, but
              moved into a python application and then into Rust with a Python
              backend, using the original Python code moved from a monorepo to
              individual modules.
            </p>
          </TextFadeInUp>
          <TextFadeInUp>
            <h4 className="mb-3 text-2xl leading-snug font-bold tracking-tight text-white">
              Other Personal Projects
            </h4>
            <p className="text-start text-xl leading-relaxed font-normal tracking-normal text-white">
              You will also find a lot of smaller projects, which showcase my
              passion for open-source and creating applications. The reason
              could be &apos;this could be better&apos;, or &apos;can this be a thing&apos; etc.
              There isn&apos;t always a reason, it can be because I want to learn a
              new language or use a framework that interests me and the best way
              to learn a technology in my opinion is to use it and experience
              what it is capable of.
            </p>
          </TextFadeInUp>
          <TextFadeInUpGrab>
            <h3 className="text-3xl leading-snug font-bold tracking-tight text-white">
              Top Programming Languages
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="mb-8 text-xl leading-relaxed font-normal tracking-normal text-white">
              I have experience in a variety of programming languages. My top
              programming languages can be found on the{" "}
              <Link className="text-indigo-500" href="/stats">
                stats
              </Link>{" "}
              page.
            </p>
          </TextFadeInUp>

          <div className="col-span-2 mt-36 flex w-full flex-col items-center gap-8">
            <TextFadeInUpGrab>
              <h3 className="mb-8 text-2xl leading-snug font-bold tracking-tight text-white">
                Contact
              </h3>
            </TextFadeInUpGrab>
            <TextFadeInUp>
              <div className="flex w-full flex-row flex-wrap justify-center gap-x-24 gap-y-16">
                <ContactLinks classes="h-32 w-32 fill-white transition-transform duration-300 ease-in-out hover:scale-110" />
              </div>
            </TextFadeInUp>
          </div>
        </StaggerContainer>
      </div>
    </>
  );
}
