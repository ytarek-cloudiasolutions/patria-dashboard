import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import OffersOverView from "./components/OffersOverView";
import CreateOfferDialog from "./components/CreateOfferDialog";
import DefaultButton from "@/shared/components/DefaultButton";
import HeaderLayout from "@/layouts/HeaderLayout";
import WhatsAppBroadcastDialog from "./components/WhatsAppBroadcastDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useOffers } from "./hooks/useOffers";
import PromotionsOverview from "./components/PromotionsOverview";
import type { Offer } from "./types";

const OffersPage = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>();
  const [broadcastOffer, setBroadcastOffer] = useState<Offer | undefined>();

  const {
    offers,
    getOffersList,
    createNewOffer,
    updateOfferInfo,
    deleteOfferInfo,
    toggleOffer,
  } = useOffers();

  useEffect(() => {
    getOffersList();
  }, [getOffersList]);

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

  const handleDeleteOffer = (offerId: string | number) => {
    deleteOfferInfo(String(offerId));
  };

  const handleStatusChange = (offerId: string | number, _newStatus: boolean) => {
    toggleOffer(String(offerId));
  };

  const handleSaveOffer = (newOffer: Offer) => {
    const payload = {
      name: newOffer.offerTitle,
      description: newOffer.offerDescription,
      discountType: newOffer.discountType,
      discountValue: newOffer.offerPercentage,
      startDate: newOffer.startDate ? new Date(newOffer.startDate).toISOString() : new Date().toISOString(),
      endDate: newOffer.endDate ? new Date(newOffer.endDate).toISOString() : new Date().toISOString(),
      status: newOffer.offerStatus ? "active" : "inactive",
      productIds: [],
      image: newOffer.offerImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm64KFO7e0T7oJ8QGv7IrlV2NUf9oMg3Oy3ZSqvSjPj4Dn4ycGy3x5oNA&s=10",
      code: newOffer.offerTitle.toUpperCase().replace(/[^A-Z0-9]/g, "") || "OFFER",
    };

    if (editingOffer) {
      updateOfferInfo(String(editingOffer.id), payload);
    } else {
      createNewOffer(payload);
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

      <PromotionsOverview offers={offers} />

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
