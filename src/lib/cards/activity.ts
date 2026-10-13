import {
  CARD_WIDTH,
  escapeXml,
  formatNumber,
  measureText,
  PADDING,
  palette,
  sectionLabel,
  card,
  truncateText,
  type CardSpec,
} from "~/lib/cards/theme";

export type ActivityCardItem = {
  nameWithOwner: string;
  description?: string;
  commits: number;
  pullRequests: number;
  reviews: number;
};

export type ActivityCardInput = {
  title: string;
  label: string;
  meta: string;
  items: Array<ActivityCardItem>;
  emptyText: string;
  maxItems?: number;
};

const ROW_HEIGHT = 48;

const HEADER_HEIGHT = 56;

const METRIC_COLUMN_WIDTH = 92;

export function activityCard(input: ActivityCardInput): CardSpec {
  const items = input.items.slice(0, input.maxItems ?? 6);

  const rows = Math.max(items.length, 1);

  const height = HEADER_HEIGHT + rows * ROW_HEIGHT + 20;

  const description =
    items.length > 0
      ? items
          .map(
            (item) =>
              `${item.nameWithOwner}: ${formatNumber(item.commits)} commits, ${formatNumber(item.pullRequests)} pull requests, ${formatNumber(item.reviews)} reviews`,
          )
          .join(". ")
      : input.emptyText;

  return card({
    width: CARD_WIDTH,
    height,
    title: input.title,
    description: `${input.title}. ${description}.`,
    css: `.act-owner{font-size:14px;fill:${palette.textFaint}}
.act-repo{font-size:14px;font-weight:600;fill:${palette.accent}}
.act-metric{font-size:15px;font-weight:600}
.act-metric-label{font-size:9.5px;font-weight:600;letter-spacing:.8px;fill:${palette.textFaint}}`,
    body: (box) => {
      const x = box.x + PADDING;

      const metricsX = box.x + box.width - PADDING - METRIC_COLUMN_WIDTH * 3;

      const textWidth = metricsX - x - 24;

      if (items.length === 0) {
        return `${sectionLabel(box, input.label, input.meta)}
<text class="body" x="${x}" y="${box.y + HEADER_HEIGHT + 26}">${escapeXml(input.emptyText)}</text>`;
      }

      const body = items
        .map((item, index) => {
          const y = box.y + HEADER_HEIGHT + index * ROW_HEIGHT;

          const [owner = "", ...rest] = item.nameWithOwner.split("/");

          const repo = rest.join("/");

          const ownerText = `${owner}/`;

          const ownerWidth = measureText(ownerText, 14, 400);

          const repoText = truncateText(
            repo,
            Math.max(60, textWidth - ownerWidth),
            14,
            600,
          );

          const descriptionText = item.description
            ? truncateText(item.description, textWidth, 12, 400)
            : "";

          const metrics = [
            { value: item.commits, label: "commits" },
            { value: item.pullRequests, label: "pull requests" },
            { value: item.reviews, label: "reviews" },
          ]
            .map(
              (
                metric,
                column,
              ) => `<text class="act-metric" x="${metricsX + column * METRIC_COLUMN_WIDTH}" y="${y + 20}">${formatNumber(metric.value)}</text>
<text class="act-metric-label" x="${metricsX + column * METRIC_COLUMN_WIDTH}" y="${y + 35}">${metric.label.toUpperCase()}</text>`,
            )
            .join("\n");

          const separator =
            index > 0
              ? `<line x1="${x}" y1="${y - 2}" x2="${box.x + box.width - PADDING}" y2="${y - 2}" stroke="${palette.borderSoft}"/>`
              : "";

          return `${separator}
<g>
<text x="${x}" y="${y + 20}"><tspan class="act-owner">${escapeXml(ownerText)}</tspan><tspan class="act-repo">${escapeXml(repoText)}</tspan></text>
${descriptionText ? `<text class="sub" x="${x}" y="${y + 36}" style="font-size:12px">${escapeXml(descriptionText)}</text>` : ""}
${metrics}
</g>`;
        })
        .join("\n");

      return `${sectionLabel(box, input.label, input.meta)}
${body}`;
    },
  });
}
