import { useEffect, useState } from "react";
import { PRODUCT_PANEL_ICON } from "../data";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { SoldProduct } from "../types";

interface TopSoldProductsProps {
  products: SoldProduct[];
}

const TopSoldProducts = ({ products }: TopSoldProductsProps) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const maxUnits = Math.max(...products.map((product) => product.units), 1);
  const ProductIcon = PRODUCT_PANEL_ICON;

  return (
    <section className="group/card overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white transition-shadow duration-300 hover:shadow-xs">
      <div className="flex min-h-14 items-center justify-between bg-[#F3EFE8] px-4 py-3">
        <h2 className="text-[18px] font-bold text-[#333333]">
          {t("Top Sold Products")}
        </h2>
        <ProductIcon className="size-5 text-[#000000] transition-transform duration-300 ease-out group-hover/card:scale-110" />
      </div>

      <div className="space-y-6 px-4 py-6 sm:space-y-9 sm:py-8">
        {products.map((product, index) => {
          const width = (product.units / maxUnits) * 100;

          return (
            <div
              key={product.id}
              className="group/row grid grid-cols-[1fr_minmax(70px,160px)_24px] items-center gap-2 sm:grid-cols-[minmax(120px,1fr)_minmax(120px,220px)_24px] sm:gap-2.5 cursor-default transition-all duration-200 ease-out hover:translate-x-1 rtl:hover:-translate-x-1"
            >
              <p className="flex items-center gap-2 text-[12px] font-medium text-[#000000]">
                <span className="font-bold">{product.rank}</span>
                <span className="truncate transition-colors duration-200 group-hover/row:text-primary">
                  {product.name}
                </span>
              </p>
              <div className="h-4 overflow-hidden rounded-[6px] bg-[#E5E5E5] sm:h-4.25">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-out group-hover/row:brightness-110"
                  style={{
                    width: `${isLoaded ? width : 0}%`,
                    transitionDelay: `${index * 80}ms`,
                  }}
                />
              </div>
              <span className="text-end text-[12px] font-bold text-[#000000] transition-all duration-200 ease-out group-hover/row:scale-110 group-hover/row:text-primary">
                {product.units}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopSoldProducts;
