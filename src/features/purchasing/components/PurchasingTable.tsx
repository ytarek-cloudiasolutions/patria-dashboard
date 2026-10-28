import { Store, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import PoStatusBadge from "./PoStatusBadge";
import type { PurchaseOrder } from "../types";

interface PurchasingTableProps {
  orders: PurchaseOrder[];
  onSubmitToSupplier: (order: PurchaseOrder) => void;
  onMakePayment: (order: PurchaseOrder) => void;
  onMarkReceived: (order: PurchaseOrder) => void;
  onCancel: (order: PurchaseOrder) => void;
  onDelete: (order: PurchaseOrder) => void;
}

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

const Destination = ({ name }: { name: string }) => (
  <div className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#7A6518]">
    <Store size={16} />
    {name}
  </div>
);

const PoActions = ({
  order,
  onSubmitToSupplier,
  onMakePayment,
  onMarkReceived,
  onCancel,
  onDelete,
}: {
  order: PurchaseOrder;
  onSubmitToSupplier: (o: PurchaseOrder) => void;
  onMakePayment: (o: PurchaseOrder) => void;
  onMarkReceived: (o: PurchaseOrder) => void;
  onCancel: (o: PurchaseOrder) => void;
  onDelete: (o: PurchaseOrder) => void;
}) => {
  const { t } = useTranslation();
  // Was previously always showing Submit + Make a payment regardless of
  // status — there was also no way at all to mark a PO received or
  // cancel it (both real backend endpoints existed and were unused).
  // A Paid/Canceled order has no status-change actions left, but it still
  // needs the Delete button below — a completed order had no way to be
  // removed at all otherwise.
  const hasStatusActions = order.status !== "Paid" && order.status !== "Canceled";

  return (
    <div className="flex flex-wrap gap-2">
      {hasStatusActions && order.status === "Pending" && (
        <DefaultButton
          data={{
            buttonText: t("Submit to Supplier"),
            type: "button",
            onClick: () => onSubmitToSupplier(order),
            className:
              "h-9 sm:h-9 px-3 sm:px-3 text-[12px] sm:text-[12px] gap-1 sm:gap-1 bg-[#F5F0EA] text-primary rounded-[16px] transition-all duration-150 active:scale-[0.98] hover:opacity-90",
          }}
        />
      )}
      {order.status === "Unpaid" && (
        <>
          <DefaultButton
            data={{
              buttonText: t("Make a payment"),
              type: "button",
              onClick: () => onMakePayment(order),
              className:
                "h-9 sm:h-9 px-3 sm:px-3 text-[12px] sm:text-[12px] gap-1 sm:gap-1 rounded-[16px] transition-all duration-150 active:scale-[0.98] hover:opacity-90",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Mark Received"),
              type: "button",
              onClick: () => onMarkReceived(order),
              className:
                "h-9 sm:h-9 px-3 sm:px-3 text-[12px] sm:text-[12px] gap-1 sm:gap-1 bg-[#E2F4ED] text-[#059B5A] rounded-[16px] transition-all duration-150 active:scale-[0.98] hover:opacity-90",
            }}
          />
        </>
      )}
      {hasStatusActions && (
        <DefaultButton
          data={{
            buttonText: t("Cancel"),
            type: "button",
            onClick: () => onCancel(order),
            className:
              "h-9 sm:h-9 px-3 sm:px-3 text-[12px] sm:text-[12px] gap-1 sm:gap-1 bg-[#FFECEC] text-[#C90000] rounded-[16px] transition-all duration-150 active:scale-[0.98] hover:opacity-90",
          }}
        />
      )}
      <button
        type="button"
        onClick={() => onDelete(order)}
        title={t("Delete")}
        className="group inline-flex h-9 items-center justify-center rounded-[16px] px-2 text-[#C90000] hover:bg-[#FFEBEE] transition-all duration-150 active:scale-90 cursor-pointer"
      >
        <Trash2 className="size-4.5 transition-transform duration-150 group-hover:scale-110" />
      </button>
    </div>
  );
};

const AmountCell = ({ order }: { order: PurchaseOrder }) => {
  const { t } = useTranslation();
  const remaining = Math.max(0, order.totalAmount - order.paid);
  return (
    <div >
      <p className="text-[14px] font-semibold text-[#28293D]">
        {formatEgp(order.totalAmount)}
      </p>
      <p className="text-[12px] font-semibold text-[#059B5A]">
        {t("Paid:")} {order.paid}{" "}
        <span className="text-[#C90000] font-semibold">
          {t("Remaining:")} {remaining}
        </span>
      </p>
    </div>
  );
};

const ContactCell = ({ order }: { order: PurchaseOrder }) => (
  <div>
    <p className="text-[14px] font-medium text-[#28293D]">
      {order.supplierName}
    </p>
    <p className="text-[12px] text-[#6B6B6B]">{order.contactEmail}</p>
  </div>
);

const PoNumberCell = ({ order }: { order: PurchaseOrder }) => (
  <div>
    <p className="text-[14px] font-semibold text-[#28293D]">{order.poNumber}</p>
    <p className="text-[12px] text-[#6B6B6B] capitalize">{order.kind}</p>
  </div>
);

const PurchasingTable = ({
  orders,
  onSubmitToSupplier,
  onMakePayment,
  onMarkReceived,
  onCancel,
  onDelete,
}: PurchasingTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4 transition-all duration-200 hover:shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <PoNumberCell order={order} />
              <PoStatusBadge status={order.status} />
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Contact")}
                </p>
                <ContactCell order={order} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Destination")}
                </p>
                <Destination name={order.warehouseName} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Total Amount")}
                </p>
                <AmountCell order={order} />
              </div>
            </div>

            <PoActions
              order={order}
              onSubmitToSupplier={onSubmitToSupplier}
              onMakePayment={onMakePayment}
              onMarkReceived={onMarkReceived}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          </div>
        ))}

        {orders.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B] animate-in fade-in-50 duration-200">
            {t("No purchase orders found.")}
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">
                {t("PO NUMBER")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("CONTACT PERSON")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("DESTINATION")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("TOTAL AMOUNT")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("STATUS")}
              </TableHead>
              <TableHead className="pe-6 py-4 text-end">
                {t("ACTIONS")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-[#FAFAF8] transition-colors duration-150">
                <TableCell className="ps-6 py-4 whitespace-nowrap">
                  <PoNumberCell order={order} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <ContactCell order={order} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Destination name={order.warehouseName} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <AmountCell order={order} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <PoStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="pe-6 py-4">
                  <div className="flex items-center justify-end">
                    <PoActions
                      order={order}
                      onSubmitToSupplier={onSubmitToSupplier}
                      onMakePayment={onMakePayment}
                      onMarkReceived={onMarkReceived}
                      onCancel={onCancel}
                      onDelete={onDelete}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-[14px] text-[#8B8B8B] animate-in fade-in-50 duration-200"
                >
                  {t("No purchase orders found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PurchasingTable;
