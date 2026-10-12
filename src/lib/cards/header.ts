import {
  CARD_WIDTH,
  escapeXml,
  measureText,
  PADDING,
  palette,
  tile,
  truncateText,
  wrapText,
} from "~/lib/cards/theme";

export type HeaderCardInput = {
  name: string;
  handle: string;
  username: string;
  role: string;
  /** Short live status shown as a pill, e.g. "Active in home-assistant/frontend". */
  highlight?: string;
};

const HEIGHT = 212;

export function renderHeaderCard(input: HeaderCardInput): string {
  const description = `${input.name} (@${input.username}). ${input.role}${input.highlight ? ` ${input.highlight}.` : ""}`;

  return tile({
    width: CARD_WIDTH,
    height: HEIGHT,
    title: input.name,
    description,
    fill: "url(#hero)",
    defs: `<linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${palette.accentDeep}"/>
  <stop offset=".5" stop-color="#1e1b4b"/>
  <stop offset="1" stop-color="${palette.background}"/>
</linearGradient>
<radialGradient id="glow" cx="0.85" cy="0.1" r="0.6">
  <stop offset="0" stop-color="${palette.accentGlow}" stop-opacity=".45"/>
  <stop offset="1" stop-color="${palette.accentGlow}" stop-opacity="0"/>
</radialGradient>`,
    css: `.name{font-size:40px;font-weight:600;letter-spacing:-1px;fill:#ffffff}
.handle{font-size:16px;fill:#c7d2fe}
.role{font-size:14.5px;fill:#e5e7eb}
.pill{font-size:12px;font-weight:600;fill:#e0e7ff}`,
    body: (box) => {
      const x = box.x + PADDING;

      const roleLines = wrapText(
        input.role,
        box.width - PADDING * 2,
        14.5,
        400,
        2,
      );

      const pill = input.highlight
        ? (() => {
            const text = truncateText(input.highlight, 420, 12, 600);

            const width = Math.ceil(measureText(text, 12, 600)) + 40;

            const px = box.x + box.width - PADDING - width;

            const py = box.y + 22;

            return `<g>
<rect x="${px}" y="${py}" width="${width}" height="28" rx="14" fill="#0b1220" fill-opacity=".75" stroke="${palette.accentGlow}" stroke-opacity=".5"/>
<circle class="pulse" cx="${px + 16}" cy="${py + 14}" r="4" fill="${palette.success}"/>
<text class="pill" x="${px + 28}" y="${py + 18}">${escapeXml(text)}</text>
</g>`;
          })()
        : "";

      return `<rect x="${box.x + 1}" y="${box.y + 1}" width="${box.width - 2}" height="${box.height - 2}" rx="15" fill="url(#glow)"/>
<g>
<text class="name" x="${x}" y="${box.y + 84}">${escapeXml(input.name)}</text>
</g>
<g>
<text class="handle" x="${x}" y="${box.y + 112}">${escapeXml(input.handle)} · @${escapeXml(input.username)}</text>
</g>
<g>
${roleLines
  .map(
    (line, index) =>
      `<text class="role" x="${x}" y="${box.y + 148 + index * 21}">${escapeXml(line)}</text>`,
  )
  .join("\n")}
</g>
${pill}`;
    },
  });
}
