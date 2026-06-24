import { Plus } from "lucide-react";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import type { Offer } from "./types";
import { useState } from "react";
import OffersOverView from "./components/OffersOverView";
import CreateOfferDialog from "./components/CreateOfferDialog";
import DefaultButton from "@/shared/components/DefaultButton";
import HeaderLayout from "@/layouts/HeaderLayout";
import { MOCK_OFFERS } from "./data";
import WhatsAppBroadcastDialog from "./components/WhatsAppBroadcastDialog";
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
        <div className="flex flex-wrap gap-4">
          <DefaultButton
            data={{
              buttonText: t("WhatsApp Broadcast"),
              onClick: handleOpenGlobalBroadcast,
              icon: <img src={WhatsAppIcon} alt="" className="size-4.5" />,
              className:
                "bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A]",
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

      <WhatsAppBroadcastDialog
        isOpen={isBroadcastDialogOpen}
        onOpenChange={setIsBroadcastDialogOpen}
        offer={broadcastOffer}
      />
    </>
  );
};

export default OffersPage;
