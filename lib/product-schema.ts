import * as z from "zod";

// Options

export const manufacturerValues = ["apple", "dell", "samsung"] as const;

export const manufacturerList = [
  { label: "Apple", value: "apple" },
  { label: "Dell", value: "dell" },
  { label: "Samsung", value: "samsung" },
] as const;

export const categoryValues = ["laptop", "desktop", "tablet"] as const;

export const categoryList = [
  { label: "Laptop", value: "laptop" },
  { label: "Desktop", value: "desktop" },
  { label: "Tablet", value: "tablet" },
] as const;

export const featureValues = [
  "bluetooth",
  "wifi",
  "usbc",
  "waterproof",
  "wireless",
  "eco",
  "premium",
] as const;

export const featureList = [
  { label: "Bluetooth", value: "bluetooth" },
  { label: "WiFi", value: "wifi" },
  { label: "USB-C", value: "usbc" },
  { label: "Wodoodporny", value: "waterproof" },
  { label: "Bezprzewodowy", value: "wireless" },
  { label: "Ekologiczny", value: "eco" },
  { label: "Premium", value: "premium" },
] as const;

export const vatValues = ["23", "8", "5"] as const;

export const vatList = [
  { label: "23%", value: "23" },
  { label: "8%", value: "8" },
  { label: "5%", value: "5" },
] as const;

export const currencyValues = ["pln", "usd", "eur"] as const;

export const currencyList = [
  { label: "PLN", value: "pln" },
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
] as const;

// Step schemas

export const productStepOneSchema = z.object({
  name: z.string().trim().min(3, "Wprowadź nazwę produktu"),
  sku: z.string().min(1).max(24, "SKU może mieć maks. 24 znaki").regex(/^[A-Za-z0-9]+$/, "SKU może zawierać tylko litery i cyfry"),
  description: z.string().optional(),
  manufacturer: z.enum(manufacturerValues),
  category: z.enum(categoryValues),
  features: z.array(z.enum(featureValues)).min(1, "Wybierz co najmniej jedną cechę produktu"),
})

export const productStepTwoSchema = z.object({
  priceNet: z
    .string()
    .trim()
    .min(1, "Cena netto jest wymagana")
    .regex(/^\d+(?:[.,]\d{1,2})?$/, "Wprowadź poprawną cenę")
    .transform((value) => Number(value.replace(",", ".")))
    .refine((value) => value >= 0, "Cena nie może być ujemna"),
  priceGross: z
    .string()
    .trim()
    .min(1, "Cena brutto jest wymagana")
    .regex(/^\d+(?:[.,]\d{1,2})?$/, "Wprowadź poprawną cenę")
    .transform((value) => Number(value.replace(",", ".")))
    .refine((value) => value >= 0, "Cena nie może być ujemna"),
  vat: z.enum(vatValues),
  currency: z.enum(currencyValues),
})

const nonNegativeInteger = z.number().int("Wartość musi być liczbą całkowitą").nonnegative("Wartość nie może być ujemna");

export const productStepThreeSchema = z.object({
    isAvailable: z.boolean(),
    isLimited: z.boolean(),
    stockQuantity: nonNegativeInteger.optional(),
    minCartQuantity: z.int("Wartość musi być liczbą całkowitą"),
    maxCartQuantity: z.int("Wartość musi być liczbą całkowitą"),
  })
  .superRefine((data, context) => {
    if (data.isLimited && data.stockQuantity === undefined) {
      context.addIssue({
        code: "custom",
        path: ["stockQuantity"],
        message: "Ilość na magazynie jest wymagana",
      });
    }

    if (data.minCartQuantity > data.maxCartQuantity) {
      context.addIssue({
        code: "custom",
        path: ["minCartQuantity"],
        message: "Minimalna ilość na koszyk nie może być większa niż maksymalna",
      });

      context.addIssue({
        code: "custom",
        path: ["maxCartQuantity"],
        message: "Maksymalna ilość na koszyk nie może być mniejsza niż minimalna",
      });
    }
  });