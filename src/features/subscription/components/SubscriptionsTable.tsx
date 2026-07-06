import { Box, CalendarDays, SquarePen, Trash2 } from "lucide-react";
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
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { PaymentStatus, Subscription, SubscriptionStatus } from "../types";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onCancel: (subscription: Subscription) => void;
}

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  Paid: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]/40",
  Pending: "bg-[#FFF5DC] text-[#C7861E] border-[#C7861E]",
  Failed: "bg-[#FFF0F0] text-[#C90000] border-[#C90000]/40",
};

const STATUS_STYLES: Record<SubscriptionStatus, string> = {
  Active: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]/40",
  Paused: "bg-[#FFF5DC] text-[#B56C00] border-[#B56C00]/40",
  Cancelled: "bg-[#FFF0F0] text-[#C90000] border-[#C90000]/40",
};

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  Active: "Approved",
  Paused: "Paused",
  Cancelled: "Cancelled",
};

const PlanDetailsCell = ({ subscription }: { subscription: Subscription }) => (
  <div className="flex flex-col gap-1.5">
    <div className="inline-flex items-center gap-2 text-[14px] font-medium text-[#28293D]">
      <Box size={14} className="text-[#000000]" />
      {subscription.quantity}x {subscription.productName}
    </div>
    <div className="flex flex-wrap gap-1.5">
      <Badge className="h-5 rounded-[30px] border border-[#624F1C] bg-[#8F6900] px-2 py-0 text-[10px] font-semibold text-white">
        {subscription.roast}
      </Badge>
      <Badge className="h-5 rounded-[30px] border border-[#624F1C] bg-[#8F6900] px-2 py-0 text-[10px] font-semibold text-white">
        {subscription.grind}
      </Badge>
    </div>
  </div>
);

const NextDeliveryCell = ({ label }: { label: string }) => (
  <Badge className="inline-flex items-center gap-1.5 px-3 py-0.5 text-[12px] text-[#28293D] font-semibold bg-white">
    <CalendarDays size={18} />
    {label}
  </Badge>
);

const PaymentCell = ({ subscription }: { subscription: Subscription }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <Badge
        className={cn(
          "h-6 w-fit rounded-full border px-3 py-0 text-[11px] font-semibold",
          PAYMENT_STYLES[subscription.paymentStatus],
        )}
      >
        {t(subscription.paymentStatus)}
      </Badge>
      <span className="text-[11px] text-[#8B8B8B]" dir="ltr">{subscription.reference}</span>
    </div>
  );
};

const StatusBadgeCell = ({ status }: { status: SubscriptionStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-7 min-w-24 rounded-full border px-3 py-0 text-[12px] font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {t(STATUS_LABEL[status])}
    </Badge>
  );
};

const SubscriptionActions = ({
  subscription,
  onEdit,
  onCancel,
}: {
  subscription: Subscription;
  onEdit: (s: Subscription) => void;
  onCancel: (s: Subscription) => void;
}) => (
  <div className="flex items-center gap-3">
    <ActionButton
      data={{
        icon: <SquarePen size={16} />,
        iconColor: "text-[#000000]",
        ariaLabel: `Edit ${subscription.customerName}'s subscription`,
        onClick: () => onEdit(subscription),
      }}
    />
    <ActionButton
      data={{
        icon: <Trash2 size={16} />,
        iconColor: "text-[#C90000]",
        ariaLabel: `Cancel ${subscription.customerName}'s subscription`,
        onClick: () => onCancel(subscription),
      }}
    />
  </div>
);

const SubscriptionsTable = ({
  subscriptions,
  onEdit,
  onCancel,
}: SubscriptionsTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#28293D]">
                  {subscription.customerName}
                </p>
                <p className="text-[12px] text-[#6B6B6B]">
                  {subscription.customerEmail}
                </p>
              </div>
              <StatusBadgeCell status={subscription.status} />
            </div>

            <div className="mb-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                {t("Plan")}
              </p>
              <PlanDetailsCell subscription={subscription} />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Frequency")}
                </p>
                <p className="text-[#28293D]">{t(subscription.frequency)}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Next Delivery")}
                </p>
                <NextDeliveryCell label={subscription.nextDelivery} />
              </div>
              <div className="col-span-2">
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Payment")}
                </p>
                <PaymentCell subscription={subscription} />
              </div>
            </div>

            <SubscriptionActions
              subscription={subscription}
              onEdit={onEdit}
              onCancel={onCancel}
            />
          </div>
        ))}

        {subscriptions.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No subscriptions yet.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("CUSTOMER")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("PLAN DETAILS")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("FREQUENCY")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("NEXT DELIVERY")}</TableHead>
              <TableHead className="px-6 py-4 text-center">{t("PAYMENT")}</TableHead>
              <TableHead className="px-6 py-4 text-center">{t("STATUS")}</TableHead>
              <TableHead className="pe-6 py-4 text-end">{t("ACTIONS")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap">
                  <p className="text-[14px] font-semibold text-[#28293D]">
                    {subscription.customerName}
                  </p>
                  <p className="text-[12px] text-[#6B6B6B]">
                    {subscription.customerEmail}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <PlanDetailsCell subscription={subscription} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap font-semibold text-[14px] text-[#28293D]">
                  {t(subscription.frequency)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <NextDeliveryCell label={subscription.nextDelivery} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <PaymentCell subscription={subscription} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <StatusBadgeCell status={subscription.status} />
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end">
                    <SubscriptionActions
                      subscription={subscription}
                      onEdit={onEdit}
                      onCancel={onCancel}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {subscriptions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No subscriptions yet.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default SubscriptionsTable;
