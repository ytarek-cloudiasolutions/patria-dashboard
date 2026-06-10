import { useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";

import SubscriptionsOverview from "./components/SubscriptionsOverview";
import SubscriptionsTable from "./components/SubscriptionsTable";
import NewSubscriptionDialog from "./components/NewSubscriptionDialog";
import SubscriptionManagementDialog from "./components/SubscriptionManagementDialog";
import CancelSubscriptionDialog from "./components/CancelSubscriptionDialog";

import {
  CUSTOMER_OPTIONS,
  INITIAL_SUBSCRIPTIONS,
  SUBSCRIPTION_PAYMENT_FILTERS,
  SUBSCRIPTION_PRODUCTS,
} from "./data";
import type {
  ManageSubscriptionFormData,
  NewSubscriptionFormData,
  PaymentStatus,
  Subscription,
} from "./types";

const generateReference = () => {
  const random = Math.random().toString(16).slice(2, 6);
  return `#sub-${Date.now()}-${random}`;
};

const formatNextDelivery = (date: string) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const SubscriptionPage = () => {
  const { t } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    INITIAL_SUBSCRIPTIONS,
  );
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isPaymentFilterOpen, setIsPaymentFilterOpen] = useState(false);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [cancellingSubscription, setCancellingSubscription] =
    useState<Subscription | null>(null);

  const overview = useMemo(
    () => ({
      activeSubscribers: subscriptions.filter((s) => s.status === "Active")
        .length,
      estimatedMrr: subscriptions.length,
      upcomingDeliveries: subscriptions.filter((s) => s.status === "Active")
        .length,
    }),
    [subscriptions],
  );

  const filteredSubscriptions = useMemo(() => {
    const q = search.toLowerCase().trim();
    return subscriptions.filter((subscription) => {
      if (
        paymentFilter !== "all" &&
        subscription.paymentStatus !== (paymentFilter as PaymentStatus)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        subscription.customerName.toLowerCase().includes(q) ||
        subscription.customerEmail.toLowerCase().includes(q) ||
        subscription.productName.toLowerCase().includes(q)
      );
    });
  }, [subscriptions, search, paymentFilter]);

  const handleCreateSubscription = (data: NewSubscriptionFormData) => {
    const customer = CUSTOMER_OPTIONS.find((c) => c.id === data.customerId);
    const product = SUBSCRIPTION_PRODUCTS.find(
      (p) => p.id === data.productId,
    );
    if (!customer || !product) return;

    const newSubscription: Subscription = {
      id: Date.now(),
      reference: generateReference(),
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      productId: product.id,
      productName: product.name,
      roast: product.roast,
      grind: product.grind,
      quantity: Number(data.quantity) || 1,
      frequency: data.frequency,
      nextDelivery: formatNextDelivery(data.firstDelivery),
      paymentStatus: "Pending",
      status: "Active",
    };
    setSubscriptions((prev) => [newSubscription, ...prev]);
  };

  const handleUpdateSubscription = (
    id: number,
    data: ManageSubscriptionFormData,
  ) => {
    setSubscriptions((prev) =>
      prev.map((subscription) =>
        subscription.id === id
          ? {
              ...subscription,
              status: data.status,
              frequency: data.frequency,
              quantity: Number(data.quantity) || subscription.quantity,
              nextDelivery: data.nextDelivery
                ? formatNextDelivery(data.nextDelivery)
                : subscription.nextDelivery,
            }
          : subscription,
      ),
    );
  };

  const handleCancelSubscription = (id: number) => {
    setSubscriptions((prev) =>
      prev.map((subscription) =>
        subscription.id === id
          ? { ...subscription, status: "Cancelled" }
          : subscription,
      ),
    );
    setCancellingSubscription(null);
  };

  return (
    <>
      {isPaymentFilterOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Subscription")}
          description={t("Manage recurring subscriptions")}
        />
        <div className="flex flex-wrap gap-3">
          <DefaultButton
            data={{
              buttonText: t("Run Renewls"),
              icon: <RefreshCw className="size-4.5" />,
              variant: "outline",
              onClick: () => {},
              className:
                "border-[#E5E5E5] bg-[#FBF6EC] text-primary hover:bg-[#F5F0EA] hover:text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("New subscription"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsNewOpen(true),
            }}
          />
        </div>
      </div>

      <SubscriptionsOverview
        activeSubscribers={overview.activeSubscribers}
        estimatedMrr={overview.estimatedMrr}
        upcomingDeliveries={overview.upcomingDeliveries}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder={t("Search by Customer name...")}
          />
        </div>
        <div className="sm:w-64">
          <DropdownSelect
            options={SUBSCRIPTION_PAYMENT_FILTERS.map((o) => ({ ...o, label: t(o.label) }))}
            selected={paymentFilter}
            onSelect={setPaymentFilter}
            onOpenChange={setIsPaymentFilterOpen}
            placeholder={t("Payment")}
            align="end"
            className="md:w-full"
            contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>
      </div>

      <SubscriptionsTable
        subscriptions={filteredSubscriptions}
        onEdit={setEditingSubscription}
        onCancel={setCancellingSubscription}
      />

      <NewSubscriptionDialog
        open={isNewOpen}
        onOpenChange={setIsNewOpen}
        onSave={handleCreateSubscription}
      />

      <SubscriptionManagementDialog
        open={!!editingSubscription}
        subscription={editingSubscription}
        onOpenChange={(open) => !open && setEditingSubscription(null)}
        onSave={handleUpdateSubscription}
      />

      <CancelSubscriptionDialog
        open={!!cancellingSubscription}
        subscription={cancellingSubscription}
        onOpenChange={(open) => !open && setCancellingSubscription(null)}
        onConfirm={handleCancelSubscription}
      />
    </>
  );
};

export default SubscriptionPage;
