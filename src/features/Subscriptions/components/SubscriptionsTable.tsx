import { CalendarDays, Package2 } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import ActionButton from "@/shared/components/ActionButton";
import type { Subscription } from "../types";

interface Props {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onCancel: (subscription: Subscription) => void;
}

const PaymentBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Pending: "bg-[#FFF3CD] text-[#856404] border border-[#FFECB5]",
    Paid: "bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]",
    Failed: "bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${colorMap[status] ?? colorMap.Pending}`}
    >
      {status}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Active: "bg-white text-[#5C4A1E] border border-[#5C4A1E]",
    Paused: "bg-white text-[#856404] border border-[#856404]",
    Cancelled: "bg-white text-[#C90000] border border-[#C90000]",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${colorMap[status] ?? colorMap.Active}`}
    >
      {status === "Active" ? "Approved" : status}
    </span>
  );
};

const TagBadge = ({ tag }: { tag: string }) => {
  const isWhole = tag === "Whole Bean";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
        isWhole ? "bg-[#5C4A1E] text-white" : "bg-[#F5F0EA] text-[#5C4A1E]"
      }`}
    >
      {tag}
    </span>
  );
};

const SubscriptionsTable = ({ subscriptions, onEdit, onCancel }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">CUSTOMER</TableHead>
          <TableHead>PLAN DETAILS</TableHead>
          <TableHead>FREQUENCY</TableHead>
          <TableHead>NEXT DELIVERY</TableHead>
          <TableHead>PAYMENT</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((sub) => (
          <TableRow key={sub.id} className="border-b border-[#F0F0F0]">
            <TableCell className="pl-4 py-4">
              <p className="text-[14px] font-semibold text-[#28293D]">
                {sub.customer.name}
              </p>
              <p className="text-[12px] text-[#8B8B8B]">{sub.customer.email}</p>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[13px] text-[#28293D]">
                  <Package2 className="size-3.5 text-[#8B8B8B]" />
                  <span>
                    {sub.plan.quantity}x {sub.plan.productName}
                  </span>
                </div>
                {sub.plan.tags && sub.plan.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {sub.plan.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-[13px] text-[#28293D]">
                {sub.frequency}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-[13px] text-[#28293D]">
                <CalendarDays className="size-3.5 text-[#8B8B8B]" />
                <span>{sub.nextDelivery}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <PaymentBadge status={sub.paymentStatus} />
                <p className="text-[11px] text-[#8B8B8B]">{sub.paymentRef}</p>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={sub.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ActionButton
                  data={{
                    icon: <Pencil className="size-4" />,
                    iconColor: "text-[#5C4A1E] hover:text-[#3d3012]",
                    onClick: () => onEdit(sub),
                  }}
                />
                <ActionButton
                  data={{
                    icon: <Trash2 className="size-4" />,
                    iconColor: "text-[#C90000] hover:text-[#a00000]",
                    onClick: () => onCancel(sub),
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SubscriptionsTable;
