import { MapPin, Store } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DefaultButton from "@/shared/components/DefaultButton";
import PoStatusBadge from "./PoStatusBadge";
import type { PurchaseOrder } from "../types";

interface PurchasingTableProps {
  orders: PurchaseOrder[];
  onSubmitToSupplier: (order: PurchaseOrder) => void;
  onMakePayment: (order: PurchaseOrder) => void;
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
}: {
  order: PurchaseOrder;
  onSubmitToSupplier: (o: PurchaseOrder) => void;
  onMakePayment: (o: PurchaseOrder) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    <DefaultButton
      data={{
        buttonText: "Submit to Supplier",
        type: "button",
        onClick: () => onSubmitToSupplier(order),
        className:
          "h-9 sm:h-9 px-3 sm:px-3 text-[12px] sm:text-[12px] gap-1 sm:gap-1 bg-[#F5F0EA] text-primary rounded-[16px]",
      }}
    />
    <DefaultButton
      data={{
        buttonText: "Make a payment",
        type: "button",
        onClick: () => onMakePayment(order),
        className:
          "h-9 sm:h-9 px-3 sm:px-3 text-[12px] sm:text-[12px] gap-1 sm:gap-1 rounded-[16px]",
      }}
    />
  </div>
);

const AmountCell = ({ order }: { order: PurchaseOrder }) => {
  const remaining = Math.max(0, order.totalAmount - order.paid);
  return (
    <div>
      <p className="text-[14px] font-semibold text-[#28293D]">
        {formatEgp(order.totalAmount)}
      </p>
      <p className="text-[12px] font-semibold text-[#059B5A]">
        Paid: {order.paid}{" "}
        <span className="text-[#C90000] font-semibold">Remaining: {remaining}</span>
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
}: PurchasingTableProps) => {
  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <PoNumberCell order={order} />
              <PoStatusBadge status={order.status} />
            </div>

            <div className="mb-3 grid grid-cols-1 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  Contact
                </p>
                <ContactCell order={order} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  Destination
                </p>
                <Destination name={order.warehouseName} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  Total Amount
                </p>
                <AmountCell order={order} />
              </div>
            </div>

            <PoActions
              order={order}
              onSubmitToSupplier={onSubmitToSupplier}
              onMakePayment={onMakePayment}
            />
          </div>
        ))}

        {orders.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            No purchase orders found.
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">PO NUMBER</TableHead>
              <TableHead className="px-6 py-4">CONTACT PERSON</TableHead>
              <TableHead className="px-6 py-4">DESTINATION</TableHead>
              <TableHead className="px-6 py-4">TOTAL AMOUNT</TableHead>
              <TableHead className="px-6 py-4">STATUS</TableHead>
              <TableHead className="px-6 py-4">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="px-6 py-4 whitespace-nowrap">
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
                <TableCell className="px-6 py-4">
                  <PoActions
                    order={order}
                    onSubmitToSupplier={onSubmitToSupplier}
                    onMakePayment={onMakePayment}
                  />
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  No purchase orders found.
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
