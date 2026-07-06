import { useTranslation } from "@/shared/i18n/useTranslation";
import deliveryMapUrl from "@/assets/images/delivery-map.png";

const StaticMapPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[16px] border border-[#E5E5E5]">
      <img
        src={deliveryMapUrl}
        alt="Delivery tracking map"
        className="h-full w-full object-cover"
      />
      {/* Subtle overlay badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#E5E5E5] bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm">
        <span className="text-[12px] font-medium text-[#595959]">
          {t("Live map coming soon")}
        </span>
      </div>
    </div>
  );
};

export default StaticMapPlaceholder;
