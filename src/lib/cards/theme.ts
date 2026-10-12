import {
  GEIST_FACES,
  GEIST_WIDTHS,
  type GeistWeight,
} from "~/generated/geist-subset";

export const CARD_WIDTH = 880;

// Transparent space inside every image so stacked cards keep a gap.
export const GUTTER = 4;

export const RADIUS = 16;

export const PADDING = 32;

export const palette = {
  background: "#030712",
  surface: "#0b1220",
  surfaceRaised: "#111a2e",
  border: "#1f2937",
  borderSoft: "#182033",
  text: "#f9fafb",
  textMuted: "#9ca3af",
  textFaint: "#6b7280",
  accent: "#818cf8",
  accentSoft: "#a5b4fc",
  accentDeep: "#4c1d95",
  accentGlow: "#6366f1",
  success: "#34d399",
  star: "#fbbf24",
  calendar: ["#111a2e", "#312e81", "#4338ca", "#6366f1", "#a5b4fc"],
} as const;

export const FONT_STACK =
  "'Geist',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

export function escapeXml(value: string): string {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character] ?? character,
  );
}

function glyphWidth(character: string, weight: GeistWeight): number {
  return GEIST_WIDTHS[weight][character] ?? GEIST_WIDTHS[weight].n ?? 0.55;
}

export function measureText(
  text: string,
  fontSize: number,
  weight: GeistWeight = 400,
  letterSpacing = 0,
): number {
  let width = 0;

  for (const character of text) {
    width += glyphWidth(character, weight);
  }

  return width * fontSize + Math.max(0, text.length - 1) * letterSpacing;
}

export function truncateText(
  text: string,
  maxWidth: number,
  fontSize: number,
  weight: GeistWeight = 400,
): string {
  if (measureText(text, fontSize, weight) <= maxWidth) {
    return text;
  }

  const ellipsis = "…";

  let result = "";

  for (const character of text) {
    const candidate = `${result}${character}`;

    if (measureText(`${candidate}${ellipsis}`, fontSize, weight) > maxWidth) {
      break;
    }

    result = candidate;
  }

  return `${result.trimEnd()}${ellipsis}`;
}

export function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number,
  weight: GeistWeight = 400,
  maxLines = Number.POSITIVE_INFINITY,
): Array<string> {
  const words = text.split(/\s+/).filter(Boolean);

  const lines: Array<string> = [];

  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (measureText(candidate, fontSize, weight) <= maxWidth || !current) {
      current = candidate;

      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const kept = lines.slice(0, maxLines);

  const rest = lines.slice(maxLines - 1).join(" ");

  kept[maxLines - 1] = truncateText(rest, maxWidth, fontSize, weight);

  return kept;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-GB");
}

export function formatCompact(value: number): string {
  if (value < 1000) {
    return String(value);
  }

  const rounded = Number((value / 1000).toPrecision(value < 10_000 ? 2 : 3));

  return `${rounded}k`;
}

export function plural(count: number, singular: string, pluralForm?: string) {
  return `${formatNumber(count)} ${count === 1 ? singular : (pluralForm ?? `${singular}s`)}`;
}

export function fontFaces(): string {
  return Object.entries(GEIST_FACES)
    .map(
      ([weight, data]) =>
        `@font-face{font-family:'Geist';font-weight:${weight};font-style:normal;src:url(data:font/woff2;base64,${data}) format('woff2')}`,
    )
    .join("\n");
}

export function baseCss(): string {
  return `${fontFaces()}
text{font-family:${FONT_STACK};fill:${palette.text}}
.muted{fill:${palette.textMuted}}
.faint{fill:${palette.textFaint}}
.accent{fill:${palette.accent}}
.heading{font-size:19px;font-weight:600;letter-spacing:-.3px}
.label{font-size:11px;font-weight:600;letter-spacing:1.1px;fill:${palette.textMuted}}
.meta{font-size:11px;fill:${palette.textFaint}}
.value{font-size:24px;font-weight:600;letter-spacing:-.5px}
.sub{font-size:11px;fill:${palette.textFaint}}
.body{font-size:13px;fill:${palette.textMuted}}
.icon{fill:none;stroke:${palette.accentSoft};stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.pulse{animation:pulse 2.4s ease-in-out infinite;transform-origin:center}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;
}

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CardSpec = {
  width: number;
  height: number;
  title: string;
  description: string;
  body: (box: Box) => string;
  css?: string;
  defs?: string;
  fill?: string;
  inset?: Partial<Record<"top" | "right" | "bottom" | "left", number>>;
};

/** Identity helper that keeps card builders readable and typed. */
export function card(spec: CardSpec): CardSpec {
  return spec;
}

function cardBox(spec: CardSpec, offsetY: number): Box {
  const inset = {
    top: GUTTER,
    right: GUTTER,
    bottom: GUTTER,
    left: GUTTER,
    ...spec.inset,
  };

  return {
    x: inset.left,
    y: offsetY + inset.top,
    width: spec.width - inset.left - inset.right,
    height: spec.height - inset.top - inset.bottom,
  };
}

function cardSurface(spec: CardSpec, box: Box): string {
  return `<rect x="${box.x + 0.5}" y="${box.y + 0.5}" width="${box.width - 1}" height="${box.height - 1}" rx="${RADIUS}" fill="${spec.fill ?? palette.background}" stroke="${palette.border}"/>
${spec.body(box)}`;
}

function svgDocument(
  width: number,
  height: number,
  title: string,
  description: string,
  css: Array<string | undefined>,
  defs: Array<string | undefined>,
  content: string,
): string {
  const extraCss = [...new Set(css.filter((rule) => rule?.trim()))].join("\n");

  const extraDefs = [...new Set(defs.filter((def) => def?.trim()))].join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
<title id="title">${escapeXml(title)}</title>
<desc id="description">${escapeXml(description)}</desc>
<style>
${baseCss()}
${extraCss}
</style>
<defs>
${extraDefs}
</defs>
${content}
</svg>
`;
}

/** One card as a standalone SVG document. */
export function renderCard(spec: CardSpec): string {
  return svgDocument(
    spec.width,
    spec.height,
    spec.title,
    spec.description,
    [spec.css],
    [spec.defs],
    cardSurface(spec, cardBox(spec, 0)),
  );
}

/** Several cards stacked into one SVG document, each keeping its own gutter. */
export function renderCardStack(
  cards: Array<CardSpec>,
  title: string,
  description?: string,
): string {
  const width = Math.max(...cards.map((spec) => spec.width), CARD_WIDTH);

  let offsetY = 0;

  const content = cards
    .map((spec) => {
      const surface = cardSurface(spec, cardBox(spec, offsetY));

      offsetY += spec.height;

      return surface;
    })
    .join("\n");

  return svgDocument(
    width,
    offsetY,
    title,
    description ?? cards.map((spec) => spec.description).join(" "),
    cards.map((spec) => spec.css),
    cards.map((spec) => spec.defs),
    content,
  );
}

export function sectionLabel(
  box: Box,
  label: string,
  meta?: string,
  y = box.y + 32,
): string {
  const x = box.x + PADDING;

  const metaText = meta
    ? `<text class="meta" x="${box.x + box.width - PADDING}" y="${y}" text-anchor="end">${escapeXml(meta)}</text>`
    : "";

  return `<circle class="pulse" cx="${x + 4}" cy="${y - 4}" r="3.5" fill="${palette.accent}"/>
<text class="label" x="${x + 16}" y="${y}">${escapeXml(label.toUpperCase())}</text>
${metaText}`;
}

export function divider(box: Box, y: number): string {
  return `<line x1="${box.x + PADDING}" y1="${y}" x2="${box.x + box.width - PADDING}" y2="${y}" stroke="${palette.borderSoft}"/>`;
}

export type Chip = {
  svg: string;
  width: number;
};

export function chip(
  x: number,
  y: number,
  label: string,
  backgroundColor: string,
  textColor: string,
): Chip {
  const fontSize = 10.5;

  const paddingX = 8;

  const width = Math.ceil(measureText(label, fontSize, 600)) + paddingX * 2;

  const height = 19;

  return {
    width,
    svg: `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="${backgroundColor}"/>
<text x="${x + width / 2}" y="${y + 13}" text-anchor="middle" font-size="${fontSize}" font-weight="600" fill="${textColor}">${escapeXml(label)}</text>`,
  };
}

export const ICONS = {
  stars:
    '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  contributions:
    '<path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M15 6a9 9 0 0 0-9 9M18 15v6M21 18h-6"/>',
  commits: '<circle cx="12" cy="12" r="3"/><path d="M3 12h6M15 12h6"/>',
  pullRequests:
    '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
  issues: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
  repositories:
    '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  followers:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  streak:
    '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
} as const;

export type IconName = keyof typeof ICONS;

export function icon(
  name: IconName,
  x: number,
  y: number,
  size = 24,
  className = "icon",
): string {
  return `<svg class="${className}" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}
