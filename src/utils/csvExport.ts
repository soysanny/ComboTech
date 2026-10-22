/** Download an array of objects as a CSV file. */
export function downloadCsv<T extends object>(
  rows: T[],
  filename: string,
  columns: { key: keyof T; label: string }[],
) {
  const headers = columns.map((col) => `"${col.label}"`).join(",");
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const value = (row as Record<string, unknown>)[String(col.key)];
        const formatted =
          value === null || value === undefined ? "" : String(value);
        return `"${formatted.replace(/"/g, '""')}"`;
      })
      .join(","),
  );
  const csv = [headers, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
