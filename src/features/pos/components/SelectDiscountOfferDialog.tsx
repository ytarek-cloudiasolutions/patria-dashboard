import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/useTranslation";
import cashierDiscountsApi from "@/features/offers/api/cashierDiscountsApi";

export interface DiscountOfferItem {
  id: string;
  name: string;
  value: number;
  requiresApproval: boolean;
  requestedByName?: string;
  requestedByRole?: string;
}

interface SelectDiscountOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOffer: (offer: DiscountOfferItem) => void;
}

const DEFAULT_OFFERS: DiscountOfferItem[] = [
  {
    id: "1",
    name: "Bibliotheca Alexandrina",
    value: 20,
    requiresApproval: true,
  },
  {
    id: "2",
    name: "Cloudia Solutions",
    value: 25,
    requiresApproval: false,
  },
];

const SelectDiscountOfferDialog = ({
  open,
  onOpenChange,
  onSelectOffer,
}: SelectDiscountOfferDialogProps) => {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<DiscountOfferItem[]>(DEFAULT_OFFERS);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedOfferId(null);

    const loadDiscounts = async () => {
      try {
        const data = await cashierDiscountsApi.getCashierDiscounts();
        if (Array.isArray(data)) {
          const activeOnly = data.filter((d) => d.isActive);
          setOffers(
            activeOnly.map((d) => ({
              id: d._id || d.id || Date.now().toString(),
              name: d.name,
              value: d.value,
              requiresApproval: Boolean(d.requiresApproval),
            }))
          );
        }
      } catch (err) {
        console.warn("Failed to fetch active cashier discounts, using defaults", err);
      }
    };

    loadDiscounts();
  }, [open]);

  const selectedOffer = offers.find((o) => o.id === selectedOfferId);

  const handleConfirmSelect = () => {
    if (!selectedOffer) return;
    onSelectOffer(selectedOffer);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="w-[696px] max-w-[calc(100%-2rem)] gap-6 rounded-[12px] border border-[#CACBD4] bg-white p-6 shadow-xl sm:max-w-[696px]">
        <DialogHeader className="p-0">
          <DialogTitle className="text-[24px] font-semibold tracking-[0.48px] text-black">
            {t("Choose a discount offer")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {offers.map((offer) => {
            const isSelected = offer.id === selectedOfferId;
            return (
              <div
                key={offer.id}
                onClick={() => setSelectedOfferId(offer.id)}
                className={`w-full min-h-[50px] p-3 rounded-[12px] flex items-center justify-between gap-3 cursor-pointer transition-all select-none ${
                  isSelected
                    ? "bg-[#F8F8F8] border-[1.25px] border-[#8F6900]"
                    : "bg-white border border-[#E5E5E5]"
                }`}
              >
                <div className="flex items-center gap-2 text-[16px] text-black">
                  <span className="font-semibold">{offer.value}%</span>
                  <span>-</span>
                  <span className="font-normal">{offer.name}</span>
                </div>

                {offer.requiresApproval ? (
                  <span className="px-3 py-1 bg-[#FE9A00]/10 border border-[#C7861E] rounded-full text-[13px] font-semibold text-[#C7861E] tracking-[0.26px] whitespace-nowrap">
                    {t("Requires approval")}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#E2F4ED] border border-[#059B5A] rounded-full text-[13px] font-semibold text-[#059B5A] tracking-[0.26px] whitespace-nowrap">
                    {t("Direct")}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full border-t border-[#CACBD4] pt-4">
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-[56px] px-[30px] rounded-[5px] border border-[#8F6900] text-[#8F6900] font-semibold text-[16px] hover:bg-[#F5F0EA] cursor-pointer"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              disabled={!selectedOfferId}
              onClick={handleConfirmSelect}
              className="h-[56px] px-[30px] rounded-[5px] bg-[#8F6900] text-white font-semibold text-[16px] hover:bg-[#8F6900]/90 cursor-pointer disabled:opacity-50"
            >
              {t("Select Offer")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectDiscountOfferDialog;
