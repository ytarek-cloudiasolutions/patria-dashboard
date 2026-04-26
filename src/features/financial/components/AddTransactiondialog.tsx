import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import { categoryOptions } from "../data";
import type { NewTransactionForm, TransactionCategory } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewTransactionForm) => void;
}

const defaultForm: NewTransactionForm = {
  type: "income",
  statement: "",
  category: "",
  amount: 0,
  date: "",
  isSalary: false,
};

const AddTransactionDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [form, setForm] = useState<NewTransactionForm>(defaultForm);

  const handleSubmit = () => {
    if (!form.statement || !form.category || !form.amount || !form.date) return;
    onSubmit(form);
    onOpenChange(false);
    setForm(defaultForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-[13px] sm:max-w-174"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#28293D]">
            Add a Financial Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-1">
          {/* Income / Expense Tabs */}
          <div className="grid grid-cols-2 border-b border-[#E5E5E5]">
            {(["income", "expense"] as const).map((t) => (
              <button
                key={t}
                onClick={() =>
                  setForm((f) => ({ ...f, type: t, isSalary: false }))
                }
                className={`py-2.5 text-[14px] font-medium capitalize transition-colors cursor-pointer ${
                  form.type === t
                    ? "border-b-2 border-[#5C4A1E] text-[#5C4A1E]"
                    : "text-[#8B8B8B] hover:text-[#28293D]"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Statement */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#000]">
              Statement/reason <span className="text-[#C90000]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Selling old equipment"
              value={form.statement}
              onChange={(e) =>
                setForm((f) => ({ ...f, statement: e.target.value }))
              }
              className="w-full h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
            />
          </div>

          {/* Category + Amount + Date */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Category <span className="text-[#C90000]">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value as TransactionCategory,
                    }))
                  }
                  className="w-full h-11 px-3 pr-8 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] appearance-none cursor-pointer focus:outline-none focus:border-[#5C4A1E]"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categoryOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8B] text-xs">
                  ▾
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Amount (EGP) <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                min={0}
                value={form.amount || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Date <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
          </div>

          {/* Classify as salary (expense only) */}
          {form.type === "expense" && (
            <div className="flex items-center justify-between bg-[#FAFAFA] rounded-[10px] px-4 py-3 border border-[#E5E5E5]">
              <span className="text-[14px] text-[#28293D]">
                Classify as salary
              </span>
              <button
                onClick={() =>
                  setForm((f) => ({ ...f, isSalary: !f.isSalary }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  form.isSalary ? "bg-[#5C4A1E]" : "bg-[#D1D5DB]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.isSalary ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <DefaultButton
              data={{
                buttonText: "Cancel",
                variant: "outline",
                type: "button",
                onClick: () => onOpenChange(false),
                className:
                  "text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: "Add Transaction",
                type: "button",
                className: "bg-[#5C4A1E] hover:bg-[#3d3012]",
                onClick: handleSubmit,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
