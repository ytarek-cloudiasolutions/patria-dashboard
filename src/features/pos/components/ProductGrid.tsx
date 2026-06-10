import { Plus, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PosProduct } from "../types";
import { formatEgpAmount } from "../utils";

type ProductGridProps = {
  products: PosProduct[];
  cartProductIds: string[];
  onSelectProduct: (product: PosProduct) => void;
};

const ProductGrid = ({
  products,
  cartProductIds,
  onSelectProduct,
}: ProductGridProps) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#E5E2DD] bg-white text-center">
        <p className="text-[14px] font-semibold text-[#333333]">
          {t("No products found")}
        </p>
        <p className="mt-1 text-[12px] text-[#8B8B8B]">
          {t("Try a different category or search term.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {products.map((product) => {
        const isInCart = cartProductIds.includes(product.id);

        return (
          <article
            key={product.id}
            role="button"
            tabIndex={0}
            className={cn(
              "group relative flex cursor-pointer flex-col overflow-hidden rounded-[16px] border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition",
              isInCart
                ? "border-primary"
                : "border-[#E4E1DC] hover:border-primary/60",
            )}
            onClick={() => onSelectProduct(product)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectProduct(product);
              }
            }}
          >
            <div
              className={cn(
                "relative h-[112px] overflow-hidden",
                product.accent ?? "bg-[#F3EEE7]",
              )}
            >
              {product.stockBadge && (
                <span className="absolute end-2 top-2 z-10 flex items-center gap-1 rounded-full border border-[#EF4E4E] bg-[#FFF0F0] px-2 py-0.5 text-[10px] font-semibold text-[#D40000]">
                  <TrendingDown className="size-3" />
                  {t(product.stockBadge)}
                </span>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2 px-3 py-3">
              <p className="line-clamp-2 min-h-9 text-[13px] font-semibold leading-[18px] text-[#333333]">
                {product.name}
              </p>
              <div className="mt-auto flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[18px] font-bold leading-5 text-[#333333]">
                    {formatEgpAmount(product.price)}
                    <span className="ms-1 text-[11px] font-medium text-[#8B8B8B]">
                      EGP
                    </span>
                  </p>
                  {isInCart && (
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-primary">
                      {t("In cart")}
                    </p>
                  )}
                </div>
                <button
                  className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-primary text-white transition-opacity hover:opacity-90"
                  aria-label={`${t("Add")} ${product.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectProduct(product);
                  }}
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductGrid;
