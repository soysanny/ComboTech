"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  MAX_PRODUCT_LIMIT,
  MIN_PRODUCT_LIMIT,
} from "@/features/homepage/constants";
import type {
  BrandSelectionMode,
  HomepageBrandProductOption,
  HomepageBrandSection,
} from "@/features/homepage/types";

function clampLimit(value: number): number {
  if (!Number.isFinite(value)) return MIN_PRODUCT_LIMIT;
  return Math.min(
    MAX_PRODUCT_LIMIT,
    Math.max(MIN_PRODUCT_LIMIT, Math.trunc(value)),
  );
}

interface BrandSectionEditorProps {
  section: HomepageBrandSection;
  products: HomepageBrandProductOption[];
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (patch: Partial<HomepageBrandSection>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}

/** Editor card for a single homepage brand section. */
export function BrandSectionEditor({
  section,
  products,
  isFirst,
  isLast,
  onUpdate,
  onMove,
  onRemove,
}: BrandSectionEditorProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(term),
    );
  }, [products, query]);

  const toggleProduct = (id: string, checked: boolean) => {
    const productIds = checked
      ? Array.from(new Set([...section.productIds, id]))
      : section.productIds.filter((productId) => productId !== id);
    onUpdate({ productIds });
  };

  return (
    <div className="bg-card ring-foreground/5 rounded-2xl p-4 shadow-sm ring-1">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isFirst}
            onClick={() => onMove(-1)}
            aria-label={`Move ${section.brand} up`}
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isLast}
            onClick={() => onMove(1)}
            aria-label={`Move ${section.brand} down`}
          >
            <ArrowDown className="size-4" />
          </Button>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{section.brand}</p>
          <p className="text-muted-foreground text-xs">
            {section.selectionMode === "manual"
              ? `${section.productIds.length} manually selected`
              : "Automatic selection"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id={`enabled-${section.id}`}
            checked={section.enabled}
            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          />
          <Label
            htmlFor={`enabled-${section.id}`}
            className="text-muted-foreground cursor-pointer text-xs"
          >
            {section.enabled ? "Visible" : "Hidden"}
          </Label>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label={`Remove ${section.brand} section`}
        >
          <Trash2 className="text-destructive size-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`limit-${section.id}`}>Products to show</Label>
          <Input
            id={`limit-${section.id}`}
            type="number"
            min={MIN_PRODUCT_LIMIT}
            max={MAX_PRODUCT_LIMIT}
            value={section.productLimit}
            onChange={(event) =>
              onUpdate({ productLimit: clampLimit(Number(event.target.value)) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Selection mode</Label>
          <Select
            value={section.selectionMode}
            onValueChange={(value) =>
              onUpdate({ selectionMode: value as BrandSelectionMode })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatic (by brand)</SelectItem>
              <SelectItem value="manual">Manual selection</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {section.selectionMode === "manual" && (
        <div className="mt-4 space-y-2">
          <Label>Choose products</Label>
          {products.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              No products found for this brand yet.
            </p>
          ) : (
            <>
              <Input
                type="search"
                placeholder="Search products..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9"
              />
              <div className="border-border/60 max-h-60 space-y-1 overflow-y-auto rounded-lg border p-2">
                {filteredProducts.length === 0 ? (
                  <p className="text-muted-foreground px-2 py-1.5 text-xs">
                    No matching products.
                  </p>
                ) : (
                  filteredProducts.map((product) => (
                    <label
                      key={product.id}
                      className="hover:bg-muted/60 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                    >
                      <Checkbox
                        checked={section.productIds.includes(product.id)}
                        onCheckedChange={(checked) =>
                          toggleProduct(product.id, checked === true)
                        }
                      />
                      <span className="truncate">{product.name}</span>
                    </label>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
