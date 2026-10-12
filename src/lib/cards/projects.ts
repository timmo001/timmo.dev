import { getTagStyle } from "~/data/tag-styles";
import { sortStack } from "~/data/stack-sort";
import { sortTags } from "~/data/tag-sort";
import {
  chipRow,
  divider,
  escapeXml,
  formatCompact,
  HALF_CARD_WIDTH,
  icon,
  measureText,
  palette,
  tile,
  truncateText,
  wrapText,
} from "~/lib/cards/theme";
import { getContrastColor, getRGBColorFromHex } from "~/lib/color";

export type ProjectCardInput = {
  title: string;
  description: string;
  tags?: Array<string>;
  stack?: Array<string>;
  stars?: number;
  language?: { name: string; color: string | null };
  side: "left" | "right";
};

export const PROJECT_CARD_HEIGHT = 204;

const INNER_PADDING = 24;

function chipItems(labels: Array<string>) {
  return labels.map((label) => {
    const { backgroundColor } = getTagStyle(label);

    return {
      label,
      backgroundColor,
      textColor: getContrastColor(getRGBColorFromHex(backgroundColor)),
    };
  });
}

export function renderProjectCard(input: ProjectCardInput): string {
  const tags = sortTags(input.tags ?? []).filter((tag) => tag !== "Archive");

  const archived = input.tags?.includes("Archive") ?? false;

  const stack = sortStack(input.stack ?? []);

  return tile({
    width: HALF_CARD_WIDTH,
    height: PROJECT_CARD_HEIGHT,
    title: input.title,
    description: `${input.title}: ${input.description}${stack.length ? ` Built with ${stack.join(", ")}.` : ""}`,
    inset:
      input.side === "left" ? { right: 4, left: 4 } : { left: 4, right: 4 },
    css: `.title{font-size:17px;font-weight:600;letter-spacing:-.3px;fill:${palette.accent}}
.stars{font-size:12px;font-weight:600;fill:${palette.star}}
.archived{font-size:10px;font-weight:600;letter-spacing:.8px;fill:${palette.textFaint}}
.desc{font-size:12.5px;fill:${palette.textMuted}}`,
    body: (box) => {
      const x = box.x + INNER_PADDING;

      const right = box.x + box.width - INNER_PADDING;

      const contentWidth = box.width - INNER_PADDING * 2;

      const starsText =
        input.stars !== undefined ? formatCompact(input.stars) : undefined;

      const starsBlock = starsText
        ? `${icon("stars", right - measureText(starsText, 12, 600) - 20, box.y + 22, 14, "icon")}
<text class="stars" x="${right}" y="${box.y + 33}" text-anchor="end">${starsText}</text>`
        : "";

      const titleMax = contentWidth - (starsText ? 80 : 0);

      const title = truncateText(input.title, titleMax, 17, 600);

      const descriptionLines = wrapText(
        input.description,
        contentWidth,
        12.5,
        400,
        3,
      );

      const lines = descriptionLines
        .map(
          (line, index) =>
            `<text class="desc" x="${x}" y="${box.y + 98 + index * 18}">${escapeXml(line)}</text>`,
        )
        .join("\n");

      const archivedBadge = archived
        ? `<text class="archived" x="${right}" y="${box.y + 52 + 13}" text-anchor="end">ARCHIVED</text>`
        : "";

      return `<g>
<text class="title" x="${x}" y="${box.y + 34}">${escapeXml(title)}</text>
${starsBlock}
${chipRow(x, box.y + 50, contentWidth - (archived ? 70 : 0), chipItems(tags))}
${archivedBadge}
${lines}
${divider({ ...box, x: box.x + INNER_PADDING - 32, width: box.width - (INNER_PADDING - 32) * 2 }, box.y + 156)}
${chipRow(x, box.y + 168, contentWidth, chipItems(stack))}
</g>`;
    },
  });
}
