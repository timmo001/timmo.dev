import {
  type BrandIconName,
  brandIcon,
  escapeXml,
  icon,
  type IconName,
  palette,
  tile,
  truncateText,
} from "~/lib/cards/theme";

export type LinkButtonInput = {
  label: string;
  icon:
    { kind: "brand"; name: BrandIconName } | { kind: "line"; name: IconName };
};

export const LINK_BUTTON_WIDTH = 146;

export const LINK_BUTTON_HEIGHT = 56;

export function renderLinkButton(input: LinkButtonInput): string {
  return tile({
    width: LINK_BUTTON_WIDTH,
    height: LINK_BUTTON_HEIGHT,
    title: input.label,
    description: `Link: ${input.label}`,
    fill: palette.surface,
    css: `.link{font-size:13px;font-weight:600;fill:${palette.text}}`,
    body: (box) => {
      const iconX = box.x + 16;

      const iconY = box.y + box.height / 2 - 10;

      const graphic =
        input.icon.kind === "brand"
          ? brandIcon(input.icon.name, iconX, iconY, 20)
          : icon(input.icon.name, iconX, iconY, 20);

      const label = truncateText(input.label, box.width - 56, 13, 600);

      return `${graphic}
<text class="link" x="${box.x + 44}" y="${box.y + box.height / 2 + 5}">${escapeXml(label)}</text>`;
    },
  });
}
