import { useState, useMemo } from "react";
import { Plus, Search, Truck, Zap, Users, Star } from "lucide-react";

import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import SupplierFormModal from "./components/SupplierFormModal";
import SuppliersTable from "./components/SuppliersTable";
import { INITIAL_SUPPLIERS, SUPPLIER_OVERVIEW } from "./data";
import type { Supplier, SupplierFormData } from "./types";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null
  );

  // ---- Derived ----
  const filteredSuppliers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [suppliers, search]);

  // ---- Handlers ----
  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleSave = (data: SupplierFormData, id?: number) => {
    const categories = data.categories
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    if (id !== undefined) {
      // Edit
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                name: data.supplierName,
                contactPerson: data.contactName,
                phone: data.phone,
                email: data.email,
                address: data.address,
                categories,
              }
            : s
        )
      );
    } else {
      // Add
      const newSupplier: Supplier = {
        id: Date.now(),
        name: data.supplierName,
        status: "Documented",
        contactPerson: data.contactName,
        phone: data.phone,
        email: data.email,
        address: data.address,
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
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Page Header */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#28293D]">Suppliers</h1>
            <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
              Manage your wholesale partners and vendors
            </p>
          </div>
          <DefaultButton
            data={{
              buttonText: "Add New Supplier",
              icon: <Plus size={16} />,
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleOpenAdd,
            }}
          />
        </div>

        {/* Overview Cards */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <OverviewCard
            data={{
              title: "Total suppliers",
              value: suppliers.length,
              icon: <Truck size={18} />,
              iconColor: "text-[#B56C00]",
              badgeColor: "bg-[#FFF5DC]",
            }}
          />
          <OverviewCard
            data={{
              title: "Supply speed",
              value: SUPPLIER_OVERVIEW.supplySpeed as unknown as number,
              icon: <Zap size={18} />,
              iconColor: "text-[#1A7A45]",
              badgeColor: "bg-[#E0F5EC]",
            }}
          />
          <OverviewCard
            data={{
              title: "Average supply cycle",
              value: SUPPLIER_OVERVIEW.averageSupplyCycle as unknown as number,
              icon: <Users size={18} />,
              iconColor: "text-[#5C6EAE]",
              badgeColor: "bg-[#E0E8F5]",
            }}
          />
          <OverviewCard
            data={{
              title: "quality assurance",
              value: SUPPLIER_OVERVIEW.qualityAssurance as unknown as number,
              icon: <Star size={18} />,
              iconColor: "text-[#7A1A7A]",
              badgeColor: "bg-[#F5E0F5]",
            }}
          />
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-3">
          <Search size={16} className="shrink-0 text-[#AAAAAA]" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-[14px] text-[#28293D] placeholder:text-[#AAAAAA] outline-none"
          />
        </div>

        {/* Table */}
        <SuppliersTable
          suppliers={filteredSuppliers}
          onEdit={handleOpenEdit}
          onDelete={setDeletingSupplier}
        />
      </div>

      {/* Add / Edit Modal */}
      <SupplierFormModal
        open={showForm}
        supplier={editingSupplier}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        open={!!deletingSupplier}
        onOpenChange={(open) => !open && setDeletingSupplier(null)}
        data={{
          item: deletingSupplier?.name ?? "",
          type: "supplier",
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SuppliersPage;
