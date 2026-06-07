import { Bell, Plus } from "lucide-react";
import type { Offer } from "./types";
import { useState } from "react";
import OffersOverView from "./components/OffersOverView";
import CreateOfferDialog from "./components/CreateOfferDialog";
import DefaultButton from "@/shared/components/DefaultButton";
import HeaderLayout from "@/layouts/HeaderLayout";
import { MOCK_OFFERS } from "./data";
import BroadcastNotificationDialog from "./components/BroadcastNotificationDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

const OffersPage = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>();
  const [broadcastOffer, setBroadcastOffer] = useState<Offer | undefined>();
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);

  const handleOpenCreateDialog = () => {
    setEditingOffer(undefined);
    setIsDialogOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const handleBroadcast = (offer: Offer) => {
    setBroadcastOffer(offer);
    setIsBroadcastDialogOpen(true);
  };

  const handleOpenGlobalBroadcast = () => {
    setBroadcastOffer(undefined);
    setIsBroadcastDialogOpen(true);
  };

  const handleDeleteOffer = (offerId: number) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
  };

  const handleStatusChange = (offerId: number, newStatus: boolean) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId ? { ...offer, offerStatus: newStatus } : offer
      )
    );
  };

  const handleSaveOffer = (newOffer: Offer) => {
    if (editingOffer) {
      setOffers((prev) =>
        prev.map((offer) => (offer.id === editingOffer.id ? newOffer : offer))
      );
    } else {
      setOffers((prev) => [...prev, newOffer]);
    }
    setIsDialogOpen(false);
    setEditingOffer(undefined);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HeaderLayout
          title={t("Promotional Offers")}
          description={t("Create and manage discounts for your products")}
        />
        <div className="flex flex-wrap gap-3">
          <DefaultButton
            data={{
              buttonText: t("Broadcast Notification"),
              onClick: handleOpenGlobalBroadcast,
              icon: <Bell className="size-4.5" />,
              className: "bg-[#F5F0EA] text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Create Offer"),
              onClick: handleOpenCreateDialog,
              icon: <Plus className="size-4.5" />,
            }}
          />
        </div>
      </div>

      <OffersOverView
        offers={offers}
        onStatusChange={handleStatusChange}
        onEdit={handleEditOffer}
        onDelete={handleDeleteOffer}
        onBroadcast={handleBroadcast}
      />

      <CreateOfferDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSaveOffer={handleSaveOffer}
        editingOffer={editingOffer}
      />

      <BroadcastNotificationDialog
        isOpen={isBroadcastDialogOpen}
        onOpenChange={setIsBroadcastDialogOpen}
        offer={broadcastOffer}
      />
    </>
  );
};

export default OffersPage;
