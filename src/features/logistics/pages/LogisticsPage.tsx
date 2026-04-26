import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { MapPin, Truck, Clock } from "lucide-react";

import OverviewCard from "@/shared/components/OverviewCard";
import DefaultButton from "@/shared/components/DefaultButton";
import ZoneCard from "../components/ZoneCard";

import AddDriverModal from "../components/AddDriverModal";
import DispatchModal from "../components/DispatchModal";
import EditDriverModal from "../components/EditDriverModal";
import type {
  AddDriverFormData,
  DispatchPayload,
  Driver,
  Zone,
} from "../types";
import { INITIAL_DRIVERS, ZONES_DATA } from "../data";
import DriversTable from "../components/DriverStable";

const LogisticsPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [search, setSearch] = useState("");
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [dispatchZone, setDispatchZone] = useState<Zone | null>(null);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);

  // ---- Derived state ----
  const activeDrivers = useMemo(
    () => drivers.filter((d) => d.status === "Active"),
    [drivers]
  );

  const filteredZones = useMemo(() => {
    if (!search.trim()) return ZONES_DATA;
    const q = search.toLowerCase();
    return ZONES_DATA.filter(
      (z) =>
        z.name.toLowerCase().includes(q) ||
        z.orders.some((o) => o.id.toLowerCase().includes(q))
    );
  }, [search]);

  // ---- Handlers ----
  const handleAddDriver = (form: AddDriverFormData) => {
    const newDriver: Driver = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      vehicle: form.vehicle,
      zones: [],
      status: form.status,
    };
    setDrivers((prev) => [...prev, newDriver]);
  };

  const handleEditSave = (updated: Driver) => {
    setDrivers((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDelete = (id: number) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" }
          : d
      )
    );
  };

  const handleDispatch = ({ zone, driverId }: DispatchPayload) => {
    // TODO: integrate with dispatch API
    console.log(`Dispatched driver ${driverId} to zone ${zone.name}`);
  };

  const handleWhatsapp = (driver: Driver) => {
    window.open(`https://wa.me/${driver.phone.replace(/\D/g, "")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] p-8">
      <div className="mx-auto max-w-[1100px]">
        {/* Page Header */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#28293D]">
              Fleet Management
            </h1>
            <p className="mt-0.5 text-[13px] text-[#6B6B6B]">
              Logistics &amp; Dispatch
            </p>
          </div>
          <DefaultButton
            data={{
              buttonText: "Add Driver",
              icon: <Plus size={16} />,
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: () => setShowAddDriver(true),
            }}
          />
        </div>

        {/* Overview Cards */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <OverviewCard
            data={{
              title: "ACTIVE ZONES",
              value: ZONES_DATA.length,
              icon: <MapPin size={20} />,
              iconColor: "text-[#7A6518]",
              badgeColor: "bg-[#FFF3DC]",
            }}
          />
          <OverviewCard
            data={{
              title: "OFFICIAL DRIVERS",
              value: activeDrivers.length,
              icon: <Truck size={20} />,
              iconColor: "text-[#1A7A45]",
              badgeColor: "bg-[#E0F5EC]",
            }}
          />
          <OverviewCard
            data={{
              title: "PENDING ORDERS",
              value: 0,
              icon: <Clock size={20} />,
              iconColor: "text-[#B56C00]",
              badgeColor: "bg-[#FFF5DC]",
            }}
          />
        </div>

        {/* Search Bar */}
        <div className="mb-7 flex items-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-2.5">
          <Search size={16} className="text-[#AAAAAA]" />
          <input
            type="text"
            placeholder="Search by order number, driver, or zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-[14px] text-[#28293D] placeholder:text-[#AAAAAA] outline-none"
          />
        </div>

        {/* Zones Grid */}
        <div className="mb-8 grid grid-cols-3 gap-5">
          {filteredZones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} onDispatch={setDispatchZone} />
          ))}
        </div>

        {/* Drivers Table */}
        <DriversTable
          drivers={drivers}
          onToggleStatus={handleToggleStatus}
          onEdit={setEditDriver}
          onDelete={handleDelete}
          onWhatsapp={handleWhatsapp}
        />
      </div>

      {/* Modals */}
      <AddDriverModal
        open={showAddDriver}
        onClose={() => setShowAddDriver(false)}
        onSave={handleAddDriver}
      />

      <DispatchModal
        open={!!dispatchZone}
        zone={dispatchZone}
        drivers={activeDrivers}
        onClose={() => setDispatchZone(null)}
        onDispatch={handleDispatch}
      />

      <EditDriverModal
        open={!!editDriver}
        driver={editDriver}
        onClose={() => setEditDriver(null)}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default LogisticsPage;
