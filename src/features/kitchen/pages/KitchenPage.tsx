import { useNavigate } from "react-router-dom";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";

const KITCHEN_STATIONS = [
  {
    id: "barista",
    name: "Barista",
    description: "Coffee & beverages station",
    color: "#F9A825",
    bg: "#FE9A001A",
  },
  {
    id: "pastry",
    name: "Pastry & Bakery",
    description: "Pastries and baked goods station",
    color: "#A856F7",
    bg: "#F3E9FA",
  },
  {
    id: "hot_food",
    name: "Hot Food",
    description: "Hot meals kitchen station",
    color: "#E53935",
    bg: "#FEECEC",
  },
];

const KitchenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <HeaderLayout
          title={t("Kitchens")}
          description={t("Manage kitchen stations and oversee live operations")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-7.5 xl:grid-cols-3">
        {KITCHEN_STATIONS.map((station) => (
          <button
            key={station.id}
            onClick={() => navigate(`/kitchen/${station.id}`)}
            className="flex flex-col gap-4 rounded-[16px] border border-[#E5E5E5] bg-white p-6 text-start shadow-sm transition hover:shadow-md cursor-pointer"
          >
            <div
              className="flex size-14 items-center justify-center rounded-full text-[22px] font-bold"
              style={{ backgroundColor: station.bg, color: station.color }}
            >
              {station.name[0]}
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#28293D]">
                {t(station.name)}
              </h3>
              <p className="mt-1 text-[13px] text-[#8B8B8B]">
                {t(station.description)}
              </p>
            </div>
            <span
              className="self-start rounded-full px-3 py-1 text-[12px] font-medium"
              style={{ backgroundColor: station.bg, color: station.color }}
            >
              {t("View Orders")}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default KitchenPage;
