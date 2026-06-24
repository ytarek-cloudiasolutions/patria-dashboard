import { useCallback, useRef, useState } from "react";
import { Search, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import DefaultButton from "@/shared/components/DefaultButton";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { CUSTOMER_COUNT_OPTIONS, MOCK_CUSTOMERS } from "../data";
import type {
  Customer,
  Offer,
  WhatsAppBroadcastFormData,
  WhatsAppTargetType,
} from "../types";

const TABS: { key: WhatsAppTargetType; label: string }[] = [
  { key: "random", label: "Random Number" },
  { key: "select", label: "Select Customer" },
];

const INITIAL_FORM: WhatsAppBroadcastFormData = {
  targetType: "random",
  customerCount: null,
  customNumber: "",
  selectedCustomerIds: [],
  image: null,
  body: "",
};

interface WhatsAppBroadcastDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  offer?: Offer;
  onSend?: (data: WhatsAppBroadcastFormData) => void;
}

const WhatsAppBroadcastDialog = ({
  isOpen,
  onOpenChange,
  offer,
  onSend,
}: WhatsAppBroadcastDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<WhatsAppBroadcastFormData>(INITIAL_FORM);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTab = form.targetType;

  // Reset form when dialog opens
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setForm({
          ...INITIAL_FORM,
          body: offer?.offerDescription ?? "",
        });
        setSearchQuery("");
        setImagePreview(null);
      }
      onOpenChange(open);
    },
    [offer, onOpenChange],
  );

  const setTab = (tab: WhatsAppTargetType) => {
    setForm((prev) => ({ ...prev, targetType: tab }));
  };

  const setCustomerCount = (value: number | "all") => {
    setForm((prev) => ({
      ...prev,
      customerCount: prev.customerCount === value ? null : value,
      customNumber: "",
    }));
  };

  const toggleCustomer = (customerId: number) => {
    setForm((prev) => ({
      ...prev,
      selectedCustomerIds: prev.selectedCustomerIds.includes(customerId)
        ? prev.selectedCustomerIds.filter((id) => id !== customerId)
        : [...prev.selectedCustomerIds, customerId],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filteredCustomers: Customer[] = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );

  const handleSubmit = () => {
    onSend?.(form);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[12px] border border-[#CACBD4] bg-white p-0 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] ring-0 sm:max-w-[696px]"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Title */}
          <div className="px-6 pt-6">
            <DialogTitle className="text-[24px] font-normal tracking-[0.02em] text-black">
              {t("Send a WhatsApp message to customers")}
            </DialogTitle>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-8">
              {/* Tab bar */}
              <div className="flex items-center gap-1.5">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setTab(tab.key)}
                    className={`flex-1 cursor-pointer rounded-none border-b-2 px-3 py-3 text-center text-[16px] font-medium leading-6 tracking-[-0.01em] transition-colors ${
                      activeTab === tab.key
                        ? "border-[#8F6900] text-[#333333]"
                        : "border-[#8B8B8B] text-[#8B8B8B]"
                    }`}
                  >
                    {t(tab.label)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === "random" ? (
                <RandomNumberTab
                  form={form}
                  setForm={setForm}
                  onSelectCount={setCustomerCount}
                  t={t}
                />
              ) : (
                <SelectCustomerTab
                  form={form}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filteredCustomers={filteredCustomers}
                  onToggleCustomer={toggleCustomer}
                  t={t}
                />
              )}

              {/* Upload field */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center gap-6 rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[rgba(245,240,234,0.3)] px-6 py-6"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ) : (
                  <Upload className="size-6 text-[#624F1C]" />
                )}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[14px] font-semibold tracking-[0.02em] text-[#333333]">
                    {t("Click to upload image")}
                  </span>
                  <span className="text-[12px] font-normal tracking-[0.02em] text-[#8B8B8B]">
                    {t("PNG, JPG up to 5MB")}
                  </span>
                </div>
              </div>

              {/* Notification Body */}
              <div className="flex flex-col gap-2.5">
                <Label className="text-[13px] font-medium text-black">
                  {t("Notification Body")}{" "}
                  <span className="text-[#595959]">({t("Editable")})</span>
                  <span className="text-white"> *</span>
                </Label>
                <Textarea
                  value={form.body}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, body: e.target.value }))
                  }
                  placeholder={t("e.g. Enjoy 20% off all product today")}
                  className="min-h-[72px] rounded-[8px] border-[#8E8E8E] border-[0.5px] bg-[#FEFEFE] px-3.5 py-3 text-[13px] leading-[1.4em] tracking-[0.02em] text-[#23252A] placeholder:text-[#595959] focus-visible:border-primary focus-visible:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white px-6 pb-6">
            <Separator className="mb-5 bg-[#CACBD4]" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => handleOpenChange(false),
                  className:
                    "w-full sm:w-auto border-[#8F6900] text-[#8F6900] hover:bg-white hover:text-[#8F6900]",
                }}
              />
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#8F6900] px-7.5 text-[16px] font-semibold text-white hover:bg-[#7a5b00] sm:h-14 sm:w-auto"
              >
                {t("Send Message")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ────────────────────────────────── Tab: Random Number ──────────────────────────────── */

interface RandomNumberTabProps {
  form: WhatsAppBroadcastFormData;
  setForm: React.Dispatch<React.SetStateAction<WhatsAppBroadcastFormData>>;
  onSelectCount: (value: number | "all") => void;
  t: (key: string) => string;
}

const RandomNumberTab = ({
  form,
  setForm,
  onSelectCount,
  t,
}: RandomNumberTabProps) => (
  <div className="flex flex-col gap-3">
    <span className="text-[14px] font-medium tracking-[0.02em] text-[#333333]">
      {t("Number of targeted customers")}
    </span>
    <div className="flex flex-wrap items-center gap-x-[7px] gap-y-3">
      {CUSTOMER_COUNT_OPTIONS.map((option) => {
        const isSelected = form.customerCount === option.value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onSelectCount(option.value)}
            className={`cursor-pointer rounded-[5px] border-[1.5px] px-2 py-4 text-[14px] font-medium tracking-[0.02em] transition-all ${
              isSelected
                ? "border-[#8F6900] bg-[#F5F0EA] text-black"
                : "border-[#CACBD4] bg-[#FAFAF7] text-black"
            }`}
          >
            {t(option.label)}
          </button>
        );
      })}
      {/* Custom number input */}
      <Input
        type="number"
        value={form.customNumber}
        onChange={(e) => {
          setForm((prev) => ({
            ...prev,
            customNumber: e.target.value,
            customerCount: null,
          }));
        }}
        placeholder={t("Enter Number")}
        className="h-[47px] w-auto min-w-[120px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-center text-[16px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
      />
    </div>
  </div>
);

/* ────────────────────────────────── Tab: Select Customer ──────────────────────────────── */

interface SelectCustomerTabProps {
  form: WhatsAppBroadcastFormData;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredCustomers: Customer[];
  onToggleCustomer: (id: number) => void;
  t: (key: string) => string;
}

const SelectCustomerTab = ({
  form,
  searchQuery,
  setSearchQuery,
  filteredCustomers,
  onToggleCustomer,
  t,
}: SelectCustomerTabProps) => (
  <div className="flex flex-col gap-3">
    <span className="text-[14px] font-medium tracking-[0.02em] text-[#333333]">
      {t("Select Customers")}
    </span>

    {/* Search */}
    <div className="flex items-center gap-2.5 rounded-[8px] border border-[#CACBD4] bg-white px-3.5 py-3">
      <Search className="size-5 shrink-0 text-[#8B8B8B]" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("Search for customers")}
        className="w-full bg-transparent text-[16px] leading-[1.4em] tracking-[0.02em] text-[#23252A] outline-none placeholder:text-[#8B8B8B]"
      />
    </div>

    {/* Customer list */}
    <div className="max-h-[150px] overflow-y-auto rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
      <div className="flex flex-col gap-1.5 px-0.5 py-2">
        {filteredCustomers.map((customer) => {
          const isChecked = form.selectedCustomerIds.includes(customer.id);
          return (
            <label
              key={customer.id}
              className="flex cursor-pointer items-center gap-3 rounded-md px-0.5 py-1.5 transition-colors hover:bg-[#F0EDE8]"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggleCustomer(customer.id)}
                className="size-5 rounded-[6px] border-[#8F6900] data-[state=checked]:border-[#8F6900] data-[state=checked]:bg-[#8F6900]"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-medium text-[#333333]">
                  {customer.name}
                </span>
                <span className="text-[14px] text-[#8B8B8B]">
                  {customer.phone}
                </span>
              </div>
            </label>
          );
        })}
        {filteredCustomers.length === 0 && (
          <p className="py-2 text-center text-[13px] text-[#8B8B8B]">
            {t("No customers found")}
          </p>
        )}
      </div>
    </div>
  </div>
);

export default WhatsAppBroadcastDialog;
