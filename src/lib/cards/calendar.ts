import { format, parseISO } from "date-fns";

import {
  CARD_WIDTH,
  escapeXml,
  formatNumber,
  PADDING,
  palette,
  sectionLabel,
  card,
  type CardSpec,
} from "~/lib/cards/theme";

export type CalendarDay = {
  date: string;
  count: number;
};

export type CalendarCardInput = {
  /** One entry per day, oldest first, starting on a Sunday. */
  days: Array<CalendarDay>;
  total: number;
  busiest?: CalendarDay;
};

const CELL = 12;

const GAP = 3;

const STEP = CELL + GAP;

const HEIGHT = 212;

function level(count: number, max: number): number {
  if (count <= 0 || max <= 0) {
    return 0;
  }

  return Math.min(4, Math.max(1, Math.ceil((count / max) * 4)));
}

export function calendarCard(input: CalendarCardInput): CardSpec {
  const columns = Math.ceil(input.days.length / 7);

  const max = input.days.reduce((best, day) => Math.max(best, day.count), 0);

  const busiest =
    input.busiest ??
    input.days.reduce<CalendarDay | undefined>(
      (best, day) => (!best || day.count > best.count ? day : best),
      undefined,
    );

  const description = `${formatNumber(input.total)} contributions in the last year${
    busiest && busiest.count > 0
      ? `, busiest day ${format(parseISO(busiest.date), "d MMMM")} with ${formatNumber(busiest.count)}`
      : ""
  }.`;

  return card({
    width: CARD_WIDTH,
    height: HEIGHT,
    title: "Contributions in the last year",
    description,
    css: `.cal-month{font-size:10px;fill:${palette.textFaint}}
.cal-cell{stroke:${palette.background};stroke-width:.5}`,
    body: (box) => {
      const gridWidth = columns * STEP - GAP;

      const x0 = box.x + (box.width - gridWidth) / 2;

      const y0 = box.y + 62;

      const cells: Array<string> = [];

      const months: Array<string> = [];

      let lastMonth = "";

      let lastLabelX = Number.NEGATIVE_INFINITY;

      input.days.forEach((day, index) => {
        const column = Math.floor(index / 7);

        const row = index % 7;

        const x = x0 + column * STEP;

        const y = y0 + row * STEP;

        const fill = palette.calendar[level(day.count, max)];

        cells.push(
          `<rect class="cal-cell" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${fill}"><title>${escapeXml(`${format(parseISO(day.date), "d MMM yyyy")}: ${formatNumber(day.count)}`)}</title></rect>`,
        );

        if (row === 0) {
          const month = day.date.slice(0, 7);

          if (month !== lastMonth) {
            if (lastMonth && x - lastLabelX >= 32) {
              months.push(
                `<text class="cal-month" x="${x}" y="${y0 - 10}">${format(parseISO(day.date), "MMM")}</text>`,
              );

              lastLabelX = x;
            }

            lastMonth = month;
          }
        }
      });

      const legendY = box.y + box.height - 22;

      const legendX = box.x + box.width - PADDING;

      const legend = palette.calendar
        .map(
          (fill, index) =>
            `<rect x="${legendX - (palette.calendar.length - index) * STEP - 34}" y="${legendY - 10}" width="${CELL}" height="${CELL}" rx="2.5" fill="${fill}"/>`,
        )
        .join("");

      return `${sectionLabel(box, "Contributions", `${formatNumber(input.total)} in the last 12 months`)}
${months.join("\n")}
<g>
${cells.join("\n")}
</g>
<text class="meta" x="${legendX - palette.calendar.length * STEP - 42}" y="${legendY}" text-anchor="end">Less</text>
${legend}
<text class="meta" x="${legendX - 28}" y="${legendY}">More</text>
${
  busiest && busiest.count > 0
    ? `<text class="meta" x="${box.x + PADDING}" y="${legendY}">Busiest day ${escapeXml(format(parseISO(busiest.date), "d MMMM"))} with ${formatNumber(busiest.count)} contributions</text>`
    : ""
}`;
    },
  });
}
