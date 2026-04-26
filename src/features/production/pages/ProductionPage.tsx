import { useState, useMemo } from "react";
import { Plus, Search, Coffee, Wrench } from "lucide-react";

import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";

import ProductionChart from "../components/ProductionChart";
import RoastBatchesTable from "../components/RoastBatchesTable";
import EquipmentTable from "../components/EquipmentTable";
import NewRoastBatchModal from "../components/NewRoastBatchModal";
import QualityCheckModal from "../components/QualityCheckModal";
import ServiceLogModal from "../components/ServiceLogModal";
import {
  INITIAL_BATCHES,
  INITIAL_EQUIPMENT,
  OVERVIEW_STATS,
  ROASTING_DEGREE_FILTER_OPTIONS,
  CHART_DATA,
  EQUIPMENT_STATUS_OPTIONS,
} from "../data";
import type {
  RoastBatch,
  EquipmentRecord,
  NewRoastBatchForm,
  QualityCheckForm,
  ServiceLogForm,
} from "../types";

type ActiveTab = "roast" | "equipment";

const ProductionPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("roast");

  // ---- Roast state ----
  const [batches, setBatches] = useState<RoastBatch[]>(INITIAL_BATCHES);
  const [roastSearch, setRoastSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("All");
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [qualityBatch, setQualityBatch] = useState<RoastBatch | null>(null);

  // ---- Equipment state ----
  const [equipment, setEquipment] =
    useState<EquipmentRecord[]>(INITIAL_EQUIPMENT);
  const [equipSearch, setEquipSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showServiceLog, setShowServiceLog] = useState(false);

  // ---- Derived ----
  const activeBatches = batches.filter((b) => b.status !== "Certified").length;

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchSearch =
        !roastSearch.trim() ||
        b.batch.toLowerCase().includes(roastSearch.toLowerCase()) ||
        b.product.toLowerCase().includes(roastSearch.toLowerCase()) ||
        b.status.toLowerCase().includes(roastSearch.toLowerCase());
      const matchDegree = degreeFilter === "All" || b.degree === degreeFilter;
      return matchSearch && matchDegree;
    });
  }, [batches, roastSearch, degreeFilter]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((e) => {
      const matchSearch =
        !equipSearch.trim() ||
        e.machine.toLowerCase().includes(equipSearch.toLowerCase());
      const matchStatus = statusFilter === "All" || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [equipment, equipSearch, statusFilter]);

  // ---- Handlers ----
  const handleCommitBatch = (form: NewRoastBatchForm) => {
    const newBatch: RoastBatch = {
      id: String(Date.now()),
      batch: form.batchNumber,
      product: form.rawCoffeeType,
      degree: form.degree,
      massIn: form.weightBefore,
      massOut: form.weightAfter,
      status: "IN-QC",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setBatches((prev) => [newBatch, ...prev]);
  };

  const handleCertifyBatch = (batchId: string, _form: QualityCheckForm) => {
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: "Certified" } : b))
    );
  };

  const handleServiceLog = (form: ServiceLogForm) => {
    const newRecord: EquipmentRecord = {
      id: String(Date.now()),
      machine: form.machineDesignation,
      task: form.taskTaxonomy as EquipmentRecord["task"],
      operator: "Admin",
      deadline: form.nextRecalibrationDeadline,
      cost: form.financialOutlay ?? 0,
      status: "Healthy",
    };
    setEquipment((prev) => [newRecord, ...prev]);
  };

  const isRoastTab = activeTab === "roast";

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Page Header */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#28293D]">
              {isRoastTab ? "Production" : "Equipment"}
            </h1>
            <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
              {isRoastTab
                ? "Manufacturing & Quality Control"
                : "Equipment maintenance and safety"}
            </p>
          </div>
          {isRoastTab ? (
            <DefaultButton
              data={{
                buttonText: "Start Roast",
                icon: <Plus size={16} />,
                className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
                onClick: () => setShowNewBatch(true),
              }}
            />
          ) : (
            <DefaultButton
              data={{
                buttonText: "Log Service",
                icon: <Wrench size={16} />,
                className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
                onClick: () => setShowServiceLog(true),
              }}
            />
          )}
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as ActiveTab)}
          className="mb-6"
        >
          <TabsList
            variant="line"
            className="w-full justify-around border-b border-[#E5E5E5] bg-transparent pb-0 rounded-none"
          >
            <TabsTrigger
              value="roast"
              className="flex-1 gap-2 pb-3 text-[14px] font-medium data-[state=active]:border-b-2 data-[state=active]:border-[#5C4A0E] data-[state=active]:text-[#5C4A0E]"
            >
              <Coffee size={16} />
              Roast
            </TabsTrigger>
            <TabsTrigger
              value="equipment"
              className="flex-1 gap-2 pb-3 text-[14px] font-medium data-[state=active]:border-b-2 data-[state=active]:border-[#5C4A0E] data-[state=active]:text-[#5C4A0E]"
            >
              <Wrench size={16} />
              Equipment
            </TabsTrigger>
          </TabsList>

          {/* ---- ROAST TAB ---- */}
          <TabsContent value="roast" className="mt-6 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-4 gap-4">
              <OverviewCard
                data={{
                  title: "Active Batches",
                  value: activeBatches,
                  icon: <Coffee size={18} />,
                  iconColor: "text-[#B56C00]",
                  badgeColor: "bg-[#FFF5DC]",
                }}
              />
              <OverviewCard
                data={{
                  title: "Quality Index",
                  value:
                    `${OVERVIEW_STATS.qualityIndex}/100` as unknown as number,
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  iconColor: "text-[#1A7A45]",
                  badgeColor: "bg-[#E0F5EC]",
                }}
              />
              <OverviewCard
                data={{
                  title: "Production Efficiency",
                  value:
                    `${OVERVIEW_STATS.productionEfficiency}%` as unknown as number,
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  iconColor: "text-[#B56C00]",
                  badgeColor: "bg-[#FFF5DC]",
                }}
              />
              <OverviewCard
                data={{
                  title: "Average Loss Rate",
                  value:
                    `${OVERVIEW_STATS.averageLossRate}%` as unknown as number,
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  ),
                  iconColor: "text-[#C90000]",
                  badgeColor: "bg-[#FFF0F0]",
                }}
              />
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-2.5">
                <Search size={16} className="text-[#AAAAAA]" />
                <input
                  type="text"
                  placeholder="Search by batch, status, or date..."
                  value={roastSearch}
                  onChange={(e) => setRoastSearch(e.target.value)}
                  className="w-full bg-transparent text-[14px] text-[#28293D] placeholder:text-[#AAAAAA] outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={degreeFilter}
                  onChange={(e) => setDegreeFilter(e.target.value)}
                  className="h-full appearance-none rounded-[10px] border border-[#E5E5E5] bg-white px-4 pr-10 text-[14px] text-[#28293D] outline-none cursor-pointer"
                >
                  {ROASTING_DEGREE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "All" ? "Roasting degree" : opt}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                  ▾
                </span>
              </div>
            </div>

            {/* Chart + Table side by side */}
            <div className="flex gap-5">
              <div className="w-[260px] shrink-0">
                <ProductionChart data={CHART_DATA} />
              </div>
              <div className="flex-1">
                <RoastBatchesTable
                  batches={filteredBatches}
                  onVerifyQuality={setQualityBatch}
                />
              </div>
            </div>
          </TabsContent>

          {/* ---- EQUIPMENT TAB ---- */}
          <TabsContent value="equipment" className="mt-6 space-y-5">
            {/* Search + Filter */}
            <div className="flex gap-3">
              <div className="flex flex-1 items-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-2.5">
                <Search size={16} className="text-[#AAAAAA]" />
                <input
                  type="text"
                  placeholder="Search by Machine..."
                  value={equipSearch}
                  onChange={(e) => setEquipSearch(e.target.value)}
                  className="w-full bg-transparent text-[14px] text-[#28293D] placeholder:text-[#AAAAAA] outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-full appearance-none rounded-[10px] border border-[#E5E5E5] bg-white px-4 pr-10 text-[14px] text-[#28293D] outline-none cursor-pointer"
                >
                  <option value="All">Status</option>
                  {EQUIPMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
                  ▾
                </span>
              </div>
            </div>

            <EquipmentTable records={filteredEquipment} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <NewRoastBatchModal
        open={showNewBatch}
        onClose={() => setShowNewBatch(false)}
        onCommit={handleCommitBatch}
      />

      <QualityCheckModal
        open={!!qualityBatch}
        batch={qualityBatch}
        onClose={() => setQualityBatch(null)}
        onCertify={handleCertifyBatch}
      />

      <ServiceLogModal
        open={showServiceLog}
        onClose={() => setShowServiceLog(false)}
        onConfirm={handleServiceLog}
      />
    </div>
  );
};

export default ProductionPage;
