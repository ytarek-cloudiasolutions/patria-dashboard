import ActionButton from "@/shared/components/ActionButton";
import DefaultButton from "@/shared/components/DefaultButton";
import { Badge } from "@/shared/components/ui/badge";
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
  main: <ChefHat className="size-6" />,
  pastry: <Croissant className="size-6" />,
  barista: <Coffee className="size-6" />,
};

const statusMap: Record<
  Kitchen["status"],
  { bg: string; text: string; border: string; label: string }
> = {
  active: {
    bg: "#E2F4ED",
    text: "#059B5A",
    border: "#059B5A",
    label: "Active",
  },
  busy: {
    bg: "#FE9A001A",
    text: "#C7861E",
    border: "#C7861E",
    label: "Busy",
  },
};

const iconBackgroundMap: Record<KitchenIcon, string> = {
  main: "#F5F0EA",
  pastry: "#F3E9FA",
  barista: "#FE9A001A",
};

const KitchenCard = ({
  kitchen,
  onOpenKitchen,
  onDeleteKitchen,
}: KitchenCardProps) => {
  const { t, dir } = useTranslation();
  const statusStyle = statusMap[kitchen.status];
  const iconBackground = iconBackgroundMap[kitchen.icon];

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
          <Badge
            className="h-6 rounded-[30px] border px-3 text-[13px] font-semibold"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              borderColor: statusStyle.border,
            }}
          >
            {t(statusStyle.label)}
          </Badge>
        </div>

        <h3 className="text-[24px] leading-none font-bold text-[#333333]">
          {kitchen.name}
        </h3>
        <p className="mt-2 text-[16px] text-[#8B8B8B]">{kitchen.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAF7] p-3">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-normal text-[#28293D]">
              <Utensils className="size-3" />
              {t("Active Orders")}
            </div>
            <p className="text-[24px] leading-none font-normal text-[#28293D]">
              {kitchen.activeOrders}
            </p>
          </div>
          <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAF7] p-3">
            <div className="mb-1 flex items-center gap-2 text-[12px] font-normal text-[#28293D]">
              <Info className="size-3" />
              {t("Requests")}
            </div>
            <p className="text-[24px] leading-none font-normal text-[#28293D]">
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
              icon: <Trash2 className="size-7" />,
              iconColor: "text-[#C90000]",
              ariaLabel: `Delete ${kitchen.name}`,
              className: "h-14 w-16 rounded-lg bg-[#FFF0F0] hover:bg-[#FFF0F0]",
              onClick: () => onDeleteKitchen(kitchen),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenCard;
