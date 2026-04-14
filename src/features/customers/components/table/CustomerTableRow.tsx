import { TableCell, TableRow } from "@/shared/components/ui/table";
import CustomerTierBadge from "./CustomerTierBadge";
import CustomerActions from "./CustomerActions";
import type { CustomerTableRowProps } from "../../types";
import clsx from "clsx";
import { AwardIcon } from "lucide-react";

const formatCurrency = (value: number) =>
  value === 0 ? "EGP 0" : `EGP ${value.toFixed(2)}`;

const CustomerTableRow = ({ customer, onEdit }: CustomerTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="align-top">
        <p className="text-[14px] font-semibold text-[#28293D]">
          {customer.name}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <p
            className={clsx(
              "text-[12px] text-[#8B8B8B]",
              !customer.isSubscriber && "uppercase"
            )}
          >
            {customer.nameSubtitle}
          </p>
          {customer.isSubscriber && (
            <span className="flex justify-center items-center gap-0.5 rounded-[30px] border border-[#059B5A] px-3 py-1 text-[11px] font-semibold text-[#059B5A] bg-[#EDF8F0]">
              <AwardIcon size={12} /> SUBSCRIBER
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="align-top">
        <p className="text-[14px] font-semibold text-[#28293D]">
          {customer.email}
        </p>
        <p className="mt-1 text-[12px] text-[#8B8B8B]">
          {customer.phone} · {customer.date}
        </p>
      </TableCell>

      <TableCell className="align-top">
        <CustomerTierBadge tier={customer.tier} label={customer.tierLabel} />
        <p className="flex items-center gap-0.5 mt-3 text-[12px] text-[#8B8B8B]">
          <AwardIcon size={12} /> {customer.points} PTS
        </p>
      </TableCell>

      <TableCell className="align-top ">
        <p className="text-[14px] font-medium text-[#059B5A]">
          {formatCurrency(customer.ltv)}
        </p>
        <p className="mt-1 text-[12px] text-[#8B8B8B]">{customer.ltvLabel}</p>
      </TableCell>
      <TableCell>
        <CustomerActions onEdit={() => onEdit(customer)} />
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableRow;
