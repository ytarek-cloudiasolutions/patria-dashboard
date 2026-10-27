import { useId, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { Thumb } from "./Thumb";
import type { ProductOrderItem } from "../types";

interface ProductOrderCardProps {
  /** Full ordered list of products. */
  products: ProductOrderItem[];
  /** Optional category-name filter (undefined = all categories). */
  categoryName?: string;
  loading?: boolean;
  onReorderProducts: (products: ProductOrderItem[]) => void;
}

const formatPrice = (price: number) => `EGP ${Number(price || 0).toFixed(2)}`;

export const ProductOrderCard = ({
  products,
  categoryName,
  loading,
  onReorderProducts,
}: ProductOrderCardProps) => {
  const { t } = useTranslation();
  const searchInputId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const query = searchTerm.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      (!categoryName || p.category === categoryName) &&
      p.name.toLowerCase().includes(query),
  );

  const resetDrag = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const from = products.findIndex((p) => p.id === draggedId);
      const to = products.findIndex((p) => p.id === targetId);
      if (from !== -1 && to !== -1) {
        const next = [...products];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onReorderProducts(next);
      }
    }
    resetDrag();
  };

  const moveToTop = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Move above the first currently-visible product so it lands on top of this view.
    const firstVisible = visible[0];
    if (!firstVisible || firstVisible.id === id) return;
    const from = products.findIndex((p) => p.id === id);
    const next = [...products];
    const [moved] = next.splice(from, 1);
    const to = next.findIndex((p) => p.id === firstVisible.id);
    next.splice(to, 0, moved);
    onReorderProducts(next);
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 w-full lg:max-w-[673px] h-[785px] p-6 bg-white rounded-2xl shadow-lg border border-[#E5E5E5] flex flex-col gap-4 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="flex items-center gap-1.5 shrink-0">
        <img src="/images/catalog-order/reorder_products.svg" alt="" className="size-4" />
        <h2 className="text-black text-sm font-semibold tracking-tight">
          {t("Reorder Products")}
        </h2>
      </div>

      <div className="shrink-0">
        <div className="group/search p-3.5 bg-white rounded-lg border border-[#CACBD4] flex items-center gap-2.5 focus-within:border-[#8F6900] focus-within:ring-2 focus-within:ring-[#8F6900]/10 transition-all duration-200">
          <label htmlFor={searchInputId} className="flex items-center cursor-pointer">
            <Search className="size-5 text-[#8B8B8B] group-focus-within/search:text-[#8F6900] shrink-0 transition-colors duration-200" />
          </label>
          <input
            id={searchInputId}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("Search for product")}
            className="flex-1 bg-transparent outline-none text-black placeholder:text-[#8B8B8B] text-base leading-6 tracking-tight"
          />
        </div>
      </div>

      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
        {loading && products.length === 0 ? (
          <p className="text-center text-sm text-[#8B8B8B] py-6">{t("Loading...")}</p>
        ) : visible.length === 0 ? (
          <p className="text-center text-sm text-[#8B8B8B] py-6">
            {t("No products found")}
          </p>
        ) : (
          visible.map((item, index) => {
            const isTop = index === 0;
            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => {
                  setDraggedId(item.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", item.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverId !== item.id) setDragOverId(item.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={resetDrag}
                className={cn(
                  "group flex w-full items-center justify-between px-1.5 py-2 rounded-2xl border transition-all duration-200 select-none",
                  isTop
                    ? "bg-[#F5F0EA] border-[#8F6900] shadow-2xs"
                    : "bg-[#F8F8F8] border-transparent hover:bg-[#F2EFE9] hover:border-[#8F6900]/30 hover:translate-x-0.5 rtl:hover:-translate-x-0.5",
                  draggedId === item.id && "opacity-40 scale-95",
                  dragOverId === item.id && draggedId !== item.id && "ring-2 ring-[#8F6900] scale-[1.01]",
                )}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="size-4 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-150 hover:scale-110 active:scale-95">
                    <img
                      src="/images/catalog-order/grip_vertical.svg"
                      alt=""
                      className="size-full pointer-events-none"
                    />
                  </div>
                  <Thumb src={item.image} name={item.name} />
                  <span className="text-black text-xs font-semibold tracking-tight truncate">
                    {item.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span className="text-black text-xs font-medium tracking-tight whitespace-nowrap">
                    {formatPrice(item.price)}
                  </span>
                  {isTop ? (
                    <div className="size-4" />
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => moveToTop(item.id, e)}
                      title={t("Move to top")}
                      className="group/top size-4 flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 hover:opacity-100"
                    >
                      <img
                        src="/images/catalog-order/move_to_top.svg"
                        alt={t("Move to top")}
                        className="size-4 pointer-events-none transition-transform duration-200 group-hover/top:-translate-y-0.5 group-hover/top:scale-110"
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
