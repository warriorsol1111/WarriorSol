import { clsx, type ClassValue } from "clsx";
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
