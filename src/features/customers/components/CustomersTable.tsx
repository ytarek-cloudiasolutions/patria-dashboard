import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import CustomerTableFilters from "./table/CustomerTableFilters";
import CustomerTableRow from "./table/CustomerTableRow";
import EditCustomerDialog from "./table/EditCustomerDialog";
import type { Customer, TierFilter } from "../types";
import { MOCK_CUSTOMERS } from "../data";

const CustomersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState<TierFilter>("All");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const filteredCustomers = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return MOCK_CUSTOMERS.filter((customer) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        customer.name.toLowerCase().includes(normalizedSearchTerm) ||
        customer.role.toLowerCase().includes(normalizedSearchTerm) ||
        customer.email.toLowerCase().includes(normalizedSearchTerm) ||
        customer.phone.toLowerCase().includes(normalizedSearchTerm) ||
        customer.date.toLowerCase().includes(normalizedSearchTerm);

      const matchesTier =
        selectedTier === "All" || customer.tier === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [searchTerm, selectedTier]);

  return (
    <div className="mt-7">
      <CustomerTableFilters
        searchTerm={searchTerm}
        selectedTier={selectedTier}
        onSearchChange={setSearchTerm}
        onTierChange={setSelectedTier}
      />

      <Table>
        <TableHeader>
          <TableRow className="h-10">
            <TableHead className="font-semibold text-[13px] text-[#28293D]">
              Name &amp; Role
            </TableHead>
            <TableHead className="font-semibold text-[13px] text-[#28293D]">
              PEOPLE &amp; DATE
            </TableHead>
            <TableHead className="font-semibold text-[13px] text-[#28293D]">
              TIER &amp; POINTS
            </TableHead>
            <TableHead className="font-semibold text-[13px] text-[#28293D]">
              LTV &amp; ORDERS
            </TableHead>
            <TableHead className="font-semibold text-[13px] text-[#28293D]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr:hover]:bg-white">
          {filteredCustomers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-7 py-10 text-center text-[14px] text-[#8B8B8B]"
              >
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            filteredCustomers.map((customer) => (
              <CustomerTableRow
                key={customer.id}
                customer={customer}
                onEdit={handleEditCustomer}
              />
            ))
          )}
        </TableBody>
      </Table>

      <EditCustomerDialog
        key={selectedCustomer?.id ?? "no-customer"}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersTable;
