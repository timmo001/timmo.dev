import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        tw="bg-gradient-to-b from-violet-900 to-slate-950"
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          backgroundImage: "linear-gradient(rgb(76, 29, 149), rgb(2, 6, 23))",
        }}
      >
        <div tw="flex w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex-row">
          <div tw="flex flex-col items-center justify-center w-full p-8">
            <h1 tw="me-6 text-8xl font-bold leading-none tracking-tight text-white">
              Aidan Timson
            </h1>
            <span tw="text-nowrap text-4xl font-bold leading-none tracking-normal">
              <span tw="text-indigo-500">Timmo</span> /{" "}
              <span tw="text-indigo-500">@timmo001</span>
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
