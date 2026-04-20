import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  ChefHat,
  Croissant,
  ChevronRight,
  Trash2,
  Coffee,
  Utensils,
  Info,
} from "lucide-react";
import type { Kitchen, KitchenIcon } from "../types";

interface KitchenCardProps {
  kitchen: Kitchen;
  onOpenKitchen: (kitchenId: string) => void;
}

const iconMap: Record<KitchenIcon, React.ReactNode> = {
  main: <ChefHat className="size-6" />,
  pastry: <Croissant className="size-6" />,
  barista: <Coffee className="size-6" />,
};

const statusMap: Record<
  Kitchen["status"],
  { bg: string; text: string; label: string }
> = {
  active: {
    bg: "#EDF8F0",
    text: "#059B5A",
    label: "Active",
  },
  busy: {
    bg: "#FE9A001A",
    text: "#C7861E",
    label: "Busy",
  },
};

const KitchenCard = ({ kitchen, onOpenKitchen }: KitchenCardProps) => {
  const statusStyle = statusMap[kitchen.status];

  return (
    <Card
      className="rounded-[16px] bg-white py-0 ring-white"
      style={{ borderTop: `8px solid ${kitchen.color}` }}
    >
      <CardContent className="px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div
            className="flex size-11.5 items-center justify-center rounded-[11.15px]"
            style={{
              color: kitchen.color,
              backgroundColor: `${kitchen.color}1A`,
            }}
          >
            {iconMap[kitchen.icon]}
          </div>
          <Badge
            className="rounded-[30px] px-3 py-1 text-[13px] font-semibold"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            {statusStyle.label}
          </Badge>
        </div>

        <h3 className="text-[24px] leading-none font-bold text-[#333333]">
          {kitchen.name}
        </h3>
        <p className="mt-2 text-[16px] text-[#8B8B8B]">{kitchen.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="rounded-[8px] border border-[#E5E5E5] p-3 bg-[#FAFAF7]">
            <div className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#28293D]">
              <Utensils className="size-3" />
              Active Orders
            </div>
            <p className="text-[24px] leading-none font-bold text-[#28293D]">
              {kitchen.activeOrders}
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E5E5] p-3 bg-[#FAFAF7]">
            <div className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#28293D]">
              <Info className="size-3" />
              Requests
            </div>
            <p className="text-[24px] leading-none font-bold text-[#28293D]">
              {kitchen.requests}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-6">
          <Button
            className="h-14 flex-1 rounded-[16px] bg-[#F5F0EA] text-[16px] font-semibold text-primary"
            onClick={() => onOpenKitchen(kitchen.id)}
          >
            Open Kitchen
            <ChevronRight className="size-4.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-14 w-16 rounded-[8px] bg-[#FFF0F0] text-[#C90000] hover:bg-[#FFF0F0] hover:text-[#C90000]"
            aria-label={`Delete ${kitchen.name}`}
          >
            <Trash2 className="size-7" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KitchenCard;
