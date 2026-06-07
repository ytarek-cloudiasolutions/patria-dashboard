import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "@/shared/i18n/useTranslation";
import KitchenOrderCard from "../components/KitchenOrderCard";
import { KITCHENS, KITCHEN_ORDERS } from "../data";
import type { KitchenIcon } from "../types";

const iconBackgroundMap: Record<KitchenIcon, string> = {
  main: "#F5F0EA",
  pastry: "#F3E9FA",
  barista: "#FE9A001A",
};

const KitchenDetailsPage = () => {
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { kitchenId } = useParams<{ kitchenId: string }>();

  const kitchen = useMemo(
    () => KITCHENS.find((kitchenItem) => kitchenItem.id === kitchenId),
    [kitchenId],
  );

  if (!kitchen) {
    return (
      <div className="space-y-4">
        <h2 className="text-[28px] font-bold text-[#303030]">
          {t("Kitchen not found")}
        </h2>
        <Button onClick={() => navigate("/kitchen")}>
          {dir === "rtl" ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          {t("Back to Kitchens")}
        </Button>
      </div>
    );
  }

  const kitchenOrders = KITCHEN_ORDERS[kitchen.id] ?? [];

  const statusMap = {
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
  } as const;

  const statusStyle = statusMap[kitchen.status];
  const kitchenInitial = kitchen.name[0] ?? "K";

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Button
            size="icon"
            variant="ghost"
            className="size-12 rounded-2xl bg-white cursor-pointer hover:bg-white"
            onClick={() => navigate("/kitchen")}
          >
            {dir === "rtl" ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
          </Button>

          <div className="flex flex-wrap items-center gap-[7px]">
            <div className="flex items-center gap-2">
              <div
                className="flex size-12 items-center justify-center rounded-full text-[18px] font-normal"
                style={{
                  backgroundColor: iconBackgroundMap[kitchen.icon],
                  color: kitchen.color,
                }}
              >
                {kitchenInitial}
              </div>
              <h1 className="text-[28px] font-normal text-black">
                {kitchen.name}
              </h1>
            </div>
            <span
              className="rounded-[30px] border px-3 py-px text-[13px] font-normal"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                borderColor: statusStyle.border,
              }}
            >
              {t(statusStyle.label)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-2 py-3">
            <p className="text-[24px] font-normal text-[#28293D]">
              {kitchen.detailActiveOrders}
            </p>
            <p className="text-[12px] text-[#28293D]">{t("Active Orders")}</p>
          </div>
          <div className="flex flex-col items-center gap-2 py-3">
            <p className="text-[24px] font-normal text-[#C90000]">
              {kitchen.lowStock}
            </p>
            <p className="text-[12px] text-[#28293D]">{t("Low Stock")}</p>
          </div>
        </div>
      </div>

      <div
        className="mb-7 h-0.75 w-full rounded-full"
        style={{ backgroundColor: kitchen.color }}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {kitchenOrders.map((order) => (
          <KitchenOrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default KitchenDetailsPage;
