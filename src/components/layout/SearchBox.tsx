"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/features/products";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/features/products/types";

export interface SearchBoxProps {
  className?: string;
  mobile?: boolean;
}

/** Search input with autocomplete suggestions. */
export function SearchBox({ className, mobile }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const containerRef = useRef<HTMLFormElement>(null);

  const { data, isLoading } = useProducts(
    debouncedQuery.trim().length > 0
      ? { search: debouncedQuery.trim(), pageSize: 6 }
      : undefined,
    {
      enabled: debouncedQuery.trim().length > 0,
    },
  );

  const suggestions = data?.data ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(
        `${ROUTES.products}?search=${encodeURIComponent(query.trim())}`,
      );
      setQuery("");
      setOpen(false);
    }
  };

  const handleSelect = (product: Product) => {
    router.push(ROUTES.productDetail(product.id));
    setQuery("");
    setOpen(false);
  };

  const showSuggestions =
    open &&
    debouncedQuery.trim().length > 0 &&
    (isLoading || suggestions.length > 0);

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className={`relative ${className ?? ""}`}
    >
      <Search className="text-muted-foreground/70 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder="Search products, brands, categories..."
        className={`input-glass pl-10 transition-all ${
          mobile ? "h-10" : "h-9"
        }`}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search products"
        autoComplete="off"
      />
      {!mobile && (
        <Button
          type="submit"
          size="sm"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
        >
          Search
        </Button>
      )}

      {showSuggestions && (
        <div className="surface-glass-strong absolute top-full right-0 left-0 z-50 mt-2 rounded-2xl p-2">
          {isLoading ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <ul className="max-h-72 overflow-auto">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(product)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--hover-bg)]"
                  >
                    <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-md">
                      {product.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs font-bold">
                          {product.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {product.brand}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-primary w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-[var(--hover-bg)]"
                >
                  Search for &quot;{debouncedQuery}&quot;
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </form>
  );
}
