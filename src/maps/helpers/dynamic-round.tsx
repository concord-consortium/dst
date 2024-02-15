export const dynamicRound = (num: number): number => {
  const decimalPart = num - Math.floor(num);
  const decimalString = decimalPart.toFixed(4); // Use toFixed(4) to ensure we have a consistent number of decimal places
  const thirdDecimalPlace = decimalString.length > 3 ? parseInt(decimalString.charAt(3)) : 0;
  const fourthDecimalPlace = decimalString.length > 4 ? parseInt(decimalString.charAt(4)) : 0;
  if (thirdDecimalPlace > 0 || fourthDecimalPlace >= 5) {
    if (thirdDecimalPlace === 0 && fourthDecimalPlace >= 5) {
      return Math.round(num * 1000) / 1000;
    } else {
      return Math.round(num * 100) / 100;
    }
  } else {
    return Math.round(num * 10) / 10;
  }
}
