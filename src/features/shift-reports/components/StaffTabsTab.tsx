import { useState, useMemo, useEffect } from "react";
import { Search, Users } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { Button } from "@/shared/components/ui/button";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { api } from "@/config/api";
import { MOCK_STAFF_TAB_USERS } from "../data";
import type { StaffTabUser } from "../types";
import { StaffTabStatementDialog } from "./StaffTabStatementDialog";
import type { ExportPayload } from "./DailyReportTab";

interface StaffTabsTabProps {
  onMenuOpenChange?: (open: boolean) => void;
  onExportDataReady?: (data: ExportPayload) => void;
}

type TabFilter = "all" | "open" | "close";

export const StaffTabsTab = ({
  onMenuOpenChange,
  onExportDataReady,
}: StaffTabsTabProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TabFilter>("all");
  const [users, setUsers] = useState<StaffTabUser[]>(MOCK_STAFF_TAB_USERS);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffTabUser | null>(null);
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  // Fetch accounts from API: https://api.patriacoffeebeans.com/api/pos/employee-accounts
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .get("/pos/employee-accounts")
      .then((res) => {
        if (!isMounted) return;
        const rawAccounts: any[] = res.data?.accounts ?? res.data?.data?.accounts ?? [];
        if (Array.isArray(rawAccounts) && rawAccounts.length > 0) {
          const mappedUsers: StaffTabUser[] = rawAccounts.map((a: any) => {
            const pending = (a.pendingOrders || []).map((o: any) => ({
              id: o._id || o.orderId || String(Math.random()),
              orderNumber: o.orderId
                ? o.orderId.startsWith("#")
                  ? o.orderId
                  : `#${o.orderId}`
                : "#ORD-000000",
              items: o.discountReason?.trim() || "Staff Order",
              date: o.createdAt
                ? new Date(o.createdAt).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })
                : "",
              price: Number(o.total || 0),
              status: "Unpaid" as const,
            }));

            const paidOrders = (a.payBook || []).map((o: any) => ({
              id: o._id || o.orderId || String(Math.random()),
              orderNumber: o.orderId
                ? o.orderId.startsWith("#")
                  ? o.orderId
                  : `#${o.orderId}`
                : "#ORD-000000",
              items: o.discountReason?.trim() || "Staff Order",
              date: o.createdAt
                ? new Date(o.createdAt).toLocaleString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })
                : "",
              price: Number(o.total || 0),
              status: "Paid" as const,
            }));

            const allOrders = [...pending, ...paidOrders];
            const totalPaid = paidOrders.reduce((sum: number, o: any) => sum + o.price, 0);
            const balance = Number(Number(a.totalOwed || 0).toFixed(2));
            const total = Number((totalPaid + balance).toFixed(2));

            return {
              id: a.staffId || String(Math.random()),
              name: a.staffName || "Staff Member",
              totalOrders: allOrders.length,
              unpaidOrders: pending.length,
              total,
              paid: Number(totalPaid.toFixed(2)),
              balance,
              orders: allOrders,
            };
          });

          setUsers(mappedUsers);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch employee accounts:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filterOptions = useMemo(
    () => [
      { label: t("All"), value: "all" },
      { label: t("Open"), value: "open" },
      { label: t("Close"), value: "close" },
    ],
    [t]
  );

  // Filtered users based on search and tab filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase().trim());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "open"
          ? u.balance > 0
          : u.balance === 0;

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  // Total Outstanding Balance
  const totalOutstandingBalance = useMemo(() => {
    return users.reduce((sum, u) => sum + u.balance, 0);
  }, [users]);

  // Export CSV payload sync
  useEffect(() => {
    if (!onExportDataReady) return;
    onExportDataReady({
      title: "Staff_Tabs_Report",
      headers: [
        t("Staff Name"),
        t("Total Orders"),
        t("Unpaid Orders"),
        t("Total (EGP)"),
        t("Paid (EGP)"),
        t("Balance (EGP)"),
      ],
      rows: filteredUsers.map((u) => [
        u.name,
        u.totalOrders,
        u.unpaidOrders,
        u.total.toFixed(2),
        u.paid.toFixed(2),
        u.balance.toFixed(2),
      ]),
    });
  }, [filteredUsers, onExportDataReady, t]);

  const handleOpenStatement = (user: StaffTabUser) => {
    setSelectedUser(user);
    setIsStatementOpen(true);
  };

  const handleUpdateUser = (updatedUser: StaffTabUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setSelectedUser(updatedUser);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Search Bar & Filter Dropdown ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="flex h-[50px] w-full items-center gap-2.5 rounded-[8px] border border-[#CACBD4] bg-white px-3.5 outline-none transition-colors focus-within:border-primary">
            <Search className="size-5 shrink-0 text-[#8B8B8B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search users...")}
              className="w-full text-[16px] text-black placeholder:text-[#8B8B8B] outline-none"
            />
          </div>
        </div>

        {/* Filter Dropdown using project's DropdownSelect */}
        <div className="w-full sm:w-[342px]">
          <DropdownSelect
            options={filterOptions}
            selected={filter}
            onSelect={(val) => setFilter(val as TabFilter)}
            onOpenChange={onMenuOpenChange}
            className="h-[50px] w-full rounded-[12px] border-[#E5E5E5] bg-white text-[16px]"
            contentClassName="w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>
      </div>

      {/* ── Total Outstanding Balance Banner ── */}
      <div className="flex items-center justify-between rounded-[12px] border border-[#CACBD4] bg-[#F5F0EA] px-6 py-4">
        <span className="text-[13px] font-semibold tracking-[0.26px] text-black">
          {t("Total Outstanding Staff Tab Balance")}
        </span>
        <div className="flex items-baseline gap-1.5 text-black">
          <span className="text-[18px] font-medium tracking-[0.36px]">EGP</span>
          <span className="text-[18px] font-bold tracking-[0.36px]">
            {Math.round(totalOutstandingBalance)}
          </span>
        </div>
      </div>

      {/* ── Staff Tab Cards List ── */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#E5E5E5] bg-white py-12 text-center text-[#8B8B8B]">
            <p className="text-[15px] font-medium">{t("Loading...")}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#E5E5E5] bg-white py-12 text-center text-[#8B8B8B]">
            <Users className="size-10 opacity-40 mb-2" />
            <p className="text-[15px] font-medium">{t("No staff tabs found")}</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[16px] border border-[#E5E5E5] bg-white p-4 shadow-xs transition-shadow duration-200 hover:shadow-sm"
            >
              {/* Left: User Icon + Info */}
              <div className="flex items-center gap-2.5">
                <div className="flex size-6 items-center justify-center text-black shrink-0">
                  <Users className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold tracking-[0.28px] text-black">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.20px] text-[#595959]">
                    {user.totalOrders} {t("orders")} · {user.unpaidOrders} {t("unpaid")}
                  </span>
                </div>
              </div>

              {/* Right: Amounts & Statement/Pay Button */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
                {/* Total */}
                <div className="text-[14px] tracking-[0.28px]">
                  <span className="font-medium text-black">{t("Total")}: EGP </span>
                  <span className="font-semibold text-black">
                    {user.total.toFixed(2)}
                  </span>
                </div>

                {/* Paid */}
                <div className="text-[14px] tracking-[0.28px]">
                  <span className="font-medium text-[#059B5A]">{t("Paid")}: EGP </span>
                  <span className="font-semibold text-[#059B5A]">
                    {user.paid.toFixed(2)}
                  </span>
                </div>

                {/* Balance */}
                <div className="text-[14px] tracking-[0.28px]">
                  <span className="font-medium text-[#C90000]">{t("Balance")}: EGP </span>
                  <span className="font-semibold text-[#C90000]">
                    {user.balance.toFixed(2)}
                  </span>
                </div>

                {/* Statement / Pay Button using project Button */}
                <Button
                  type="button"
                  onClick={() => handleOpenStatement(user)}
                  className="h-9 rounded-[5px] bg-primary px-6 text-xs font-semibold text-white transition-all hover:bg-primary/90 active:scale-98 cursor-pointer shrink-0 ml-auto md:ml-0"
                >
                  {t("Statement / Pay")}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Statement / Pay Dialog ── */}
      <StaffTabStatementDialog
        open={isStatementOpen}
        onOpenChange={setIsStatementOpen}
        user={selectedUser}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
};

export default StaffTabsTab;

