export type ProductStatus = "available" | "unavailable";

export type Product = {
  name: string;
  sku: string;
  category: string;
  grossPrice: number;
  status: ProductStatus;
  amountInStore: number | undefined;
};