import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import DatePicker from "@/shared/components/DatePicker";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { TRANSACTION_CATEGORY_OPTIONS } from "../data";
import type {
  TransactionCategory,
  TransactionFormData,
  TransactionType,
} from "../types";

const FORM_ID = "add-transaction-form";

const INITIAL_FORM: TransactionFormData = {
  type: "Income",
  statement: "",
  category: "",
  amount: "",
  date: "",
  classifyAsSalary: false,
};

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TransactionFormData) => void;
}

const AddTransactionDialog = ({
  open,
  onOpenChange,
  onSave,
}: AddTransactionDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<TransactionFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setIsCategoryOpen(false);
    }
  }, [open]);

  const set = <K extends keyof TransactionFormData>(
    key: K,
    value: TransactionFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof TransactionFormData, string>> = {};
    if (!form.statement.trim()) next.statement = t("Statement is required");
    if (!form.category) next.category = t("Category is required");
    if (!form.amount.trim() || Number(form.amount) <= 0) {
      next.amount = t("Enter a valid amount");
    }
    if (!form.date) next.date = t("Date is required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onOpenChange(false);
  };

  const isExpense = form.type === "Expense";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-180"
      >
        {isCategoryOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Add a Financial Transaction")}
            </DialogTitle>
          </div>

          {/* Type tabs */}
          <div className="px-5 pt-4 sm:px-7">
            <div className="grid grid-cols-2 gap-1.5">
              <TabItem
                value="Income"
                label={t("Income")}
                isActive={form.type === "Income"}
                onClick={(value) => set("type", value as TransactionType)}
              />
              <TabItem
                value="Expense"
                label={t("Expense")}
                isActive={form.type === "Expense"}
                onClick={(value) => set("type", value as TransactionType)}
              />
            </div>
          </div>

          {/* Body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              <div>
                <InputField
                  data={{
                    id: "statement",
                    label: {
                      htmlFor: "statement",
                      labelText: t("Statement/reason"),
                    },
                    placeholder: t("e.g. Selling old equipment"),
                    required: true,
                    inputProps: {
                      value: form.statement,
                      onChange: (e) => set("statement", e.target.value),
                    },
                  }}
                />
                {errors.statement && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.statement}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:items-end">
                <div className="flex flex-col">
                  <Label
                    htmlFor="category"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Category")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={TRANSACTION_CATEGORY_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                    selected={form.category}
                    onSelect={(value) =>
                      set("category", value as TransactionCategory)
                    }
                    onOpenChange={setIsCategoryOpen}
                    placeholder={t("Select category")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                  {errors.category && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    data={{
                      id: "amount",
                      label: {
                        htmlFor: "amount",
                        labelText: t("Amount (EGP)"),
                      },
                      placeholder: "0.00",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "0",
                        step: "0.01",
                        value: form.amount,
                        onChange: (e) => set("amount", e.target.value),
                      },
                    }}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.amount}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Date")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DatePicker
                    value={form.date}
                    onChange={(date) => set("date", date)}
                    placeholder="DD/MM/YYYY"
                    withBackdrop
                    popoverPlacement="bottom-right"
                  />
                  {errors.date && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.date}
                    </p>
                  )}
                </div>
              </div>

              {isExpense && (
                <label className="flex items-center justify-between rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-3 cursor-pointer">
                  <span className="text-[14px] font-medium text-[#28293D]">
                    {t("Classify as salary")}
                  </span>
                  <Switch
                    checked={form.classifyAsSalary}
                    onCheckedChange={(checked) =>
                      set("classifyAsSalary", checked)
                    }
                    aria-label="Classify as salary"
                  />
                </label>
              )}
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Add Transaction")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
