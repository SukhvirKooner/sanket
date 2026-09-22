/** Indian number formatting helpers */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format crore amounts: 4.85 → ₹4.85 Cr */
export function formatCrore(cr: number, decimals = 2): string {
  return `₹${cr.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} Cr`;
}

/** Format lakh amounts: 38 → ₹38 L */
export function formatLakh(lakh: number, decimals = 0): string {
  return `₹${lakh.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} L`;
}

/** Convert absolute number to Indian compact: 2400000 → 24 lakh / 2.4M */
export function formatIndianCount(n: number, dual = false): string {
  if (n >= 10000000) {
    const cr = n / 10000000;
    const primary = `${cr.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
    if (!dual) return primary;
    return `${primary} / ${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 100000) {
    const lakh = n / 100000;
    const primary = `${lakh.toLocaleString("en-IN", { maximumFractionDigits: 1 })} lakh`;
    if (!dual) return primary;
    const m = n / 1_000_000;
    return `${primary} / ${m >= 1 ? `${m.toFixed(1)}M` : `${(n / 1000).toFixed(0)}K`}`;
  }
  if (n >= 1000) {
    return n.toLocaleString("en-IN");
  }
  return String(n);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export function formatPct(n: number, decimals = 0): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
