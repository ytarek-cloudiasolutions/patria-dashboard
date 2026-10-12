import { useState } from "react";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Category } from "../../categories/store/categoryTypes";

type ReassignChoice = "move" | "delete";

interface ReassignCategoryDialogProps {
  open: boolean;
  categoryName: string;
  productCount: number;
  /** Every other category the admin can move the products to (the one being deleted is already excluded by the caller). */
  categories: Category[];
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  /** targetCategoryId is omitted when the admin chose to permanently delete the products instead of moving them. */
  onConfirm: (targetCategoryId?: string) => void;
}

// Shown when deleting a category fails because products still use it — lets
// the admin explicitly choose what happens to those products: move them to
// another category they pick themselves, or delete them along with the
// category. Never automatic/silent either way.
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
  const [choice, setChoice] = useState<ReassignChoice>("move");
  const [targetId, setTargetId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reset local state on every close (not via an effect, since setState
  // synchronously inside an effect body triggers an avoidable extra render).
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setChoice("move");
      setTargetId("");
      setIsDropdownOpen(false);
    }
    onOpenChange(next);
  };

  const options = categories.map((c) => ({ value: c.id, label: c.name }));
  const canConfirm = choice === "delete" || !!targetId;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(choice === "move" ? targetId : undefined);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[520px] max-w-[calc(100%-2rem)] gap-0 rounded-[14px] border border-[#CACBD4] bg-white p-7 shadow-2xl sm:max-w-[520px]"
      >
        <DialogHeader className="p-0 text-left mb-5">
          <DialogTitle className="text-[22px] font-semibold text-[#111827] tracking-[0.2px]">
            {t("This category still has products")}
          </DialogTitle>
          <p className="mt-2 text-[15px] font-normal leading-relaxed text-[#595959]">
            {productCount} {t("product(s) still use")} "{categoryName}". {t("Choose what happens to them before the category is deleted.")}
          </p>
        </DialogHeader>

        <RadioGroup
          value={choice}
          onValueChange={(v) => setChoice(v as ReassignChoice)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <RadioGroupItem value="move" className="border-[#8F6900] data-checked:border-[#8F6900] data-checked:bg-[#8F6900]" />
              <span className="text-[15px] font-medium text-[#111827]">
                {t("Move products to another category")}
              </span>
            </label>
            {choice === "move" && (
              <DropdownSelect
                options={options}
                selected={targetId}
                onSelect={setTargetId}
                onOpenChange={setIsDropdownOpen}
                placeholder={t("Select a category")}
                align="start"
                className="h-[50px] w-full rounded-[10px] border border-[#E5E5E5] bg-white p-3 text-[15px] font-normal text-[#23252A] hover:bg-white data-[state=open]:border-[#8F6900] focus:border-[#8F6900] focus-visible:border-[#8F6900] focus-visible:ring-0 transition-colors cursor-pointer ms-[26px] w-[calc(100%-26px)]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <RadioGroupItem value="delete" className="border-[#C90000] data-checked:border-[#C90000] data-checked:bg-[#C90000]" />
              <span className="text-[15px] font-medium text-[#111827]">
                {t("Delete these products permanently")}
              </span>
            </label>
            {choice === "delete" && (
              <p className="ms-[26px] text-[13px] font-normal leading-relaxed text-[#C90000]">
                {t("This cannot be undone — the products and the category will both be permanently deleted.")}
              </p>
            )}
          </div>
        </RadioGroup>

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
              onClick={handleConfirm}
              disabled={!canConfirm || isSubmitting}
              className={`h-[50px] min-w-[150px] px-6 rounded-[5px] text-[16px] font-semibold text-white transition-colors cursor-pointer disabled:opacity-50 ${
                choice === "delete"
                  ? "bg-[#C90000] hover:bg-[#C90000]/90"
                  : "bg-[#8F6900] hover:bg-[#8F6900]/90"
              }`}
            >
              {isSubmitting
                ? choice === "delete" ? t("Deleting...") : t("Moving...")
                : choice === "delete" ? t("Delete Permanently") : t("Move & Delete")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReassignCategoryDialog;
