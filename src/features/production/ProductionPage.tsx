import { useMemo, useState } from "react";
import { Plus, Wrench } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";

import ProductionTabs from "./components/ProductionTabs";
import RoastOverview from "./components/RoastOverview";
import ProductionChart from "./components/ProductionChart";
import BatchesTable from "./components/BatchesTable";
import EquipmentTable from "./components/EquipmentTable";
import StartRoastDialog from "./components/StartRoastDialog";
import QualityCheckDialog from "./components/QualityCheckDialog";
import LogServiceDialog from "./components/LogServiceDialog";

import {
  EQUIPMENT_STATUS_FILTERS,
  INITIAL_BATCHES,
  INITIAL_EQUIPMENT,
  ROASTING_DEGREE_FILTERS,
} from "./data";
import type {
  BatchFormData,
  EquipmentRecord,
  EquipmentStatus,
  ProductionTab,
  QualityCheckFormData,
  RoastBatch,
  RoastingDegree,
  ServiceLogFormData,
} from "./types";

const ProductionPage = () => {
  const [tab, setTab] = useState<ProductionTab>("roast");

  const [batches, setBatches] = useState<RoastBatch[]>(INITIAL_BATCHES);
  const [equipment, setEquipment] =
    useState<EquipmentRecord[]>(INITIAL_EQUIPMENT);

  const [batchSearch, setBatchSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [isDegreeFilterOpen, setIsDegreeFilterOpen] = useState(false);

  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [equipmentStatusFilter, setEquipmentStatusFilter] = useState("all");
  const [isEquipmentStatusOpen, setIsEquipmentStatusOpen] = useState(false);

  const [isStartRoastOpen, setIsStartRoastOpen] = useState(false);
  const [verifyingBatch, setVerifyingBatch] = useState<RoastBatch | null>(
    null,
  );
  const [isLogServiceOpen, setIsLogServiceOpen] = useState(false);

  const isScrimActive =
    isDegreeFilterOpen || isEquipmentStatusOpen;

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

  const activeBatches = batches.filter(
    (b) => b.status === "Verify Quality" || b.status === "IN-QC",
  ).length;

  const handleSaveBatch = (data: BatchFormData) => {
    const newBatch: RoastBatch = {
      id: Date.now(),
      batchNumber: data.batchNumber.trim(),
      product: data.rawCoffeeType.trim(),
      degree: data.degree,
      weightBefore: Number(data.weightBefore) || 0,
      weightAfter: Number(data.weightAfter) || 0,
      status: "Verify Quality",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setBatches((prev) => [newBatch, ...prev]);
  };

  const handleConfirmQuality = (
    batchId: number,
    _data: QualityCheckFormData,
  ) => {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.id === batchId ? { ...batch, status: "Released" } : batch,
      ),
    );
  };

  const handleLogService = (data: ServiceLogFormData) => {
    const newRecord: EquipmentRecord = {
      id: Date.now(),
      machine: `#TRF-${String(equipment.length + 1).padStart(6, "0")}`,
      task: data.task,
      operator: "Admin",
      deadline: data.deadline
        ? new Date(data.deadline).toLocaleDateString("en-US")
        : "—",
      cost: Number(data.cost) || 0,
      status: "Maintenance",
    };
    setEquipment((prev) => [newRecord, ...prev]);
  };

  const isRoast = tab === "roast";

  return (
    <>
      {isScrimActive && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={isRoast ? "Production" : "Equipment"}
          description={
            isRoast
              ? "Manufacturing & Quality Control"
              : "Equipment maintenance and safety"
          }
        />
        {isRoast ? (
          <DefaultButton
            data={{
              buttonText: "Start Roast",
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsStartRoastOpen(true),
            }}
          />
        ) : (
          <DefaultButton
            data={{
              buttonText: "Log Service",
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
                placeholder="Search by batch, status, or date..."
              />
            </div>
            <div className="sm:w-64">
              <DropdownSelect
                options={ROASTING_DEGREE_FILTERS}
                selected={degreeFilter}
                onSelect={setDegreeFilter}
                onOpenChange={setIsDegreeFilterOpen}
                placeholder="Roasting degree"
                align="end"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            <ProductionChart />
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
                placeholder="Search by Machine."
              />
            </div>
            <div className="sm:w-64">
              <DropdownSelect
                options={EQUIPMENT_STATUS_FILTERS}
                selected={equipmentStatusFilter}
                onSelect={setEquipmentStatusFilter}
                onOpenChange={setIsEquipmentStatusOpen}
                placeholder="Status"
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
