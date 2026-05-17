import { Clock, RefreshCw } from "lucide-react";
import type { AttendanceLog } from "../types";

interface Props {
  logs: AttendanceLog[];
}

const AttendanceTab = ({ logs }: Props) => {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
      <div className="flex h-[86px] items-center justify-between bg-[#F5F0EA] px-[24px]">
        <div className="flex items-center gap-[18px]">
          <Clock className="size-8 text-[#000000]" />
          <div>
            <h2 className="text-[24px] font-bold leading-none text-[#333333]">
              Attendance Logs
            </h2>
            <p className="mt-[7px] text-[14px] font-medium text-[#727272]">
              Manage your account and platform preferences
            </p>
          </div>
        </div>

        <button className="flex size-[52px] items-center justify-center rounded-[8px] bg-primary transition-colors hover:bg-[#7A5C10]">
          <RefreshCw className="size-6 text-white" />
        </button>
      </div>

      <div className="overflow-x-auto px-[20px] pb-[31px] pt-[31px]">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-[#E1E1E5] text-left text-[14px] font-bold text-[#28293D]">
              <th className="pb-[15px]">STAFF MEMBER</th>
              <th className="pb-[15px]">IN-DATE/TIME</th>
              <th className="pb-[15px]">OUT-DATE/TIME</th>
              <th className="pb-[15px] text-center">LOGGED HOURS</th>
              <th className="pb-[15px] text-center">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="h-[61px] align-middle text-[16px] font-medium text-[#000000]">
                  {log.staffMember}
                </td>
                <td className="align-middle text-[16px] font-medium text-[#000000]">
                  {log.inDateTime}
                </td>
                <td className="align-middle text-[16px] font-medium text-[#000000]">
                  {log.outDateTime}
                </td>
                <td className="text-center align-middle text-[16px] font-medium text-[#000000]">
                  {log.loggedHours}
                </td>
                <td className="text-center align-middle">
                  <span
                    className={`inline-flex h-[27px] min-w-[97px] items-center justify-center rounded-full border px-[14px] text-[15px] font-semibold leading-none ${
                      log.status === "Ongoing"
                        ? "border-[#00A85A] text-[#00A85A]"
                        : "border-[#0066FF] text-[#336DFF]"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AttendanceTab;
