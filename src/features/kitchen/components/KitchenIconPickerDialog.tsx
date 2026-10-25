import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { KITCHEN_ICONS, type KitchenIconId } from "../icons";
import KitchenIconTile from "./KitchenIconTile";

interface KitchenIconPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: KitchenIconId;
  onSelect: (icon: KitchenIconId) => void;
}

const KitchenIconPickerDialog = ({
  open,
  onOpenChange,
  value,
  onSelect,
}: KitchenIconPickerDialogProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<KitchenIconId>(value);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = KITCHEN_ICONS.filter((option) => {
    if (!normalizedQuery) return true;
    return (
      option.label.toLowerCase().includes(normalizedQuery) ||
      t(option.label).toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[700px]"
      >
        <div className="flex flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[24px]">
              {t("Select kitchen icon")}
            </DialogTitle>
          </div>

          <div className="flex flex-col gap-8 px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex h-12 items-center gap-2.5 rounded-lg bg-white px-3.5 outline outline-1 -outline-offset-1 outline-[#CACBD4]">
              <Search className="size-5 shrink-0 text-[#8B8B8B]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("Search icons...")}
                className="w-full min-w-0 bg-transparent text-base font-normal leading-6 tracking-tight text-black outline-none placeholder:text-[#8B8B8B]"
              />
            </div>

            {filtered.length > 0 ? (
              <div className="flex flex-wrap content-center items-center justify-start gap-4">
                {filtered.map((option) => (
                  <KitchenIconTile
                    key={option.id}
                    option={option}
                    selected={selected === option.id}
                    onClick={() => setSelected(option.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-[#8B8B8B]">
                {t("No icons found.")}
              </p>
            )}
          </div>

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
                type="button"
                onClick={() => {
                  onSelect(selected);
                  onOpenChange(false);
                }}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Select Icon")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KitchenIconPickerDialog;
