export type TagStyle = {
  backgroundColor: string;
};

const HOME_ASSISTANT_BLUE = "#03A9F4";

export const tagStyles: Record<string, TagStyle> = {
  "Home Assistant Integration": {
    backgroundColor: HOME_ASSISTANT_BLUE,
  },
  "Home Assistant Community Add-on": {
    backgroundColor: HOME_ASSISTANT_BLUE,
  },
};

const defaultTagStyle: TagStyle = {
  backgroundColor: "#6366f1",
};

export function getTagStyle(label: string): TagStyle {
  return tagStyles[label] ?? defaultTagStyle;
}
