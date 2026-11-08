"use client";

import { useMemo, useRef, useState } from "react";
import { Download, FileUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBulkCreateProducts } from "../hooks/useAdmin";
import {
  parseProductImport,
  PRODUCT_IMPORT_TEMPLATE,
  type ParseResult,
} from "../lib/productImport";

export function BulkProductImportForm({
  onImported,
}: {
  onImported?: () => void;
}) {
  const bulk = useBulkCreateProducts();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  const parsed = useMemo<ParseResult>(
    () => (text.trim() ? parseProductImport(text) : { products: [], errors: [] }),
    [text],
  );

  const handleFile = async (file?: File) => {
    if (!file) return;
    const content = await file.text();
    setText(content);
    setFileName(file.name);
  };

  const downloadTemplate = () => {
    const blob = new Blob([PRODUCT_IMPORT_TEMPLATE], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "product-import-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (parsed.products.length === 0) return;
    bulk.mutate(parsed.products, {
      onSuccess: () => {
        setText("");
        setFileName("");
        onImported?.();
      },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Upload or paste a <strong>CSV</strong> or <strong>JSON</strong> file.
        Separate multiple values (images, ports, tags) with a pipe{" "}
        <code className="bg-muted rounded px-1">|</code>. Specifications are
        optional.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.json,text/csv,application/json"
          className="hidden"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
        >
          <FileUp className="mr-1.5 size-4" />
          Choose file
        </Button>
        <Button type="button" variant="ghost" onClick={downloadTemplate}>
          <Download className="mr-1.5 size-4" />
          Download CSV template
        </Button>
        {fileName && <Badge variant="secondary">{fileName}</Badge>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bulk-products">Or paste CSV / JSON</Label>
        <Textarea
          id="bulk-products"
          rows={8}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setFileName("");
          }}
          placeholder="name,brand,category,price,thumbnail,cpu,ram,..."
          className="font-mono text-xs"
        />
      </div>

      {text.trim() && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{parsed.products.length} ready</Badge>
            {parsed.errors.length > 0 && (
              <Badge variant="destructive">
                {parsed.errors.length} with issues
              </Badge>
            )}
          </div>

          {parsed.products.length > 0 && (
            <div className="border-border/60 overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Brand</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.products.slice(0, 5).map((product, index) => (
                    <tr
                      key={`${product.name}-${index}`}
                      className="border-border/60 border-t"
                    >
                      <td className="max-w-56 truncate px-3 py-2">
                        {product.name}
                      </td>
                      <td className="px-3 py-2">{product.brand}</td>
                      <td className="px-3 py-2">{product.category}</td>
                      <td className="px-3 py-2">{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsed.products.length > 5 && (
                <p className="text-muted-foreground border-border/60 border-t px-3 py-2 text-xs">
                  Showing 5 of {parsed.products.length}
                </p>
              )}
            </div>
          )}

          {parsed.errors.length > 0 && (
            <ul className="border-destructive/30 bg-destructive/5 text-destructive max-h-40 space-y-1 overflow-y-auto rounded-lg border p-3 text-xs">
              {parsed.errors.slice(0, 20).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={bulk.isPending || parsed.products.length === 0}
        >
          <Upload className="mr-1.5 size-4" />
          {bulk.isPending
            ? "Importing..."
            : `Import ${parsed.products.length || ""} products`}
        </Button>
      </div>
    </div>
  );
}
