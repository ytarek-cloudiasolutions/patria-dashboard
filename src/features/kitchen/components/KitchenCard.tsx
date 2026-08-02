import { cn } from "@/lib/utils";
import ActionButton from "@/shared/components/ActionButton";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  ChefHat,
  Croissant,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Coffee,
  Utensils,
  Info,
} from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Kitchen, KitchenIcon } from "../types";
import { Button } from "@/shared/components/ui/button";

interface KitchenCardProps {
  kitchen: Kitchen;
  onOpenKitchen: (kitchenId: string) => void;
  onDeleteKitchen: (kitchen: Kitchen) => void;
}

const iconMap: Record<KitchenIcon, React.ReactNode> = {
  hot_food: <ChefHat className="size-6" />,
  pastry: <Croissant className="size-6" />,
  barista: <Coffee className="size-6" />,
};

const iconBackgroundMap: Record<KitchenIcon, string> = {
  hot_food: "#FEECEC",
  pastry: "#F3E9FA",
  barista: "#FE9A001A",
};

const KitchenCard = ({
  kitchen,
  onOpenKitchen,
  onDeleteKitchen,
}: KitchenCardProps) => {
  const { t, dir } = useTranslation();
  const iconBackground = iconBackgroundMap[kitchen.icon];

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
            {iconMap[kitchen.icon]}
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
          <ActionButton
            data={{
              icon: <Trash2 className="size-6" />,
              iconColor: "text-white",
              ariaLabel: `Delete ${kitchen.name}`,
              className: "h-14 w-16 rounded-[8px] bg-[#C90000] hover:bg-[#C90000]/90",
              onClick: () => onDeleteKitchen(kitchen),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenCard;
