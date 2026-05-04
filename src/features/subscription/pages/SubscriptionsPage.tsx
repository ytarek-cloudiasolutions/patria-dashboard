import { useState, useMemo } from "react";
import {
  Users,
  TrendingUp,
  Clock,
  RefreshCw,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";

import SubscriptionsTable from "../components/SubscriptionsTable";
import NewSubscriptionDialog from "../components/NewSubscriptionDialog";

import CancelSubscriptionDialog from "../components/CancelSubscriptionDialog";
import OverviewCard from "@/shared/components/OverviewCard";
import EditSubscriptionDialog from "../components/EditsubScriptionDialog";
import { subscriptionsData } from "../data";
import type {
  Subscription,
  NewSubscriptionForm,
  EditSubscriptionForm,
} from "../types";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(subscriptionsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("Paid");

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  // Derived stats
  const activeSubscribers = useMemo(
    () => subscriptions.filter((s) => s.status === "Active").length,
    [subscriptions],
  );
  const estimatedMRR = subscriptions.length + 1; // simplified
  const upcomingDeliveries = useMemo(
    () => subscriptions.filter((s) => s.status === "Active").length,
    [subscriptions],
  );

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [subscriptions, searchQuery]);

  const handleNewSubscription = (data: NewSubscriptionForm) => {
    // In a real app, this would call an API
    console.log("New subscription:", data);
  };

  const handleEditSubscription = (id: string, data: EditSubscriptionForm) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: data.status,
              frequency: data.frequency,
              plan: { ...s.plan, quantity: data.quantity },
            }
          : s,
      ),
    );
  };

  const handleCancelSubscription = () => {
    if (!selectedSubscription) return;
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === selectedSubscription.id
          ? { ...s, status: "Cancelled" as const }
          : s,
      ),
    );
    setCancelDialogOpen(false);
    setSelectedSubscription(null);
  };

  const handleEditClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setEditDialogOpen(true);
  };

  const handleCancelClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setCancelDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-8 py-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#28293D]">
            Subscriptions
          </h1>
          <p className="text-[14px] text-[#8B8B8B] mt-1">
            Manage recurring subscriptions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log("Run renewals")}
            className="flex items-center gap-2 px-5 py-3 rounded-[5px] border border-[#5C4A1E] text-[#5C4A1E] text-[14px] font-semibold hover:bg-[#F5F0EA] transition-colors cursor-pointer bg-white"
          >
            <RefreshCw className="size-4" />
            Run Renewals
          </button>
          <button
            onClick={() => setNewDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-[5px] bg-[#5C4A1E] text-white text-[14px] font-semibold hover:bg-[#3d3012] transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            New subscription
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <OverviewCard
          data={{
            title: "Active Subscribers",
            value: activeSubscribers,
            icon: <Users className="size-5" />,
            badgeColor: "bg-[#FFF0E6]",
            iconColor: "text-[#E07B39]",
          }}
        />
        <OverviewCard
          data={{
            title: "Estimated MRR",
            value: estimatedMRR,
            icon: <TrendingUp className="size-5" />,
            badgeColor: "bg-[#E6F4EA]",
            iconColor: "text-[#34A853]",
          }}
        />
        <OverviewCard
          data={{
            title: "Upcoming Deliveries",
            value: upcomingDeliveries,
            icon: <Clock className="size-5" />,
            badgeColor: "bg-[#FFF8E6]",
            iconColor: "text-[#F5A623]",
          }}
        />
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8B8B8B]" />
          <input
            type="text"
            placeholder="Search by Customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
          />
        </div>
        <div className="relative">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-11 pl-4 pr-10 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] appearance-none cursor-pointer focus:outline-none focus:border-[#5C4A1E]"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#8B8B8B]" />
        </div>
      </div>

      {/* Table */}
      <SubscriptionsTable
        subscriptions={filteredSubscriptions}
        onEdit={handleEditClick}
        onCancel={handleCancelClick}
      />

      {/* Dialogs */}
      <NewSubscriptionDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onSubmit={handleNewSubscription}
      />

      <EditSubscriptionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        subscription={selectedSubscription}
        onSubmit={handleEditSubscription}
      />

      <CancelSubscriptionDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        customerName={selectedSubscription?.customer.name ?? ""}
        onConfirm={handleCancelSubscription}
      />
    </div>
  );
};

export default SubscriptionsPage;
