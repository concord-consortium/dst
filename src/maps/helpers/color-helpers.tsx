type Color = [number, number, number];
export const colors: Color[] = [
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

export const rgbToHex = (color: Color): string  => {
  return '#' + color.map(c => c.toString(16).padStart(2, '0')).join('');
}

export const hexToRGBA = (hex: string, opacity: number): string => {
  hex = hex.toUpperCase();
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
