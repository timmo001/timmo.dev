// Minimal declarations for the font tooling used by scripts/build-font-subset.ts.

declare module "subset-font" {
  type SubsetFontOptions = {
    targetFormat?: "sfnt" | "woff" | "woff2";
    preserveNameIds?: Array<number>;
    variationAxes?: Record<string, number | { min: number; max: number }>;
  };

  export default function subsetFont(
    buffer: Buffer,
    text: string,
    options?: SubsetFontOptions,
  ): Promise<Buffer>;
}

declare module "fontkit" {
  type GlyphRun = {
    advanceWidth: number;
  };

  type Font = {
    unitsPerEm: number;
    layout(text: string): GlyphRun;
  };

  export function create(buffer: Buffer): Font;
}
