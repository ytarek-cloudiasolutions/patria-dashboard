import { useEffect, useRef, useState } from "react";
import { Plus, Tag } from "lucide-react";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import OffersOverView from "./components/OffersOverView";
import CreateOfferDialog from "./components/CreateOfferDialog";
import DefaultButton from "@/shared/components/DefaultButton";
import HeaderLayout from "@/layouts/HeaderLayout";
import WhatsAppBroadcastDialog from "./components/WhatsAppBroadcastDialog";
import TabItem from "@/shared/components/TabItem";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useOffers } from "./hooks/useOffers";
import PromotionsOverview from "./components/PromotionsOverview";
import CashierDiscountsSection from "./components/CashierDiscountsSection";
import type { Offer } from "./types";

type OfferFilterTab = "all" | "offers" | "banners";

const OffersPage = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>();
  const [broadcastOffer, setBroadcastOffer] = useState<Offer | undefined>();
  const [filterTab, setFilterTab] = useState<OfferFilterTab>("all");

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
    const isBanner = Boolean(newOffer.isBanner);
    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const startDate = isBanner
      ? now.toISOString()
      : newOffer.startDate
        ? new Date(newOffer.startDate).toISOString()
        : now.toISOString();
    const endDate = isBanner
      ? oneYearLater.toISOString()
      : newOffer.endDate
        ? new Date(newOffer.endDate).toISOString()
        : oneYearLater.toISOString();

    const buildPayload = (withImage: boolean) => ({
      name: newOffer.offerTitle,
      description: newOffer.offerDescription,
      discountType: isBanner ? "percentage" : newOffer.discountType,
      discountValue: isBanner ? 0 : newOffer.offerPercentage,
      startDate,
      endDate,
      status: newOffer.offerStatus ? "active" : "inactive",
      productIds: newOffer.productIds ?? [],
      ...(withImage
        ? {}
        : {
            image: newOffer.offerImage?.startsWith("blob:")
              ? undefined
              : newOffer.offerImage,
          }),
      code: isBanner ? "" : newOffer.code || "",
      usageLimit: isBanner ? 0 : newOffer.usageLimit ?? 0,
      minOrderAmount: isBanner ? 0 : newOffer.minOrderAmount ?? 0,
      isBanner,
      ...(isBanner && newOffer.releaseDate
        ? { releaseDate: new Date(newOffer.releaseDate).toISOString() }
        : {}),
      ...(isBanner && newOffer.productId
        ? { productId: newOffer.productId }
        : {}),
    });

    if (imageFile) {
      const fd = new FormData();
      const plain = buildPayload(true);
      Object.entries(plain).forEach(([k, v]) => {
        if (v === undefined) return;
        // FormData can't carry a real array — JSON-stringify it, matching
        // offerController.parseFormJsonFields on the backend, which parses
        // it back.
        if (Array.isArray(v)) {
          fd.append(k, JSON.stringify(v));
          return;
        }
        fd.append(k, String(v));
      });
      fd.append("bannerImage", imageFile);
      if (editingOffer) {
        updateOfferInfo(String(editingOffer.id), fd as any);
      } else {
        createNewOffer(fd as any);
      }
    } else {
      const payload = buildPayload(false);
      if (editingOffer) {
        updateOfferInfo(String(editingOffer.id), payload);
      } else {
        createNewOffer(payload);
      }
    }
    setIsDialogOpen(false);
    setEditingOffer(undefined);
  };

  const offersCount = offers.filter((o) => !o.isBanner).length;
  const bannersCount = offers.filter((o) => o.isBanner).length;
  const filteredOffers = offers.filter((o) => {
    if (filterTab === "offers") return !o.isBanner;
    if (filterTab === "banners") return o.isBanner;
    return true;
  });

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

      <CashierDiscountsSection />

      <div className="mb-6 grid grid-cols-3 gap-1.5 border-b border-[#E5E5E5]">
        <TabItem
          value="all"
          label={t("All")}
          count={offers.length}
          isActive={filterTab === "all"}
          onClick={(v) => setFilterTab(v as OfferFilterTab)}
        />
        <TabItem
          value="offers"
          label={t("Offers")}
          count={offersCount}
          isActive={filterTab === "offers"}
          onClick={(v) => setFilterTab(v as OfferFilterTab)}
        />
        <TabItem
          value="banners"
          label={t("Banners")}
          count={bannersCount}
          isActive={filterTab === "banners"}
          onClick={(v) => setFilterTab(v as OfferFilterTab)}
        />
      </div>

      <OffersOverView
        offers={filteredOffers}
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
        initialTab={filterTab === "banners" ? "banner" : "offer"}
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
