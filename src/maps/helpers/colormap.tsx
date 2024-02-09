type Color = [number, number, number];
const colors: Color[] = [
  [245, 253, 250],
  [226, 251, 241],
  [208, 248, 233],
  [190, 246, 225],
  [172, 243, 216],
  [154, 240, 207],
  [136, 238, 199],
  [119, 235, 191],
  [102, 225, 182],
  [91, 208, 175],
  [84, 196, 170],
  [74, 182, 164],
  [66, 169, 159],
  [56, 154, 153],
  [48, 140, 147],
  [36, 122, 140],
  [28, 110, 135],
  [20, 98, 130],
  [12, 85, 125],
  [2, 69, 118]
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
  const index = Math.min(Math.floor((value - minValue) / range), colors.length - 2);
  const factor = (value - minValue) % range / range;

  const color = interpolateColor(colors[index], colors[index + 1], factor);
  return rgbToHex(color);
}