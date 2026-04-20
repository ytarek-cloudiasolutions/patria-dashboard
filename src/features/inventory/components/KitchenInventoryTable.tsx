import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  ArrowLeft,
  ArrowUp,
  Box,
  ChefHat,
  Coffee,
  Croissant,
  Info,
  Minus,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { InventoryStatus, KitchenInventoryDetails } from "../types";

interface KitchenInventoryTableProps {
  kitchen: KitchenInventoryDetails;
  onBack: () => void;
}

const iconMap: Record<KitchenInventoryDetails["icon"], LucideIcon> = {
  main: ChefHat,
  barista: Coffee,
  pastry: Croissant,
};

const badgeStyles: Record<
  InventoryStatus,
  { label: string; bg: string; text: string; icon: LucideIcon }
> = {
  critical: {
    label: "Critical",
    bg: "#FFF0F0",
    text: "#C90000",
    icon: Info,
  },
  low: {
    label: "Low",
    bg: "#FE9A001A",
    text: "#C7861E",
    icon: TriangleAlert,
  },
  normal: {
    label: "Normal",
    bg: "#F5F0EA",
    text: "#8F6900",
    icon: Box,
  },
  excess: {
    label: "Excess",
    bg: "#E2F4ED",
    text: "#059B5A",
    icon: ArrowUp,
  },
};

const topStatusOrder: InventoryStatus[] = ["critical", "normal", "excess"];

const KitchenInventoryTable = ({
  kitchen,
  onBack,
}: KitchenInventoryTableProps) => {
  const Icon = iconMap[kitchen.icon];
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    kitchen.items.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {}),
  );

  const handleIncreaseQuantity = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] ?? 0) + 1,
    }));
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] ?? 0) - 1, 0),
    }));
  };

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="size-11 rounded-[14px] bg-white"
            onClick={onBack}
          >
            <ArrowLeft className="size-6" />
          </Button>

          <div
            className="flex size-11 items-center justify-center rounded-full"
            style={{
              color: kitchen.accentColor,
              backgroundColor: `${kitchen.accentColor}1A`,
            }}
          >
            <Icon className="size-5" />
          </div>

          <div>
            <h1 className="text-[28px] leading-none font-bold text-[#333333]">
              {kitchen.name} Inventory
            </h1>
            <p className="mt-1 text-[13px] text-[#8B8B8B] ">
              {kitchen.subtitle}
            </p>
          </div>

          <Badge
            className="rounded-[30px] px-3 py-1 text-[12px] font-semibold"
            style={{ backgroundColor: "#EDF8F0", color: "#059B5A" }}
          >
            Active
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {topStatusOrder.map((status) => {
            const count = kitchen.distribution[status];
            const StatusIcon = badgeStyles[status].icon;

            if (count === 0) {
              return null;
            }

            return (
              <Badge
                key={status}
                className="rounded-[30px] px-3 py-1 text-[12px] font-semibold"
                style={{
                  backgroundColor: badgeStyles[status].bg,
                  color: badgeStyles[status].text,
                }}
              >
                <StatusIcon className="mr-1 size-3" aria-hidden />
                {count} {badgeStyles[status].label}
              </Badge>
            );
          })}
        </div>
      </div>

      <div
        className="mb-5 h-1 w-full rounded-full"
        style={{ backgroundColor: kitchen.accentColor }}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 text-[13px] font-semibold text-[#28293D]">
              Item
            </TableHead>
            <TableHead className="pl-14 text-[13px] font-semibold text-[#28293D]">
              Quantity
            </TableHead>
            <TableHead className="text-[13px] font-semibold text-[#28293D]">
              Status
            </TableHead>
            <TableHead className="text-center text-[13px] font-semibold text-[#28293D]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:hover]:bg-white">
          {kitchen.items.map((item) => (
            <TableRow key={item.id} className="h-12">
              <TableCell className="px-4 text-[17px] font-medium text-[#2C2C2C] md:text-[14px]">
                <div className="flex items-center gap-2">
                  {item.status === "critical" ? (
                    <Info
                      className="size-3"
                      style={{ color: badgeStyles.critical.text }}
                      aria-hidden
                    />
                  ) : null}
                  <span>{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-[17px] text-[#2C2C2C] md:text-[14px]">
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-auto w-auto rounded-[16px] bg-[#FAFAF7] p-1.5 text-[#1F1F1F] hover:bg-[#FAFAF7]"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    <span className="flex size-3.5 items-center justify-center rounded-full border border-black">
                      <Minus className="size-2.75" />
                    </span>
                  </Button>
                  <span className="inline-flex min-w-20 items-center justify-center gap-1 text-center leading-none">
                    <span className="font-bold text-[#2C2C2C]">
                      {quantities[item.id] ?? item.quantity}
                    </span>
                    <span className="font-normal text-[#5C5C5C]">
                      {item.unit}
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-auto w-auto rounded-[16px] bg-[#FAFAF7] p-1.5 text-[#1F1F1F] hover:bg-[#FAFAF7]"
                    onClick={() => handleIncreaseQuantity(item.id)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    <span className="flex size-3.5 items-center justify-center rounded-full border border-black">
                      <Plus className="size-2.75" />
                    </span>
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {(() => {
                  const StatusIcon = badgeStyles[item.status].icon;

                  return (
                    <Badge
                      className="rounded-[30px] px-3 py-1 text-[12px] font-semibold"
                      style={{
                        backgroundColor: badgeStyles[item.status].bg,
                        color: badgeStyles[item.status].text,
                      }}
                    >
                      <StatusIcon className="mr-1 size-3" aria-hidden />
                      {badgeStyles[item.status].label}
                    </Badge>
                  );
                })()}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-[8px] text-[#5A5A5A] hover:bg-[#F5F0EA]"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-[8px] text-[#C90000] hover:bg-[#FFF0F0]"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default KitchenInventoryTable;
