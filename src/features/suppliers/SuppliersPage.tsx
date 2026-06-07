import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DeleteDialog from "@/shared/components/DeleteDialog";

import SuppliersOverview from "./components/SuppliersOverview";
import SuppliersTable from "./components/SuppliersTable";
import SupplierFormModal from "./components/SupplierFormModal";
import { INITIAL_SUPPLIERS } from "./data";
import type {
  Supplier,
  SupplierCategory,
  SupplierFormData,
} from "./types";

const parseCategories = (raw: string): SupplierCategory[] =>
  raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean)
    .map(
      (c) =>
        (c.charAt(0).toUpperCase() +
          c.slice(1).toLowerCase()) as SupplierCategory,
    );

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null,
  );

  const filteredSuppliers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.categories.some((c) => c.toLowerCase().includes(q)),
    );
  }, [suppliers, search]);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleSave = (data: SupplierFormData, id?: number) => {
    const categories = parseCategories(data.categories);

    if (id !== undefined) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                name: data.supplierName.trim(),
                contactPerson: data.contactName.trim(),
                phone: data.phone.trim(),
                email: data.email.trim(),
                address: data.address.trim(),
                categories,
              }
            : s,
        ),
      );
    } else {
      const newSupplier: Supplier = {
        id: Date.now(),
        name: data.supplierName.trim(),
        status: "Documented",
        contactPerson: data.contactName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        categories,
      };
      setSuppliers((prev) => [newSupplier, ...prev]);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingSupplier) return;
    setSuppliers((prev) => prev.filter((s) => s.id !== deletingSupplier.id));
    setDeletingSupplier(null);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title="Suppliers"
          description="Manage your wholesale partners and vendors"
        />
        <DefaultButton
          data={{
            buttonText: "Add New Supplier",
            icon: <Plus className="size-4.5" />,
            onClick: handleOpenAdd,
          }}
        />
      </div>

      <SuppliersOverview totalSuppliers={suppliers.length} />

      <div className="mb-5">
        <SearchInputField
          value={search}
          onChange={setSearch}
          placeholder="Search suppliers..."
        />
      </div>

      <SuppliersTable
        suppliers={filteredSuppliers}
        onEdit={handleOpenEdit}
        onDelete={setDeletingSupplier}
      />

      <SupplierFormModal
        open={isFormOpen}
        supplier={editingSupplier}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />

      <DeleteDialog
        open={!!deletingSupplier}
        onOpenChange={(open) => !open && setDeletingSupplier(null)}
        data={{
          item: deletingSupplier?.name ?? "",
          type: "supplier",
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default SuppliersPage;
