import { useState } from "react";
import { Zap, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

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

const CashierDiscountsSection = () => {
  const { t } = useTranslation();
  const [discounts, setDiscounts] = useState<CashierDiscount[]>(INITIAL_DISCOUNTS);
  const [discountName, setDiscountName] = useState("");
  const [valuePercent, setValuePercent] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [deletingDiscount, setDeletingDiscount] = useState<CashierDiscount | null>(null);

  const handleAddDiscount = () => {
    if (!discountName.trim() || !valuePercent.trim()) return;

    const numericValue = parseFloat(valuePercent.replace(/[^0-9.]/g, ""));
    if (isNaN(numericValue)) return;

    const newDiscount: CashierDiscount = {
      id: Date.now().toString(),
      name: discountName.trim(),
      value: numericValue,
      requiresApproval,
      status: true,
    };

    setDiscounts((prev) => [...prev, newDiscount]);
    setDiscountName("");
    setValuePercent("");
    setRequiresApproval(false);
  };

  const handleToggleStatus = (id: string) => {
    setDiscounts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingDiscount) return;
    setDiscounts((prev) => prev.filter((item) => item.id !== deletingDiscount.id));
    setDeletingDiscount(null);
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
            onClick={handleAddDiscount}
            className="h-[48px] px-[26px] bg-[#F5F0EA] text-[#8F6900] font-semibold text-[16px] font-montserrat rounded-[5px] cursor-pointer whitespace-nowrap"
          >
            {t("Add Discount")}
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="h-[44px] bg-[#F5F0EA] px-6 grid grid-cols-12 items-center text-[13px] font-semibold text-[#28293D] font-montserrat uppercase tracking-[0.26px]">
        <div className="col-span-4 text-left">{t("DISCOUNT NAME")}</div>
        <div className="col-span-2 text-center">{t("VALUE")}</div>
        <div className="col-span-3 text-center">{t("REQUIRES APPROVAL")}</div>
        <div className="col-span-2 text-center">{t("STATUS")}</div>
        <div className="col-span-1 text-center">{t("ACTIONS")}</div>
      </div>

      {/* Table Body */}
      <div className="bg-white divide-y divide-[#E5E5E5]/60">
        {discounts.length === 0 ? (
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
              <div className="col-span-4 text-left text-[12px] font-bold font-montserrat text-[#333333] tracking-[0.24px]">
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
