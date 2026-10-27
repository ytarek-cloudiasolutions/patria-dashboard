import { useId, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { Thumb } from "./Thumb";
import type { CategoryOrderItem } from "../types";

export const ALL_CATEGORY_ID = "all";

interface CategoryOrderCardProps {
  categories: CategoryOrderItem[];
  selectedCategoryId: string;
  loading?: boolean;
  onSelectCategory: (id: string) => void;
  onReorderCategories: (categories: CategoryOrderItem[]) => void;
}

export const CategoryOrderCard = ({
  categories,
  selectedCategoryId,
  loading,
  onSelectCategory,
  onReorderCategories,
}: CategoryOrderCardProps) => {
  const { t } = useTranslation();
  const searchInputId = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const query = searchTerm.trim().toLowerCase();
  const filtered = categories.filter((c) => c.name.toLowerCase().includes(query));
  const showAll = !query || "all".includes(query);

  const resetDrag = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      const from = categories.findIndex((c) => c.id === draggedId);
      const to = categories.findIndex((c) => c.id === targetId);
      if (from !== -1 && to !== -1) {
        const next = [...categories];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onReorderCategories(next);
      }
    }
    resetDrag();
  };

  const rowBase =
    "group flex w-full items-center gap-1.5 px-1.5 py-2 rounded-2xl border transition-all duration-200 select-none cursor-pointer active:scale-[0.99]";

  const Grip = () => (
    <div className="size-4 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-150 hover:scale-110 active:scale-95">
      <img
        src="/images/catalog-order/grip_vertical.svg"
        alt=""
        className="size-full pointer-events-none"
      />
    </div>
  );

  return (
    <div className="w-full xl:w-[439px] lg:w-[384px] h-[785px] px-3 py-6 bg-white rounded-2xl shadow-lg border border-[#E5E5E5] flex flex-col gap-4 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="flex items-center gap-1.5 shrink-0 px-1">
        <img src="/images/catalog-order/category_order.svg" alt="" className="size-4" />
        <h2 className="text-black text-sm font-semibold tracking-tight">
          {t("Category Order")}
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
            placeholder={t("Search for category")}
            className="flex-1 bg-transparent outline-none text-black placeholder:text-[#8B8B8B] text-base leading-6 tracking-tight"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
        {showAll && (
          <div
            onClick={() => onSelectCategory(ALL_CATEGORY_ID)}
            className={cn(
              rowBase,
              selectedCategoryId === ALL_CATEGORY_ID
                ? "bg-[#F5F0EA] border-[#8F6900] shadow-2xs"
                : "bg-[#F8F8F8] border-transparent hover:bg-[#F2EFE9] hover:border-[#8F6900]/30 hover:translate-x-0.5 rtl:hover:-translate-x-0.5",
            )}
          >
            <Grip />
            <span className="size-8 shrink-0 rounded-md border-[0.27px] border-[#E5E5E5] bg-[#F5F0EA] flex items-center justify-center text-[11px] font-semibold text-[#8F6900] transition-transform duration-200 group-hover:scale-105">
              A
            </span>
            <span className="text-black text-xs font-semibold tracking-tight">
              {t("All")}
            </span>
          </div>
        )}

        {loading && categories.length === 0 ? (
          <p className="text-center text-sm text-[#8B8B8B] py-6">{t("Loading...")}</p>
        ) : filtered.length === 0 && !showAll ? (
          <p className="text-center text-sm text-[#8B8B8B] py-6">
            {t("No categories found")}
          </p>
        ) : (
          filtered.map((item) => (
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
              onClick={() => onSelectCategory(item.id)}
              className={cn(
                rowBase,
                selectedCategoryId === item.id
                  ? "bg-[#F5F0EA] border-[#8F6900] shadow-2xs"
                  : "bg-[#F8F8F8] border-transparent hover:bg-[#F2EFE9] hover:border-[#8F6900]/30 hover:translate-x-0.5 rtl:hover:-translate-x-0.5",
                draggedId === item.id && "opacity-40 scale-95",
                dragOverId === item.id && draggedId !== item.id && "ring-2 ring-[#8F6900] scale-[1.01]",
              )}
            >
              <Grip />
              <Thumb src={item.image} name={item.name} />
              <span className="text-black text-xs font-semibold tracking-tight truncate">
                {item.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
