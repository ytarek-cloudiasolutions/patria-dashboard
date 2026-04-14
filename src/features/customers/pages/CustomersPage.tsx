import HeaderLayout from "@/layouts/HeaderLayout";
import CustomersOverview from "../components/CustomersOverview";
import CustomersTable from "../components/CustomersTable";

const CustomersPage = () => {
  return (
    <div>
      {/* HEADER */}
      <HeaderLayout
        title="Customers"
        description="Customer management and loyalty data"
      />

      {/* CUSTOMERS OVERVIEW */}
      <CustomersOverview />

      {/* CUSTOMERS Table */}
      <CustomersTable />
    </div>
  );
};

export default CustomersPage;
