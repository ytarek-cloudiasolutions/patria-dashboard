import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import UploadDropzone from "./UploadDropzone";

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (fileName: string) => void;
}

const ImportDataDialog = ({
  open,
  onOpenChange,
  onUpload,
}: ImportDataDialogProps) => {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (open) setFileName("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-175"
      >
        <div className="flex flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Products")}
            </DialogTitle>
            <p className="mt-1 text-[14px] text-[#8B8B8B]">
              {t("Upload a CSV/Excel file to import the products")}
            </p>
          </div>

          <div className="flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex gap-3 rounded-[12px] bg-[#F4F4F4] p-4">
              <FileText className="mt-0.5 size-5 shrink-0 text-[#595959]" />
              <div>
                <p className="text-[14px] font-semibold text-[#28293D]">
                  {t("Import Instructions")}
                </p>
                <ol className="mt-1 list-decimal space-y-0.5 ps-4 text-[13px] text-[#595959]">
                  <li>{t("Prepare a CSV or Excel file containing the product data.")}</li>
                  <li>
                    {t(
                      "Ensure that at least the Name and Price columns are included.",
                    )}
                  </li>
                  <li>{t("Upload the file here.")}</li>
                </ol>
              </div>
            </div>

            <UploadDropzone
              fileOnly
              onSelect={(file) => setFileName(file.name)}
              title="Click to upload File"
              hint={fileName || "CSV or Excel (.xlsx)"}
              accept=".csv,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
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
                disabled={!fileName}
                onClick={() => {
                  onUpload(fileName);
                  onOpenChange(false);
                }}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white disabled:opacity-50 sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Upload File")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataDialog;
