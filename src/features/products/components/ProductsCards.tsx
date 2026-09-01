import { Box, Loader2, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "../types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { formatEgp } from "../utils";
import { Switch } from "@/shared/components/ui/switch";

interface ProductsCardsProps {
  products: Product[];
  togglingProductId?: string | null;
  isLoading?: boolean;
  isMutating?: boolean;
  onToggleAvailability: (id: string, available: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const ProductsCards = ({
  products,
  togglingProductId,
  isLoading = false,
  isMutating = false,
  onToggleAvailability,
  onEdit,
  onDelete,
}: ProductsCardsProps) => {
  const { t, language } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-[280px] animate-pulse rounded-[16px] border-2 border-[#E5E5E5] bg-[#FAFAF7]"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => {
        const isAvailable = product.available !== false && product.isActive !== false;
        const isToggling = togglingProductId === product.id;

        return (
          <div
            key={product.id}
            className="group relative flex flex-col justify-between rounded-[16px] border-2 border-[#E5E5E5] bg-white overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            {/* Top Image Container */}
            <div className="relative h-[160px] w-full bg-[#FAFAF7] overflow-hidden flex items-center justify-center border-b border-[#E5E5E5]/50">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-t-[5px] transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <Box className="size-12 text-[#A1A1AA]" />
              )}

              {/* Manufactured / Product Type Badge (Top-Left) */}
              <div className="absolute top-3.5 start-2.5 z-10">
                <span className="inline-flex items-center rounded-full border border-[#004EF9] bg-[#EDF4FB] px-2 py-0.5 text-[10px] font-semibold text-[#3574FF] tracking-[0.20px]">
                  {product.productType === "factory" || product.productType === "manufactured"
                    ? language === "ar"
                      ? "مصنع"
                      : "Manufactured"
                    : language === "ar"
                      ? "جاهز"
                      : "Ready"}
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="flex flex-1 flex-col justify-between p-3 gap-3 bg-white">
              <div className="flex flex-col gap-2.5">
                {/* Category Tag */}
                <div className="inline-flex w-fit items-center rounded-full border border-[#725400] bg-[#8F6900] px-2 py-0.5">
                  <span className="text-[10px] font-semibold text-white tracking-[0.20px]">
                    {product.category || "Coffee"}
                  </span>
                </div>

                {/* Product Name */}
                <h4 className="text-[14px] font-semibold text-black tracking-[0.28px] line-clamp-1">
                  {product.name}
                </h4>
              </div>

              {/* Footer Row (Price & Action Controls) */}
              <div className="flex items-center justify-between w-full pt-1">
                {/* Price (Matching Recipe Tab UI with bold amount) */}
                <span className="text-[16px] text-black tracking-[0.32px]">
                  <span className="font-normal">EGP</span>
                  <span className="font-bold">
                    {" "}
                    {formatEgp(product.price).replace(/^EGP\s*/i, "")}
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Availability Switch (Same as ProductsTable) */}
                  {isToggling ? (
                    <div className="flex size-9 items-center justify-center">
                      <Loader2 className="size-4.5 animate-spin text-[#059B5A]" />
                    </div>
                  ) : (
                    <Switch
                      checked={isAvailable}
                      disabled={isMutating || togglingProductId !== null}
                      onCheckedChange={(val) => onToggleAvailability(product.id, val)}
                      className="data-[state=checked]:bg-[#059B5A] ring-[#059B5A33]"
                    />
                  )}

                  {/* Edit Button */}
                  <button
                    type="button"
                    disabled={isMutating || togglingProductId !== null}
                    onClick={() => onEdit(product)}
                    aria-label={t("Edit product")}
                    className="flex size-5 items-center justify-center text-black transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
                  >
                    <SquarePen className="size-4.5 text-black" />
                  </button>

                  {/* Delete Button */}
                  {onDelete && (
                    <button
                      type="button"
                      disabled={isMutating || togglingProductId !== null}
                      onClick={() => onDelete(product)}
                      aria-label={t("Delete product")}
                      className="flex size-5 items-center justify-center text-[#C90000] transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="size-4.5 text-[#C90000]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsCards;
