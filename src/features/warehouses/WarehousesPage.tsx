import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Plus, Warehouse as WarehouseIcon } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";

import WarehouseSection from "./components/WarehouseSection";
import TransfersTable from "./components/TransfersTable";
import AddWarehouseModal from "./components/AddWarehouseModal";
import InternalTransferModal from "./components/InternalTransferModal";

import type {
  InternalTransfer,
  TransferFormState,
  Warehouse,
  WarehouseFormData,
} from "./types";
import { useWarehouses } from "./hooks/useWarehouses";
import { useProducts } from "@/features/products/hooks/useProducts";

const mapApiWarehouse = (w: any): Warehouse => ({
  id: w._id ?? w.id,
  shortId: (w._id ?? w.id ?? "").slice(-6).toUpperCase(),
  name: w.name ?? "",
  address: w.address ?? w.location ?? "",
  kind: w.type === "sub" ? "Sub Warehouse" : "Main Warehouse",
});

const mapApiTransfer = (t: any): InternalTransfer => ({
  id: t._id ?? t.id,
  reference: t.reference ?? `#TRF-${(t._id ?? "").slice(-6).toUpperCase()}`,
  fromId: t.fromWarehouseId?._id ?? t.fromWarehouseId ?? t.fromWarehouse?._id ?? "",
  fromName: t.fromWarehouseId?.name ?? t.fromWarehouse?.name ?? "",
  toId: t.toWarehouseId?._id ?? t.toWarehouseId ?? t.toWarehouse?._id ?? "",
  toName: t.toWarehouseId?.name ?? t.toWarehouse?.name ?? "",
  items: (t.items ?? t.products ?? []).map((p: any) => ({
    productId: p.productId ?? p.product?._id ?? "",
    productName: p.productName ?? p.product?.name ?? "",
    quantity: p.quantity ?? 0,
    unit: p.unit ?? "kg",
  })),
  createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
  status: (t.status === "approved" ? "Approved" : t.status === "completed" ? "Completed" : t.status === "rejected" ? "Rejected" : "Pending") as any,
});


const WarehousesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    warehouses: apiWarehouses,
    transfers: apiTransfers,
    getWarehouses,
    getTransfers,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    createTransfer,
    loading: warehousesLoading,
  } = useWarehouses();
  const { products: apiProducts, getProducts, isFetchingProducts } = useProducts();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transfers, setTransfers] = useState<InternalTransfer[]>([]);

  useEffect(() => { getWarehouses(); getTransfers(); getProducts({}); }, [getWarehouses, getTransfers, getProducts]);
  useEffect(() => { if (apiWarehouses) setWarehouses(apiWarehouses.map(mapApiWarehouse)); }, [apiWarehouses]);
  useEffect(() => { if (apiTransfers) setTransfers(apiTransfers.map(mapApiTransfer)); }, [apiTransfers]);

  const productOptions = useMemo(() =>
    (apiProducts ?? []).map((p: any) => ({ value: p.id ?? p._id, label: p.name })),
    [apiProducts]
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const [warehousesLoaded, setWarehousesLoaded] = useState(false);
  const [transfersLoaded, setTransfersLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const warehousesStarted = useRef(warehousesLoading.fetch);
  const transfersStarted = useRef(warehousesLoading.fetchTransfers);
  const productsStarted = useRef(isFetchingProducts);

  useEffect(() => {
    if (warehousesLoading.fetch) {
      warehousesStarted.current = true;
    } else if (warehousesStarted.current) {
      setWarehousesLoaded(true);
    }
  }, [warehousesLoading.fetch]);

  useEffect(() => {
    if (warehousesLoading.fetchTransfers) {
      transfersStarted.current = true;
    } else if (transfersStarted.current) {
      setTransfersLoaded(true);
    }
  }, [warehousesLoading.fetchTransfers]);

  useEffect(() => {
    if (isFetchingProducts) {
      productsStarted.current = true;
    } else if (productsStarted.current) {
      setProductsLoaded(true);
    }
  }, [isFetchingProducts]);

  const { mainWarehouses, subWarehouses } = useMemo(() => {
    return {
      mainWarehouses: warehouses.filter((w) => w.kind === "Main Warehouse"),
      subWarehouses: warehouses.filter((w) => w.kind === "Sub Warehouse"),
    };
  }, [warehouses]);

  const handleSaveWarehouse = (data: WarehouseFormData) => {
    const payload = {
      name: data.name.trim(),
      address: data.address.trim(),
      type: (data.kind === "Sub Warehouse" ? "sub" : "main") as "main" | "sub",
    };
    if (editingWarehouse) {
      updateWarehouse(editingWarehouse.id, payload);
      setEditingWarehouse(null);
    } else {
      createWarehouse(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingWarehouse) return;
    deleteWarehouse(deletingWarehouse.id);
    setDeletingWarehouse(null);
  };

  const handleSelectWarehouse = (warehouse: Warehouse) => {
    navigate(`/warehouses/${warehouse.id}`, { state: { warehouse } });
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsAddOpen(true);
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setDeletingWarehouse(warehouse);
  };

  const handleCreateTransfer = (form: TransferFormState) => {
    const items = form.items.filter((item) => item.productId && item.quantity > 0);
    if (!form.fromId || !form.toId || items.length === 0) return;
    createTransfer({
      fromWarehouseId: form.fromId,
      toWarehouseId: form.toId,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    } as any);
  };

  const isLoading = !warehousesLoaded || !transfersLoaded || !productsLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center animate-in fade-in-50 duration-300">
        <WarehouseIcon className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="animate-in fade-in-50 duration-300">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Warehouses")}
          description={t("Manage physical storage and internal stock movements.")}
        />
        <div className="flex flex-wrap gap-3">
          <DefaultButton
            data={{
              buttonText: t("Internal Transfer"),
              icon: <ArrowLeftRight className="size-4.5 transition-transform duration-200 group-hover:rotate-180" />,
              onClick: () => setIsTransferOpen(true),
              className:
                "bg-[#F5F0EA] text-primary transition-all duration-150 active:scale-[0.98]",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Add Warehouse"),
              icon: <Plus className="size-4.5 transition-transform duration-200 group-hover:rotate-90" />,
              onClick: () => {
                setEditingWarehouse(null);
                setIsAddOpen(true);
              },
              className: "transition-all duration-150 active:scale-[0.98]",
            }}
          />
        </div>
      </div>

      <WarehouseSection
        title={t("Main Warehouses")}
        kind="Main Warehouse"
        warehouses={mainWarehouses}
        onSelectWarehouse={handleSelectWarehouse}
        onEditWarehouse={handleEditWarehouse}
        onDeleteWarehouse={handleDeleteWarehouse}
      />

      <WarehouseSection
        title={t("Sub Warehouses")}
        kind="Sub Warehouse"
        warehouses={subWarehouses}
        onSelectWarehouse={handleSelectWarehouse}
        onEditWarehouse={handleEditWarehouse}
        onDeleteWarehouse={handleDeleteWarehouse}
      />

      <TransfersTable transfers={transfers} />

      <AddWarehouseModal
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) setEditingWarehouse(null);
        }}
        editingWarehouse={editingWarehouse}
        onSave={handleSaveWarehouse}
      />

      <DeleteDialog
        open={!!deletingWarehouse}
        onOpenChange={(open) => !open && setDeletingWarehouse(null)}
        data={{ item: deletingWarehouse?.name ?? "", type: "warehouse" }}
        onConfirm={handleConfirmDelete}
      />

      <InternalTransferModal
        open={isTransferOpen}
        warehouses={warehouses}
        productOptions={productOptions}
        onOpenChange={setIsTransferOpen}
        onSave={handleCreateTransfer}
      />
    </section>
  );
};

export default WarehousesPage;
