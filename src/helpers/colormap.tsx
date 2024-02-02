type Color = [number, number, number];
const colors: Color[] = [
  [0, 0, 255],    // blue
  [0, 255, 0],    // green
  [255, 255, 0],  // yellow
  [255, 165, 0],  // orange
  [255, 0, 0]     // red
];

function interpolateColor(color1: Color, color2: Color, factor: number): Color {
  const result: Color = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
      result[i] = Math.round(color1[i] + (color2[i] - color1[i]) * factor);
  }
  return result;
}

function rgbToHex(color: Color): string {
  return '#' + color.map(c => c.toString(16).padStart(2, '0')).join('');
}

export function getColorForValue(value: number, minValue: number, maxValue: number): string {
  const range = (maxValue - minValue) / (colors.length - 1);
  let index = Math.min(Math.floor((value - minValue) / range), colors.length - 2);
  let factor = (value - minValue) % range / range;

  const color = interpolateColor(colors[index], colors[index + 1], factor);
  return rgbToHex(color);
}