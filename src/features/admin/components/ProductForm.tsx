"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product, CreateProductInput, ProductSpecs } from "@/features/products/types";

export interface ProductFormData {
  name: string;
  brand: string;
  series?: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  warrantyMonths: number;
  thumbnail: string;
  images: string;
  tags?: string;
  productCode?: string;
  badge?: string;
  freeGifts?: string;
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  ssd?: string;
  hdd?: string;
  display?: string;
  screenSize?: number;
  os?: string;
  ports?: string;
  weight?: string;
  color?: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  series: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().positive(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative(),
  warrantyMonths: z.coerce.number().int().nonnegative(),
  thumbnail: z.string().min(1, "Thumbnail is required"),
  images: z.string().min(1, "Images are required"),
  tags: z.string().optional(),
  productCode: z.string().optional(),
  badge: z.string().optional(),
  freeGifts: z.string().optional(),
  cpu: z.string().optional(),
  gpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  ssd: z.string().optional(),
  hdd: z.string().optional(),
  display: z.string().optional(),
  screenSize: z.coerce.number().positive().optional(),
  os: z.string().optional(),
  ports: z.string().optional(),
  weight: z.string().optional(),
  color: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
});

export interface ProductFormProps {
  initialValue?: Product;
  onSubmit: (value: CreateProductInput) => void;
  loading?: boolean;
}

/** Admin product create/edit form. */
export function ProductForm({ initialValue, onSubmit, loading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues: initialValue
      ? {
          name: initialValue.name,
          brand: initialValue.brand,
          series: initialValue.series ?? "",
          category: initialValue.category,
          description: initialValue.description,
          price: initialValue.price,
          originalPrice: initialValue.originalPrice,
          stock: initialValue.stock,
          warrantyMonths: initialValue.warrantyMonths,
          thumbnail: initialValue.thumbnail,
          images: initialValue.images.join(", "),
          tags: initialValue.tags.join(", "),
          productCode: initialValue.productCode ?? "",
          badge: initialValue.badge ?? "",
          freeGifts: initialValue.freeGifts?.join(", ") ?? "",
          cpu: initialValue.specs?.cpu ?? "",
          gpu: initialValue.specs?.gpu ?? "",
          ram: initialValue.specs?.ram ?? "",
          storage: initialValue.specs?.storage ?? "",
          ssd: initialValue.specs?.ssd ?? "",
          hdd: initialValue.specs?.hdd ?? "",
          display: initialValue.specs?.display ?? "",
          screenSize: initialValue.specs?.screenSize,
          os: initialValue.specs?.os ?? "",
          ports: initialValue.specs?.ports?.join(", ") ?? "",
          weight: initialValue.specs?.weight ?? "",
          color: initialValue.specs?.color ?? "",
          isFeatured: initialValue.isFeatured,
          isNewArrival: initialValue.isNewArrival,
          isBestSeller: initialValue.isBestSeller,
        }
      : {
          name: "",
          brand: "",
          series: "",
          category: "",
          description: "",
          price: 0,
          originalPrice: undefined,
          stock: 0,
          warrantyMonths: 12,
          thumbnail: "",
          images: "",
          tags: "",
          productCode: "",
          badge: "",
          freeGifts: "",
          cpu: "",
          gpu: "",
          ram: "",
          storage: "",
          ssd: "",
          hdd: "",
          display: "",
          screenSize: undefined,
          os: "",
          ports: "",
          weight: "",
          color: "",
          isFeatured: false,
          isNewArrival: false,
          isBestSeller: false,
        },
  });

  const handleFormSubmit = (formData: ProductFormData) => {
    const specs: ProductSpecs = {};
    if (formData.cpu) specs.cpu = formData.cpu;
    if (formData.gpu) specs.gpu = formData.gpu;
    if (formData.ram) specs.ram = formData.ram;
    if (formData.storage) specs.storage = formData.storage;
    if (formData.ssd) specs.ssd = formData.ssd;
    if (formData.hdd) specs.hdd = formData.hdd;
    if (formData.display) specs.display = formData.display;
    if (formData.screenSize) specs.screenSize = formData.screenSize;
    if (formData.os) specs.os = formData.os;
    if (formData.ports) specs.ports = formData.ports.split(",").map((s) => s.trim()).filter(Boolean);
    if (formData.weight) specs.weight = formData.weight;
    if (formData.color) specs.color = formData.color;

    const modelKey = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const payload: CreateProductInput = {
      name: formData.name,
      brand: formData.brand,
      series: formData.series?.trim() || undefined,
      modelKey,
      category: formData.category as CreateProductInput["category"],
      description: formData.description,
      price: formData.price,
      originalPrice: formData.originalPrice,
      currency: "USD",
      stock: formData.stock,
      warrantyMonths: formData.warrantyMonths,
      thumbnail: formData.thumbnail,
      images: formData.images.split(",").map((s) => s.trim()).filter(Boolean),
      tags: formData.tags?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
      productCode: formData.productCode?.trim() || undefined,
      badge: formData.badge?.trim() || undefined,
      freeGifts:
        formData.freeGifts?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
      specs,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller,
    };
    onSubmit(payload);
  };

  const featured = useWatch({ control, name: "isFeatured" });
  const newArrival = useWatch({ control, name: "isNewArrival" });
  const bestSeller = useWatch({ control, name: "isBestSeller" });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register("brand")} />
          {errors.brand && <p className="text-destructive text-xs">{errors.brand.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="series">Series / product line</Label>
          <Input id="series" {...register("series")} placeholder="e.g. Vivobook, Legion, TUF" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productCode">Product code / SKU</Label>
          <Input id="productCode" {...register("productCode")} placeholder="e.g. L001-B1503CVA1" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category slug</Label>
          <Input id="category" {...register("category")} placeholder="e.g. laptops" />
          {errors.category && <p className="text-destructive text-xs">{errors.category.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="warrantyMonths">Warranty (months)</Label>
          <Input id="warrantyMonths" type="number" {...register("warrantyMonths")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="badge">Badge / ribbon</Label>
          <Input id="badge" {...register("badge")} placeholder="e.g. VIP SPECS" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="freeGifts">Free gifts (comma separated)</Label>
          <Input id="freeGifts" {...register("freeGifts")} placeholder="e.g. Backpack, Wireless Mouse" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-destructive text-xs">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Original price</Label>
          <Input id="originalPrice" type="number" step="0.01" {...register("originalPrice")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && <p className="text-destructive text-xs">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
        {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input id="thumbnail" {...register("thumbnail")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (comma separated)</Label>
        <Textarea id="images" rows={2} {...register("images")} />
        {errors.images && <p className="text-destructive text-xs">{errors.images.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" {...register("tags")} />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold">Specifications (optional)</h3>
        <p className="text-muted-foreground text-xs">Fill in details like CPU, RAM, GPU etc. for laptops and hardware products.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cpu">CPU</Label>
          <Input id="cpu" {...register("cpu")} placeholder="e.g. Intel Core i7-13700H" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gpu">GPU</Label>
          <Input id="gpu" {...register("gpu")} placeholder="e.g. NVIDIA RTX 4060 8GB" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ram">RAM</Label>
          <Input id="ram" {...register("ram")} placeholder="e.g. 16GB DDR5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="storage">Storage</Label>
          <Input id="storage" {...register("storage")} placeholder="e.g. 512GB NVMe SSD" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ssd">SSD</Label>
          <Input id="ssd" {...register("ssd")} placeholder="e.g. 512GB" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hdd">HDD</Label>
          <Input id="hdd" {...register("hdd")} placeholder="e.g. 1TB" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="display">Display</Label>
          <Input id="display" {...register("display")} placeholder="e.g. 15.6&apos; FHD IPS" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="screenSize">Screen size (in)</Label>
          <Input id="screenSize" type="number" step="0.1" {...register("screenSize")} placeholder="e.g. 15.6" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="os">OS</Label>
          <Input id="os" {...register("os")} placeholder="e.g. Windows 11" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ports">Ports (comma separated)</Label>
          <Input id="ports" {...register("ports")} placeholder="e.g. USB-C, HDMI, 3.5mm" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input id="weight" {...register("weight")} placeholder="e.g. 1.8 kg" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" {...register("color")} placeholder="e.g. Misty Grey" />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 py-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isFeatured"
            checked={featured}
            onCheckedChange={(checked) => setValue("isFeatured", checked === true)}
          />
          <Label htmlFor="isFeatured" className="cursor-pointer">Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isNewArrival"
            checked={newArrival}
            onCheckedChange={(checked) => setValue("isNewArrival", checked === true)}
          />
          <Label htmlFor="isNewArrival" className="cursor-pointer">New arrival</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="isBestSeller"
            checked={bestSeller}
            onCheckedChange={(checked) => setValue("isBestSeller", checked === true)}
          />
          <Label htmlFor="isBestSeller" className="cursor-pointer">Best seller</Label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialValue ? "Update product" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
