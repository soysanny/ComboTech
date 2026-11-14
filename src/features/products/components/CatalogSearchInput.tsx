"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface CatalogSearchInputProps {
  value?: string;
  onSearch: (value?: string) => void;
}

interface CatalogSearchFormProps extends CatalogSearchInputProps {
  initialValue?: string;
}

function CatalogSearchForm({
  initialValue,
  onSearch,
}: CatalogSearchFormProps) {
  const [draft, setDraft] = useState(initialValue ?? "");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(draft.trim() || undefined);
  };

  return (
    <form onSubmit={submit} className="relative flex-1">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Search products by name, brand, or model..."
        aria-label="Search products"
        autoComplete="off"
        className="pr-24 pl-10"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute top-1/2 right-1.5 h-8 -translate-y-1/2 rounded-lg px-3 text-xs font-semibold"
      >
        Search
      </Button>
    </form>
  );
}

/** URL-backed catalog search field. Restores its value from shared URLs. */
export function CatalogSearchInput({
  value,
  onSearch,
}: CatalogSearchInputProps) {
  return (
    <CatalogSearchForm
      key={value ?? ""}
      initialValue={value}
      onSearch={onSearch}
    />
  );
}
