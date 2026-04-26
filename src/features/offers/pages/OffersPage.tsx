import { Bell, Plus } from "lucide-react";
import type { Offer } from "../types";
import { useState } from "react";
import OffersOverView from "../components/OffersOverView";
import CreateOfferDialog from "../components/CreateOfferDialog";
import DefaultButton from "@/shared/components/DefaultButton";
import HeaderLayout from "@/layouts/HeaderLayout";
import { MOCK_OFFERS } from "../data";
import BroadcastNotificationDialog from "../components/BroadcastNotificationDialog";

const OffersPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>();
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);

  const handleOpenCreateDialog = () => {
    setEditingOffer(undefined);
    setIsDialogOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const handleOpenBroadcastDialog = () => {
    setIsBroadcastDialogOpen(true);
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
        <HeaderLayout
          title="Promotional Offers"
          description="Create and manage discounts for your products"
        />
        <div className="flex gap-4">
          <DefaultButton
            data={{
              buttonText: "Broadcast Notification",
              onClick: handleOpenBroadcastDialog,
              icon: <Bell className="size-4.5" />,
              className: "bg-[#F5F0EA] text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Create Offer",
              onClick: handleOpenCreateDialog,
              icon: <Plus className="size-4.5" />,
            }}
          />
        </div>
      </div>

      {/* OFFERS */}
      <OffersOverView
        offers={offers}
        onStatusChange={handleStatusChange}
        onEdit={handleEditOffer}
        onDelete={handleDeleteOffer}
      />

      {/* CREATE OFFER DIALOG */}
      <CreateOfferDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveOffer={handleSaveOffer}
        editingOffer={editingOffer}
      />

      <BroadcastNotificationDialog
        isOpen={isBroadcastDialogOpen}
        onOpenChange={setIsBroadcastDialogOpen}
      />
    </>
  );
};

export default OffersPage;
