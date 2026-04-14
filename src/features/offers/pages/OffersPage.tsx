import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import type { Offer } from "../types";
import { useState } from "react";
import OffersOverView from "../components/OffersOverView";
import CreateOfferForm from "../components/CreateOfferForm";

const OffersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>();
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 1,
      offerStatus: true,
      offerTitle: "Ramadan Kareem",
      offerDescription: "20% off all orders - celebrate the holy month",
      offerPercentage: 20,
      discountType: "percentage" as const,
      offerValidPeriod: "Mar 1 - Apr 10, 2026",
      numberOfProducts: 2,
    },
    {
      id: 2,
      offerStatus: true,
      offerTitle: "Welcome Offer",
      offerDescription: "15% off your first order - enjoy ERB Roastery",
      offerPercentage: 15,
      discountType: "percentage" as const,
      offerValidPeriod: "Mar 1 - Apr 10, 2026",
      numberOfProducts: 2,
    },
    {
      id: 3,
      offerStatus: true,
      offerTitle: "Weekend Brunch Deal",
      offerDescription:
        "50 EGP off on orders above 350 EGP every Friday & Saturday",
      offerPercentage: 50,
      discountType: "fixed" as const,
      offerValidPeriod: "Mar 1 - Apr 10, 2026",
      numberOfProducts: 2,
    },
    {
      id: 4,
      offerStatus: false,
      offerTitle: "Ramadan Kareem",
      offerDescription: "20% off all orders - celebrate the holy month",
      offerPercentage: 20,
      discountType: "percentage" as const,
      offerValidPeriod: "Mar 1 - Apr 10, 2026",
      numberOfProducts: 2,
    },
  ]);

  const handleOpenCreateDialog = () => {
    setEditingOffer(undefined);
    setIsDialogOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const handleDeleteOffer = (offerId: number) => {
    setOffers(offers.filter((offer) => offer.id !== offerId));
  };

  const handleStatusChange = (offerId: number, newStatus: boolean) => {
    setOffers(
      offers.map((offer) =>
        offer.id === offerId ? { ...offer, offerStatus: newStatus } : offer
      )
    );
  };

  const handleSaveOffer = (newOffer: Offer) => {
    if (editingOffer) {
      // Update existing offer
      setOffers(
        offers.map((offer) => (offer.id === editingOffer.id ? newOffer : offer))
      );
    } else {
      // Add new offer
      setOffers([...offers, newOffer]);
    }
    setIsDialogOpen(false);
    setEditingOffer(undefined);
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-[32px]">Promotional Offers</h1>
          <p className="font-normal text-[16px">
            Create and manage discounts for your products
          </p>
        </div>
        <Button
          onClick={handleOpenCreateDialog}
          className="px-7.5 py-4 h-14 rounded-[5px] font-semibold text-[16px]"
        >
          <Plus />
          Create Offer
        </Button>
      </div>

      {/* OFFERS */}
      <OffersOverView
        offers={offers}
        onStatusChange={handleStatusChange}
        onEdit={handleEditOffer}
        onDelete={handleDeleteOffer}
      />

      {/* CREATE OFFER DIALOG */}
      <CreateOfferForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveOffer={handleSaveOffer}
        editingOffer={editingOffer}
      />
    </>
  );
};

export default OffersPage;
