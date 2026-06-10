import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { CUSTOMER_CONTACTS, WHATSAPP_AUDIENCE_PRESETS } from "../data";
import type { WhatsAppMode } from "../types";
import UploadDropzone from "./UploadDropzone";

interface WhatsAppOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (recipientCount: number, message: string) => void;
}

const WhatsAppOfferDialog = ({
  open,
  onOpenChange,
  onSend,
}: WhatsAppOfferDialogProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<WhatsAppMode>("random");
  const [audience, setAudience] = useState<number | "all">(25);
  const [customNumber, setCustomNumber] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setMode("random");
      setAudience(25);
      setCustomNumber("");
      setSearch("");
      setSelectedIds([]);
      setImageUrl(undefined);
      setMessage("");
    }
  }, [open]);

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CUSTOMER_CONTACTS;
    return CUSTOMER_CONTACTS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    );
  }, [search]);

  const toggleContact = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const recipientCount =
    mode === "select"
      ? selectedIds.length
      : audience === "all"
        ? CUSTOMER_CONTACTS.length
        : customNumber
          ? Number(customNumber) || 0
          : audience;

  const tabClass = (active: boolean) =>
    cn(
      "h-11 flex-1 cursor-pointer border-b-2 text-[14px] font-semibold transition-colors",
      active
        ? "border-primary text-[#333333]"
        : "border-[#E5E5E5] font-medium text-[#8B8B8B]",
    );

  const canSend = recipientCount > 0 && message.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        <div className="flex min-w-0 max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-bold text-[#28293D]">
              {t("Send a WhatsApp message to customers")}
            </DialogTitle>
          </div>

          <div className="mt-3 flex px-5 sm:px-7">
            <button
              type="button"
              className={tabClass(mode === "random")}
              onClick={() => setMode("random")}
            >
              {t("Random Number")}
            </button>
            <button
              type="button"
              className={tabClass(mode === "select")}
              onClick={() => setMode("select")}
            >
              {t("Select Customer")}
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {mode === "random" ? (
              <div>
                <p className="mb-2.5 text-[14px] font-semibold text-[#28293D]">
                  {t("Number of targeted customers")}
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {WHATSAPP_AUDIENCE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAudience(preset);
                        setCustomNumber("");
                      }}
                      className={cn(
                        "h-11 cursor-pointer rounded-[8px] border px-2 text-[13px] font-semibold whitespace-nowrap transition-colors",
                        audience === preset && !customNumber
                          ? "border-primary bg-[#FBF6EE] text-primary"
                          : "border-[#E5E5E5] text-[#28293D] hover:border-primary/50",
                      )}
                    >
                      {preset} {t("Customer")}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setAudience("all");
                      setCustomNumber("");
                    }}
                    className={cn(
                      "h-11 cursor-pointer rounded-[8px] border px-2 text-[13px] font-semibold whitespace-nowrap transition-colors",
                      audience === "all" && !customNumber
                        ? "border-primary bg-[#FBF6EE] text-primary"
                        : "border-[#E5E5E5] text-[#28293D] hover:border-primary/50",
                    )}
                  >
                    {t("All Customers")}
                  </button>
                  <Input
                    type="number"
                    min="0"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    placeholder={t("Enter Number")}
                    className="h-11 rounded-[8px] border-[#E5E5E5] px-3 text-[13px] focus-visible:border-primary focus-visible:ring-0"
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2.5 text-[14px] font-semibold text-[#28293D]">
                  {t("Select Customers")}
                </p>
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-[#8B8B8B]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("Search for customers")}
                    className="h-11 w-full rounded-[8px] border border-[#E5E5E5] bg-white ps-9 pe-3 text-[13px] text-[#28293D] outline-none placeholder:text-[#8B8B8B] focus:border-primary/50"
                  />
                </div>
                <div className="max-h-44 space-y-1 overflow-y-auto rounded-[10px] border border-[#E5E5E5] p-2">
                  {filteredContacts.map((contact) => {
                    const id = `wa-contact-${contact.id}`;
                    return (
                      <label
                        key={contact.id}
                        htmlFor={id}
                        className="flex cursor-pointer items-center gap-3 rounded-[8px] px-2 py-2 hover:bg-[#FAFAF7]"
                      >
                        <Checkbox
                          id={id}
                          checked={selectedIds.includes(contact.id)}
                          onCheckedChange={() => toggleContact(contact.id)}
                          className="size-5 rounded-[6px] border-[#8F6900]"
                        />
                        <span className="flex flex-col">
                          <span className="text-[13px] font-medium text-[#28293D]">
                            {contact.name}
                          </span>
                          <span className="text-[11px] text-[#8B8B8B]" dir="ltr">
                            {contact.phone}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  {filteredContacts.length === 0 && (
                    <p className="py-4 text-center text-[13px] text-[#8B8B8B]">
                      {t("No customers found.")}
                    </p>
                  )}
                </div>
              </div>
            )}

            <UploadDropzone
              value={imageUrl}
              onSelect={(_, url) => setImageUrl(url)}
              title="Click to upload image"
              hint="PNG, JPG up to 5MB"
            />

            <div className="flex flex-col">
              <Label
                htmlFor="wa-message"
                className="mb-2 text-[14px] font-semibold text-[#28293D]"
              >
                {t("Notification Body")}{" "}
                <span className="text-[12px] font-normal text-[#8B8B8B]">
                  {t("(Editable)")}
                </span>
                <span className="text-[#C90000]">*</span>
              </Label>
              <Textarea
                id="wa-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("e.g. Enjoy 20% off all product today")}
                className="min-h-20 rounded-xl border-[#E5E5E5] px-4 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
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
                disabled={!canSend}
                onClick={() => {
                  onSend(recipientCount, message.trim());
                  onOpenChange(false);
                }}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white disabled:opacity-50 sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {mode === "select"
                  ? `${t("Send Offer")} (${recipientCount} ${t("Customers")})`
                  : `${t("Send through WhatsApp")} (${recipientCount} ${t("Customers")})`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppOfferDialog;
