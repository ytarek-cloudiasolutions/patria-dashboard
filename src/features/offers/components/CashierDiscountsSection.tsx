import { useEffect, useState } from "react";
import { Zap, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import cashierDiscountsApi, {
  type CashierDiscountItem,
} from "../api/cashierDiscountsApi";

export interface CashierDiscount {
  id: string;
  name: string;
  value: number;
  requiresApproval: boolean;
  status: boolean;
}

const INITIAL_DISCOUNTS: CashierDiscount[] = [
  {
    id: "1",
    name: "Employee Discount",
    value: 20,
    requiresApproval: true,
    status: true,
  },
  {
    id: "2",
    name: "CloudiaSolutions",
    value: 30,
    requiresApproval: false,
    status: false,
  },
  {
    id: "3",
    name: "Birthday Discount",
    value: 50,
    requiresApproval: true,
    status: false,
  },
];

const mapApiItemToDiscount = (item: CashierDiscountItem): CashierDiscount => ({
  id: item._id || item.id || Date.now().toString(),
  name: item.name,
  value: item.value,
  requiresApproval: Boolean(item.requiresApproval),
  status: Boolean(item.isActive),
});

const CashierDiscountsSection = () => {
  const { t } = useTranslation();
  const [discounts, setDiscounts] = useState<CashierDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountName, setDiscountName] = useState("");
  const [valuePercent, setValuePercent] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [deletingDiscount, setDeletingDiscount] = useState<CashierDiscount | null>(null);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const data = await cashierDiscountsApi.getCashierDiscounts();
      if (Array.isArray(data)) {
        setDiscounts(data.map(mapApiItemToDiscount));
      }
    } catch (error) {
      console.warn("Failed to fetch cashier discounts from API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleAddDiscount = async () => {
    if (!discountName.trim() || !valuePercent.trim()) return;

    const numericValue = parseFloat(valuePercent.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) return;

    setIsSubmitting(true);
    try {
      const newItem = await cashierDiscountsApi.createCashierDiscount({
        name: discountName.trim(),
        value: numericValue,
        requiresApproval,
      });

      if (newItem) {
        const mapped = mapApiItemToDiscount(newItem);
        setDiscounts((prev) => [mapped, ...prev.filter((d) => d.id !== mapped.id)]);
      } else {
        await fetchDiscounts();
      }

      showSuccessToast(t("Cashier discount created successfully"));
      setDiscountName("");
      setValuePercent("");
      setRequiresApproval(false);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to create cashier discount"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const target = discounts.find((item) => item.id === id);
    if (!target) return;

    const nextStatus = !target.status;
    setDiscounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );

    try {
      await cashierDiscountsApi.updateCashierDiscount(id, { isActive: nextStatus });
      showSuccessToast(t("Discount status updated"));
    } catch (error: any) {
      setDiscounts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: target.status } : item))
      );
      showErrorToast(error?.response?.data?.message || t("Failed to update status"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingDiscount) return;

    const idToDelete = deletingDiscount.id;
    setDeletingDiscount(null);

    try {
      await cashierDiscountsApi.deleteCashierDiscount(idToDelete);
      setDiscounts((prev) => prev.filter((item) => item.id !== idToDelete));
      showSuccessToast(t("Cashier discount deleted successfully"));
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to delete cashier discount"));
    }
  };

  return (
    <div className="w-full rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden my-6">
      {/* Top Header & Form Container */}
      <div className="p-5 sm:p-6 flex flex-col gap-6">
        {/* Header Row with Zap Icon & Description */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="size-[46px] rounded-[8px] bg-[#FE9A00]/10 flex items-center justify-center shrink-0">
            <Zap className="size-[22px] text-[#C7861E] fill-[#C7861E]" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <h3 className="text-[18px] font-semibold text-black font-montserrat tracking-[0.36px]">
              {t("Cashier Discounts (Ready Discounts)")}
            </h3>
            <p className="text-[12px] font-normal text-[#8B8B8B] font-inter leading-[16px]">
              {t(
                'Only the percentages you add here will appear to the cashier as ready-to-use discount buttons—not as a custom value they can type in manually. If "Requires Approval" is enabled, the cashier sends a request to the manager or super admin (via a system notification and WhatsApp), and approval is required before the discount is applied. If disabled, the discount is applied immediately.'
              )}
            </p>
          </div>
        </div>

        {/* Input Form Row */}
        <div className="flex flex-wrap items-end gap-4 sm:gap-6 pt-1">
          {/* Discount Name Input */}
          <div className="flex-1 min-w-[240px] flex flex-col gap-2.5">
            <label className="text-[16px] font-medium font-montserrat text-black">
              {t("Discount Name")}{" "}
              <span className="text-[#C90000]">*</span>
            </label>
            <div className="h-[50px] px-3 bg-white rounded-[12px] border border-[#E5E5E5] flex items-center focus-within:border-[#8F6900] transition-colors">
              <input
                type="text"
                placeholder={t("Full Name")}
                value={discountName}
                onChange={(e) => setDiscountName(e.target.value)}
                className="w-full bg-transparent text-[16px] font-montserrat text-black placeholder:text-[#8B8B8B] outline-none"
              />
            </div>
          </div>

          {/* Value% Input */}
          <div className="w-[116px] shrink-0 flex flex-col gap-2.5">
            <label className="text-[16px] font-medium font-montserrat text-black">
              {t("Value%")}
            </label>
            <div className="h-[50px] px-3 bg-white rounded-[12px] border border-[#E5E5E5] flex items-center focus-within:border-[#8F6900] transition-colors">
              <input
                type="text"
                placeholder={t("e.g. 20")}
                value={valuePercent}
                onChange={(e) => setValuePercent(e.target.value)}
                className="w-full bg-transparent text-[16px] font-montserrat text-black placeholder:text-[#8B8B8B] outline-none"
              />
            </div>
          </div>

          {/* Requires Manager Approval Checkbox */}
          <div className="flex items-center gap-1.5 pb-1 select-none">
            <div
              className={`rounded-[10px] p-1 transition-colors ${
                requiresApproval ? "bg-[#624F1C1A]" : ""
              }`}
            >
              <Checkbox
                id="requires_manager_approval"
                checked={requiresApproval}
                onCheckedChange={(value) => setRequiresApproval(value === true)}
                className="h-5 w-5 rounded-[5.99px] border-[#8F6900] cursor-pointer"
              />
            </div>
            <Label
              htmlFor="requires_manager_approval"
              className="text-[16px] font-medium font-montserrat text-[#333333] cursor-pointer"
            >
              {t("Requires Manager Approval")}
            </Label>
          </div>

          {/* Add Discount Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleAddDiscount}
            className="h-[48px] px-[26px] bg-[#F5F0EA] text-[#8F6900] font-semibold text-[16px] font-montserrat rounded-[5px] cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {t("Add Discount")}
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="h-[44px] bg-[#F5F0EA] px-6 grid grid-cols-12 items-center text-[13px] font-semibold text-[#28293D] font-montserrat uppercase tracking-[0.26px]">
        <div className="col-span-4 text-start">{t("DISCOUNT NAME")}</div>
        <div className="col-span-2 text-center">{t("VALUE")}</div>
        <div className="col-span-3 text-center">{t("REQUIRES APPROVAL")}</div>
        <div className="col-span-2 text-center">{t("STATUS")}</div>
        <div className="col-span-1 text-center">{t("ACTIONS")}</div>
      </div>

      {/* Table Body */}
      <div className="bg-white divide-y divide-[#E5E5E5]/60 min-h-[120px] relative">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center text-[#8B8B8B] gap-2 font-montserrat text-sm">
            <Loader2 className="size-5 animate-spin text-[#8F6900]" />
            <span>{t("Loading cashier discounts...")}</span>
          </div>
        ) : discounts.length === 0 ? (
          <div className="p-8 text-center text-[#8B8B8B] font-montserrat text-sm">
            {t("No cashier discounts added yet.")}
          </div>
        ) : (
          discounts.map((discount) => (
            <div
              key={discount.id}
              className="px-6 py-3.5 grid grid-cols-12 items-center min-h-[58px] hover:bg-neutral-50/50 transition-colors"
            >
              {/* Discount Name */}
              <div className="col-span-4 text-start text-[12px] font-bold font-montserrat text-[#333333] tracking-[0.24px]">
                {discount.name}
              </div>

              {/* Value */}
              <div className="col-span-2 text-center text-[14px] font-semibold font-montserrat text-black tracking-[0.28px]">
                {discount.value}%
              </div>

              {/* Requires Approval Badge */}
              <div className="col-span-3 flex items-center justify-center gap-1.5">
                {discount.requiresApproval ? (
                  <>
                    <CheckCircle2 className="size-[18px] text-[#059B5A]" />
                    <span className="text-[13px] font-semibold font-montserrat text-[#059B5A] tracking-[0.26px]">
                      {t("Yes")}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-[18px] text-[#595959]" />
                    <span className="text-[13px] font-semibold font-montserrat text-[#595959] tracking-[0.26px]">
                      {t("No")}
                    </span>
                  </>
                )}
              </div>

              {/* Status Switch */}
              <div className="col-span-2 flex items-center justify-center">
                <Switch
                  checked={discount.status}
                  onCheckedChange={() => handleToggleStatus(discount.id)}
                  className="data-[state=checked]:bg-[#059B5A] data-[state=unchecked]:bg-[#CACBD4]"
                />
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setDeletingDiscount(discount)}
                  title={t("Delete")}
                  className="p-1 hover:opacity-75 transition-opacity text-[#C90000] cursor-pointer"
                >
                  <Trash2 className="size-[18px]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteDialog
        open={!!deletingDiscount}
        onOpenChange={(open) => !open && setDeletingDiscount(null)}
        data={{ item: deletingDiscount?.name || "", type: "discount" }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CashierDiscountsSection;
