"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CATEGORY_NAV } from "@/constants/site";
import type {
  ProductCategorySlug,
  ProductFilters,
  ProductSortOption,
} from "../types";

const categories: { slug: ProductCategorySlug; label: string }[] =
  CATEGORY_NAV;

const sortOptions: { value: ProductSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "best_selling", label: "Best selling" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "highest_rating", label: "Highest rated" },
];

export interface FilterOptions {
  brands: string[];
  series: string[];
  seriesByBrand?: Record<string, string[]>;
  cpus: string[];
  gpus: string[];
  rams: string[];
  storages: string[];
  screenSizes: number[];
}

export interface ProductFilterPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  options: FilterOptions;
  total?: number;
  className?: string;
}

function FilterContent({
  filters,
  onChange,
  options,
}: {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  options: FilterOptions;
}) {
  const update = (patch: Partial<ProductFilters>) => {
    onChange({ ...filters, ...patch });
  };

  const toggleStringArray = (
    key: "brands" | "series" | "cpu" | "gpu" | "ram" | "storage",
    value: string,
    current?: string[],
  ) => {
    const list = current ?? [];
    const next = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    update({ [key]: next.length > 0 ? next : undefined });
  };

  const toggleNumberArray = (
    key: "screenSize",
    value: number,
    current?: number[],
  ) => {
    const list = current ?? [];
    const next = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    update({ [key]: next.length > 0 ? next : undefined });
  };

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.brands?.length ?? 0) +
    (filters.series?.length ?? 0) +
    (filters.cpu?.length ?? 0) +
    (filters.gpu?.length ?? 0) +
    (filters.ram?.length ?? 0) +
    (filters.storage?.length ?? 0) +
    (filters.screenSize?.length ?? 0) +
    (filters.ssd ? 1 : 0) +
    (filters.hdd ? 1 : 0) +
    (filters.minPrice !== undefined ? 1 : 0) +
    (filters.maxPrice !== undefined ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold tracking-tight">Filters</h3>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={() =>
              onChange({
                search: filters.search,
                sort: filters.sort,
              })
            }
          >
            <X className="mr-1 size-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sort by
        </Label>
        <Select
          value={filters.sort ?? "newest"}
          onValueChange={(value) =>
            update({ sort: value as ProductSortOption })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex cursor-pointer items-center gap-2.5 text-sm"
            >
              <Checkbox
                checked={filters.category === category.slug}
                onCheckedChange={(checked) =>
                  update({ category: checked ? category.slug : undefined })
                }
              />
              <span className="text-muted-foreground">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {options.brands.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Brand
          </Label>
          <div className="space-y-2">
            {options.brands.map((brand) => (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  checked={(filters.brands ?? []).includes(brand)}
                  onCheckedChange={() =>
                    toggleStringArray("brands", brand, filters.brands)
                  }
                />
                <span className="text-muted-foreground">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {options.series.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Series
          </Label>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {options.series.map((series) => (
              <label
                key={series}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  checked={(filters.series ?? []).includes(series)}
                  onCheckedChange={() =>
                    toggleStringArray("series", series, filters.series)
                  }
                />
                <span className="text-muted-foreground">{series}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price range
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              update({
                minPrice:
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
              })
            }
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              update({
                maxPrice:
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
              })
            }
          />
        </div>
      </div>

      {options.cpus.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Processor
          </Label>
          <div className="space-y-2">
            {options.cpus.map((cpu) => (
              <label
                key={cpu}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  checked={(filters.cpu ?? []).includes(cpu)}
                  onCheckedChange={() =>
                    toggleStringArray("cpu", cpu, filters.cpu)
                  }
                />
                <span className="text-muted-foreground">{cpu}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {options.gpus.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Graphics
          </Label>
          <div className="space-y-2">
            {options.gpus.map((gpu) => (
              <label
                key={gpu}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  checked={(filters.gpu ?? []).includes(gpu)}
                  onCheckedChange={() =>
                    toggleStringArray("gpu", gpu, filters.gpu)
                  }
                />
                <span className="text-muted-foreground">{gpu}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {options.rams.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Memory
          </Label>
          <div className="space-y-2">
            {options.rams.map((ram) => (
              <label
                key={ram}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  checked={(filters.ram ?? []).includes(ram)}
                  onCheckedChange={() =>
                    toggleStringArray("ram", ram, filters.ram)
                  }
                />
                <span className="text-muted-foreground">{ram}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {options.storages.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Storage
          </Label>
          <div className="space-y-2">
            {options.storages.map((storage) => (
              <label
                key={storage}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  checked={(filters.storage ?? []).includes(storage)}
                  onCheckedChange={() =>
                    toggleStringArray("storage", storage, filters.storage)
                  }
                />
                <span className="text-muted-foreground">{storage}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {options.screenSizes.length > 0 && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Screen size
          </Label>
          <div className="space-y-2">
            {options.screenSizes.map((size) => (
              <label
                key={size}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <Checkbox
                  checked={(filters.screenSize ?? []).includes(size)}
                  onCheckedChange={() =>
                    toggleNumberArray("screenSize", size, filters.screenSize)
                  }
                />
                <span className="text-muted-foreground">{size}&quot;</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Storage type
        </Label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.ssd ?? false}
            onCheckedChange={(checked) =>
              update({ ssd: checked === true ? true : undefined })
            }
          />
          <span className="text-muted-foreground">SSD only</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox
            checked={filters.hdd ?? false}
            onCheckedChange={(checked) =>
              update({ hdd: checked === true ? true : undefined })
            }
          />
          <span className="text-muted-foreground">HDD only</span>
        </label>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <Checkbox
          checked={filters.inStockOnly ?? false}
          onCheckedChange={(checked) =>
            update({ inStockOnly: checked === true })
          }
        />
        <span className="text-muted-foreground">In stock only</span>
      </label>
    </div>
  );
}

/** Advanced filter panel for the product catalog. */
export function ProductFilterPanel({
  filters,
  onChange,
  options,
  total,
  className,
}: ProductFilterPanelProps) {
  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "bg-card ring-foreground/5 hidden h-fit rounded-2xl p-5 shadow-sm ring-1 lg:block",
          className,
        )}
      >
        <FilterContent filters={filters} onChange={onChange} options={options} />
      </aside>

      {/* Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="size-4" />
              Filters
              {total !== undefined && (
                <span className="text-muted-foreground text-xs">({total})</span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent filters={filters} onChange={onChange} options={options} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
