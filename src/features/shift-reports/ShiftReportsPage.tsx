import { useState } from "react";
import { FileUp, BarChart3 } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";

import ShiftReportsTabs from "./components/ShiftReportsTabs";
import DailyReportTab from "./components/DailyReportTab";
import MostSellingTab from "./components/MostSellingTab";
import ShiftReportsTab from "./components/ShiftReportsTab";
import type { ShiftReportsTab as ShiftReportsTabKey } from "./types";

const ShiftReportsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ShiftReportsTabKey>("daily");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <>
      {!hasLoaded && (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <BarChart3 className="size-16 animate-spin text-primary" />
        </div>
      )}

      <div className={!hasLoaded ? "hidden" : ""}>
        {isMenuOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Shift Reports")}
          description={t("Daily, best-selling and shift performance reports")}
        />
        <DefaultButton
          data={{
            buttonText: t("Export CSV"),
            variant: "outline",
            icon: <FileUp className="size-4.5" />,
            className:
              "border-[#7A3FF2] text-[#7A3FF2] hover:bg-[#7A3FF2]/5 hover:text-[#7A3FF2]",
          }}
        />
      </div>

      <ShiftReportsTabs active={tab} onChange={setTab} />

      {tab === "daily" && (
        <DailyReportTab
          onMenuOpenChange={setIsMenuOpen}
          onInitialLoadComplete={() => setHasLoaded(true)}
        />
      )}
      {tab === "most-selling" && (
        <MostSellingTab onMenuOpenChange={setIsMenuOpen} />
      )}
      {tab === "shifts" && <ShiftReportsTab onMenuOpenChange={setIsMenuOpen} />}
      </div>
    </>
  );
};

export default ShiftReportsPage;
