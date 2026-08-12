import { useCallback, useEffect, useState } from "react";
import { Activity, Database, Globe, HardDrive, MessageCircle, RefreshCw, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import SectionCard from "./SectionCard";

interface SystemStatus {
  server: { status: string; uptimeSeconds: number; memoryUsedMB: number; memoryTotalMB: number; nodeVersion: string };
  database: { status: string; name: string | null };
  integrations: {
    whatsapp: { status: string };
    fcmCustomer: { initialized: boolean; error: string | null };
    fcmDriver: { initialized: boolean; error: string | null };
  };
}

const formatUptime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}H ${m}M`;
};

const isHealthy = (v: string | boolean) => v === "connected" || v === true || v === "up";

const Tile = ({
  icon: Icon,
  label,
  value,
  sublabel,
  healthy,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sublabel: string;
  healthy: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-5 text-center">
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-2xl",
          healthy ? "bg-[#E2F4ED]" : "bg-[#FFF7E6]",
        )}
      >
        <Icon size={20} className={healthy ? "text-[#059B5A]" : "text-[#C7861E]"} />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
          {t(label)}
        </p>
        <p className="text-[20px] font-bold text-[#333333]" dir="ltr">{value}</p>
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#8B8B8B]">
          {t(sublabel)}
        </p>
      </div>
    </div>
  );
};

const SystemSection = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/system/status")
      .then(({ data }) => setStatus(data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const RefreshButton = () => (
    <button
      type="button"
      aria-label="Refresh"
      onClick={load}
      className="flex size-10 cursor-pointer items-center justify-center rounded-[8px] bg-primary text-white hover:bg-primary/90"
    >
      <RefreshCw className={cn("size-4.5", loading && "animate-spin")} />
    </button>
  );

  return (
    <SectionCard
      icon={<Activity size={32} />}
      title={t("System Status")}
      subtitle={t("Basic server health and external integrations")}
      action={<RefreshButton />}
      contentClassName="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6"
    >
      {!status ? (
        <p className="py-8 text-center text-[13px] text-[#8B8B8B]">
          {loading ? t("Loading...") : t("Unable to load system status")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tile
              icon={HardDrive}
              label={t("Memory")}
              value={`${status.server.memoryUsedMB} / ${status.server.memoryTotalMB} MB`}
              sublabel={`Node ${status.server.nodeVersion}`}
              healthy
            />
            <Tile
              icon={Activity}
              label={t("Uptime")}
              value={formatUptime(status.server.uptimeSeconds)}
              sublabel={t("Server")}
              healthy
            />
            <Tile
              icon={Database}
              label={t("Database")}
              value={t(status.database.status)}
              sublabel={status.database.name || t("MongoDB")}
              healthy={isHealthy(status.database.status)}
            />
            <Tile
              icon={Globe}
              label={t("Environment")}
              value={import.meta.env.MODE === "production" ? t("Production") : t("Development")}
              sublabel={t("Runtime mode")}
              healthy
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Tile
              icon={MessageCircle}
              label={t("WhatsApp Gateway")}
              value={t(status.integrations.whatsapp.status)}
              sublabel={t("Integration")}
              healthy={status.integrations.whatsapp.status === "connected"}
            />
            <Tile
              icon={Bell}
              label={t("Customer Push (FCM)")}
              value={status.integrations.fcmCustomer.initialized ? t("Connected") : t("Not configured")}
              sublabel={t("Integration")}
              healthy={status.integrations.fcmCustomer.initialized}
            />
            <Tile
              icon={Bell}
              label={t("Driver Push (FCM)")}
              value={status.integrations.fcmDriver.initialized ? t("Connected") : t("Not configured")}
              sublabel={t("Integration")}
              healthy={status.integrations.fcmDriver.initialized}
            />
          </div>
        </>
      )}
    </SectionCard>
  );
};

export default SystemSection;
