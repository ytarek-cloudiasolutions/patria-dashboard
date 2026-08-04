import { useState, useEffect } from "react";
import type { Offer } from "../types";
import { Switch } from "@/shared/components/ui/switch";
import {
  CalendarDays,
  Megaphone,
  SquarePen,
  Trash2,
  Image as ImageIcon,
  Tag,
  Users,
} from "lucide-react";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface OfferCardProps {
  offer: Offer;
  onStatusChange?: (offerId: string | number, newStatus: boolean) => void;
  onEdit?: (offer: Offer) => void;
  onDelete?: (offerId: string | number) => void;
  onBroadcast?: (offer: Offer) => void;
}

const OfferCard = ({
  offer,
  onStatusChange,
  onEdit,
  onDelete,
  onBroadcast,
}: OfferCardProps) => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(offer.offerStatus);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    setIsActive(offer.offerStatus);
  }, [offer.offerStatus]);

  const handleStatusChange = (newStatus: boolean) => {
    setIsActive(newStatus);
    onStatusChange?.(offer.id, newStatus);
  };

  const handleDelete = () => {
    onDelete?.(offer.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className="relative flex flex-col w-full h-[450px] overflow-hidden rounded-[16px] border border-[#8B8B8B] bg-white [box-shadow:0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)]">
        {/* Banner Image + Status Badge */}
        <div className="relative w-full h-[156px] shrink-0 overflow-hidden rounded-t-[16px]">
          {offer.offerImage ? (
            <img
              src={offer.offerImage}
              alt={offer.offerTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F0EA] flex flex-col items-center justify-center gap-1">
              <ImageIcon className="w-10 h-10 text-[#8B8B8B] opacity-40" />
              <span className="text-[12px] text-[#8B8B8B]">
                {t("No banner image")}
              </span>
            </div>
          )}
          {/* Active Status Badge */}
          <div
            className={`absolute left-[20px] top-[18px] inline-flex items-center justify-center gap-1 rounded-[30px] px-3 py-1 text-[13px] font-semibold tracking-[0.26px] outline-1 outline-offset-[-1px] ${
              isActive
                ? "bg-[#E2F4ED] text-[#059B5A] outline-[#059B5A]"
                : "bg-[#DCDCDC] text-[#23252A] outline-[#8B8B8B]"
            }`}
          >
            {isActive ? t("Active") : t("Inactive")}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-1 flex-col justify-between px-[20px] py-[24px] bg-white overflow-hidden rounded-b-[16px]">
          {/* Title & Description + Discount Badge */}
          <div className="flex w-full items-start justify-between gap-[10px]">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h3 className="text-[20px] font-bold text-[#333333] leading-[21.4px] tracking-[0.40px] truncate">
                {offer.offerTitle}
              </h3>
              <p className="text-[13px] font-normal text-[#8B8B8B] leading-[18.2px] tracking-[0.26px] line-clamp-2">
                {offer.offerDescription}
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-center rounded-[5px] bg-[#F5F0EA] p-2">
              <span className="text-[12px] font-bold tracking-[0.24px] text-[#333333] whitespace-nowrap">
                {offer.discountType === "percentage"
                  ? `${offer.offerPercentage}% OFF`
                  : `${offer.offerPercentage} EGP OFF`}
              </span>
            </div>
          </div>

          {/* Valid Period Box */}
          <div className="flex w-full items-center gap-[8px] rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF7] p-2 overflow-hidden outline-1 outline-[#E5E5E5] -outline-offset-1">
            <div className="flex size-6 items-center justify-center shrink-0">
              <CalendarDays className="size-6 text-black" />
            </div>
            <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
              <span className="text-[13px] font-normal tracking-[0.26px] text-[#333333]">
                {t("Valid Period")}
              </span>
              <span className="text-[16px] font-semibold tracking-[0.32px] text-[#28293D] truncate">
                {offer.offerValidPeriod}
              </span>
            </div>
          </div>

          {/* Product Count Box */}
          <div className="flex w-full items-center gap-[8px] rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF7] p-2 outline-1 outline-[#E5E5E5] -outline-offset-1">
            <span className="text-[12px] font-normal tracking-[0.24px] text-[#8B8B8B]">
              {t("Applies to")} {offer.numberOfProducts ?? 0} {t("product(s)")}
            </span>
          </div>

          {/* Code & Claims Row */}
          <div className="flex w-full items-center justify-between">
            {/* Code */}
            <div className="flex items-center gap-[2px]">
              <Tag className="size-4 text-black shrink-0" />
              <span className="text-[12px] font-semibold tracking-[0.24px] text-black">
                {t("Code:")}
              </span>
              <span className="text-[12px] font-semibold tracking-[0.24px] text-[#8F6900] ml-1">
                {offer.code || "—"}
              </span>
            </div>

            {/* Claims */}
            <div className="flex items-center gap-[2px]">
              <Users className="size-4 text-black shrink-0" />
              <span className="text-[12px] font-semibold tracking-[0.24px] text-black">
                {t("Claims:")}
              </span>
              <span className="text-[12px] font-semibold tracking-[0.24px] text-[#8F6900] ml-1">
                {offer.claimsCount ?? 0}
              </span>
            </div>
          </div>

          {/* Separator Divider */}
          <div className="w-full h-px bg-[#CACBD4]" />

          {/* Footer Actions */}
          <div className="flex w-full items-center justify-between">
            {/* Left: Active Label & Switch */}
            <div className="flex items-center gap-[12px]">
              <span className="text-[13px] font-medium tracking-[0.26px] text-[#333333]">
                {t("Active")}
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={handleStatusChange}
                className="data-[state=checked]:bg-[#8F6900] ring-[#624F1C1A]"
              />
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-[12px]">
              {isActive && (
                <button
                  type="button"
                  onClick={() => onBroadcast?.(offer)}
                  className="flex items-center gap-[4px] rounded-[5px] bg-[#EDEDFF] p-2 text-[10px] font-semibold text-[#6A68FF] hover:bg-[#E0E0FF] transition-colors cursor-pointer"
                >
                  <Megaphone className="size-[18px] text-[#6A68FF]" />
                  <span>{t("Mass Broadcast")}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onEdit?.(offer)}
                title={t("Edit Offer")}
                className="cursor-pointer text-black hover:text-[#8F6900] transition-colors"
              >
                <SquarePen className="size-[18px]" />
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                title={t("Delete Offer")}
                className="cursor-pointer text-[#C90000] hover:text-[#A00000] transition-colors"
              >
                <Trash2 className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        data={{ item: offer.offerTitle, type: "offer" }}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default OfferCard;
