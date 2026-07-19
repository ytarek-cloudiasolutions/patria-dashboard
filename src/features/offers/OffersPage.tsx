import { useEffect, useRef, useState } from "react";
import { Plus, Tag } from "lucide-react";
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
    loading,
    getOffersList,
    createNewOffer,
    updateOfferInfo,
    deleteOfferInfo,
    toggleOffer,
  } = useOffers();

  const [offersLoaded, setOffersLoaded] = useState(false);
  const offersStarted = useRef(loading.fetch);

  useEffect(() => {
    if (loading.fetch) {
      offersStarted.current = true;
    } else if (offersStarted.current) {
      setOffersLoaded(true);
    }
  }, [loading.fetch]);

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

  const handleSaveOffer = (newOffer: Offer, imageFile?: File) => {
    const buildPayload = (withImage: boolean) => ({
      name: newOffer.offerTitle,
      description: newOffer.offerDescription,
      discountType: newOffer.discountType,
      discountValue: newOffer.offerPercentage,
      startDate: newOffer.startDate ? new Date(newOffer.startDate).toISOString() : new Date().toISOString(),
      endDate: newOffer.endDate ? new Date(newOffer.endDate).toISOString() : new Date().toISOString(),
      status: newOffer.offerStatus ? "active" : "inactive",
      productIds: newOffer.productIds ?? [],
      ...(withImage ? {} : { image: newOffer.offerImage?.startsWith("blob:") ? undefined : newOffer.offerImage }),
      code: newOffer.code || "",
      usageLimit: newOffer.usageLimit ?? 0,
      minOrderAmount: newOffer.minOrderAmount ?? 0,
    });

    if (imageFile) {
      const fd = new FormData();
      const plain = buildPayload(true);
      Object.entries(plain).forEach(([k, v]) => {
        if (v === undefined) return;
        // FormData can't carry a real array — JSON-stringify it, matching
        // offerController.parseFormJsonFields on the backend, which parses
        // it back. Was previously skipped entirely, so productIds always
        // saved empty whenever a banner image was attached.
        if (Array.isArray(v)) {
          fd.append(k, JSON.stringify(v));
          return;
        }
        fd.append(k, String(v));
      });
      fd.append("bannerImage", imageFile);
      if (editingOffer) { updateOfferInfo(String(editingOffer.id), fd as any); }
      else { createNewOffer(fd as any); }
    } else {
      const payload = buildPayload(false);
      if (editingOffer) { updateOfferInfo(String(editingOffer.id), payload); }
      else { createNewOffer(payload); }
    }
    setIsDialogOpen(false);
    setEditingOffer(undefined);
  };

  const isLoading = !offersLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Tag className="size-16 animate-spin text-primary" />
      </div>
    );
  }

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
