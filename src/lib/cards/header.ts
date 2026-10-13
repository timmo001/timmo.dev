import {
  CARD_WIDTH,
  escapeXml,
  PADDING,
  palette,
  card,
  wrapText,
  type CardSpec,
} from "~/lib/cards/theme";

export type HeaderCardInput = {
  name: string;
  handle: string;
  username: string;
  role: string;
};

const HEIGHT = 176;

export function headerCard(input: HeaderCardInput): CardSpec {
  const description = `${input.name} (@${input.username}). ${input.role}`;

  return card({
    width: CARD_WIDTH,
    height: HEIGHT,
    title: input.name,
    description,
    css: `.hero-name{font-size:40px;font-weight:600;letter-spacing:-1px;fill:${palette.text}}
.hero-handle{font-size:16px;fill:${palette.accentSoft}}
.hero-role{font-size:14.5px;fill:${palette.textMuted}}
`,
    body: (box) => {
      const x = box.x + PADDING;

      const roleLines = wrapText(
        input.role,
        box.width - PADDING * 2,
        14.5,
        400,
        2,
      );

      return `<g>
<text class="hero-name" x="${x}" y="${box.y + 62}">${escapeXml(input.name)}</text>
</g>
<g>
<text class="hero-handle" x="${x}" y="${box.y + 90}">${escapeXml(input.handle)} · @${escapeXml(input.username)}</text>
</g>
<g>
${roleLines
  .map(
    (line, index) =>
      `<text class="hero-role" x="${x}" y="${box.y + 124 + index * 21}">${escapeXml(line)}</text>`,
  )
  .join("\n")}
</g>
`;
    },
  });
}
