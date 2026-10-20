import { Trophy } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";

export interface DailyProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface DailyProductsSoldProps {
  products: DailyProduct[];
  date: string;
  totalUnits?: number;
  totalProducts?: number;
}

const FIGMA_PRODUCTS: DailyProduct[] = [
  { id: "iced-spanish-latte", name: "Iced Spanish Latte", quantity: 9, revenue: 1940 },
  { id: "middle-eastern-sandwich", name: "Middle eastern especial sandwich", quantity: 4, revenue: 1940 },
  { id: "bakery", name: "Bakery", quantity: 3, revenue: 1940 },
  { id: "flat-white", name: "Flat White", quantity: 3, revenue: 1940 },
  { id: "mineral-water", name: "Mineral Water", quantity: 1, revenue: 1940 },
];

const formatAmount = (amount: number) =>
  Number.isInteger(amount) ? amount.toLocaleString() : amount.toLocaleString(undefined, { maximumFractionDigits: 2 });

const formatDate = (date: string) => {
  if (!date) return "19/10/2026";

  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-GB");
};

const DailyProductsSold = ({
  products,
  date,
  totalUnits,
  totalProducts,
}: DailyProductsSoldProps) => {
  const { t } = useTranslation();
  const displayProducts = products.length > 0 ? products.slice(0, 5) : FIGMA_PRODUCTS;
  const bestSeller = displayProducts[0];
  const maxQuantity = Math.max(...displayProducts.map((product) => product.quantity), 1);
  const shownUnits = totalUnits ?? displayProducts.reduce((total, product) => total + product.quantity, 0);
  const shownProducts = totalProducts ?? displayProducts.length;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
      <div className="space-y-4 px-4 py-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#333333]">
            {t("Daily Products sold")}
          </h2>
          <p className="mt-1 text-base tracking-tight text-[#595959]">
            {formatDate(date)} <span className="mx-1">•</span> {shownUnits} {t("units")} <span className="mx-1">•</span> {shownProducts} {t("products")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#CDD0D8] bg-[#F5F0EA] px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white">
              <Trophy className="size-6 text-[#8F6900]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-tight text-black">{t("Best Seller")}</p>
              <p className="truncate text-lg font-bold tracking-tight text-black">{bestSeller.name}</p>
            </div>
          </div>
          <div className="shrink-0 text-right tracking-tight text-black">
            <p className="text-base font-bold">{bestSeller.quantity} {t("units")}</p>
            <p className="mt-1 text-xs font-bold">EGP {formatAmount(bestSeller.revenue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(150px,1fr)_minmax(180px,1.7fr)_minmax(88px,.45fr)] items-center gap-4 bg-[#F5F0EA] px-4 py-3 text-xs font-semibold uppercase tracking-tight text-[#28293D] sm:px-8">
        <span>{t("Product")}</span>
        <span className="text-center">{t("Quantity")}</span>
        <span className="text-right">{t("Sales")}</span>
      </div>

      <div className="max-h-[320px] overflow-y-auto px-4 sm:px-8">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className={`grid grid-cols-[minmax(150px,1fr)_minmax(180px,1.7fr)_minmax(88px,.45fr)] items-center gap-4 py-4 ${
              index < displayProducts.length - 1 ? "border-b border-[#CDD0D8]" : ""
            }`}
          >
            <p className="truncate text-sm font-semibold tracking-tight text-black">{product.name}</p>
            <div className="flex items-center gap-2.5">
              <div className="h-5 flex-1 overflow-hidden rounded-md bg-[#E5E5E5]">
                <div
                  className="h-full rounded-md bg-[#8F6900] transition-[width] duration-500"
                  style={{ width: `${(product.quantity / maxQuantity) * 100}%` }}
                />
              </div>
              <span className="w-3 text-xs font-semibold text-black">{product.quantity}</span>
            </div>
            <p className="text-right text-sm font-bold tracking-tight text-black">EGP {formatAmount(product.revenue)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyProductsSold;
