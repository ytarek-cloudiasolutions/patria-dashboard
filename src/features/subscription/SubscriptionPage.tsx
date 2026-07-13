import { useEffect, useMemo, useState } from "react";
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

import { SUBSCRIPTION_PAYMENT_FILTERS } from "./data";
import { useSubscription } from "./hooks/useSubscription";
import type {
  ManageSubscriptionFormData,
  NewSubscriptionFormData,
  PaymentStatus,
  Subscription,
} from "./types";

const SubscriptionPage = () => {
  const { t } = useTranslation();

  const {
    subscriptions,
    stats,
    users,
    products,
    getSubscriptionsList,
    getSubscriptionStats,
    createNewSubscription,
    updateSubscriptionInfo,
    deleteSubscriptionInfo,
    getUsersList,
    getProductsList,
    runRenewals,
  } = useSubscription();

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [isPaymentFilterOpen, setIsPaymentFilterOpen] = useState(false);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [cancellingSubscription, setCancellingSubscription] =
    useState<Subscription | null>(null);

  // Fetch lists and stats on mount
  useEffect(() => {
    getSubscriptionsList();
    getSubscriptionStats();
    getUsersList();
    getProductsList();
  }, [getSubscriptionsList, getSubscriptionStats, getUsersList, getProductsList]);

  const estimatedMrr = useMemo(() => {
    const sum = subscriptions
      .filter((s: Subscription) => s.status === "Active")
      .reduce((total: number, s: Subscription) => {
        const unitPrice = s.price || 0;
        const qty = s.quantity || 1;
        const freq = (s.frequency || "").toLowerCase();
        let monthly = 0;
        if (freq === "weekly") {
          monthly = (unitPrice * qty * 52) / 12;
        } else if (freq === "bi-weekly" || freq === "biweekly") {
          monthly = (unitPrice * qty * 26) / 12;
        } else if (freq === "monthly") {
          monthly = unitPrice * qty;
        } else {
          monthly = unitPrice * qty * 4;
        }
        return total + monthly;
      }, 0);
    return `EGP ${Math.round(sum).toLocaleString()}`;
  }, [subscriptions]);

  const overview = useMemo(
    () => ({
      activeSubscribers: stats.active ?? subscriptions.filter((s: Subscription) => s.status === "Active").length,
      estimatedMrr,
      upcomingDeliveries: subscriptions.filter((s: Subscription) => s.status === "Active").length,
    }),
    [stats, subscriptions, estimatedMrr],
  );

  const filteredSubscriptions = useMemo(() => {
    const q = search.toLowerCase().trim();
    return subscriptions.filter((subscription: Subscription) => {
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
    createNewSubscription({
      customerId: data.customerId,
      productId: data.productId,
      frequency: data.frequency.toLowerCase(),
      quantity: Number(data.quantity) || 1,
      nextDeliveryDate: new Date(data.firstDelivery).toISOString(),
      status: "active",
      startDate: new Date().toISOString(),
    });
  };

  const handleUpdateSubscription = (
    id: string | number,
    data: ManageSubscriptionFormData,
  ) => {
    if (!editingSubscription) return;
    updateSubscriptionInfo(String(id), {
      customerId: editingSubscription.customerId,
      productId: editingSubscription.productId,
      status: data.status.toLowerCase(),
      frequency: data.frequency.toLowerCase(),
      quantity: Number(data.quantity) || 1,
      nextDeliveryDate: data.nextDelivery ? new Date(data.nextDelivery).toISOString() : undefined,
    });
  };

  const handleCancelSubscription = (id: string | number) => {
    deleteSubscriptionInfo(String(id));
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
              onClick: runRenewals,
              className:
                "border-[#E5E5E5] bg-[#FBF6EC] text-primary hover:bg-[#FBF6EC] hover:text-primary",
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
        users={users}
        products={products}
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
