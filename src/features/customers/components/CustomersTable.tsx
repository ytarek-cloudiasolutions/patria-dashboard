import { SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import ActionButton from "@/shared/components/ActionButton";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import { useTranslation } from "@/shared/i18n/useTranslation";
import TierBadge from "./TierBadge";
import type { Customer } from "../types";

interface CustomersTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onWhatsApp: (customer: Customer) => void;
}

const formatEgp = (value: number) =>
  value === 0
    ? "EGP 0"
    : `EGP ${value.toLocaleString("en-US", {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })}`;

const RoleSubLabel = ({ customer }: { customer: Customer }) => {
  const { t } = useTranslation();
  if (customer.role === "subscriber") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[12px] text-[#8B8B8B]">
          {customer.createdBy ?? customer.name}
        </span>
        <Badge className="h-4.5 px-2 py-0 text-[10px] font-semibold uppercase rounded-full border bg-[#E2F4ED] text-[#059B5A] border-current">
          {t("Subscriber")}
        </Badge>
      </div>
    );
  }
  return (
    <span className="text-[12px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
      {t(customer.role)}
    </span>
  );
};

const CustomerActions = ({
  customer,
  onEdit,
  onDelete,
  onWhatsApp,
}: {
  customer: Customer;
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
  onWhatsApp: (c: Customer) => void;
}) => (
  <div className="flex items-center gap-3 shrink-0">
    <button
      type="button"
      onClick={() => onWhatsApp(customer)}
      aria-label={`Message ${customer.name} on WhatsApp`}
      className="flex cursor-pointer items-center justify-center shrink-0"
    >
      <img src={WhatsAppIcon} alt="" className="size-5 shrink-0" />
    </button>
    <ActionButton
      data={{
        icon: <SquarePen size={16} />,
        iconColor: "text-[#000000]",
        ariaLabel: `Edit ${customer.name}`,
        onClick: () => onEdit(customer),
        className: "shrink-0",
      }}
    />
    <ActionButton
      data={{
        icon: <Trash2 size={16} />,
        iconColor: "text-[#C90000]",
        ariaLabel: `Delete ${customer.name}`,
        onClick: () => onDelete(customer),
        className: "shrink-0",
      }}
    />
  </div>
);

const CustomersTable = ({
  customers,
  onEdit,
  onDelete,
  onWhatsApp,
}: CustomersTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-[#28293D]">
                  {customer.name}
                </p>
                <div className="mt-1">
                  <RoleSubLabel customer={customer} />
                </div>
              </div>
              <CustomerActions
                customer={customer}
                onEdit={onEdit}
                onDelete={onDelete}
                onWhatsApp={onWhatsApp}
              />
            </div>

            <div className="mb-3">
              <p className="text-[13px] text-[#28293D]">{customer.email}</p>
              <p className="text-[12px] text-[#6B6B6B]" dir="ltr">
                {customer.phone}
              </p>
            </div>

            <div className="mb-3">
              <TierBadge tier={customer.tier} />
              <p className="mt-1 text-[12px] text-[#8B8B8B]">
                {customer.loyaltyPoints} {t("PTS")}
              </p>
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#059B5A]">
                {formatEgp(customer.lifetimeValue)}
              </p>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                {customer.segment}
              </p>
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No customers found.")}
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">
                {t("NAME & ROLE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("PEOPLE & DATE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("TIER & POINTS")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("LTV & ORDERS")}
              </TableHead>
              <TableHead className="pe-6 py-4 text-end">
                {t("ACTIONS")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap">
                  <p className="text-[14px] font-semibold text-[#28293D]">
                    {customer.name}
                  </p>
                  <div className="mt-1">
                    <RoleSubLabel customer={customer} />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <p className="text-[13px] text-[#28293D]">{customer.email}</p>
                  <p className="text-[12px] text-[#6B6B6B]">{customer.phone}</p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <TierBadge tier={customer.tier} />
                  <p className="mt-1 text-[12px] text-[#8B8B8B]">
                    {customer.loyaltyPoints} {t("PTS")}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <p className="text-[14px] font-semibold text-[#059B5A]">
                    {formatEgp(customer.lifetimeValue)}
                  </p>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    {t(customer.segment)}
                  </p>
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap shrink-0">
                  <div className="flex items-center justify-end shrink-0">
                    <CustomerActions
                      customer={customer}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onWhatsApp={onWhatsApp}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {customers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No customers found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CustomersTable;
