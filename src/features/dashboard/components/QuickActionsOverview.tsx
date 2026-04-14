import ManageKitchen from "@/assets/icons/manage-kitchen.svg";
import ManageInventory from "@/assets/icons/manage-inventory.svg";
import AddNewProduct from "@/assets/icons/add-new-product.svg";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import QuickActionsCard from "./QuickActionsCard";

const QuickActionsOverview = () => {
  const quickActions = [
    {
      icon: ManageKitchen,
      label: "Manage Kitchen",
    },
    {
      icon: ManageInventory,
      label: "Manage Inventory",
    },
    {
      icon: AddNewProduct,
      label: "Add new Product",
    },
  ];

  return (
    <Card className="bg-[#F5F0EA] border border-[#CACBD4] rounded-[16px]">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <QuickActionsCard actions={quickActions} />
      </CardContent>
    </Card>
  );
};

export default QuickActionsOverview;
