import { useState } from "react";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Category } from "../../categories/store/categoryTypes";

interface ReassignCategoryDialogProps {
  open: boolean;
  categoryName: string;
  productCount: number;
  /** Every other category the admin can move the products to (the one being deleted is already excluded by the caller). */
  categories: Category[];
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (targetCategoryId: string) => void;
}

// Shown when deleting a category fails because products still use it — lets
// the admin explicitly pick which OTHER category those products move to,
// rather than the backend guessing/auto-assigning one on their behalf.
const ReassignCategoryDialog = ({
  open,
  categoryName,
  productCount,
  categories,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
}: ReassignCategoryDialogProps) => {
  const { t } = useTranslation();
  const [targetId, setTargetId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reset local state on every close (not via an effect, since setState
  // synchronously inside an effect body triggers an avoidable extra render).
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTargetId("");
      setIsDropdownOpen(false);
    }
    onOpenChange(next);
  };

  const options = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[520px] max-w-[calc(100%-2rem)] gap-0 rounded-[14px] border border-[#CACBD4] bg-white p-7 shadow-2xl sm:max-w-[520px]"
      >
        <DialogHeader className="p-0 text-left mb-5">
          <DialogTitle className="text-[22px] font-semibold text-[#111827] tracking-[0.2px]">
            {t("Move products before deleting")}
          </DialogTitle>
          <p className="mt-2 text-[15px] font-normal leading-relaxed text-[#595959]">
            {productCount} {t("product(s) still use")} "{categoryName}". {t("Choose another category to move them to — the category will then be deleted.")}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-medium text-[#111827]">
            {t("Move products to")}
          </label>
          <DropdownSelect
            options={options}
            selected={targetId}
            onSelect={setTargetId}
            onOpenChange={setIsDropdownOpen}
            placeholder={t("Select a category")}
            align="start"
            className="h-[50px] w-full rounded-[10px] border border-[#E5E5E5] bg-white p-3 text-[15px] font-normal text-[#23252A] hover:bg-white data-[state=open]:border-[#8F6900] focus:border-[#8F6900] focus-visible:border-[#8F6900] focus-visible:ring-0 transition-colors cursor-pointer"
          />
        </div>

        <div className="mt-6 w-full border-t border-[#E5E5E5] pt-5">
          <div className="flex items-center justify-end gap-3.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className="h-[50px] min-w-[120px] px-6 rounded-[5px] border border-[#8F6900] bg-white text-[16px] font-semibold text-[#8F6900] hover:bg-[#F5F0EA] transition-colors cursor-pointer disabled:opacity-60"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => targetId && onConfirm(targetId)}
              disabled={!targetId || isSubmitting}
              className="h-[50px] min-w-[150px] px-6 rounded-[5px] bg-[#8F6900] text-[16px] font-semibold text-white hover:bg-[#8F6900]/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? t("Moving...") : t("Move & Delete")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReassignCategoryDialog;
