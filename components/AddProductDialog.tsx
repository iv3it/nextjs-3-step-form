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
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryList, currencyList, manufacturerList, vatList, featureList, productFormSchema, productStepOneSchema, productStepTwoSchema, productStepThreeSchema, type ProductFormValues } from "@/lib/product-schema";
import { useForm, revalidateLogic } from "@tanstack/react-form";
import type { Product } from "@/lib/product-types";

type AddProductDialogProps = {
  onProductCreated: (product: Product) => void;
};

function AddProductDialog({ onProductCreated }: AddProductDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [priceSource, setPriceSource] = useState<"net" | "gross">("net");
  const [open, setOpen] = useState(false);

  const roundPrice = (value: number) => Number(value.toFixed(2));

  const parsePrice = (value: string) => {
    if (value === "") return 0;
    const normalized = value.replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const calculateGross = (net: string, vat: string) => roundPrice(parsePrice(net) * (1 + Number(vat) / 100));
  const calculateNet = (gross: string, vat: string) => roundPrice(parsePrice(gross) / (1 + Number(vat) / 100));

  const handlePrevStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  const defaultFormValues: ProductFormValues = {
    step1: {
      name: "",
      sku: "",
      description: "",
      manufacturer: "",
      category: "",
      features: [],
    },
    step2: {
      priceNet: "",
      priceGross: "",
      vat: "",
      currency: "",
    },
    step3: {
      isAvailable: true,
      isLimited: false,
      stockQuantity: undefined,
      minCartQuantity: 1,
      maxCartQuantity: 1,
    }
  }

  const form = useForm({
    defaultValues: defaultFormValues,
    validationLogic: revalidateLogic(),
    validators: {
      onSubmit: productFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      const newProduct: Product = {
        name: value.step1.name,
        sku: value.step1.sku,
        category: value.step1.category,
        grossPrice: Math.round(
          Number(value.step2.priceGross.replace(",", ".")) * 100
        ),
        status: value.step3.isAvailable ? "available" : "unavailable",
        amountInStore: value.step3.isLimited ? value.step3.stockQuantity : undefined,
      };

      onProductCreated(newProduct);

      setOpen(false);
    }
  });

  const handleGrossChange = (value: string) => {
    if (!/^(\d+([.,]\d{0,2})?)?$/.test(value)) {
      return;
    }

    setPriceSource("gross");
    form.setFieldValue("step2.priceGross", value);

    const vat = form.getFieldValue("step2.vat");

    if (value === "") {
      form.setFieldValue("step2.priceNet", "");
      return;
    }

    if (vat !== "") {
      form.setFieldValue("step2.priceNet", calculateNet(value, vat).toString())
    }
  };

  const handleNetChange = (value: string) => {
    if (!/^(\d+([.,]\d{0,2})?)?$/.test(value)) {
      return;
    }

    setPriceSource("net");
    form.setFieldValue("step2.priceNet", value);

    const vat = form.getFieldValue("step2.vat");

    if (value === "") {
      form.setFieldValue("step2.priceGross", "");
      return;
    }

    if (vat !== "") {
      form.setFieldValue("step2.priceGross", calculateGross(value, vat).toString());
    }
  };

  const handleVatChange = (value: ProductFormValues["step2"]["vat"]) => {
    form.setFieldValue("step2.vat", value);

    if (value === "") {
      return;
    }

    if (priceSource === "net") {
      const priceNet = form.getFieldValue("step2.priceNet");

      if (priceNet !== "") {
        form.setFieldValue("step2.priceGross", calculateGross(priceNet, value).toString());
      }
    } else {
      const priceGross = form.getFieldValue("step2.priceGross");

      if (priceGross !== "") {
        form.setFieldValue("step2.priceNet", calculateNet(priceGross, value).toString());
      }
    }
  };

  const resetProductForm = () => {
    setCurrentStep(1);
    setPriceSource("net");
    form.reset();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);

          if(!open) {
            resetProductForm();
          }
        }
      }>
        <DialogTrigger render={
          <Button onClick={resetProductForm} className="h-auto rounded-full px-4 py-2">
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

          <form onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}>
            <div className="flex flex-col">
              {/* Step 1 */}
              <div className={currentStep === 1 ? "flex flex-col gap-y-4" : "hidden"}>
                <form.FormGroup
                  name="step1"
                  validators={{
                    onDynamic: productStepOneSchema,
                  }}
                  onGroupSubmit={() => {
                    setCurrentStep(2);
                  }}
                >
                  {(formGroup) => (
                    <>
                      <div className="w-full flex gap-x-4">
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step1.name">Nazwa produktu</Label>
                          <form.Field
                            name="step1.name"
                            validators={{
                              onChange: productStepOneSchema.shape.name,
                            }}
                          >
                            {(field) => (
                              <>
                                <Input
                                  id={field.name}
                                  className="rounded-[50px]"
                                  placeholder="np. MacBook Pro 14"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(event) => field.handleChange(event.target.value)}
                                  aria-invalid={field.state.meta.errors.length > 0}
                                />

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step1.sku">SKU produktu</Label>
                          <form.Field
                            name="step1.sku"
                            validators={{
                              onChange: productStepOneSchema.shape.sku,
                            }}
                          >
                            {(field) => (
                              <>
                                <Input
                                  id={field.name}
                                  className="rounded-[50px]"
                                  placeholder="np. MBP14M3PRO"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(event) => field.handleChange(event.target.value)}
                                  aria-invalid={field.state.meta.errors.length > 0}
                                />

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Label htmlFor="step1.description">Opis produktu</Label>
                        <form.Field
                          name="step1.description"
                          validators={{
                            onChange: productStepOneSchema.shape.description,
                          }}
                        >
                          {(field) => (
                            <>
                              <Textarea
                                id={field.name}
                                placeholder="Krótki opis produktu"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                aria-invalid={field.state.meta.errors.length > 0}
                              />

                              <FieldError
                                errors={field.state.meta.errors.map((error) => ({
                                  message: typeof error === "string" ? error : error?.message,
                                }))}
                              />
                            </>
                          )}
                        </form.Field>
                      </div>
                      <div className="w-full flex gap-x-4">
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step1.manufacturer">Producent</Label>
                          <form.Field
                            name="step1.manufacturer"
                            validators={{
                              onChange: productStepOneSchema.shape.manufacturer,
                            }}
                          >
                            {(field) => (
                              <>
                                <Select
                                  items={manufacturerList}
                                  value={field.state.value}
                                  onValueChange={(value) => {
                                    if (typeof value === "string") {
                                      field.handleChange(value);
                                    }
                                  }}
                                >
                                  <SelectTrigger
                                    id="manufacturer"
                                    className="w-full"
                                    aria-invalid={field.state.meta.errors.length > 0}
                                  >
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

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step1.category">Kategoria</Label>
                          <form.Field
                            name="step1.category"
                            validators={{
                              onChange: productStepOneSchema.shape.category,
                            }}
                          >
                            {(field) => (
                              <>
                                <Select
                                  items={categoryList}
                                  value={field.state.value}
                                  onValueChange={(value) => {
                                    if (typeof value === "string") {
                                      field.handleChange(value);
                                    }
                                  }}
                                >
                                  <SelectTrigger
                                    id="category"
                                    className="w-full"
                                    aria-invalid={field.state.meta.errors.length > 0}
                                  >
                                    <SelectValue placeholder="Wybierz kategorię" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectGroup>
                                      {categoryList.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                          {item.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Label>Cechy produktu</Label>
                        <form.Field
                          name="step1.features"
                          validators={{
                            onChange: productStepOneSchema.shape.features,
                          }}
                        >
                          {(field) => (
                            <>
                              <ToggleGroup
                                variant="outline"
                                size="sm"
                                multiple
                                value={field.state.value}
                                onValueChange={(value) => {
                                  field.handleChange(value as ProductFormValues["step1"]["features"]);
                                }}
                              >
                                {featureList.map((feature) => (
                                  <ToggleGroupItem
                                    key={feature.value}
                                    value={feature.value}
                                    aria-label={`Toggle ${feature.value}`}
                                    className="py-0.5 px-2 rounded-[26px]"
                                  >
                                    {feature.label}
                                  </ToggleGroupItem>
                                ))}
                              </ToggleGroup>

                              <FieldError
                                errors={field.state.meta.errors.map((error) => ({
                                  message: typeof error === "string" ? error : error?.message,
                                }))}
                              />
                            </>
                          )}
                        </form.Field>
                      </div>

                      <DialogFooter>
                        <div className="flex justify-between w-full">
                          <Button type="button" onClick={handlePrevStep} disabled={currentStep === 1} variant="outline" className="h-auto px-2.5 py-2 border">
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Wstecz
                          </Button>

                          <Button type="button" onClick={() => formGroup.handleSubmit()} className="h-auto rounded-full px-4 py-2">
                            Dalej
                            <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                          </Button>
                        </div>
                      </DialogFooter>
                    </>
                  )}
                </form.FormGroup>
              </div>

              {/* Step 2 */}
              <div className={currentStep === 2 ? "flex flex-col gap-y-4" : "hidden"}>
                <form.FormGroup
                  name="step2"
                  validators={{
                    onDynamic: productStepTwoSchema,
                  }}
                  onGroupSubmit={() => {
                    setCurrentStep(3);
                  }}

                >
                  {(formGroup) => (
                    <>
                      <div className="w-full flex gap-x-4">
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step2.priceNet">Cena netto</Label>
                          <form.Field
                            name="step2.priceNet"
                            validators={{
                              onChange: productStepTwoSchema.shape.priceNet,
                            }}
                          >
                            {(field) => (
                              <>
                                <Input
                                  id={field.name}
                                  className="rounded-[50px]"
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="0.00"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => handleNetChange(e.target.value)}
                                  aria-invalid={field.state.meta.errors.length > 0}
                                />

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step2.priceGross">Cena brutto</Label>
                          <form.Field
                            name="step2.priceGross"
                            validators={{
                              onChange: productStepTwoSchema.shape.priceGross,
                            }}
                          >
                            {(field) => (
                              <>
                                <Input
                                  id={field.name}
                                  className="rounded-[50px]"
                                  type="text"
                                  inputMode="decimal"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e) => handleGrossChange(e.target.value)}
                                  placeholder="0.00"
                                  aria-invalid={field.state.meta.errors.length > 0}
                                />

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                      </div>
                      <div className="w-full flex gap-x-4">
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step2.vat">Stawka VAT</Label>
                          <form.Field
                            name="step2.vat"
                            validators={{
                              onChange: productStepTwoSchema.shape.vat,
                            }}
                          >
                            {(field) => (
                              <>
                                <Select
                                  items={vatList}
                                  value={field.state.value}
                                  onValueChange={(value) => {
                                    if (typeof value === "string") {
                                      handleVatChange(value as ProductFormValues["step2"]["vat"]);
                                    }
                                  }}
                                >
                                  <SelectTrigger
                                    id="vat"
                                    className="w-full"
                                    aria-invalid={field.state.meta.errors.length > 0}
                                  >
                                    <SelectValue placeholder="Wybierz stawkę VAT" />
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

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step2.currency">Waluta</Label>
                          <form.Field
                            name="step2.currency"
                            validators={{
                              onChange: productStepTwoSchema.shape.currency,
                            }}
                          >
                            {(field) => (
                              <>
                                <Select
                                  items={currencyList}
                                  value={field.state.value}
                                  onValueChange={(value) => {
                                    if (typeof value === "string") {
                                      field.handleChange(value as ProductFormValues["step2"]["currency"]);
                                    }
                                  }}
                                >
                                  <SelectTrigger
                                    id="currency"
                                    className="w-full"
                                    aria-invalid={field.state.meta.errors.length > 0}
                                  >
                                    <SelectValue placeholder="Wybierz walutę"/>
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

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                      </div>

                      <DialogFooter>
                        <div className="flex justify-between w-full">
                          <Button type="button" onClick={handlePrevStep} disabled={currentStep === 1} variant="outline" className="h-auto px-2.5 py-2 border">
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Wstecz
                          </Button>

                          <Button type="button" onClick={() => formGroup.handleSubmit()} className="h-auto rounded-full px-4 py-2">
                            Dalej
                            <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                          </Button>
                        </div>
                      </DialogFooter>
                    </>
                  )}
                </form.FormGroup>
              </div>

              {/* Step 3 */}
              <div className={currentStep === 3 ? "flex flex-col gap-y-4" : "hidden"}>
                <form.FormGroup
                  name="step3"
                  validators={{
                    onDynamic: productStepThreeSchema,
                  }}
                >
                  {(formGroup) => (
                    <>
                      <div className="flex items-center space-x-2">
                        <form.Field
                          name="step3.isAvailable"
                          validators={{
                            onChange: productStepThreeSchema.shape.isAvailable,
                          }}
                        >
                          {(field) => (
                            <>
                              <Switch
                                id="isAvailable"
                                checked={field.state.value}
                                onCheckedChange={(checked) => {
                                  field.handleChange(checked);
                                }}
                              />

                              <Label htmlFor="isAvailable">Produkt jest dostępny</Label>

                              <FieldError
                                errors={field.state.meta.errors.map((error) => ({
                                  message: typeof error === "string" ? error : error?.message,
                                }))}
                              />
                            </>
                          )}
                        </form.Field>
                      </div>
                      <Separator />
                      <FieldGroup>
                        <Field orientation="horizontal">
                          <form.Field
                            name="step3.isLimited"
                            validators={{
                              onChange: productStepThreeSchema.shape.isLimited,
                            }}
                          >
                            {(field) => (
                              <>
                                <Checkbox
                                  id="isLimited"
                                  name="isLimited"
                                  checked={field.state.value}
                                  onCheckedChange={(checked) => {
                                    field.handleChange(checked);

                                    if (!checked) {
                                      form.setFieldValue("step3.stockQuantity", undefined);
                                    }
                                  }}
                                />

                                <FieldLabel htmlFor="isLimited">
                                  Produkt limitowany
                                </FieldLabel>
                              </>
                            )}
                          </form.Field>
                        </Field>
                      </FieldGroup>

                      <form.Subscribe selector={(state) => state.values.step3.isLimited}>
                        {(isLimited) =>
                          isLimited && (
                            <form.Field
                              name="step3.stockQuantity"
                              validators={{
                                onChange: productStepThreeSchema.shape.stockQuantity,
                              }}
                            >
                              {(field) => (
                                <>
                                  <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="step3.stockQuantity">Ilość na magazynie</Label>

                                    <Input
                                      id={field.name}
                                      className="rounded-[50px]"
                                      type="number"
                                      min={0}
                                      step={1}
                                      value={field.state.value ?? ""}
                                      onBlur={field.handleBlur}
                                      onChange={(event) => {
                                        const value = event.target.value;

                                        field.handleChange(
                                          value === "" ? undefined : Number(value)
                                        );
                                      }}
                                      placeholder="0"
                                      aria-invalid={field.state.meta.errors.length > 0}
                                    />

                                    <FieldError
                                      errors={field.state.meta.errors.map((error) => ({
                                        message: typeof error === "string" ? error : error?.message,
                                      }))}
                                    />
                                  </div>
                                </>
                              )}
                            </form.Field>
                          )
                        }
                      </form.Subscribe>

                      <Separator />

                      <p className="text-base font-medium">Limity koszyka</p>
                      <div className="w-full flex gap-x-4">
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step3.minCartQuantity">Minimalna ilość</Label>
                          <form.Field
                            name="step3.minCartQuantity"
                            validators={{
                              onChange: productStepThreeSchema.shape.minCartQuantity,
                            }}
                          >
                            {(field) => (
                              <>
                                <Input
                                  id={field.name}
                                  className="rounded-[50px]"
                                  type="text"
                                  inputMode="numeric"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(event) => {
                                    const value = event.target.value;

                                    if (/^\d*$/.test(value)) {
                                      field.handleChange(
                                        value === "" ? 0 : Number(value)
                                      );
                                    }
                                  }}
                                  placeholder="0"
                                  aria-invalid={field.state.meta.errors.length > 0}
                                />

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                          <Label htmlFor="step3.maxCartQuantity">Maksymalna ilość</Label>
                          <form.Field
                            name="step3.maxCartQuantity"
                            validators={{
                              onChange: productStepThreeSchema.shape.maxCartQuantity,
                            }}
                          >
                            {(field) => (
                              <>
                                <Input
                                  id={field.name}
                                  className="rounded-[50px]"
                                  type="text"
                                  inputMode="numeric"
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(event) => {
                                    const value = event.target.value;

                                    if (/^\d*$/.test(value)) {
                                      field.handleChange(
                                        value === "" ? 0 : Number(value)
                                      );
                                    }
                                  }}
                                  placeholder="0"
                                  aria-invalid={field.state.meta.errors.length > 0}
                                />

                                <FieldError
                                  errors={field.state.meta.errors.map((error) => ({
                                    message: typeof error === "string" ? error : error?.message,
                                  }))}
                                />
                              </>
                            )}
                          </form.Field>
                        </div>
                      </div>

                      <DialogFooter>
                        <div className="flex justify-between w-full">
                          <Button type="button" onClick={handlePrevStep} disabled={currentStep === 1} variant="outline" className="h-auto px-2.5 py-2 border">
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Wstecz
                          </Button>

                          <Button type="submit" className="h-auto rounded-full px-4 py-2">
                            Zapisz produkt
                          </Button>
                        </div>
                      </DialogFooter>
                    </>
                  )}
                </form.FormGroup>
              </div>
            </div>
          </form>

        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddProductDialog;