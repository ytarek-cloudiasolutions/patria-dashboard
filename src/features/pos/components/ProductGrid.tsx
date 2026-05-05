import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import type { CartItem, PosProduct } from "../types";
import { formatEgpAmount } from "../utils";

type ProductGridProps = {
  products: PosProduct[];
  cartItems: CartItem[];
  onAddProduct: (product: PosProduct) => void;
};

const ProductGrid = ({
  products,
  cartItems,
  onAddProduct,
}: ProductGridProps) => {
  return (
    <div className="grid grid-cols-[repeat(4,minmax(186px,1fr))] gap-x-6 gap-y-8">
      {products.map((product) => {
        const isInCart = cartItems.some((item) => item.id === product.id);

        return (
          <article
            key={product.id}
            role="button"
            tabIndex={0}
            className={cn(
              "group relative h-[228px] cursor-pointer overflow-hidden rounded-[16px] border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition",
              isInCart
                ? "border-[#9B7200]"
                : "border-[#E4E1DC] hover:border-[#9B7200]/60"
            )}
            onClick={() => onAddProduct(product)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onAddProduct(product);
              }
            }}
          >
            <div
              className={cn(
                "relative h-[112px] overflow-hidden",
                product.accent ?? "bg-[#F3EEE7]"
              )}
            >
              {product.stockBadge && (
                <span className="absolute left-2 top-2 z-10 rounded-full border border-[#EF4E4E] bg-[#FFF0F0] px-2 py-0.5 text-[11px] font-semibold text-[#D40000]">
                  {product.stockBadge}
                </span>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex h-[116px] flex-col px-3 py-3">
              <p className="line-clamp-2 min-h-9 text-[13px] font-semibold leading-[17px] text-[#2D3042]">
                {product.name}
              </p>
              <div className="mt-auto flex items-end justify-between gap-3">
                <div>
                  <p className="text-[18px] font-bold leading-5 text-[#1F2433]">
                    {formatEgpAmount(product.price)}
                    <span className="ml-1 text-[12px] font-medium text-[#6F7280]">
                      EGP
                    </span>
                  </p>
                  {isInCart && (
                    <p className="mt-1 text-[8px] font-bold uppercase text-[#9B7200]">
                      In cart
                    </p>
                  )}
                </div>
                <Button
                  size="icon-sm"
                  className="size-8 rounded-[6px] bg-[#9B7200] text-white hover:bg-[#856100]"
                  aria-label={`Add ${product.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddProduct(product);
                  }}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductGrid;
