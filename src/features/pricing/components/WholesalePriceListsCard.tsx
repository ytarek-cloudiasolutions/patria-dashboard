import { Banknote, SquareArrowOutUpRight, Trash2 } from "lucide-react";
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
    <Card className="h-full gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
      <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4 sm:px-6">
        <h3 className="text-[15px] font-bold text-[#333333] sm:text-[16px]">
          {t("Wholesale Price Lists")}
        </h3>
        <Banknote size={24} className="text-[#28293D]" />
      </div>
      <CardContent className="flex h-full flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6">
        {lists.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No price lists yet.")}
          </p>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              className="flex flex-col gap-3 rounded-[12px] bg-[#FAFAF7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <p className="truncate text-[14px] font-semibold text-[#333333]">
                  {list.name}
                </p>
                <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                  {list.productsCount} products • {list.customerSegment}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 self-end sm:self-center">
                <button
                  type="button"
                  aria-label={`Edit ${list.name}`}
                  onClick={() => onEdit?.(list)}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-[8px] text-[#000000] hover:bg-white"
                >
                  <SquareArrowOutUpRight size={18} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${list.name}`}
                  onClick={() => onDelete?.(list)}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-[8px] text-[#C90000] hover:bg-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default WholesalePriceListsCard;
