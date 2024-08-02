import {
  TextFadeInUp,
  TextFadeInUpGrab,
} from "~/app/_components/animations/text";

export default function Home() {
  return (
    <>
      <header className="h-screen w-full bg-gradient-to-b from-violet-900 to-slate-950 p-4">
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

      <div className="container flex flex-col items-center justify-start bg-gradient-to-b from-slate-950 to-gray-950 px-4 py-16">
        <div className="grid-row grid gap-x-4 gap-y-36 px-2 sm:grid-cols-1 md:grid-cols-2">
          <TextFadeInUpGrab>
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-white">
              About Me
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="text-start text-xl font-normal leading-relaxed tracking-normal text-white">
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
          <TextFadeInUpGrab>
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-white">
              Personal Projects / Open-Source Contributions
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="text-start text-xl font-normal leading-relaxed tracking-normal text-white">
              I am very passionate about open-source projects and the
              open-source community. Alongside my own personal projects, I have
              contributed to projects such as{" "}
              <a
                className="text-indigo-500"
                href="https://www.home-assistant.io"
                target="_blank"
              >
                Home Assistant
              </a>
              , the{" "}
              <a
                className="text-indigo-500"
                href="https://github.com/hassio-addons"
                target="_blank"
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
              >
                GitHub
              </a>{" "}
              profile.
            </p>
          </TextFadeInUp>
          <TextFadeInUpGrab>
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-white">
              System Bridge
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="text-start text-xl font-normal leading-relaxed tracking-normal text-white">
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
          <TextFadeInUpGrab>
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-white">
              Other Personal Projects
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="text-start text-xl font-normal leading-relaxed tracking-normal text-white">
              You will also find a lot of smaller projects, which showcase my
              passion for open-source and creating applications. The reason
              could be 'this could be better', or 'can this be a thing' etc.
              There isn't always a reason, it can be because I want to learn a
              new language or use a framework that interests me and the best way
              to learn a technology in my opinion is to use it and experience
              what it is capable of.
            </p>
          </TextFadeInUp>
          <TextFadeInUpGrab>
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-white">
              Top Programming Languages
            </h3>
          </TextFadeInUpGrab>
          <TextFadeInUp>
            <p className="mb-8 text-xl font-normal leading-relaxed tracking-normal text-white">
              I have experience in a variety of programming languages. My top
              programming languages from GitHub are:
            </p>
          </TextFadeInUp>
        </div>
        <TextFadeInUp>
          <iframe
            src="https://stats.timmo.dev/github/topLanguages?background=transparent&padding=0"
            title="Top Languages"
            height="74"
            width="670"
            style={{ border: 0, background: "transparent !important" }}
          ></iframe>
        </TextFadeInUp>

        <div className="mt-36 flex w-full flex-col gap-36">
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
            <h3 className="mb-8 text-2xl font-bold leading-snug tracking-tight text-white">
              Contact
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <a href="https://dev.to/timmo001" rel="me" target="_blank">
                <svg
                  className="h-32 w-32 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.73 11.93C7.73 13.65 7.71 13.76 7.5 14C7.31 14.17 7.12 14.23 6.74 14.23L6.23 14.24L6.2 11.97L6.18 9.7H6.7C7.05 9.7 7.3 9.77 7.47 9.91C7.71 10.12 7.73 10.16 7.73 11.93M22 7.5V16.5C22 17.61 21.11 18.5 20 18.5H4C2.89 18.5 2 17.61 2 16.5V7.5C2 6.39 2.89 5.5 4 5.5H20C21.11 5.5 22 6.39 22 7.5M8.93 11.73C8.9 9.89 8.88 9.74 8.64 9.34C8.24 8.66 7.79 8.5 6.28 8.5H5V15.5H6.21C7.54 15.5 8.1 15.33 8.5 14.79C8.91 14.26 9 13.81 8.93 11.73M13.12 8.5H11.64C10.15 8.5 10.14 8.5 9.93 8.78S9.7 9.21 9.7 12V14.96L9.97 15.23C10.22 15.5 10.28 15.5 11.68 15.5H13.12V14.31L12.03 14.27L10.93 14.24V12.6L11.61 12.57L12.27 12.53V11.34H10.88V9.7H13.12V8.5M19 8.56C19 8.5 18.7 8.5 18.34 8.5L17.66 8.56L17.07 10.91C16.69 12.39 16.45 13.18 16.4 13.04C16.32 12.77 15.26 8.6 15.26 8.55C15.26 8.5 14.95 8.5 14.58 8.5H13.89L14.3 10.05C14.5 10.92 14.89 12.33 15.11 13.2C15.45 14.55 15.57 14.85 15.86 15.14C16.06 15.36 16.31 15.5 16.47 15.5C16.8 15.5 17.23 15.16 17.37 14.77C17.5 14.5 19 8.69 19 8.56Z" />
                </svg>
              </a>
              <a href="https://github.com/timmo001" rel="me" target="_blank">
                <svg
                  className="h-32 w-32 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                </svg>
              </a>
              <a
                href="https://community.home-assistant.io/u/timmo001"
                rel="me"
                target="_blank"
              >
                <svg
                  className="h-32 w-32 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z" />
                </svg>
              </a>
              <a href="https://fosstodon.org/@timmo" rel="me" target="_blank">
                <svg
                  className="h-32 w-32 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.94,14C20.66,15.41 18.5,16.96 15.97,17.26C14.66,17.41 13.37,17.56 12,17.5C9.75,17.39 8,16.96 8,16.96V17.58C8.32,19.8 10.22,19.93 12.03,20C13.85,20.05 15.47,19.54 15.47,19.54L15.55,21.19C15.55,21.19 14.27,21.87 12,22C10.75,22.07 9.19,21.97 7.38,21.5C3.46,20.45 2.78,16.26 2.68,12L2.67,8.57C2.67,4.23 5.5,2.96 5.5,2.96C6.95,2.3 9.41,2 11.97,2H12.03C14.59,2 17.05,2.3 18.5,2.96C18.5,2.96 21.33,4.23 21.33,8.57C21.33,8.57 21.37,11.78 20.94,14M18,8.91C18,7.83 17.7,7 17.15,6.35C16.59,5.72 15.85,5.39 14.92,5.39C13.86,5.39 13.05,5.8 12.5,6.62L12,7.5L11.5,6.62C10.94,5.8 10.14,5.39 9.07,5.39C8.15,5.39 7.41,5.72 6.84,6.35C6.29,7 6,7.83 6,8.91V14.17H8.1V9.06C8.1,8 8.55,7.44 9.46,7.44C10.46,7.44 10.96,8.09 10.96,9.37V12.16H13.03V9.37C13.03,8.09 13.53,7.44 14.54,7.44C15.44,7.44 15.89,8 15.89,9.06V14.17H18V8.91Z" />
                </svg>
              </a>
              <a href="https://twitter.com/timmo001" rel="me" target="_blank">
                <svg
                  className="h-32 w-32 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                </svg>
              </a>
              <a href="mailto:aidan@timmo.dev" rel="me" target="_blank">
                <svg
                  className="h-32 w-32 fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
