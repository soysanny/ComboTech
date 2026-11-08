import type {
  CreateProductInput,
  ProductCategorySlug,
  ProductSpecs,
} from "@/features/products/types";

const CATEGORY_SLUGS: ProductCategorySlug[] = [
  "laptops",
  "desktops",
  "pc-components",
  "used",
  "peripherals",
  "storage",
  "network",
  "speakers",
  "printers",
  "accessories",
];

const CATEGORY_SET = new Set<string>(CATEGORY_SLUGS);

export interface ParseResult {
  products: CreateProductInput[];
  errors: string[];
}

function normalizeKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

/** Minimal RFC-4180-ish CSV parser supporting quoted fields and escaped quotes. */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function parseCsv(text: string): Record<string, string>[] {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ""));
  if (rows.length === 0) return [];
  const headers = rows[0].map((header, index) =>
    normalizeKey(header) || `col${index}`,
  );

  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? "").trim();
    });
    return record;
  });
}

function flatten(record: Record<string, unknown>): Record<string, unknown> {
  const flat: Record<string, unknown> = { ...record };
  const specs = record.specs;
  if (specs && typeof specs === "object" && !Array.isArray(specs)) {
    Object.entries(specs as Record<string, unknown>).forEach(([key, value]) => {
      if (flat[key] === undefined) flat[key] = value;
    });
  }
  return flat;
}

function pick(
  record: Record<string, unknown>,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== "") return record[key];
    const target = normalizeKey(key);
    for (const [recordKey, value] of Object.entries(record)) {
      if (
        normalizeKey(recordKey) === target &&
        value !== undefined &&
        value !== ""
      ) {
        return value;
      }
    }
  }
  return undefined;
}

function asString(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.map(asString).filter(Boolean).join("|");
  return String(value).trim();
}

function asNumber(value: unknown): number | undefined {
  const cleaned = asString(value).replace(/[^0-9.-]/g, "");
  if (!cleaned) return undefined;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function asBoolean(value: unknown): boolean {
  const normalized = asString(value).toLowerCase();
  return ["true", "1", "yes", "y"].includes(normalized);
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  return asString(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toProductInput(
  record: Record<string, unknown>,
): CreateProductInput | string {
  const flat = flatten(record);

  const name = asString(pick(flat, "name", "productname", "title"));
  if (!name) return "Missing product name";

  const brand = asString(pick(flat, "brand"));
  if (!brand) return `Missing brand for "${name}"`;

  const category = asString(pick(flat, "category", "categoryslug"));
  if (!category) return `Missing category for "${name}"`;
  if (!CATEGORY_SET.has(category)) {
    return `Unknown category "${category}" for "${name}"`;
  }

  const price = asNumber(pick(flat, "price"));
  if (price === undefined || price <= 0) {
    return `Missing or invalid price for "${name}"`;
  }

  const images = asList(pick(flat, "images", "gallery", "imageurls"));
  const thumbnail =
    asString(pick(flat, "thumbnail", "image", "imageurl")) ||
    images[0] ||
    "";
  if (!thumbnail) return `Missing thumbnail/image for "${name}"`;
  if (images.length === 0) images.push(thumbnail);

  const specs: ProductSpecs = {};
  const setSpec = (key: keyof ProductSpecs, ...aliases: string[]) => {
    const value = asString(pick(flat, ...aliases));
    if (value) (specs as Record<string, unknown>)[key] = value;
  };
  setSpec("cpu", "cpu", "processor");
  setSpec("gpu", "gpu", "graphics");
  setSpec("ram", "ram", "memory");
  setSpec("storage", "storage");
  setSpec("ssd", "ssd");
  setSpec("hdd", "hdd");
  setSpec("display", "display", "screen");
  setSpec("os", "os", "operatingsystem");
  setSpec("weight", "weight");
  setSpec("color", "color");

  const screenSize = asNumber(pick(flat, "screensize", "size"));
  if (screenSize !== undefined) specs.screenSize = screenSize;
  const ports = asList(pick(flat, "ports"));
  if (ports.length > 0) specs.ports = ports;

  const description =
    asString(pick(flat, "description", "desc")) || `${name} from ${brand}.`;
  const originalPrice = asNumber(
    pick(flat, "originalprice", "oldprice", "msrp"),
  );

  return {
    name,
    brand,
    series: asString(pick(flat, "series")) || undefined,
    modelKey: asString(pick(flat, "modelkey")) || undefined,
    category: category as ProductCategorySlug,
    description,
    price,
    originalPrice:
      originalPrice !== undefined && originalPrice > price
        ? originalPrice
        : undefined,
    currency: asString(pick(flat, "currency")) || "USD",
    images,
    thumbnail,
    stock: asNumber(pick(flat, "stock", "quantity")) ?? 0,
    warrantyMonths: asNumber(pick(flat, "warrantymonths", "warranty")) ?? 12,
    specs,
    productCode:
      asString(pick(flat, "productcode", "sku", "code")) || undefined,
    badge: asString(pick(flat, "badge")) || undefined,
    freeGifts: asList(pick(flat, "freegifts", "gifts")),
    tags: asList(pick(flat, "tags")),
    isFeatured: asBoolean(pick(flat, "isfeatured", "featured")),
    isNewArrival: asBoolean(pick(flat, "isnewarrival", "newarrival", "new")),
    isBestSeller: asBoolean(
      pick(flat, "isbestseller", "bestseller", "bestselling"),
    ),
  };
}

/** Parse a CSV or JSON bulk-import text into validated product payloads. */
export function parseProductImport(text: string): ParseResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { products: [], errors: ["The file is empty."] };
  }

  let records: Record<string, unknown>[];

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const list = Array.isArray(parsed)
        ? parsed
        : (parsed as { products?: unknown }).products;
      if (!Array.isArray(list)) {
        return {
          products: [],
          errors: ["JSON must be an array or contain a products array."],
        };
      }
      records = list.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item),
      );
    } catch {
      return { products: [], errors: ["Invalid JSON syntax."] };
    }
  } else {
    records = parseCsv(trimmed);
  }

  if (records.length === 0) {
    return { products: [], errors: ["No product rows were found."] };
  }

  const products: CreateProductInput[] = [];
  const errors: string[] = [];

  records.forEach((record, index) => {
    const result = toProductInput(record);
    if (typeof result === "string") {
      errors.push(`Row ${index + 2}: ${result}`);
    } else {
      products.push(result);
    }
  });

  return { products, errors };
}

export const PRODUCT_IMPORT_TEMPLATE = [
  "name,brand,series,category,description,price,originalPrice,stock,warrantyMonths,thumbnail,images,cpu,gpu,ram,storage,display,screenSize,os,ports,weight,color,productCode,badge,freeGifts,tags,isFeatured,isNewArrival,isBestSeller",
  "Dell Latitude 7420,DELL,Latitude,laptops,Business laptop,1000,1200,12,12,/images/products/example.jpg,/images/products/example.jpg,Intel Core i7,Intel Iris Xe,16 GB,512 GB SSD,14 inch FHD,14,Windows 11,USB-C|HDMI,1.4,Titan Grey,SKU-001,VIP SPECS,Backpack|Mouse,,false,true,false",
].join("\n");
