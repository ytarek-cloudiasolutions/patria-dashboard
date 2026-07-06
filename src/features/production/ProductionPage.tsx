import { useEffect, useMemo, useState } from "react";
import { Plus, Wrench } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";

import ProductionTabs from "./components/ProductionTabs";
import RoastOverview from "./components/RoastOverview";
import ProductionChart from "./components/ProductionChart";
import BatchesTable from "./components/BatchesTable";
import EquipmentTable from "./components/EquipmentTable";
import StartRoastDialog from "./components/StartRoastDialog";
import QualityCheckDialog from "./components/QualityCheckDialog";
import LogServiceDialog from "./components/LogServiceDialog";

import { useProduction } from "./hooks/useProduction";
import type { ApiBatch, ApiEquipment } from "./store/productionTypes";

import {
  EQUIPMENT_STATUS_FILTERS,
  ROASTING_DEGREE_FILTERS,
} from "./data";
import type {
  BatchFormData,
  EquipmentRecord,
  EquipmentStatus,
  EquipmentTask,
  ProductionTab,
  QualityCheckFormData,
  RoastBatch,
  RoastingDegree,
  ServiceLogFormData,
} from "./types";

// Map backend batch status → UI batch status
const mapBatchStatus = (s: ApiBatch["status"]): RoastBatch["status"] => {
  switch (s) {
    case "in_progress":
      return "IN-QC";
    case "completed":
      return "Released";
    case "failed":
      return "Failed";
    default:
      return "Verify Quality";
  }
};

// Map backend equipment status → UI equipment status
const mapEquipmentStatus = (s: ApiEquipment["status"]): EquipmentStatus => {
  switch (s) {
    case "operational":
      return "Healthy";
    case "maintenance":
      return "Maintenance";
    case "offline":
      return "Poor";
    default:
      return "Healthy";
  }
};

// Map ApiBatch → local RoastBatch (index used as numeric id)
const mapBatch = (b: ApiBatch, index: number): RoastBatch => ({
  id: index,
  batchNumber: b.batchId ?? `B-${index}`,
  product:
    b.productName ??
    (typeof b.productId === "string" ? b.productId : String(index)),
  degree: "Medium" as RoastingDegree, // degree not stored on backend
  weightBefore: b.quantity ?? 0,
  weightAfter: 0, // not stored on backend
  status: mapBatchStatus(b.status),
  date: b.startDate
    ? new Date(b.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
});

// Map ApiEquipment → local EquipmentRecord (index used as numeric id)
const mapEquipment = (e: ApiEquipment, index: number): EquipmentRecord => ({
  id: index,
  machine: e.name,
  task: (e.type as EquipmentTask) ?? "Inspection",
  operator: "Admin",
  deadline: e.nextServiceDate
    ? new Date(e.nextServiceDate).toLocaleDateString("en-US")
    : "—",
  cost: 0,
  status: mapEquipmentStatus(e.status),
});

const ProductionPage = () => {
  const { t } = useTranslation();

  const {
    batches: apiBatches,
    equipment: apiEquipment,
    getBatches,
    createBatch,
    updateBatchStatus,
    getEquipment,
    createEquipment,
  } = useProduction();

  const [tab, setTab] = useState<ProductionTab>("roast");

  const [batchSearch, setBatchSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [isDegreeFilterOpen, setIsDegreeFilterOpen] = useState(false);

  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState("all");
  const [isEquipmentStatusOpen, setIsEquipmentStatusOpen] = useState(false);

  const [isStartRoastOpen, setIsStartRoastOpen] = useState(false);
  const [verifyingBatch, setVerifyingBatch] = useState<RoastBatch | null>(null);
  const [isLogServiceOpen, setIsLogServiceOpen] = useState(false);

  useEffect(() => {
    getBatches();
    getEquipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map backend data to UI types
  const batches: RoastBatch[] = useMemo(
    () => (apiBatches ?? []).map(mapBatch),
    [apiBatches],
  );

  const equipment: EquipmentRecord[] = useMemo(
    () => (apiEquipment ?? []).map(mapEquipment),
    [apiEquipment],
  );

  const isScrimActive = isDegreeFilterOpen || isEquipmentStatusOpen;

  const filteredBatches = useMemo(() => {
    const q = batchSearch.toLowerCase().trim();
    return batches.filter((batch) => {
      if (
        degreeFilter !== "all" &&
        batch.degree !== (degreeFilter as RoastingDegree)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        batch.batchNumber.toLowerCase().includes(q) ||
        batch.product.toLowerCase().includes(q) ||
        batch.status.toLowerCase().includes(q) ||
        batch.date.toLowerCase().includes(q)
      );
    });
  }, [batches, batchSearch, degreeFilter]);

  const filteredEquipment = useMemo(() => {
    const q = equipmentSearch.toLowerCase().trim();
    return equipment.filter((record) => {
      if (
        equipmentStatusFilter !== "all" &&
        record.status !== (equipmentStatusFilter as EquipmentStatus)
      ) {
        return false;
      }
      if (!q) return true;
      return record.machine.toLowerCase().includes(q);
    });
  }, [equipment, equipmentSearch, equipmentStatusFilter]);

  const activeBatches = (apiBatches ?? []).filter(
    (b) => b.status === "in_progress",
  ).length;

  // Compute chart data from real batches
  const chartData = useMemo(
    () =>
      (apiBatches ?? []).slice(0, 8).map((b) => ({
        label: b.batchId ?? "—",
        value: Math.min(100, b.quantity ?? 0),
      })),
    [apiBatches],
  );

  const handleSaveBatch = (data: BatchFormData) => {
    createBatch({
      productId: data.rawCoffeeType.trim(),
      quantity: Number(data.weightBefore) || 0,
      startDate: new Date().toISOString(),
      notes: `Degree: ${data.degree}, Batch: ${data.batchNumber}`,
    });
  };

  const handleConfirmQuality = (
    batchId: number,
    _data: QualityCheckFormData,
  ) => {
    const backendBatch = (apiBatches ?? [])[batchId];
    if (backendBatch) {
      updateBatchStatus(backendBatch._id, { status: "completed" });
    }
  };

  const handleLogService = (data: ServiceLogFormData) => {
    createEquipment({
      name: data.machine,
      type: data.task,
      status: "maintenance",
      nextServiceDate: data.deadline || undefined,
    });
  };

  const isRoast = tab === "roast";

  return (
    <>
      {isScrimActive && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={isRoast ? t("Production") : t("Equipment")}
          description={
            isRoast
              ? t("Manufacturing & Quality Control")
              : t("Equipment maintenance and safety")
          }
        />
        {isRoast ? (
          <DefaultButton
            data={{
              buttonText: t("Start Roast"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsStartRoastOpen(true),
            }}
          />
        ) : (
          <DefaultButton
            data={{
              buttonText: t("Log Service"),
              icon: <Wrench className="size-4.5" />,
              onClick: () => setIsLogServiceOpen(true),
            }}
          />
        )}
      </div>

      <ProductionTabs active={tab} onChange={setTab} />

      {isRoast ? (
        <>
          <RoastOverview activeBatches={activeBatches} />

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchInputField
                value={batchSearch}
                onChange={setBatchSearch}
                placeholder={t("Search by batch, status, or date...")}
              />
            </div>
            <div className="sm:w-64">
              <DropdownSelect
                options={ROASTING_DEGREE_FILTERS.map((o) => ({
                  ...o,
                  label: t(o.label),
                }))}
                selected={degreeFilter}
                onSelect={setDegreeFilter}
                onOpenChange={setIsDegreeFilterOpen}
                placeholder={t("Roasting degree")}
                align="end"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            <ProductionChart data={chartData} />
            <div className="flex h-full flex-col">
              <BatchesTable
                batches={filteredBatches}
                onVerifyQuality={setVerifyingBatch}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchInputField
                value={equipmentSearch}
                onChange={setEquipmentSearch}
                placeholder={t("Search by Machine.")}
              />
            </div>
            <div className="sm:w-64">
              <DropdownSelect
                options={EQUIPMENT_STATUS_FILTERS.map((o) => ({
                  ...o,
                  label: t(o.label),
                }))}
                selected={equipmentStatusFilter}
                onSelect={setEquipmentStatusFilter}
                onOpenChange={setIsEquipmentStatusOpen}
                placeholder={t("Status")}
                align="end"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>
          </div>

          <EquipmentTable records={filteredEquipment} />
        </>
      )}

      <StartRoastDialog
        open={isStartRoastOpen}
        onOpenChange={setIsStartRoastOpen}
        onSave={handleSaveBatch}
      />

      <QualityCheckDialog
        open={!!verifyingBatch}
        batch={verifyingBatch}
        onOpenChange={(open) => !open && setVerifyingBatch(null)}
        onConfirm={handleConfirmQuality}
      />

      <LogServiceDialog
        open={isLogServiceOpen}
        onOpenChange={setIsLogServiceOpen}
        onSave={handleLogService}
      />
    </>
  );
};

export default ProductionPage;
