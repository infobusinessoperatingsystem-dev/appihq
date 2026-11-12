const ghanaCurrency = new Intl.NumberFormat("en-GH", {
  maximumFractionDigits: 2,
});

export function formatGhs(value: number | string): string {
  const normalized = typeof value === "number"
    ? value
    : Number(value.trim().replace(/^GHS\s*/i, "").replace(/,/g, ""));

  if (!Number.isFinite(normalized)) {
    return typeof value === "string" ? value : "GHS 0";
  }

  return `GHS ${ghanaCurrency.format(normalized)}`;
}
