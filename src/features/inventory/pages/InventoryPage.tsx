import HeaderLayout from "@/layouts/HeaderLayout";
import { useNavigate } from "react-router-dom";
import { INVENTORY_METRICS, KITCHEN_INVENTORY, STOCK_LEVELS } from "../data";
import InventoryOverviewCards from "../components/InventoryOverviewCards";
import KitchenInventoryCard from "../components/KitchenInventoryCard";
import StockLevels from "../components/StockLevels";

const InventoryPage = () => {
  const navigate = useNavigate();

  return (
    <section>
      <HeaderLayout
        title="Inventory"
        description="Manage stock levels across all kitchen stations and the main warehouse."
      />

      <InventoryOverviewCards metrics={INVENTORY_METRICS} />

      <StockLevels levels={STOCK_LEVELS} />

      <div className="mt-8 grid grid-cols-1 gap-x-7.5 gap-y-8 xl:grid-cols-2">
        {KITCHEN_INVENTORY.map((kitchen) => (
          <KitchenInventoryCard
            key={kitchen.id}
            kitchen={kitchen}
            onOpenKitchen={(kitchenId) => navigate(`/inventory/${kitchenId}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default InventoryPage;
