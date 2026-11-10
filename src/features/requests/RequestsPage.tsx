import { useCallback, useEffect, useMemo, useState } from "react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DatePicker from "@/shared/components/DatePicker";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Label } from "@/shared/components/ui/label";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import cashierDiscountsApi from "@/features/offers/api/cashierDiscountsApi";
import { subscribeDiscountEvents } from "@/features/offers/utils/discountSocketBus";
import { mapApprovalRequest } from "./data";
import type { ApprovalRequest, ApprovalStatus, ApprovalStatusFilter } from "./types";

const TH =
  "px-4 py-3 text-[13px] font-semibold text-[#28293D] uppercase tracking-[0.26px] select-none";
const TD = "px-4 py-4 text-[14px]";

const RequestsPage = () => {
  const { t } = useTranslation();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApprovalStatusFilter>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const data = await cashierDiscountsApi.getAllDiscountRequests();
      const mapped = data
        .map(mapApprovalRequest)
        .filter((r): r is ApprovalRequest => r !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRequests(mapped);
    } catch (err) {
      console.error("Failed to fetch discount approval requests:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    // Discount approve/reject/cancel actions emit socket events (see
    // cashierDiscountController.js) — refetch so this history list stays
    // live without the operator needing to reload the page.
    const unsubscribe = subscribeDiscountEvents(() => fetchRequests());
    return unsubscribe;
  }, [fetchRequests]);

  const statusOptions = useMemo(
    () => [
      { label: t("All"), value: "all" },
      { label: t("Pending"), value: "pending" },
      { label: t("Approved"), value: "approved" },
      { label: t("Rejected"), value: "rejected" },
    ],
    [t],
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Filter by status
      if (statusFilter !== "all") {
        if (req.status.toLowerCase() !== statusFilter) {
          return false;
        }
      }

      // Filter by date range if selected
      if (fromDate) {
        const itemDate = new Date(req.date);
        const start = new Date(`${fromDate}T00:00:00`);
        if (!isNaN(itemDate.getTime()) && !isNaN(start.getTime()) && itemDate < start) {
          return false;
        }
      }

      if (toDate) {
        const itemDate = new Date(req.date);
        const end = new Date(`${toDate}T23:59:59`);
        if (!isNaN(itemDate.getTime()) && !isNaN(end.getTime()) && itemDate > end) {
          return false;
        }
      }

      return true;
    });
  }, [requests, statusFilter, fromDate, toDate]);

  const renderStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex h-[26px] w-[94px] items-center justify-center rounded-[30px] border border-[#059B5A] bg-[#E2F4ED] text-[13px] font-semibold tracking-[0.26px] text-[#059B5A]">
            {t("Approved")}
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex h-[26px] w-[94px] items-center justify-center rounded-[30px] border border-[#C7861E] bg-[rgba(254,154,0,0.10)] text-[13px] font-semibold tracking-[0.26px] text-[#C7861E]">
            {t("Pending")}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex h-[26px] w-[94px] items-center justify-center rounded-[30px] border border-[#C90000] bg-[#C90000] text-[13px] font-semibold tracking-[0.26px] text-white">
            {t("Rejected")}
          </span>
        );
    }
  };

  return (
    <div className="w-full animate-in fade-in-50 duration-300">
      {/* Dark overlay when dropdown is open */}
      {isDropdownOpen && (
        <div className="pointer-events-none fixed inset-0 z-60 bg-black/50 transition-opacity animate-in fade-in-0 duration-200" />
      )}

      {/* Page Header */}
      <div className="mb-8">
        <HeaderLayout
          title={t("Approval Requests")}
          description={t("Discount and manager-approval requests sent from POS")}
        />
      </div>

      {/* Filters Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
        {/* From Date */}
        <div className="flex flex-col gap-2.5 min-w-0">
          <Label className="text-[12px] font-medium text-black">
            {t("From")}
          </Label>
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            placeholder="06/06/2026"
            popoverPlacement="bottom-right"
            withBackdrop
            backdropClassName="bg-black/50"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-4.5 text-[16px] font-normal text-black"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col gap-2.5 min-w-0">
          <Label className="text-[12px] font-medium text-black">
            {t("To")}
          </Label>
          <DatePicker
            value={toDate}
            onChange={setToDate}
            placeholder="06/07/2026"
            popoverPlacement="bottom-right"
            withBackdrop
            backdropClassName="bg-black/50"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-4.5 text-[16px] font-normal text-black"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex flex-col gap-2.5 min-w-0">
          <Label className="text-[12px] font-medium text-black">
            {t("Status")}
          </Label>
          <DropdownSelect
            options={statusOptions}
            selected={statusFilter}
            onSelect={(val) => setStatusFilter(val as ApprovalStatusFilter)}
            onOpenChange={setIsDropdownOpen}
            placeholder={t("All")}
            align="start"
            className="h-[50px] rounded-[12px] border-[#E5E5E5] px-4.5 text-[16px] font-normal text-black"
            contentClassName="w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left rtl:text-right">
            <thead className="bg-[#F5F0EA] border-b border-[#CACBD4]">
              <tr className="h-11">
                <th className={cn(TH, "text-start ps-6")}>{t("ORDER ID")}</th>
                <th className={cn(TH, "text-center")}>{t("REQUESTED BY")}</th>
                <th className={cn(TH, "text-center")}>{t("DISCOUNT")}</th>
                <th className={cn(TH, "text-center")}>{t("APPROVED BY")}</th>
                <th className={cn(TH, "text-center")}>{t("STATUS")}</th>
                <th className={cn(TH, "text-center pe-6")}>{t("DATE")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="h-[60px] transition-colors duration-150 hover:bg-[#FAFAF7]/70"
                  >
                    {/* Order ID */}
                    <td className={cn(TD, "text-start ps-6 font-bold text-[#333333] tracking-[0.28px]")}>
                      {req.orderId}
                    </td>

                    {/* Requested By */}
                    <td className={cn(TD, "text-center font-semibold text-[#333333] tracking-[0.28px]")}>
                      {req.requestedBy}
                    </td>

                    {/* Discount */}
                    <td className={cn(TD, "text-center font-semibold text-[#333333] tracking-[0.28px]")}>
                      {req.discount}
                    </td>

                    {/* Approved By */}
                    <td className={cn(TD, "text-center font-medium text-[#595959] tracking-[0.28px]")}>
                      {req.approvedBy}
                    </td>

                    {/* Status Badge */}
                    <td className={cn(TD, "text-center")}>
                      <div className="flex items-center justify-center">
                        {renderStatusBadge(req.status)}
                      </div>
                    </td>

                    {/* Date */}
                    <td className={cn(TD, "text-center pe-6 font-medium text-[#595959] tracking-[0.28px]")}>
                      {req.date ? new Date(req.date).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-[14px] font-medium text-[#8B8B8B]"
                  >
                    {isLoading ? t("Loading...") : t("No approval requests found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
