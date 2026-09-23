'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ArrowRightIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";

function AddProductDialog() {

  const manufacturerList = [
    { label: "Apple", value: "apple" },
    { label: "Dell", value: "dell" },
    { label: "Samsung", value: "samsung" },
  ]

  const productCategories = [
    { label: "Laptop", value: "laptop" },
    { label: "Desktop", value: "desktop" },
    { label: "Tablet", value: "tablet" },
  ]

  const currencyList = [
    { label: "PLN", value: "pln" },
    { label: "USD", value: "usd" },
    { label: "EUR", value: "eur" },
  ]

  const vatList = [
    { label: "23%", value: "23" },
    { label: "8%", value: "8" },
    { label: "5%", value: "5" },
  ]

  const [currentStep, setCurrentStep] = useState(1);

  const [priceNet, setPriceNet] = useState("");
  const [priceGross, setPriceGross] = useState("");
  const [vatValue, setVatValue] = useState("23");
  const [minStockQuantity, setMinStockQuantity] = useState("");
  const [maxStockQuantity, setMaxStockQuantity] = useState("");

  const handleChangePrice = (value: string) => {
    // max 2 decimal places
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setPriceNet(value)
    }
  }

  const handleVatValue = (value: string) => {
    setVatValue(value)
  }

  const handleMinStockQuantity = (value: string) => {
    if (/^\d*$/.test(value)) {
      setMinStockQuantity(value)
    }
  }

  const handleMaxStockQuantity = (value: string) => {
    if (/^\d*$/.test(value)) {
      setMaxStockQuantity(value)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  const handleNextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, 3))
  }

  return (
    <>
      <Dialog onOpenChange={(open) => {
        if(!open) {
          setCurrentStep(1);
        }
      }}>
        <form>
          <DialogTrigger render={
            <Button className="h-auto rounded-full px-4 py-2">
              <Plus className="mr-1.5 h-4 w-4" />
              Dodaj produkt
            </Button>
          } />
          <DialogContent className="md:max-w-[720px]">
            <DialogHeader className="py-6">
              <DialogTitle>Dodaj nowy produkt</DialogTitle>
            </DialogHeader>

            <Separator />

            <div className="flex justify-start items-center gap-4">
              <div className="flex justify-center items-center gap-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex justify-center items-center">
                  <p className="text-white text-sm font-semibold">1</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">Informacje</p>
                  <p className="text-xs text-muted-foreground">Dane podstawowe</p>
                </div>
              </div>

              <div className="w-16 h-px bg-[#e4e4e4] hidden md:block" />

              <div className="flex justify-center items-center gap-x-3">
                <div className={`w-8 h-8 rounded-full flex justify-center items-center ${currentStep >= 2 ? "bg-blue-600" : "bg-accent"}`}>
                  <p className={`text-sm font-semibold ${currentStep >= 2 ? "text-white" : "text-muted-foreground"}`}>2</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`text-sm font-medium ${currentStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Cena</p>
                  <p className="text-xs text-muted-foreground">Dane cenowe</p>
                </div>
              </div>

              <div className="w-16 h-px bg-[#e4e4e4] hidden md:block" />

              <div className="flex justify-center items-center gap-x-3">
                <div className={`w-8 h-8 rounded-full flex justify-center items-center ${currentStep >= 3 ? "bg-blue-600" : "bg-accent"}`}>
                  <p className={`text-sm font-semibold ${currentStep >= 3 ? "text-white" : "text-muted-foreground"}`}>3</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`text-sm font-medium ${currentStep >= 3 ? "text-foreground" : "text-muted-foreground"}`}>Dostępność</p>
                  <p className="text-xs text-muted-foreground">Stany magazynowe</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="py-5 flex flex-col">
              {/* Step 1 */}
              <div className={currentStep === 1 ? "flex flex-col gap-y-4" : "hidden"}>
                <div className="w-full flex gap-x-4">
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Nazwa produktu</Label>
                    <Input className="rounded-[50px]" placeholder="np. MacBook Pro 14" />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>SKU produktu</Label>
                    <Input className="rounded-[50px]" placeholder="np. MBP14M3PRO"/>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Label>Nazwa produktu</Label>
                  <Textarea placeholder="Krótki opis produktu"/>
                </div>
                <div className="w-full flex gap-x-4">
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Producent</Label>
                    <Select items={manufacturerList}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz producenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {manufacturerList.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Kategoria</Label>
                    <Select items={productCategories}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {productCategories.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Label>Cechy produktu</Label>
                  <ToggleGroup variant="outline" size="sm" defaultValue={[]} multiple>
                    <ToggleGroupItem value="bluetooth" aria-label="Toggle bluetooth" className="py-0.5 px-2 rounded-[26px]">
                      Bluetooth
                    </ToggleGroupItem>
                    <ToggleGroupItem value="wifi" aria-label="Toggle wifi" className="py-0.5 px-2 rounded-[26px]">
                      WiFi
                    </ToggleGroupItem>
                    <ToggleGroupItem value="usbc" aria-label="Toggle usbc" className="py-0.5 px-2 rounded-[26px]">
                      USB-C
                    </ToggleGroupItem>
                    <ToggleGroupItem value="waterproof" aria-label="Toggle waterproof" className="py-0.5 px-2 rounded-[26px]">
                      Wodoodporny
                    </ToggleGroupItem>
                    <ToggleGroupItem value="wireless" aria-label="Toggle wireless" className="py-0.5 px-2 rounded-[26px]">
                      Bezprzewodowy
                    </ToggleGroupItem>
                    <ToggleGroupItem value="eco" aria-label="Toggle eco" className="py-0.5 px-2 rounded-[26px]">
                      Ekologiczny
                    </ToggleGroupItem>
                    <ToggleGroupItem value="premium" aria-label="Toggle premium" className="py-0.5 px-2 rounded-[26px]">
                      Premium
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Step 2 */}
              <div className={currentStep === 2 ? "flex flex-col gap-y-4" : "hidden"}>
                <div className="w-full flex gap-x-4">
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Cena netto</Label>
                    <Input className="rounded-[50px]"
                     type="text"
                     inputMode="decimal"
                     value={priceNet}
                     onChange={(e) => handleChangePrice(e.target.value)}
                     placeholder="0.00"
                    />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Cena brutto</Label>
                    <Input className="rounded-[50px]"
                     type="text"
                     inputMode="decimal"
                     value={priceGross}
                     onChange={(e) => handleChangePrice(e.target.value)}
                     placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-x-4">
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Stawka VAT</Label>
                    <Select
                    items={vatList}
                    value={vatValue}
                    defaultValue="23"
                    onValueChange={(value) => {
                      if (typeof value === "string") {
                        handleVatValue(value);
                      }
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {vatList.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Waluta</Label>
                    <Select items={currencyList} defaultValue="pln">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {currencyList.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={currentStep === 3 ? "flex flex-col gap-y-4" : "hidden"}>
                <div className="flex items-center space-x-2">
                  <Switch id="isAvailable" />
                  <Label htmlFor="isAvailable">Produkt jest dostępny</Label>
                </div>
                <Separator />
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox id="isLimited" name="isLimited" />
                    <FieldLabel htmlFor="isLimited">
                      Produkt limitowany
                    </FieldLabel>
                  </Field>
                </FieldGroup>
                <Separator />
                <div className="w-full flex gap-x-4">
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Minimalna ilość</Label>
                    <Input className="rounded-[50px]"
                     type="text"
                     inputMode="decimal"
                     value={minStockQuantity}
                     onChange={(e) => handleMinStockQuantity(e.target.value)}
                     placeholder="0"
                    />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col gap-2">
                    <Label>Maksymalna ilość</Label>
                    <Input className="rounded-[50px]"
                     type="text"
                     inputMode="decimal"
                     value={maxStockQuantity}
                     onChange={(e) => handleMaxStockQuantity(e.target.value)}
                     placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex justify-between w-full">
                <Button onClick={handlePrevStep} disabled={currentStep === 1} variant="outline" className="h-auto px-2.5 py-2 border">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Wstecz
                </Button>
                <Button onClick={handleNextStep} disabled={currentStep === 3} type="submit" className="h-auto rounded-full px-4 py-2">
                  Dalej
                  <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

export default AddProductDialog;