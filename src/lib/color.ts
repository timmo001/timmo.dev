export function getRGBColorFromHex(str: string): {
  r: number;
  g: number;
  b: number;
} {
  const hex = str.replace("#", "");
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function getContrastColor({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}): string {
  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
  return brightness > 125 ? "black" : "white";
}
