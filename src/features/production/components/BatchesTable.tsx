import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { BatchStatus, RoastBatch, RoastingDegree } from "../types";

interface BatchesTableProps {
  batches: RoastBatch[];
  onVerifyQuality: (batch: RoastBatch) => void;
}

const DEGREE_STYLES: Record<RoastingDegree, string> = {
  Light: "bg-[#F5F0EA] text-[#8F6900] border-[#8F6900]",
  Medium: "bg-primary text-primary-foreground border-[#624F1C]",
  Dark: "bg-[#FFF7E6] text-[#C7861E] border-[#C7861E]",
};

const DegreeBadge = ({ degree }: { degree: RoastingDegree }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 rounded-full border px-3 py-0 text-[11px] font-semibold tracking-wide",
        DEGREE_STYLES[degree],
      )}
    >
      {t(degree)}
    </Badge>
  );
};

const STATUS_STYLES: Record<BatchStatus, string> = {
  "Verify Quality": "bg-primary text-primary-foreground",
  "IN-QC": "bg-[#E5E5E5] text-[#23252A] border-[#595959]",
  Released: "bg-[#E2F4ED] text-[#059B5A]",
  Failed: "bg-[#FFF0F0] text-[#C90000]",
};

const MassCell = ({ batch }: { batch: RoastBatch }) => {
  const { t } = useTranslation();
  const loss =
    batch.weightBefore > 0
      ? ((batch.weightBefore - batch.weightAfter) / batch.weightBefore) * 100
      : 0;
  const lossColor = loss < 50 ? "text-[#059B5A]" : "text-[#C90000]";
  return (
    <div>
      <p className="text-[13px] font-medium text-[#28293D]" dir="ltr">
        {batch.weightBefore}Kg + {batch.weightAfter}kg
      </p>
      <p className={cn("text-[12px] font-semibold", lossColor)}>
        {t("Missing")} {loss.toFixed(1)}%
      </p>
    </div>
  );
};

const StatusCell = ({
  batch,
  onVerifyQuality,
}: {
  batch: RoastBatch;
  onVerifyQuality: (b: RoastBatch) => void;
}) => {
  const { t } = useTranslation();
  if (batch.status === "Verify Quality") {
    return (
      <DefaultButton
        data={{
          buttonText: t("Verify Quality"),
          type: "button",
          onClick: () => onVerifyQuality(batch),
          className:
            "h-9 sm:h-9 px-3 sm:px-3 text-[12px] sm:text-[12px] gap-1 sm:gap-1 rounded-[16px]",
        }}
      />
    );
  }
  return (
    <Badge
      className={cn(
        "rounded-full px-8 py-0 text-[12px] font-semibold border border-transparent",
        STATUS_STYLES[batch.status],
      )}
    >
      {t(batch.status)}
    </Badge>
  );
};

const BatchesTable = ({ batches, onVerifyQuality }: BatchesTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#28293D]">
                  {batch.batchNumber}
                </p>
                <p className="text-[12px] text-[#6B6B6B]">{batch.product}</p>
              </div>
              <DegreeBadge degree={batch.degree} />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Mass (in/out)")}
                </p>
                <MassCell batch={batch} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Date")}
                </p>
                <p className="text-[#28293D]" dir="ltr">{batch.date}</p>
              </div>
            </div>

            <StatusCell batch={batch} onVerifyQuality={onVerifyQuality} />
          </div>
        ))}

        {batches.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No batches yet.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("BATCH")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("PRODUCT")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("DEGREE")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("MASS(IN/OUT)")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("STATUS")}</TableHead>
              <TableHead className="pe-6 py-4 text-end">{t("DATE")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#28293D]">
                  {batch.batchNumber}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-[14px] text-[#28293D]">
                  {batch.product}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                  <DegreeBadge degree={batch.degree} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <MassCell batch={batch} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <StatusCell
                    batch={batch}
                    onVerifyQuality={onVerifyQuality}
                  />
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap font-medium text-[13px] text-[#28293D]" dir="ltr">
                  {batch.date}
                </TableCell>
              </TableRow>
            ))}

            {batches.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No batches yet.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default BatchesTable;
