import { format, formatDistanceToNowStrict } from "date-fns";

import {
  CARD_WIDTH,
  chip,
  escapeXml,
  icon,
  measureText,
  PADDING,
  palette,
  sectionLabel,
  card,
  truncateText,
  type CardSpec,
} from "~/lib/cards/theme";

export type ReleaseCardItem = {
  repository: string;
  name: string;
  tagName: string;
  publishedAt: Date;
  isPrerelease: boolean;
};

export type ReleasesCardInput = {
  items: Array<ReleaseCardItem>;
  maxItems?: number;
  now?: Date;
};

const ROW_HEIGHT = 38;

const HEADER_HEIGHT = 54;

export function releasesCard(input: ReleasesCardInput): CardSpec {
  const items = input.items.slice(0, input.maxItems ?? 6);

  const rows = Math.max(items.length, 1);

  const height = HEADER_HEIGHT + rows * ROW_HEIGHT + 16;

  return card({
    width: CARD_WIDTH,
    height,
    title: "Latest releases",
    description:
      items.length > 0
        ? items
            .map(
              (item) =>
                `${item.repository} ${item.tagName} on ${format(item.publishedAt, "d MMM yyyy")}`,
            )
            .join(". ")
        : "No releases yet.",
    css: `.rel-repo{font-size:13px;font-weight:600}
.rel-tag{font-size:12px;font-weight:600;fill:${palette.accent}}
.rel-name{font-size:12px;fill:${palette.textMuted}}
.rel-when{font-size:11px;fill:${palette.textFaint}}`,
    body: (box) => {
      const x = box.x + PADDING;

      const right = box.x + box.width - PADDING;

      if (items.length === 0) {
        return `${sectionLabel(box, "Latest releases")}
<text class="body" x="${x}" y="${box.y + HEADER_HEIGHT + 24}">No releases yet.</text>`;
      }

      const body = items
        .map((item, index) => {
          const y = box.y + HEADER_HEIGHT + index * ROW_HEIGHT;

          const baseline = y + 24;

          const when = formatDistanceToNowStrict(item.publishedAt, {
            addSuffix: true,
          });

          const whenWidth = measureText(when, 11, 400);

          const repoWidth = measureText(item.repository, 13, 600);

          const tagWidth = measureText(item.tagName, 12, 600);

          const prerelease = item.isPrerelease
            ? chip(0, 0, "pre-release", "#1f2937", palette.textMuted)
            : undefined;

          let cursor = x + 26;

          const repoText = `<text class="rel-repo" x="${cursor}" y="${baseline}">${escapeXml(item.repository)}</text>`;

          cursor += repoWidth + 12;

          const tagText = `<text class="rel-tag" x="${cursor}" y="${baseline}">${escapeXml(item.tagName)}</text>`;

          cursor += tagWidth + 12;

          const prereleaseSvg = prerelease
            ? chip(
                cursor,
                baseline - 13,
                "pre-release",
                "#1f2937",
                palette.textMuted,
              )
            : undefined;

          if (prereleaseSvg) {
            cursor += prereleaseSvg.width + 10;
          }

          const nameMax = right - whenWidth - 16 - cursor;

          const name =
            item.name && item.name !== item.tagName && nameMax > 60
              ? `<text class="rel-name" x="${cursor}" y="${baseline}">${escapeXml(truncateText(item.name, nameMax, 12, 400))}</text>`
              : "";

          const separator =
            index > 0
              ? `<line x1="${x}" y1="${y + 2}" x2="${right}" y2="${y + 2}" stroke="${palette.borderSoft}"/>`
              : "";

          return `${separator}
<g>
${icon("tag", x, baseline - 13, 16)}
${repoText}
${tagText}
${prereleaseSvg?.svg ?? ""}
${name}
<text class="rel-when" x="${right}" y="${baseline}" text-anchor="end">${escapeXml(when)}</text>
</g>`;
        })
        .join("\n");

      return `${sectionLabel(box, "Latest releases", `${items.length} most recent`)}
${body}`;
    },
  });
}
