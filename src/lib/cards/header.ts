import {
  CARD_WIDTH,
  escapeXml,
  measureText,
  PADDING,
  palette,
  card,
  truncateText,
  wrapText,
  type CardSpec,
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

export function headerCard(input: HeaderCardInput): CardSpec {
  const description = `${input.name} (@${input.username}). ${input.role}${input.highlight ? ` ${input.highlight}.` : ""}`;

  return card({
    width: CARD_WIDTH,
    height: HEIGHT,
    title: input.name,
    description,
    css: `.hero-name{font-size:40px;font-weight:600;letter-spacing:-1px;fill:${palette.text}}
.hero-handle{font-size:16px;fill:${palette.accentSoft}}
.hero-role{font-size:14.5px;fill:${palette.textMuted}}
.hero-pill{font-size:12px;font-weight:600;fill:${palette.text}}`,
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
<rect x="${px}" y="${py}" width="${width}" height="28" rx="14" fill="${palette.surface}" stroke="${palette.border}"/>
<circle class="pulse" cx="${px + 16}" cy="${py + 14}" r="4" fill="${palette.success}"/>
<text class="hero-pill" x="${px + 28}" y="${py + 18}">${escapeXml(text)}</text>
</g>`;
          })()
        : "";

      return `<g>
<text class="hero-name" x="${x}" y="${box.y + 84}">${escapeXml(input.name)}</text>
</g>
<g>
<text class="hero-handle" x="${x}" y="${box.y + 112}">${escapeXml(input.handle)} · @${escapeXml(input.username)}</text>
</g>
<g>
${roleLines
  .map(
    (line, index) =>
      `<text class="hero-role" x="${x}" y="${box.y + 148 + index * 21}">${escapeXml(line)}</text>`,
  )
  .join("\n")}
</g>
${pill}`;
    },
  });
}
