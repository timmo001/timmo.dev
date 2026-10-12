import {
  CARD_WIDTH,
  escapeXml,
  PADDING,
  palette,
  sectionLabel,
  card,
  type CardSpec,
} from "~/lib/cards/theme";
import type { Language } from "~/types/github/language";

export type LanguagesCardInput = {
  languages: Array<Language>;
  limit?: number;
};

const COLUMNS = 3;

const ROW_HEIGHT = 24;

export type LanguageSection = {
  svg: string;
  height: number;
};

export function renderLanguageSection(
  languages: Array<Language>,
  x: number,
  y: number,
  width: number,
  limit: number,
): LanguageSection {
  const shown = languages.slice(0, limit);

  const total = shown.reduce((sum, language) => sum + language.size, 0);

  const barHeight = 10;

  let cursor = x;

  const segments = shown
    .map((language, index) => {
      const share = total === 0 ? 0 : language.size / total;

      const segmentWidth = Math.max(0, share * width - (index > 0 ? 2 : 0));

      const svg = `<rect x="${cursor + (index > 0 ? 2 : 0)}" y="${y}" width="${segmentWidth}" height="${barHeight}" fill="${escapeXml(language.color || palette.textFaint)}"/>`;

      cursor += share * width;

      return svg;
    })
    .join("");

  const rows = Math.ceil(shown.length / COLUMNS);

  const columnWidth = width / COLUMNS;

  const legend = shown
    .map((language, index) => {
      const column = Math.floor(index / rows);

      const row = index % rows;

      const lx = x + column * columnWidth;

      const ly = y + barHeight + 26 + row * ROW_HEIGHT;

      const share = total === 0 ? 0 : (language.size / total) * 100;

      return `<circle cx="${lx + 5}" cy="${ly - 4}" r="5" fill="${escapeXml(language.color || palette.textFaint)}"/>
<text x="${lx + 17}" y="${ly}" font-size="12.5" font-weight="600">${escapeXml(language.name)}</text>
<text class="meta" x="${lx + columnWidth - 20}" y="${ly}" text-anchor="end" style="font-size:11.5px">${share.toFixed(1)}%</text>`;
    })
    .join("\n");

  return {
    svg: `<clipPath id="bar"><rect x="${x}" y="${y}" width="${width}" height="${barHeight}" rx="${barHeight / 2}"/></clipPath>
<rect x="${x}" y="${y}" width="${width}" height="${barHeight}" rx="${barHeight / 2}" fill="${palette.surfaceRaised}"/>
<g clip-path="url(#bar)">${segments}</g>
${legend}`,
    height: barHeight + 26 + rows * ROW_HEIGHT,
  };
}

export function languagesCard(input: LanguagesCardInput): CardSpec {
  const limit = input.limit ?? 9;

  const rows = Math.ceil(Math.min(input.languages.length, limit) / COLUMNS);

  const height = 56 + 10 + 26 + rows * ROW_HEIGHT + 8 + 8;

  return card({
    width: CARD_WIDTH,
    height,
    title: "Top languages",
    description: `Most-used languages across public repositories: ${input.languages
      .slice(0, limit)
      .map((language) => language.name)
      .join(", ")}.`,
    body: (box) => {
      const section = renderLanguageSection(
        input.languages,
        box.x + PADDING,
        box.y + 50,
        box.width - PADDING * 2,
        limit,
      );

      return `${sectionLabel(box, "Top languages", "By bytes in recent public repos")}
<g>
${section.svg}
</g>`;
    },
  });
}
