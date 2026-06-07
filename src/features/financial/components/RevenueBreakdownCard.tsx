import { Info } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { RevenueBreakdownRow } from "../types";

interface RevenueBreakdownCardProps {
  rows: RevenueBreakdownRow[];
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const RevenueBreakdownCard = ({ rows }: RevenueBreakdownCardProps) => {
  const max = Math.max(...rows.map((r) => r.amount), 1);

  return (
    <Card className="h-full rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
      <CardContent className="flex h-full flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-2">
          <Info size={25} className="text-[#000000]" />
          <h3 className="text-[18px] font-semibold text-[#333333] sm:text-[16px]">
            Revenues versus expenses
          </h3>
        </div>

        <div className="flex flex-col gap-5">
          {rows.map((row) => {
            const width = (row.amount / max) * 100;
            return (
              <div key={row.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-[#28293D]">
                    {row.label}
                  </span>
                  <span className="font-semibold text-[#28293D]">
                    {formatEgp(row.amount)}
                  </span>
                </div>
                <div className="h-[6px] w-[302.5px] overflow-hidden rounded-[3px] bg-[#E5E5E5]">
                  <div
                    className="h-full rounded-[3px] bg-[#8F6900]"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueBreakdownCard;
