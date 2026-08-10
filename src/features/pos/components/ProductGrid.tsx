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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(186px,1fr))] gap-4">
      {products.map((product) => {
        const isInCart = cartProductIds.includes(product.id);

        return (
          <article
            key={product.id}
            role="button"
            tabIndex={0}
            className={cn(
              "group relative flex h-[257px] w-full flex-col overflow-hidden rounded-[24px] bg-white transition cursor-pointer select-none",
              isInCart
                ? "border-2 border-[#8F6900]"
                : "border-2 border-[#E5E5E5] hover:border-[#8F6900]/50",
            )}
            onClick={() => onSelectProduct(product)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectProduct(product);
              }
            }}
          >
            {/* Image Container */}
            <div className="relative h-[140px] w-full shrink-0 overflow-hidden bg-[#F5F0EA]">
              {product.stockBadge && (
                <span className="absolute start-1 top-[13px] z-10 flex items-center gap-1 rounded-[30px] border border-[#C90000] bg-[#C90000] px-3 py-1 text-[13px] font-semibold text-white">
                  <TrendingDown className="size-3 text-white" />
                  {t(product.stockBadge)}
                </span>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                className="size-full rounded-t-[24px] rounded-b-[5px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content Container */}
            <div className="flex flex-1 flex-col justify-between rounded-b-[24px] bg-white px-4 py-[22px]">
              <div>
                <p className="line-clamp-2 text-[14px] font-semibold leading-[14.98px] tracking-[0.28px] text-[#333333]">
                  {product.name}
                </p>
              </div>

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                  <div className="flex items-center gap-1">
                    <span className="text-[18px] font-bold tracking-[0.36px] text-black">
                      {formatEgpAmount(product.price)}
                    </span>
                    <span className="text-[14px] font-normal tracking-[0.28px] text-black">
                      EGP
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex size-9 shrink-0 items-center justify-center rounded-[5.71px] bg-[#8F6900] p-2.5 text-white transition-opacity hover:opacity-90 cursor-pointer"
                    aria-label={`${t("Add")} ${product.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelectProduct(product);
                    }}
                  >
                    <Plus className="size-4 text-white" />
                  </button>
                </div>
                {isInCart && (
                  <p className="text-[8px] font-semibold leading-[8.56px] tracking-[0.16px] uppercase text-[#8F6900]">
                    {t("IN CART")}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductGrid;
