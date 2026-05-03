import { FileUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useFileUpload } from "@/shared/hooks/use-file-upload";
import { INITIAL_CATEGORY_FORM } from "../data";
import type { CategoryFormData } from "../types";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: CategoryFormData) => void;
}

const AddCategoryDialog = ({
  open,
  onOpenChange,
  onSave,
}: AddCategoryDialogProps) => {
  const [form, setForm] = useState<CategoryFormData>(INITIAL_CATEGORY_FORM);
  const [showErrors, setShowErrors] = useState(false);

  const [uploadState, uploadActions] = useFileUpload({
    accept: "image/*",
    multiple: false,
    maxFiles: 1,
    onFilesChange: (files) => {
      const first = files[0];
      setForm((previous) => ({ ...previous, imageUrl: first?.preview ?? "" }));
    },
  });

  const uploadedImage = useMemo(
    () => uploadState.files[0]?.preview,
    [uploadState.files]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!open) {
      return;
    }

    setShowErrors(false);
    uploadActions.clearFiles();
    setForm(INITIAL_CATEGORY_FORM);
  }, [open]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const hasErrors = form.name.trim().length === 0;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (hasErrors) {
      setShowErrors(true);
      return;
    }

    onSave(form);
    handleClose();
  };

  const uploadZoneClass = uploadState.isDragging
    ? "border-primary bg-primary/5"
    : "border-[#7A5900] bg-white";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[820px] rounded-[12px] bg-white p-0 ring-0 sm:max-w-174"
      >
        <div className="relative max-h-[90vh] overflow-y-auto p-8">
          <DialogTitle className="mb-10 text-[28px] font-semibold text-[#28293D]">
            Add New Category
          </DialogTitle>

          <div className="space-y-8">
            <div
              className={`flex h-40 cursor-pointer items-center justify-center rounded-[16px] border border-dashed transition-colors [border-width:2px] [border-dasharray:6,4] ${uploadZoneClass}`}
              onDragEnter={uploadActions.handleDragEnter}
              onDragLeave={uploadActions.handleDragLeave}
              onDragOver={uploadActions.handleDragOver}
              onDrop={uploadActions.handleDrop}
              onClick={uploadActions.openFileDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  uploadActions.openFileDialog();
                }
              }}
            >
              {uploadedImage || form.imageUrl ? (
                <div className="relative flex size-full items-center justify-center p-2">
                  <img
                    src={uploadedImage ?? form.imageUrl}
                    alt="Category"
                    className="h-22 w-auto max-w-70 rounded-[8px] object-contain"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 size-7 rounded-full"
                    onClick={(event) => {
                      event.stopPropagation();
                      uploadActions.clearFiles();
                      setForm((previous) => ({ ...previous, imageUrl: "" }));
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <FileUp className="mb-6 size-6 text-[#000000]" />
                  <p className="mb-1 text-[16px] font-semibold text-[#333333]">
                    Click to upload image
                  </p>
                  <p className="text-[14px] text-[#8B8B8B]">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}

              <input
                {...uploadActions.getInputProps({ className: "hidden" })}
              />
            </div>

            <div>
              <p className="mb-3 text-[18px] font-medium text-[#000000]">
                Category Name <span className="text-[#C90000]">*</span>
              </p>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Speciality Coffee"
                className={`h-14 rounded-[12px] px-4 text-[16px] placeholder:text-[#8B8B8B] ${
                  showErrors && hasErrors
                    ? "border-[#C90000]"
                    : "border-[#E5E5E5]"
                }`}
              />
            </div>

            {showErrors && hasErrors ? (
              <p className="text-[12px] font-medium text-[#C90000]">
                Please enter a category name.
              </p>
            ) : null}
          </div>

          <div className="my-9 border-t border-[#CACBD4]" />

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-14 rounded-[5px] border-primary px-7.5 py-4 text-[16px] text-primary hover:bg-white hover:text-primary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-14 rounded-[5px] px-7.5 py-4 text-[16px]"
              onClick={handleSubmit}
            >
              Add category
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
