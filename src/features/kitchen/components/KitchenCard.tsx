import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  ChevronRight,
  ChevronLeft,
  SquarePen,
  Trash2,
  Utensils,
  Info,
} from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Kitchen } from "../types";
import { getKitchenIcon } from "../icons";
import { Button } from "@/shared/components/ui/button";

interface KitchenCardProps {
  kitchen: Kitchen;
  onOpenKitchen: (kitchenId: string) => void;
  onEditKitchen?: (kitchen: Kitchen) => void;
  onDeleteKitchen: (kitchen: Kitchen) => void;
}

const KitchenCard = ({
  kitchen,
  onOpenKitchen,
  onEditKitchen,
  onDeleteKitchen,
}: KitchenCardProps) => {
  const { t, dir } = useTranslation();
  const KitchenIconComponent = getKitchenIcon(kitchen.icon);
  const iconBackground = `${kitchen.color.slice(0, 7)}1A`;

  const isBusy = kitchen.status?.toLowerCase() === "busy";
  const badgeText = isBusy ? "Busy" : "Active";
  const badgeClasses = isBusy
    ? "bg-[#FE9A001A] text-[#C7861E] border-[#C7861E]"
    : "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]";

  return (
    <Card
      className="gap-8 rounded-2xl bg-white p-6 py-6 ring-0"
      style={{ borderTop: `9px solid ${kitchen.color}` }}
    >
      <CardContent className="px-0 py-0">
        <div className="mb-6 flex items-center justify-between">
          <div
            className="flex size-11.5 items-center justify-center rounded-[11.15px]"
            style={{
              color: kitchen.color,
              backgroundColor: iconBackground,
            }}
          >
            <KitchenIconComponent className="size-6" />
          </div>

          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full border px-3 py-1 text-[13px] font-medium leading-none transition-colors",
              badgeClasses
            )}
          >
            {t(badgeText)}
          </span>
        </div>

        <h3 className="text-[24px] leading-none font-bold text-[#333333]">
          {kitchen.name}
        </h3>
        <p className="mt-2 text-[16px] text-[#8B8B8B]">{kitchen.description}</p>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAF7] p-3">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-normal text-[#28293D]">
              <Utensils className="size-3" />
              {t("Active Orders")}
            </div>
            <p className="text-[24px] leading-none font-semibold text-[#28293D]">
              {kitchen.activeOrders}
            </p>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAF7] p-3">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-normal text-[#28293D]">
              <Info className="size-3" />
              {t("Requests")}
            </div>
            <p className="text-[24px] leading-none font-semibold text-[#28293D]">
              {kitchen.requests}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <Button
            className="h-14 flex-1 rounded-2xl bg-[#F5F0EA] text-[16px] font-semibold text-[#8F6900] cursor-pointer"
            onClick={() => onOpenKitchen(kitchen.id)}
          >
            {t("Open Kitchen")}
            {dir === "rtl" ? <ChevronLeft className="size-4.5" /> : <ChevronRight className="size-4.5" />}
          </Button>
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              aria-label={`Edit ${kitchen.name}`}
              onClick={() => onEditKitchen?.(kitchen)}
              className="flex size-5 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70"
            >
              <SquarePen className="size-4.5" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${kitchen.name}`}
              onClick={() => onDeleteKitchen(kitchen)}
              className="flex size-5 cursor-pointer items-center justify-center text-[#C90000] transition-opacity hover:opacity-70"
            >
              <Trash2 className="size-4.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenCard;
