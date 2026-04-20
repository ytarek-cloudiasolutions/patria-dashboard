import { Button } from "@/shared/components/ui/button";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import KitchenInventoryTable from "../components/KitchenInventoryTable";
import { KITCHEN_INVENTORY } from "../data";

const InventoryKitchenPage = () => {
  const navigate = useNavigate();
  const { kitchenId } = useParams<{ kitchenId: string }>();

  const kitchen = useMemo(
    () => KITCHEN_INVENTORY.find((kitchenItem) => kitchenItem.id === kitchenId),
    [kitchenId],
  );

  if (!kitchen) {
    return (
      <div className="space-y-4">
        <h2 className="text-[28px] font-bold text-[#303030]">
          Kitchen not found
        </h2>
        <Button onClick={() => navigate("/inventory")}>
          <ArrowLeft className="size-4" />
          Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <KitchenInventoryTable
      kitchen={kitchen}
      onBack={() => navigate("/inventory")}
    />
  );
};

export default InventoryKitchenPage;
