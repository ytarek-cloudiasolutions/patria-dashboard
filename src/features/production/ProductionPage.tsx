import { useEffect, useMemo, useState } from "react";
import { Plus, Wrench, Coffee } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { useProducts } from "@/features/products/hooks/useProducts";

import ProductionTabs from "./components/ProductionTabs";
import RoastOverview from "./components/RoastOverview";
import ProductionChart from "./components/ProductionChart";
import BatchesTable from "./components/BatchesTable";
import EquipmentTable from "./components/EquipmentTable";
import StartRoastDialog from "./components/StartRoastDialog";
import CompleteRoastDialog from "./components/CompleteRoastDialog";
import QualityCheckDialog from "./components/QualityCheckDialog";
import LogServiceDialog from "./components/LogServiceDialog";

import {
  MAINTENANCE_STATUS_FILTERS,
  ROASTING_DEGREE_FILTERS,
} from "./data";
import type {
  CompleteRoastFormData,
  EquipmentRecord,
  MaintenanceStatus,
  ProductionTab,
  QualityCheckFormData,
  RoastBatch,
  RoastingDegree,
  ServiceLogFormData,
  StartRoastFormData,
} from "./types";

const mapBatch = (b: any): RoastBatch => ({
  id: b._id,
  batchNumber: b.batchId ?? "—",
  productId: typeof b.product === "object" ? b.product?._id : b.product,
  product: typeof b.product === "object" ? b.product?.name ?? "—" : "—",
  degree: (b.roastProfile as RoastingDegree) ?? "Medium",
  weightIn: b.weightIn ?? 0,
  weightOut: b.weightOut ?? null,
  moistureGreen: b.moistureGreen ?? null,
  moistureRoasted: b.moistureRoasted ?? null,
  roastColor: b.roastColor ?? "",
  cupScore: b.cupScore ?? null,
  status: b.status ?? "Roasted",
  date: b.roastDate
    ? new Date(b.roastDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  notes: b.notes ?? "",
});

const mapMaintenanceLog = (l: any): EquipmentRecord => ({
  id: l._id,
  equipmentName: l.equipmentName ?? "—",
  taskType: l.taskType ?? "Cleaning",
  operator: l.performedBy?.name ?? "—",
  deadline: l.nextDueDate ? new Date(l.nextDueDate).toLocaleDateString("en-US") : "—",
  cost: l.cost ?? 0,
  status: l.status ?? "Pending",
});

const ProductionPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ProductionTab>("roast");

  const { products, getProducts } = useProducts();
  const [batches, setBatches] = useState<RoastBatch[]>([]);
  const [equipment, setEquipment] = useState<EquipmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [batchSearch, setBatchSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [isDegreeFilterOpen, setIsDegreeFilterOpen] = useState(false);

  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState("all");
  const [isEquipmentStatusOpen, setIsEquipmentStatusOpen] = useState(false);

  const [isStartRoastOpen, setIsStartRoastOpen] = useState(false);
  const [completingBatch, setCompletingBatch] = useState<RoastBatch | null>(null);
  const [verifyingBatch, setVerifyingBatch] = useState<RoastBatch | null>(null);
  const [isLogServiceOpen, setIsLogServiceOpen] = useState(false);

  const isScrimActive = isDegreeFilterOpen || isEquipmentStatusOpen;

  const loadBatches = () => {
    api
      .get("/production/batches")
      .then(({ data }) => setBatches((data?.batches ?? []).map(mapBatch)))
      .catch(() => setBatches([]));
  };

  const loadMaintenance = () => {
    api
      .get("/production/maintenance")
      .then(({ data }) => setEquipment((data?.logs ?? []).map(mapMaintenanceLog)))
      .catch(() => setEquipment([]));
  };

  useEffect(() => {
    getProducts({ limit: 200 });
    setLoading(true);
    Promise.all([
      api.get("/production/batches").then(({ data }) => setBatches((data?.batches ?? []).map(mapBatch))).catch(() => setBatches([])),
      api.get("/production/maintenance").then(({ data }) => setEquipment((data?.logs ?? []).map(mapMaintenanceLog))).catch(() => setEquipment([])),
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productOptions = useMemo(
    () => products.map((p) => ({ value: p.id, label: p.name })),
    [products],
  );

  const filteredBatches = useMemo(() => {
    const q = batchSearch.toLowerCase().trim();
    return batches.filter((batch) => {
      if (degreeFilter !== "all" && batch.degree !== (degreeFilter as RoastingDegree)) {
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
        record.status !== (equipmentStatusFilter as MaintenanceStatus)
      ) {
        return false;
      }
      if (!q) return true;
      return record.equipmentName.toLowerCase().includes(q);
    });
  }, [equipment, equipmentSearch, equipmentStatusFilter]);

  const activeBatches = batches.filter(
    (b) => b.status === "Roasted" || b.status === "In-QC",
  ).length;

  const overview = useMemo(() => {
    const withScore = batches.filter((b) => b.cupScore != null);
    const qualityIndex = withScore.length
      ? `${(withScore.reduce((sum, b) => sum + (b.cupScore ?? 0), 0) / withScore.length).toFixed(1)}/100`
      : "—";

    const completed = batches.filter((b) => b.weightOut != null && b.weightIn > 0);
    const productionEfficiency = completed.length
      ? `${(
          (completed.reduce((sum, b) => sum + (b.weightOut ?? 0) / b.weightIn, 0) / completed.length) * 100
        ).toFixed(1)}%`
      : "—";
    const averageLossRate = completed.length
      ? `${(
          (completed.reduce((sum, b) => sum + (b.weightIn - (b.weightOut ?? 0)) / b.weightIn, 0) / completed.length) * 100
        ).toFixed(1)}%`
      : "—";

    return { qualityIndex, productionEfficiency, averageLossRate };
  }, [batches]);

  const chartData = useMemo(
    () =>
      batches
        .filter((b) => b.weightOut != null && b.weightIn > 0)
        .slice(0, 8)
        .reverse()
        .map((b) => ({
          label: b.batchNumber,
          value: Math.round(((b.weightOut ?? 0) / b.weightIn) * 100),
        })),
    [batches],
  );

  const handleSaveBatch = async (data: StartRoastFormData) => {
    try {
      await api.post("/production/roast", {
        batchId: data.batchNumber.trim(),
        product: data.productId,
        weightIn: Number(data.weightIn),
        roastProfile: data.degree,
        moistureGreen: data.moistureGreen ? Number(data.moistureGreen) : undefined,
        notes: data.notes || undefined,
      });
      showSuccessToast(t("Roast batch started"));
      loadBatches();
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || t("Failed to start roast batch"));
    }
  };

  const handleCompleteRoast = async (batchId: string, data: CompleteRoastFormData) => {
    try {
      await api.put(`/production/batches/${batchId}/complete`, {
        weightOut: Number(data.weightOut),
        moistureRoasted: data.moistureRoasted ? Number(data.moistureRoasted) : undefined,
        roastColor: data.roastColor || undefined,
        cupScore: data.cupScore ? Number(data.cupScore) : undefined,
        notes: data.notes || undefined,
      });
      showSuccessToast(t("Batch sent to QC"));
      loadBatches();
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || t("Failed to complete roast"));
    }
  };

  const handleConfirmQuality = async (batchId: string, data: QualityCheckFormData) => {
    try {
      await api.post("/production/qc", {
        batch: batchId,
        cuppingScore: Number(data.cuppingScore),
        aroma: data.aroma ? Number(data.aroma) : undefined,
        acidity: data.acidity ? Number(data.acidity) : undefined,
        body: data.body ? Number(data.body) : undefined,
        aftertaste: data.aftertaste ? Number(data.aftertaste) : undefined,
        cupper: data.cupper || undefined,
        notes: data.notes || undefined,
      });
      showSuccessToast(t("Batch released"));
      loadBatches();
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || t("Failed to submit QC report"));
    }
  };

  const handleLogService = async (data: ServiceLogFormData) => {
    try {
      await api.post("/production/maintenance", {
        equipmentName: data.equipmentName.trim(),
        taskType: data.taskType,
        notes: data.notes || undefined,
        cost: data.cost ? Number(data.cost) : undefined,
        nextDueDate: data.deadline,
        status: data.status,
      });
      showSuccessToast(t("Service log recorded"));
      loadMaintenance();
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || t("Failed to record service log"));
    }
  };

  const isRoast = tab === "roast";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Coffee className="size-16 animate-spin text-primary" />
      </div>
    );
  }

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
          <RoastOverview
            activeBatches={activeBatches}
            qualityIndex={overview.qualityIndex}
            productionEfficiency={overview.productionEfficiency}
            averageLossRate={overview.averageLossRate}
          />

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
                options={ROASTING_DEGREE_FILTERS.map((o) => ({ ...o, label: t(o.label) }))}
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
                onCompleteRoast={setCompletingBatch}
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
                placeholder={t("Search by equipment name.")}
              />
            </div>
            <div className="sm:w-64">
              <DropdownSelect
                options={MAINTENANCE_STATUS_FILTERS.map((o) => ({ ...o, label: t(o.label) }))}
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
        productOptions={productOptions}
      />

      <CompleteRoastDialog
        open={!!completingBatch}
        batch={completingBatch}
        onOpenChange={(open) => !open && setCompletingBatch(null)}
        onConfirm={handleCompleteRoast}
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
