import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useState, useEffect } from "react";
import type { Offer } from "../types";
import { Switch } from "@/shared/components/ui/switch";
import { CalendarDays, Megaphone, SquarePen, Trash2, Image as ImageIcon, Tag, Users } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
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
      <Card className="w-full p-0 border border-[#8B8B8B] rounded-[16px] overflow-hidden [box-shadow:0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0px_rgba(0,0,0,0.10)]">
        <div className="relative w-full h-39 border-0 outline-none">
          {offer.offerImage ? (
            <img
              src={offer.offerImage}
              alt={offer.offerTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F5F0EA] flex flex-col items-center justify-center gap-1">
              <ImageIcon className="w-10 h-10 text-[#8B8B8B] opacity-40" />
              <span className="text-[12px] text-[#8B8B8B]">{t("No banner image")}</span>
            </div>
          )}
          <Badge
            className={`absolute top-4.5 left-5 h-6 px-3 rounded-[30px] text-[13px] font-semibold border-current ${
              isActive
                ? "bg-[#E2F4ED] text-[#059B5A]"
                : "bg-[#DCDCDC] text-[#23252A]"
            }`}
          >
            {isActive ? t("Active") : t("Inactive")}
          </Badge>
        </div>

        <div className="pb-6">
          <CardHeader className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-[#333333] text-[20px] font-bold">
                  {offer.offerTitle}
                </CardTitle>
                <CardDescription className="text-[#8B8B8B] text-[13px] font-normal mt-1">
                  {offer.offerDescription}
                </CardDescription>
              </div>

              <Badge className="px-2 h-7.75 rounded-[5px] bg-[#F5F0EA] text-[#333333] text-[12px] font-bold whitespace-nowrap">
                {offer.discountType === "percentage"
                  ? `${offer.offerPercentage}% ${t("OFF")}`
                  : `${offer.offerPercentage} EGP OFF`}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Valid Period box */}
            <Card className="p-2 bg-[#FAFAF7] border border-[#E5E5E5] rounded-[10px]">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-6 text-[#000000]" />
                <div className="flex flex-col">
                  <span className="text-[#333333] text-[13px]">
                    {t("Valid Period")}
                  </span>
                  <span className="text-[#28293D] text-[16px] font-semibold">
                    {offer.offerValidPeriod}
                  </span>
                </div>
              </div>
            </Card>

            {/* "Applies to N product(s)" box */}
            <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAF7] px-2 py-2 text-[13px] text-[#28293D]">
              {t("Applies to")}{" "}
              <span className="font-semibold text-[#333333]">
                {offer.numberOfProducts ?? 0}
              </span>{" "}
              {t("product(s)")}
            </div>

            {/* Code & Claims row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                <Tag className="size-4 text-[#000000]" />
                <span className="text-[12px] text-[#000000] tracking-[0.24px] font-semibold">
                  {t("Code:")}
                </span>
                <span className="text-[12px] text-[#8F6900] tracking-[0.24px] font-semibold ml-0.5">
                  {offer.code || "—"}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Users className="size-4 text-[#000000]" />
                <span className="text-[12px] text-[#000000] tracking-[0.24px] font-semibold">
                  {t("Claims:")}
                </span>
                <span className="text-[12px] text-[#8F6900] tracking-[0.24px] font-semibold ml-0.5">
                  {offer.claimsCount ?? 0}
                </span>
              </div>
            </div>

            <Separator className="bg-[#CACBD4]" />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[#333333] text-[13px] font-semibold uppercase tracking-wider">
                  {t("Active")}
                </span>
                <Switch
                  checked={isActive}
                  onCheckedChange={handleStatusChange}
                  className="data-[state=checked]:bg-primary ring-[#624F1C1A]"
                />
              </div>

              <div className="flex items-center gap-3">
                {isActive && (
                  <DefaultButton
                    data={{
                      buttonText: t("Mass Broadcast"),
                      icon: <Megaphone className="size-4.5" />,
                      onClick: () => onBroadcast?.(offer),
                      className:
                        "h-[34px] px-[12px] gap-[6px] bg-[#EDEDFF] text-[#6A68FF] text-[12px] font-semibold rounded-[5px]",
                    }}
                  />
                )}

                <button
                  onClick={() => onEdit?.(offer)}
                  className="cursor-pointer"
                >
                  <SquarePen className="size-4.5 text-[#000000]" />
                </button>

                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="cursor-pointer"
                >
                  <Trash2 className="size-4.5 text-[#C90000]" />
                </button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

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
