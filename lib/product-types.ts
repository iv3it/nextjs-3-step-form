export type ProductCurrency = "pln" | "usd" | "eur";

export type ProductStatus = "available" | "unavailable";

export type Product = {
  name: string;
  sku: string;
  category: string;
  grossPrice: number;
  currency: ProductCurrency;
  status: ProductStatus;
  amountInStore: number | undefined;
};