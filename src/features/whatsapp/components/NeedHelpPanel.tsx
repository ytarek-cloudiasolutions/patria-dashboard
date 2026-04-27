import { HelpCircle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";

const NeedHelpPanel = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-[#28293D]">Need help?</span>
              <HelpCircle size={18} className="text-[#6B6B6B]" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="px-5 py-5 text-center text-[13px] leading-relaxed text-[#6B6B6B] whitespace-normal">
            Read our knowledge base for gateway troubleshooting
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default NeedHelpPanel;