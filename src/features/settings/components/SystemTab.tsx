import {
  Activity,
  Database,
  Globe,
  HardDrive,
  RefreshCw,
  RotateCw,
} from "lucide-react";
import type { SystemStatus } from "../types";

interface Props {
  status: SystemStatus;
}

const StatCard = ({
  icon,
  label,
  value,
  sub,
  iconClassName,
  iconBackgroundClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  iconClassName: string;
  iconBackgroundClassName: string;
}) => (
  <div className="flex h-[157px] flex-col items-center justify-center rounded-[14px] border border-[#E1E1E5] bg-white text-center shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
    <div
      className={`mb-[19px] flex size-[41px] items-center justify-center rounded-[13px] ${iconBackgroundClassName}`}
    >
      <span className={iconClassName}>{icon}</span>
    </div>
    <p className="text-[12px] font-bold uppercase leading-none text-[#000000]">
      {label}
    </p>
    <p className="mt-[7px] text-[23px] font-semibold leading-none text-[#333333]">
      {value}
    </p>
    <p className="mt-[8px] text-[10px] font-bold uppercase text-[#000000]">
      {sub}
    </p>
  </div>
);

const SystemTab = ({ status }: Props) => {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
      <div className="flex h-[86px] items-center justify-between bg-[#F5F0EA] px-[24px]">
        <div className="flex items-center gap-[18px]">
          <Activity className="size-8 text-[#000000]" />
          <div>
            <h2 className="text-[24px] font-bold leading-none text-[#333333]">
              System Status
            </h2>
            <p className="mt-[7px] text-[14px] font-medium text-[#727272]">
              Global Cluster Health
            </p>
          </div>
        </div>

        <button className="flex size-[52px] items-center justify-center rounded-[8px] bg-primary transition-colors hover:bg-[#7A5C10]">
          <RefreshCw className="size-6 text-white" />
        </button>
      </div>

      <div className="px-[20px] pb-[25px] pt-[27px]">
        <div className="grid gap-[18px] md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<HardDrive className="size-6" />}
            label="Storage Core"
            value={status.storageCore}
            sub="Node Engine"
            iconClassName="text-[#C57A00]"
            iconBackgroundClassName="bg-[#FFF5E4]"
          />
          <StatCard
            icon={<RotateCw className="size-7" />}
            label="Socket Sync"
            value={String(status.socketSync)}
            sub="Real-Time Nodes"
            iconClassName="text-[#00A85A]"
            iconBackgroundClassName="bg-[#DDF6EB]"
          />
          <StatCard
            icon={<Database className="size-7" />}
            label="Database Layer"
            value={status.databaseLayer}
            sub="MongoDB Cluster"
            iconClassName="text-[#E18A00]"
            iconBackgroundClassName="bg-[#FFF5E4]"
          />
          <StatCard
            icon={<Globe className="size-7" />}
            label="Environment"
            value={status.environment}
            sub="Runtime Mode"
            iconClassName="text-[#0066FF]"
            iconBackgroundClassName="bg-[#EAF1FF]"
          />
        </div>

        <div className="mt-[59px] grid gap-[18px] md:grid-cols-3">
          <div className="h-[121px] rounded-[14px] border border-[#E1E1E5] bg-white px-[24px] py-[24px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <p className="text-[12px] font-bold uppercase text-[#000000]">
              System Uptime
            </p>
            <p className="mt-[15px] text-[24px] font-semibold leading-none text-[#00A85A]">
              {status.systemUptime}
            </p>
            <p className="mt-[11px] text-[10px] font-semibold text-[#00A85A]">
              • Operational
            </p>
          </div>
          <div className="h-[121px] rounded-[14px] border border-[#E1E1E5] bg-white px-[24px] py-[24px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <p className="text-[12px] font-bold uppercase text-[#000000]">
              Backups Integrity
            </p>
            <p className="mt-[18px] text-[23px] font-bold leading-none text-[#000000]">
              {status.backupsIntegrity}
            </p>
            <p className="mt-[12px] text-[10px] font-medium text-[#8F8F8F]">
              • Sync every 24h at 03:00
            </p>
          </div>
          <div className="h-[121px] rounded-[14px] border border-[#E1E1E5] bg-white px-[24px] py-[24px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <p className="text-[12px] font-bold uppercase text-[#000000]">
              Latency Index
            </p>
            <p className="mt-[18px] text-[23px] font-bold leading-none text-[#000000]">
              {status.latencyIndex}
            </p>
            <p className="mt-[12px] text-[10px] font-medium text-[#8F8F8F]">
              • Average &lt; 50ms
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemTab;
