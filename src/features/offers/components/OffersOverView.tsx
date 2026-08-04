import type { Offer } from "../types";
import OfferCard from "./OfferCard";

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
