"use client";

import { useMemo, useState } from "react";
import { Plus, Save } from "lucide-react";
import { AdminPageShell } from "@/components/layout/AdminPageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  useAdminHomepageBrandSections,
  useSaveHomepageBrandSections,
} from "../hooks/useAdmin";
import { BrandSectionEditor } from "./BrandSectionEditor";
import { DEFAULT_PRODUCT_LIMIT } from "@/features/homepage/constants";
import type {
  HomepageBrandProductOption,
  HomepageBrandSection,
  HomepageBrandSectionsAdminData,
} from "@/features/homepage/types";

const TITLE = "Homepage brand sections";
const DESCRIPTION =
  "Choose which brand sections appear on the storefront, their order, product count, and whether products are selected automatically or manually.";

function HomepageSectionsEditor({
  data,
}: {
  data: HomepageBrandSectionsAdminData;
}) {
  const save = useSaveHomepageBrandSections();
  const [sections, setSections] = useState<HomepageBrandSection[]>(() =>
    [...data.sections].sort((a, b) => a.order - b.order),
  );
  const [brandToAdd, setBrandToAdd] = useState("");

  const productsByBrand = useMemo(() => {
    const map = new Map<string, HomepageBrandProductOption[]>();
    for (const product of data.products) {
      const key = product.brand.toLowerCase();
      const list = map.get(key);
      if (list) list.push(product);
      else map.set(key, [product]);
    }
    return map;
  }, [data.products]);

  const availableBrands = useMemo(() => {
    const used = new Set(sections.map((section) => section.brand.toLowerCase()));
    return data.brands.filter((brand) => !used.has(brand.toLowerCase()));
  }, [data.brands, sections]);

  const updateSection = (id: string, patch: Partial<HomepageBrandSection>) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, ...patch } : section,
      ),
    );
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    setSections((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((section, position) => ({ ...section, order: position }));
    });
  };

  const removeSection = (id: string) => {
    setSections((prev) =>
      prev
        .filter((section) => section.id !== id)
        .map((section, position) => ({ ...section, order: position })),
    );
  };

  const addSection = () => {
    if (!brandToAdd) return;
    const brand = brandToAdd;
    setSections((prev) => [
      ...prev,
      {
        id: `brand-${brand.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        brand,
        enabled: true,
        order: prev.length,
        productLimit: DEFAULT_PRODUCT_LIMIT,
        selectionMode: "auto",
        productIds: [],
      },
    ]);
    setBrandToAdd("");
  };

  const handleSave = () => {
    save.mutate(
      sections.map((section, position) => ({ ...section, order: position })),
    );
  };

  return (
    <AdminPageShell title={TITLE} description={DESCRIPTION}>
      <div className="bg-card ring-foreground/5 flex flex-wrap items-end gap-3 rounded-2xl p-4 shadow-sm ring-1">
        <div className="min-w-48 flex-1 space-y-2">
          <Label htmlFor="brand-to-add" className="text-xs">
            Add a brand section
          </Label>
          <Select value={brandToAdd} onValueChange={setBrandToAdd}>
            <SelectTrigger id="brand-to-add">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {availableBrands.length === 0 ? (
                <SelectItem value="__none" disabled>
                  All brands added
                </SelectItem>
              ) : (
                availableBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={addSection} disabled={!brandToAdd}>
          <Plus className="mr-1.5 size-4" />
          Add section
        </Button>

        <Button
          onClick={handleSave}
          disabled={save.isPending}
          className="ml-auto"
        >
          <Save className="mr-1.5 size-4" />
          {save.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="space-y-3">
        {sections.length === 0 ? (
          <EmptyState
            title="No brand sections"
            description="Add a brand section to display its products on the homepage."
          />
        ) : (
          sections.map((section, index) => (
            <BrandSectionEditor
              key={section.id}
              section={section}
              products={productsByBrand.get(section.brand.toLowerCase()) ?? []}
              isFirst={index === 0}
              isLast={index === sections.length - 1}
              onUpdate={(patch) => updateSection(section.id, patch)}
              onMove={(direction) => moveSection(index, direction)}
              onRemove={() => removeSection(section.id)}
            />
          ))
        )}
      </div>
    </AdminPageShell>
  );
}

export function AdminHomepageContent() {
  const { data, isLoading, isError, error, refetch } =
    useAdminHomepageBrandSections();

  if (isLoading) {
    return (
      <AdminPageShell title={TITLE} description={DESCRIPTION}>
        <Skeleton className="h-80 w-full" />
      </AdminPageShell>
    );
  }

  if (isError || !data) {
    return (
      <AdminPageShell title={TITLE} description={DESCRIPTION}>
        <EmptyState
          title="Failed to load homepage settings"
          description={error?.message ?? "Something went wrong."}
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      </AdminPageShell>
    );
  }

  return <HomepageSectionsEditor data={data} />;
}
