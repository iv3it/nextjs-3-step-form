import React from 'react';
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ProductStatus = "available" | "unavailable";

type Product = {
  name: string;
  sku: string;
  category: string;
  grossPrice: number;
  status: ProductStatus;
  amountInStore: number | undefined;
}

const products: Product[] = [
  {
    name: "MacBook Pro 14\"",
    sku: "MBP14M3PRO",
    category: "Komputery",
    grossPrice: 999900,
    status: "available",
    amountInStore: undefined,
  },
  {
    name: "Galaxy S24 Ultra",
    sku: "SGS24U256",
    category: "Telefony",
    grossPrice: 629900,
    status: "available",
    amountInStore: 45,
  },
  {
    name: "Sony WH-1000XM5",
    sku: "SNWH1000XM5",
    category: "RTV",
    grossPrice: 159900,
    status: "available",
    amountInStore: undefined,
  },
  {
    name: "Bosch Serie 6 WAU28P40",
    sku: "BSWAU28P40",
    category: "AGD",
    grossPrice: 329900,
    status: "unavailable",
    amountInStore: 0,
  },
  {
    name: "Xiaomi Smart Band 8",
    sku: "XMSB8BLK",
    category: "Akcesoria",
    grossPrice: 17900,
    status: "available",
    amountInStore: undefined,
  },
]

function ProductList() {
  return (
    <div className="w-full flex flex-col gap-y-6 py-12.5 max-[1240px]:px-4 max-[1240px]:py-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Produkty</h1>
          <h2 className="text-sm text-muted-foreground">7 produktów w katalogu</h2>
        </div>
        <Button className="h-auto rounded-full px-4 py-2">
          <Plus className="w-4 h-4 mr-1.5" />
          Dodaj produkt
        </Button>
      </div>
      <div className="border rounded-[10px] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4">Nazwa</TableHead>
              <TableHead className="px-4">SKU</TableHead>
              <TableHead className="px-4">Kategoria</TableHead>
              <TableHead className="px-4">Cena Brutto</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4">Magazyn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="text-sm font-medium px-4 py-2">{product.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground px-4 py-2">{product.sku}</TableCell>
                <TableCell className="text-xs text-muted-foreground px-4 py-2">{product.category}</TableCell>
                <TableCell className="text-sm font-medium px-4 py-2">{(product.grossPrice / 100).toFixed(2)} PLN</TableCell>
                <TableCell className="px-4 py-2">
                  {product.status === "available" ? (
                    <Badge variant="green">Dostępny</Badge>
                  ) : (
                    <Badge variant="destructive">Niedostępny</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm px-4 py-2">{product.amountInStore ?? "—" }</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-gray-50">
            <TableRow>
              <TableCell colSpan={6} className="p-4">
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs text-muted-foreground">Strona 1 z 2 · 7 produktów</span>

                  <Pagination>
                    <PaginationContent className="ml-auto">
                      <PaginationItem>
                        <PaginationPrevious href="#" text="Wstecz" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" text="Dalej" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export default ProductList;