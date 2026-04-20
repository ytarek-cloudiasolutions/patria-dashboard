import HeaderLayout from "@/layouts/HeaderLayout";
import OrdersTable from "../components/OrdersTable";

const OrdersPage = () => {
  return (
    <div>
      <HeaderLayout
        title="Orders"
        description="Manage and track customer orders"
        className="mb-4"
      />
      <div>
        <OrdersTable />
      </div>
    </div>
  );
};

export default OrdersPage;
