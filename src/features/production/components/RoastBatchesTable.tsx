import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { cn } from "@/lib/utils";
import type { RoastBatch } from "../types";

interface RoastBatchesTableProps {
  batches: RoastBatch[];
  onVerifyQuality: (batch: RoastBatch) => void;
}

const DegreeBadge = ({ degree }: { degree: RoastBatch["degree"] }) => {
  const styles: Record<RoastBatch["degree"], string> = {
    Light: "border border-[#E5E5E5] bg-white text-[#6B6B6B]",
    Medium: "bg-[#5C4A0E] text-white",
    Dark: "border border-[#E5E5E5] bg-white text-[#6B6B6B]",
  };
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-semibold",
        styles[degree]
      )}
    >
      {degree}
    </span>
  );
};

const MissingRate = ({
  massIn,
  massOut,
}: {
  massIn: number;
  massOut: number;
}) => {
  const missing = massIn > 0 ? ((massIn - massOut) / massIn) * 100 : 0;
  return (
    <div>
      <p className="text-[13px] font-medium text-[#28293D]">
        {massIn}Kg → {massOut}Kg
      </p>
      <p
        className={cn(
          "text-[11px] font-semibold",
          missing > 50
            ? "text-[#C90000]"
            : missing > 0
            ? "text-[#B56C00]"
            : "text-[#059B5A]"
        )}
      >
        Missing {missing.toFixed(1)}%
      </p>
    </div>
  );
};

const StatusCell = ({
  batch,
  onVerify,
}: {
  batch: RoastBatch;
  onVerify: () => void;
}) => {
  if (batch.status === "Verify Quality") {
    return (
      <button
        onClick={onVerify}
        className="rounded-full bg-[#5C4A0E] px-4 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#4A3A08] cursor-pointer"
      >
        Verify Quality
      </button>
    );
  }
  return (
    <span className="rounded-full border border-[#E5E5E5] bg-white px-4 py-1.5 text-[12px] font-semibold text-[#6B6B6B]">
      {batch.status}
    </span>
  );
};

const RoastBatchesTable = ({
  batches,
  onVerifyQuality,
}: RoastBatchesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">BATCH</TableHead>
          <TableHead className="px-4">PRODUCT</TableHead>
          <TableHead className="px-4">DEGREE</TableHead>
          <TableHead className="px-4">MASS(IN/OUT)</TableHead>
          <TableHead className="px-4">STATUS</TableHead>
          <TableHead className="px-4">DATE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches.map((batch) => (
          <TableRow key={batch.id}>
            <TableCell className="px-4 font-semibold text-[#28293D]">
              {batch.batch}
            </TableCell>
            <TableCell className="px-4 text-[#28293D]">
              {batch.product}
            </TableCell>
            <TableCell className="px-4">
              <DegreeBadge degree={batch.degree} />
            </TableCell>
            <TableCell className="px-4">
              <MissingRate massIn={batch.massIn} massOut={batch.massOut} />
            </TableCell>
            <TableCell className="px-4">
              <StatusCell
                batch={batch}
                onVerify={() => onVerifyQuality(batch)}
              />
            </TableCell>
            <TableCell className="px-4 text-[#6B6B6B]">{batch.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RoastBatchesTable;
