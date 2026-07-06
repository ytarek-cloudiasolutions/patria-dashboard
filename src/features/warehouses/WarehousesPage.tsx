import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";

import WarehouseSection from "./components/WarehouseSection";
import TransfersTable from "./components/TransfersTable";
import AddWarehouseModal from "./components/AddWarehouseModal";
import InternalTransferModal from "./components/InternalTransferModal";

import { useWarehouses } from "./hooks/useWarehouses";
import { useProducts } from "@/features/products/hooks/useProducts";

import type {
  Warehouse as BackendWarehouse,
  Transfer as BackendTransfer,
  PopulatedWarehouseRef,
} from "./store/warehousesTypes";
import type {
  InternalTransfer,
  TransferFormState,
  TransferStatus,
  Warehouse,
  WarehouseFormData,
} from "./types";

// Map backend Warehouse → local UI Warehouse
const mapWarehouse = (w: BackendWarehouse): Warehouse => ({
  id: w._id,
  shortId: w.warehouseId,
  name: w.name,
  address: w.address ?? "",
  kind: w.type === "main" ? "Main Warehouse" : "Sub Warehouse",
});

const capitalize = (s: string): string =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// Map backend Transfer → local UI InternalTransfer
const mapTransfer = (t: BackendTransfer, index: number): InternalTransfer => {
  const from =
    typeof t.fromWarehouseId === "object" && t.fromWarehouseId !== null
      ? (t.fromWarehouseId as PopulatedWarehouseRef)
      : { _id: "", name: "" };
  const to =
    typeof t.toWarehouseId === "object" && t.toWarehouseId !== null
      ? (t.toWarehouseId as PopulatedWarehouseRef)
      : { _id: "", name: "" };
  return {
    id: index,
    reference: `#TRF-${t._id.slice(-6).toUpperCase()}`,
    fromId: from._id,
    fromName: from.name,
    toId: to._id,
    toName: to.name,
    items: t.products.map((p) => ({
      id: p.productId,
      productId: p.productId,
      quantity: p.quantity,
    })),
    createdAt: new Date().toLocaleDateString("en-US"),
    status: capitalize(t.status) as TransferStatus,
  };
};

const WarehousesPage = () => {
  const { t } = useTranslation();

  const {
    warehouses: backendWarehouses,
    transfers: backendTransfers,
    getWarehouses,
    getTransfers,
    createWarehouse,
    createTransfer,
  } = useWarehouses();

  const { products, getProducts } = useProducts();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect(() => {
    getWarehouses();
    getTransfers();
    getProducts({ limit: 100 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map backend data to UI types
  const warehouses: Warehouse[] = useMemo(
    () => (backendWarehouses ?? []).map(mapWarehouse),
    [backendWarehouses],
  );

  const transfers: InternalTransfer[] = useMemo(
    () => (backendTransfers ?? []).map(mapTransfer),
    [backendTransfers],
  );

  const { mainWarehouses, subWarehouses } = useMemo(
    () => ({
      mainWarehouses: warehouses.filter((w) => w.kind === "Main Warehouse"),
      subWarehouses: warehouses.filter((w) => w.kind === "Sub Warehouse"),
    }),
    [warehouses],
  );

  // Build product dropdown options from real backend products
  const productOptions = useMemo(
    () =>
      (products ?? []).map((p) => ({
        value: p.id,
        label: p.name,
      })),
    [products],
  );

  const handleAddWarehouse = (data: WarehouseFormData) => {
    createWarehouse({
      name: data.name.trim(),
      type: data.kind === "Main Warehouse" ? "main" : "sub",
      address: data.address.trim(),
    });
  };

  const handleCreateTransfer = (form: TransferFormState) => {
    const items = form.items.filter((i) => i.productId && i.quantity > 0);
    if (!form.fromId || !form.toId || items.length === 0) return;
    createTransfer({
      fromWarehouseId: form.fromId,
      toWarehouseId: form.toId,
      products: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    });
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Warehouses")}
          description={t("Manage physical storage and internal stock movements.")}
        />
        <div className="flex flex-wrap gap-3">
          <DefaultButton
            data={{
              buttonText: t("Internal Transfer"),
              icon: <ArrowLeftRight className="size-4.5" />,
              onClick: () => setIsTransferOpen(true),
              className: "bg-[#F5F0EA] text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Add Warehouse"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsAddOpen(true),
            }}
          />
        </div>
      </div>

      <WarehouseSection
        title={t("Main Warehouses")}
        kind="Main Warehouse"
        warehouses={mainWarehouses}
      />

      <WarehouseSection
        title={t("Sub Warehouses")}
        kind="Sub Warehouse"
        warehouses={subWarehouses}
      />

      <TransfersTable transfers={transfers} />

      <AddWarehouseModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddWarehouse}
      />

      <InternalTransferModal
        open={isTransferOpen}
        warehouses={warehouses}
        productOptions={productOptions}
        onOpenChange={setIsTransferOpen}
        onSave={handleCreateTransfer}
      />
    </>
  );
};

export default WarehousesPage;
