import {
  GEIST_FACES,
  GEIST_WIDTHS,
  type GeistWeight,
} from "~/generated/geist-subset";

export const CARD_WIDTH = 880;

export const HALF_CARD_WIDTH = CARD_WIDTH / 2;

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

type TileOptions = {
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

export function tile(options: TileOptions): string {
  const inset = {
    top: GUTTER,
    right: GUTTER,
    bottom: GUTTER,
    left: GUTTER,
    ...options.inset,
  };

  const box: Box = {
    x: inset.left,
    y: inset.top,
    width: options.width - inset.left - inset.right,
    height: options.height - inset.top - inset.bottom,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}" role="img" aria-labelledby="title description">
<title id="title">${escapeXml(options.title)}</title>
<desc id="description">${escapeXml(options.description)}</desc>
<style>
${baseCss()}
${options.css ?? ""}
</style>
<defs>
${options.defs ?? ""}
</defs>
<rect x="${box.x + 0.5}" y="${box.y + 0.5}" width="${box.width - 1}" height="${box.height - 1}" rx="${RADIUS}" fill="${options.fill ?? palette.background}" stroke="${palette.border}"/>
${options.body(box)}
</svg>
`;
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

export function chipRow(
  x: number,
  y: number,
  maxWidth: number,
  items: Array<{ label: string; backgroundColor: string; textColor: string }>,
): string {
  const gap = 6;

  let cursor = x;

  const parts: Array<string> = [];

  for (const item of items) {
    const rendered = chip(
      cursor,
      y,
      item.label,
      item.backgroundColor,
      item.textColor,
    );

    if (cursor + rendered.width > x + maxWidth) {
      break;
    }

    parts.push(rendered.svg);
    cursor += rendered.width + gap;
  }

  return parts.join("\n");
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
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  heart:
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  activity:
    '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
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

// Brand marks drawn as filled 24px paths (from ContactLinks.astro).
export const BRAND_ICONS = {
  github:
    "M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z",
  homeAssistant:
    "M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z",
  dev: "M7.73 11.93C7.73 13.65 7.71 13.76 7.5 14C7.31 14.17 7.12 14.23 6.74 14.23L6.23 14.24L6.2 11.97L6.18 9.7H6.7C7.05 9.7 7.3 9.77 7.47 9.91C7.71 10.12 7.73 10.16 7.73 11.93M22 7.5V16.5C22 17.61 21.11 18.5 20 18.5H4C2.89 18.5 2 17.61 2 16.5V7.5C2 6.39 2.89 5.5 4 5.5H20C21.11 5.5 22 6.39 22 7.5M8.93 11.73C8.9 9.89 8.88 9.74 8.64 9.34C8.24 8.66 7.79 8.5 6.28 8.5H5V15.5H6.21C7.54 15.5 8.1 15.33 8.5 14.79C8.91 14.26 9 13.81 8.93 11.73M13.12 8.5H11.64C10.15 8.5 10.14 8.5 9.93 8.78S9.7 9.21 9.7 12V14.96L9.97 15.23C10.22 15.5 10.28 15.5 11.68 15.5H13.12V14.31L12.03 14.27L10.93 14.24V12.6L11.61 12.57L12.27 12.53V11.34H10.88V9.7H13.12V8.5M19 8.56C19 8.5 18.7 8.5 18.34 8.5L17.66 8.56L17.07 10.91C16.69 12.39 16.45 13.18 16.4 13.04C16.32 12.77 15.26 8.6 15.26 8.55C15.26 8.5 14.95 8.5 14.58 8.5H13.89L14.3 10.05C14.5 10.92 14.89 12.33 15.11 13.2C15.45 14.55 15.57 14.85 15.86 15.14C16.06 15.36 16.31 15.5 16.47 15.5C16.8 15.5 17.23 15.16 17.37 14.77C17.5 14.5 19 8.69 19 8.56Z",
  mastodon:
    "M20.94,14C20.66,15.41 18.5,16.96 15.97,17.26C14.66,17.41 13.37,17.56 12,17.5C9.75,17.39 8,16.96 8,16.96V17.58C8.32,19.8 10.22,19.93 12.03,20C13.85,20.05 15.47,19.54 15.47,19.54L15.55,21.19C15.55,21.19 14.27,21.87 12,22C10.75,22.07 9.19,21.97 7.38,21.5C3.46,20.45 2.78,16.26 2.68,12L2.67,8.57C2.67,4.23 5.5,2.96 5.5,2.96C6.95,2.3 9.41,2 11.97,2H12.03C14.59,2 17.05,2.3 18.5,2.96C18.5,2.96 21.33,4.23 21.33,8.57C21.33,8.57 21.37,11.78 20.94,14M18,8.91C18,7.83 17.7,7 17.15,6.35C16.59,5.72 15.85,5.39 14.92,5.39C13.86,5.39 13.05,5.8 12.5,6.62L12,7.5L11.5,6.62C10.94,5.8 10.14,5.39 9.07,5.39C8.15,5.39 7.41,5.72 6.84,6.35C6.29,7 6,7.83 6,8.91V14.17H8.1V9.06C8.1,8 8.55,7.44 9.46,7.44C10.46,7.44 10.96,8.09 10.96,9.37V12.16H13.03V9.37C13.03,8.09 13.53,7.44 14.54,7.44C15.44,7.44 15.89,8 15.89,9.06V14.17H18V8.91Z",
  linkedin:
    "M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z",
} as const;

export type BrandIconName = keyof typeof BRAND_ICONS;

export function brandIcon(
  name: BrandIconName,
  x: number,
  y: number,
  size = 20,
  fill = palette.accentSoft,
): string {
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${BRAND_ICONS[name]}" fill="${fill}"/></svg>`;
}
