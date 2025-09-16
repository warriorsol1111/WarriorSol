import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

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
export const signInSchema = z.object({
  email: z.string().min(1, { message: "Please enter your email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  stayLoggedIn: z.boolean().optional(),
});

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
