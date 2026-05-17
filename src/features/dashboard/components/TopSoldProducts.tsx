import { PRODUCT_PANEL_ICON } from "../data";
import type { SoldProduct } from "../types";

interface TopSoldProductsProps {
  products: SoldProduct[];
}

const TopSoldProducts = ({ products }: TopSoldProductsProps) => {
  const maxUnits = Math.max(...products.map((product) => product.units));
  const ProductIcon = PRODUCT_PANEL_ICON;

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white">
      <div className="flex min-h-14 items-center justify-between bg-[#F3EFE8] px-4 py-3">
        <h2 className="text-[18px] font-bold text-[#333333]">
          Top Sold Products
        </h2>
        <ProductIcon className="size-5 text-[#000000]" />
      </div>

      <div className="space-y-6 px-4 py-6 sm:space-y-9 sm:py-8">
        {products.map((product) => {
          const width = (product.units / maxUnits) * 100;

          return (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_minmax(70px,160px)_24px] items-center gap-2 sm:grid-cols-[minmax(120px,1fr)_minmax(120px,220px)_24px] sm:gap-2.5"
            >
              <p className="truncate text-[12px] font-medium text-[#000000]">
                <span className="mr-1 font-bold">{product.rank}</span>
                {product.name}
              </p>
              <div className="h-4 overflow-hidden rounded-[6px] bg-[#E5E5E5] sm:h-4.25">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="text-end text-[12px] font-bold text-[#000000]">
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
