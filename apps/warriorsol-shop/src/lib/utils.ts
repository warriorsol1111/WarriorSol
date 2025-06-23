import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice({
  amount,
  currencyCode = "USD",
  locale = "en-US",
}: {
  amount: string;
  currencyCode?: string;
  locale?: string;
}) {
  const numberAmount = parseFloat(amount);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(numberAmount);
}

// Base color dictionary for common color names
const baseColors: { [key: string]: string } = {
  // Basic colors
  black: "#000000",
  white: "#FFFFFF",
  grey: "#808080",
  gray: "#808080",
  red: "#FF0000",
  green: "#008000",
  blue: "#0000FF",
  yellow: "#FFFF00",
  purple: "#800080",
  orange: "#FFA500",
  brown: "#A52A2A",

  // Specific shades
  charcoal: "#36454F",
  cardinal: "#C41E3A",
  loden: "#4B5320",
  heather: "#D3D3D3",
  navy: "#000080",
  royal: "#4169E1",
  forest: "#228B22",
  maroon: "#800000",
  olive: "#808000",
  tan: "#D2B48C",
  khaki: "#F0E68C",
  burgundy: "#800020",
  teal: "#008080",
  default: "#CCCCCC", // Default color for when no specific color is provided
};

// Function to get color code from variant title
export function getColorCode(variantTitle: string): string {
  const color = variantTitle.toLowerCase();
  return baseColors[color] || baseColors.default;
}

export function calculateDiscountPercentage(
  originalPrice: string,
  salePrice: string
) {
  const original = parseFloat(originalPrice);
  const sale = parseFloat(salePrice);
  return Math.round(((original - sale) / original) * 100);
}
