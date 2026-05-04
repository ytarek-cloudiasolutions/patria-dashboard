import { useNavigate } from "react-router-dom";
import KitchenCard from "../components/KitchenCard";
import { KITCHENS } from "../data";
import HeaderLayout from "@/layouts/HeaderLayout";

const KitchenPage = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="mb-8 ">
        <HeaderLayout
          title="Kitchens"
          description="Manage kitchen stations and oversee live operations"
        />
      </div>
      <div className="grid grid-cols-1 gap-7.5 xl:grid-cols-3">
        {KITCHENS.map((kitchen) => (
          <KitchenCard
            key={kitchen.id}
            kitchen={kitchen}
            onOpenKitchen={(kitchenId) => navigate(`/kitchen/${kitchenId}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default KitchenPage;
