import { RefreshCw, ShieldCheck } from "lucide-react";
import type { AuditLog, MutationType } from "../types";

interface Props {
  logs: AuditLog[];
}

const MUTATION_STYLES: Record<MutationType, string> = {
  Update: "border-[#E18A00] text-[#C57A00]",
  Create: "border-[#00A85A] text-[#00A85A]",
  Delete: "border-[#FF0000] text-[#FF0000]",
};

const AuditLogsTab = ({ logs }: Props) => {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
      <div className="flex h-[86px] items-center justify-between bg-[#F5F0EA] px-[24px]">
        <div className="flex items-center gap-[18px]">
          <ShieldCheck className="size-8 text-[#000000]" />
          <div>
            <h2 className="text-[24px] font-bold leading-none text-[#333333]">
              Audit Governance
            </h2>
            <p className="mt-[7px] text-[14px] font-medium text-[#727272]">
              Cryptographically sealed administrator activity
            </p>
          </div>
        </div>

        <button className="flex size-[52px] items-center justify-center rounded-[8px] bg-primary transition-colors hover:bg-[#7A5C10]">
          <RefreshCw className="size-6 text-white" />
        </button>
      </div>

      <div className="overflow-x-auto px-[21px] pb-[31px] pt-[38px]">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-[#E1E1E5] text-left text-[14px] font-bold text-[#28293D]">
              <th className="pb-[16px]">EVENT TIMESTAMP</th>
              <th className="pb-[16px]">ADMIN ENTITY</th>
              <th className="pb-[16px]">MUTATION TYPE</th>
              <th className="pb-[16px]">TARGET RESOURCE</th>
              <th className="pb-[16px]">ORIGIN IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="h-[67px] align-middle text-center text-[16px] font-medium leading-[1.1] text-[#000000]">
                  {log.eventTimestamp}
                </td>
                <td className="align-middle text-[16px] font-medium text-[#000000]">
                  {log.adminEntity}
                </td>
                <td className="align-middle">
                  <span
                    className={`inline-flex h-[27px] min-w-[78px] items-center justify-center rounded-full border px-[13px] text-[15px] font-semibold leading-none ${
                      MUTATION_STYLES[log.mutationType]
                    }`}
                  >
                    {log.mutationType}
                  </span>
                </td>
                <td className="align-middle text-[13px] font-medium leading-[1.1] text-[#696969]">
                  <span className="mr-2 font-mono text-[16px] text-[#000000]">
                    &gt;_
                  </span>
                  {log.targetResource}
                </td>
                <td className="align-middle text-[12px] font-medium text-[#696969]">
                  {log.originIP}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AuditLogsTab;
