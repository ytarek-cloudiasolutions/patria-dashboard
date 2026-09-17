import type { Offer } from "../types";
import OfferCard from "./OfferCard";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface OffersOverViewProps {
  offers: Offer[];
  onStatusChange?: (offerId: string | number, newStatus: boolean) => void;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offerId: string | number) => void;
  onBroadcast?: (offer: Offer) => void;
}

const OffersOverView = ({
  offers,
  onStatusChange,
  onEdit,
  onDelete,
  onBroadcast,
}: OffersOverViewProps) => {
  const { t } = useTranslation();

  if (offers.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-[16px] border border-[#E5E5E5] bg-white py-16 text-center shadow-xs">
        <p className="text-[16px] font-semibold text-[#333333]">
          {t("No offers or banners found")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3 w-full">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onBroadcast={onBroadcast}
        />
      ))}
    </div>
  );
};

export default OffersOverView;
