import { useEffect, useState } from "react";
import { Camera, ScanBarcode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ScanMode = "manual" | "camera";

interface ScanProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: (barcode: string) => void;
}

const ScanProductDialog = ({
  open,
  onOpenChange,
  onSearch,
}: ScanProductDialogProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ScanMode>("manual");
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    if (open) {
      setMode("manual");
      setBarcode("");
    }
  }, [open]);

  const tabClass = (active: boolean) =>
    cn(
      "flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 text-[13px] font-semibold transition-colors",
      active
        ? "border-primary text-[#333333]"
        : "border-[#E5E5E5] font-medium text-[#8B8B8B]",
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-6 ring-0 sm:max-w-110"
      >
        <DialogTitle className="text-[20px] font-bold text-[#28293D]">
          {t("Add New Product")}
        </DialogTitle>

        <div className="mt-2 flex">
          <button
            type="button"
            className={tabClass(mode === "manual")}
            onClick={() => setMode("manual")}
          >
            <ScanBarcode className="size-4.5" />
            {t("Scan Barcode/Enter manually")}
          </button>
          <button
            type="button"
            className={tabClass(mode === "camera")}
            onClick={() => setMode("camera")}
          >
            <Camera className="size-4.5" />
            {t("Use camera")}
          </button>
        </div>

        {mode === "manual" ? (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder={t("Enter barcode")}
              className="h-12 flex-1 rounded-[8px] border-[#E5E5E5] px-4 text-[14px] focus-visible:border-primary focus-visible:ring-0"
            />
            <Button
              type="button"
              disabled={!barcode.trim()}
              onClick={() => {
                onSearch(barcode.trim());
                onOpenChange(false);
              }}
              className="h-12 rounded-[8px] px-8 text-sm font-semibold text-white disabled:opacity-50"
            >
              {t("Search")}
            </Button>
          </div>
        ) : (
          <div
            className="mt-5 flex h-56 items-center justify-center rounded-[12px] border border-[#E5E5E5]"
            style={{
              backgroundColor: "#F3F3F3",
              backgroundImage:
                "linear-gradient(45deg, #E5E5E5 25%, transparent 25%, transparent 75%, #E5E5E5 75%), linear-gradient(45deg, #E5E5E5 25%, transparent 25%, transparent 75%, #E5E5E5 75%)",
              backgroundSize: "22px 22px",
              backgroundPosition: "0 0, 11px 11px",
            }}
          >
            <div className="flex size-32 items-center justify-center rounded-[12px] border-2 border-white shadow-[0_0_0_2000px_rgba(0,0,0,0.04)]">
              <Camera className="size-8 text-[#8B8B8B]" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScanProductDialog;
