import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KitchenOrderCard from "../components/KitchenOrderCard";
import { KITCHENS, KITCHEN_ORDERS } from "../data";

const KitchenDetailsPage = () => {
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
          Kitchen not found
        </h2>
        <Button onClick={() => navigate("/kitchen")}>
          <ArrowLeft className="size-4" />
          Back to Kitchens
        </Button>
      </div>
    );
  }

  const kitchenOrders = KITCHEN_ORDERS[kitchen.id] ?? [];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-[16px] bg-white p-6"
            onClick={() => navigate("/kitchen")}
          >
            <ArrowLeft className="size-6" />
          </Button>

          <h1 className="text-[28px] leading-none font-semibold text-black">
            {kitchen.name}
          </h1>
          <span className="rounded-[30px] px-3 py-1 text-[13px] font-semibold bg-[#EDF8F0] text-[#059B5A]">
            Active
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[24px] leading-none font-bold text-[#28293D]">
              {kitchen.detailActiveOrders}
            </p>
            <p className="mt-1 text-[12px] font-medium text-[#28293D]">
              Active Orders
            </p>
          </div>
          <div className="text-center">
            <p className="text-[24px] leading-none font-bold text-[#C90000]">
              {kitchen.lowStock}
            </p>
            <p className="mt-1 text-[12px] font-medium text-[#28293D]">
              Low Stock
            </p>
          </div>
        </div>
      </div>

      <div
        className="mb-7 h-0.75 w-full rounded-full"
        style={{ backgroundColor: kitchen.color }}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {kitchenOrders.map((order) => (
          <KitchenOrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default KitchenDetailsPage;
