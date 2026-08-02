import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { INVENTORY_COUNT_SESSIONS } from "../data";
import type { InventoryCountSession } from "../types";

interface InventoryCountViewProps {
  onSelectSession?: (session: InventoryCountSession) => void;
}

const InventoryCountView = ({ onSelectSession }: InventoryCountViewProps) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F5F0EA] border-none">
            <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("INVENTORY NUMBER")}
            </TableHead>
            <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("WAREHOUSE")}
            </TableHead>
            <TableHead className="px-6 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("DATE")}
            </TableHead>
            <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("STATUS")}
            </TableHead>
            <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("NO. OF ITEMS")}
            </TableHead>
            <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
              {t("DETAILS")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVENTORY_COUNT_SESSIONS.map((session) => (
            <TableRow key={session.id} className="border-none hover:bg-[#FAFAF8]">
              <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                {session.number}
              </TableCell>
              <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-[#28293D]">
                {session.warehouse}
              </TableCell>
              <TableCell className="px-6 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-[#28293D]" dir="ltr">
                {session.date}
              </TableCell>
              <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                <div className="inline-flex justify-center">
                  {session.status === "In Progress" ? (
                    <Badge className="h-[34px] w-[160px] justify-center rounded-[30px] bg-[#EDF4FB] text-[#3574FF] border border-[#004EF9] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                      {t("In Progress")}
                    </Badge>
                  ) : (
                    <Badge className="h-[34px] w-[160px] justify-center rounded-[30px] bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                      {t("Completed")}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#28293D]">
                {session.noOfItems}
              </TableCell>
              <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                <div className="inline-flex justify-center">
                  <button
                    type="button"
                    onClick={() => onSelectSession?.(session)}
                    className="h-[34px] w-[160px] inline-flex items-center justify-center rounded-[16px] bg-[#F5F0EA] text-[12px] font-semibold leading-6 text-[#8F6900] hover:bg-[#EAE2D5] transition-colors cursor-pointer"
                  >
                    {t("View")}
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryCountView;
