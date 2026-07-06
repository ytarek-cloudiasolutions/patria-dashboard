import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import DeleteDialog from "@/shared/components/DeleteDialog";
import CustomersOverview from "./components/CustomersOverview";
import CustomersTable from "./components/CustomersTable";
import EditCustomerDialog from "./components/EditCustomerDialog";
import { useCustomers } from "./hooks/useCustomers";
import type {
  Customer,
  CustomerFormData,
  CustomerRole,
  CustomerTier,
} from "./types";

const makeTierFilterOptions = (t: (s: string) => string) => [
  { label: t("All Tiers"), value: "all" },
  { label: t("Bronze (Standard)"), value: "Bronze" },
  { label: t("Silver (Pro)"), value: "Silver" },
  { label: t("Gold (Wholesale VIP)"), value: "Gold" },
];

const DELETE_TYPE_BY_ROLE: Record<
  CustomerRole,
  "user" | "admin" | "manager" | "subscriber"
> = {
  user: "user",
  admin: "admin",
  manager: "manager",
  subscriber: "subscriber",
};

const CustomersPage = () => {
  const { t } = useTranslation();
  const tierFilterOptions = makeTierFilterOptions(t);

  const {
    customers,
    stats: backendStats,
    getCustomersList,
    getCustomerStats,
    updateCustomerInfo,
    deleteCustomerInfo,
  } = useCustomers();

  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [isTierFilterOpen, setIsTierFilterOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null,
  );

  // Fetch list when search query changes
  useEffect(() => {
    getCustomersList({
      search: search.trim() || undefined,
    });
  }, [getCustomersList, search]);

  // Fetch stats on mount
  useEffect(() => {
    getCustomerStats();
  }, [getCustomerStats]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      return tierFilter === "all" || customer.tier === (tierFilter as CustomerTier);
    });
  }, [customers, tierFilter]);

  const totalRevenue = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0);
  }, [customers]);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditOpen(true);
  };

  const handleSaveCustomer = (data: CustomerFormData, id: string | number) => {
    updateCustomerInfo(String(id), {
      loyaltyPoints: Number(data.loyaltyPoints) || 0,
      tier: data.tier.toLowerCase(),
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingCustomer) return;
    deleteCustomerInfo(String(deletingCustomer.id));
    setDeletingCustomer(null);
  };

  const handleWhatsApp = (customer: Customer) => {
    const phone = customer.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Scrim/backdrop overlay when the tier filter dropdown is open */}
      {isTierFilterOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6">
        <HeaderLayout
          title={t("Customers")}
          description={t("Customer management and loyalty data")}
        />
      </div>

      <CustomersOverview
        totalCustomers={backendStats.total || customers.length}
        activeCustomersToday={backendStats.active ?? customers.length}
        totalRevenue={totalRevenue}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder={t("Search by name or phone...")}
          />
        </div>
        <div className="sm:w-72">
          <DropdownSelect
            options={tierFilterOptions}
            selected={tierFilter}
            onSelect={setTierFilter}
            onOpenChange={setIsTierFilterOpen}
            placeholder={t("Tier")}
            align="end"
            className="md:w-full"
            contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>
      </div>

      <CustomersTable
        customers={filteredCustomers}
        onEdit={handleEdit}
        onDelete={setDeletingCustomer}
        onWhatsApp={handleWhatsApp}
      />

      <EditCustomerDialog
        open={isEditOpen}
        customer={editingCustomer}
        onOpenChange={setIsEditOpen}
        onSave={handleSaveCustomer}
      />

      <DeleteDialog
        open={!!deletingCustomer}
        onOpenChange={(open) => !open && setDeletingCustomer(null)}
        data={{
          item: deletingCustomer?.name ?? "",
          type: deletingCustomer
            ? DELETE_TYPE_BY_ROLE[deletingCustomer.role]
            : "user",
          typeBeforeName: true,
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default CustomersPage;
