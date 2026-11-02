import {
  Banknote,
  BadgeCheck,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { WholesalePriceList } from "../types";

interface WholesalePriceListsCardProps {
  lists: WholesalePriceList[];
  onEdit?: (list: WholesalePriceList) => void;
  onDelete?: (list: WholesalePriceList) => void;
}

const WholesalePriceListsCard = ({
  lists,
  onEdit,
  onDelete,
}: WholesalePriceListsCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="group/card h-full gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4 sm:px-6">
        <h3 className="text-[15px] font-bold text-[#333333] sm:text-[16px]">
          {t("Wholesale Price Lists")}
        </h3>
        <Banknote size={24} className="text-[#28293D] transition-transform duration-200 ease-out group-hover/card:scale-105" />
      </div>
      <CardContent className="flex h-full flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6">
        {lists.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B] animate-in fade-in-50 duration-200">
            {t("No price lists yet.")}
          </p>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              className="rounded-[12px] border border-[#EDEBE7] bg-[#FAFAF7] px-4 py-3 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-[#333333]">
                    {list.name}
                  </p>
                  <span className="mt-1.5 inline-flex items-center rounded-[30px] border border-[#059B5A] bg-[#E2F4ED] px-3 py-0.5 text-[11px] font-medium uppercase text-[#059B5A]">
                    {list.customerSegment}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Edit ${list.name}`}
                    onClick={() => onEdit?.(list)}
                    className="group cursor-pointer text-[#000000] hover:text-primary transition-all duration-150 active:scale-90"
                  >
                    <Pencil size={18} className="transition-transform duration-150 group-hover:scale-110" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${list.name}`}
                    onClick={() => onDelete?.(list)}
                    className="group cursor-pointer text-[#C90000] transition-all duration-150 active:scale-90"
                  >
                    <Trash2 size={18} className="transition-transform duration-150 group-hover:scale-110" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[13px] text-[#595959]">
                  <Package size={16} className="text-[#8B8B8B]" />
                  {list.products.length} {t("products at a special price")}
                </span>
                {list.authorized && (
                  <span className="flex items-center gap-1 text-[13px] font-medium text-[#059B5A]">
                    <BadgeCheck size={16} />
                    {t("Authorized Tier")}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default WholesalePriceListsCard;
