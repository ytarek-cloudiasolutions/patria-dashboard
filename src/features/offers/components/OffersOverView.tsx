import type { Offer } from "../types";
import OfferCard from "./OfferCard";

interface OffersOverViewProps {
  offers: Offer[];
  onStatusChange?: (offerId: number, newStatus: boolean) => void;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offerId: number) => void;
}

const OffersOverView = ({
  offers,
  onStatusChange,
  onEdit,
  onDelete,
}: OffersOverViewProps) => {
  return (
    <div className="grid grid-cols-3 gap-y-5.5">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default OffersOverView;
