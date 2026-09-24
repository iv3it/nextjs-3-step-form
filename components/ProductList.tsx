'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { useQueryState, parseAsInteger } from "nuqs";

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

import AddProductDialog from "@/components/AddProductDialog";
import type { Product } from "@/lib/product-types";

const initialProducts: Product[] = [
  {
    name: "MacBook Pro 14\"",
    sku: "MBP14M3PRO",
    category: "Komputery",
    grossPrice: 999900,
    currency: "pln",
    status: "available",
    amountInStore: undefined,
  },
  {
    name: "Galaxy S24 Ultra",
    sku: "SGS24U256",
    category: "Telefony",
    grossPrice: 629900,
    currency: "usd",
    status: "available",
    amountInStore: 45,
  },
  {
    name: "Sony WH-1000XM5",
    sku: "SNWH1000XM5",
    category: "RTV",
    grossPrice: 159900,
    currency: "pln",
    status: "available",
    amountInStore: undefined,
  },
  {
    name: "Bosch Serie 6 WAU28P40",
    sku: "BSWAU28P40",
    category: "AGD",
    grossPrice: 329900,
    currency: "eur",
    status: "unavailable",
    amountInStore: 0,
  },
  {
    name: "Xiaomi Smart Band 8",
    sku: "XMSB8BLK",
    category: "Akcesoria",
    grossPrice: 17900,
    currency: "pln",
    status: "available",
    amountInStore: undefined,
  },
]

function ProductList() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleProductCreated = (product: Product) => {
    setProducts((currentProducts) => [
      product,
      ...currentProducts,
    ]);

    setPage(1);
  };

  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));

  const paginatedProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const getProductLabel = (count: number) => {
    if (count === 1) {
      return "produkt";
    }

    if (count >= 2 && count <= 4) {
      return "produkty";
    }

    return "produktów";
  };

  return (
    <div className="w-full flex flex-col gap-y-4 md:gap-y-6 py-12.5 max-[1240px]:px-4 max-[1240px]:py-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Produkty</h1>
          <h2 className="text-sm text-muted-foreground">{products.length} {getProductLabel(products.length)} w katalogu</h2>
        </div>

        <AddProductDialog onProductCreated={handleProductCreated} />
      </div>
      <div className="md:hidden flex flex-col justify-between gap-6">
        <div className="flex flex-col gap-2">
          {paginatedProducts.map((product, index) => (
            <div key={index} className="flex flex-col p-3 border rounded-[10px] overflow-hidden gap-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sku}</p>
                </div>
                {product.status === "available" ? (
                  <Badge variant="green">Dostępny</Badge>
                ) : (
                  <Badge variant="destructive">Niedostępny</Badge>
                )}
              </div>

              <div className="flex justify-between bg-accent rounded-[9px] p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Kategoria</p>
                  <p className="text-sm">{product.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cena brutto</p>
                  <p className="text-sm font-medium">{(product.grossPrice / 100).toFixed(2)} {product.currency.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Magazyn</p>
                  <p className="text-sm">{product.amountInStore ?? "—" }</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row w-full items-center justify-between">
          <span className="text-xs text-muted-foreground">Strona {page} z {totalPages} · {products.length} {getProductLabel(products.length)}</span>

          <Pagination className="mt-4 md:mt-0">
            <PaginationContent className="md:ml-auto">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Wstecz"
                  onClick={(event) => {
                    event.preventDefault();

                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Dalej"
                  onClick={(event) => {
                    event.preventDefault();

                    if (page < totalPages) {
                      setPage(page + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <div className="hidden md:block w-full border rounded-[10px] overflow-hidden">
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
              {paginatedProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="text-sm font-medium px-4 py-2">{product.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-2">{product.sku}</TableCell>
                  <TableCell className="text-xs text-muted-foreground px-4 py-2">{product.category}</TableCell>
                  <TableCell className="text-sm font-medium px-4 py-2">{(product.grossPrice / 100).toFixed(2)} {product.currency.toUpperCase()}</TableCell>
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
                  <div className="flex flex-col md:flex-row w-full items-center justify-between">
                    <span className="text-xs text-muted-foreground">Strona {page} z {totalPages} · {products.length} {getProductLabel(products.length)}</span>

                    <Pagination className="mt-4 md:mt-0">
                      <PaginationContent className="md:ml-auto">
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            text="Wstecz"
                            onClick={(event) => {
                              event.preventDefault();

                              if (page > 1) {
                                setPage(page - 1);
                              }
                            }}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, index) => {
                          const pageNumber = index + 1;

                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                isActive={page === pageNumber}
                                onClick={(event) => {
                                  event.preventDefault();
                                  setPage(pageNumber);
                                }}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            text="Dalej"
                            onClick={(event) => {
                              event.preventDefault();

                              if (page < totalPages) {
                                setPage(page + 1);
                              }
                            }}
                          />
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