import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { cn } from "@/lib/utils";
import type { EquipmentRecord } from "../types";

interface EquipmentTableProps {
  records: EquipmentRecord[];
}

const TaskBadge = ({ task }: { task: EquipmentRecord["task"] }) => (
  <span className="rounded-full border border-[#E5E5E5] bg-white px-3 py-1 text-[11px] font-semibold text-[#6B6B6B]">
    {task}
  </span>
);

const StatusBadge = ({ status }: { status: EquipmentRecord["status"] }) => {
  const styles: Record<EquipmentRecord["status"], string> = {
    Poor: "border border-[#F5A8A8] bg-[#FFF0F0] text-[#C90000]",
    Healthy: "border border-[#A8DFC4] bg-[#E8F5EE] text-[#1A7A45]",
  };
  return (
    <span className={cn("rounded-full px-4 py-1.5 text-[12px] font-semibold", styles[status])}>
      {status}
    </span>
  );
};

const EquipmentTable = ({ records }: EquipmentTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">MACHINE</TableHead>
          <TableHead className="px-4">TASK</TableHead>
          <TableHead className="px-4">OPERATOR</TableHead>
          <TableHead className="px-4">DEADLINE</TableHead>
          <TableHead className="px-4">COST</TableHead>
          <TableHead className="px-4">STATUS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="px-4 font-semibold text-[#28293D]">{record.machine}</TableCell>
            <TableCell className="px-4">
              <TaskBadge task={record.task} />
            </TableCell>
            <TableCell className="px-4 font-semibold text-[#28293D]">{record.operator}</TableCell>
            <TableCell className="px-4 text-[#6B6B6B]">{record.deadline}</TableCell>
            <TableCell className="px-4 text-[#28293D]">EGP {record.cost.toLocaleString()}</TableCell>
            <TableCell className="px-4">
              <StatusBadge status={record.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EquipmentTable;