import { useCallback, useRef, useState } from "react";
import { FileUp, BarChart3 } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";

import ShiftReportsTabs from "./components/ShiftReportsTabs";
import DailyReportTab, { type ExportPayload } from "./components/DailyReportTab";
import MostSellingTab from "./components/MostSellingTab";
import ShiftReportsTab from "./components/ShiftReportsTab";
import type { ShiftReportsTab as ShiftReportsTabKey } from "./types";

const ShiftReportsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ShiftReportsTabKey>("daily");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const exportDataRef = useRef<ExportPayload | null>(null);

  const handleExportDataReady = useCallback((data: ExportPayload) => {
    exportDataRef.current = data;
  }, []);

  const handleExportCSV = () => {
    if (!exportDataRef.current || exportDataRef.current.rows.length === 0) {
      showErrorToast(t("No data available to export"));
      return;
    }

    const { title, headers, rows } = exportDataRef.current;
    const formattedHeaders = headers.map((h) => `"${h}"`);
    const formattedRows = rows.map((r) =>
      r.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(","),
    );

    const csvContent =
      "\uFEFF" + [formattedHeaders.join(","), ...formattedRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${title}_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccessToast(t("Report exported successfully"));
  };

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
              onClick: handleExportCSV,
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
            onExportDataReady={handleExportDataReady}
          />
        )}
        {tab === "most-selling" && (
          <MostSellingTab
            onMenuOpenChange={setIsMenuOpen}
            onExportDataReady={handleExportDataReady}
          />
        )}
        {tab === "shifts" && (
          <ShiftReportsTab
            onMenuOpenChange={setIsMenuOpen}
            onExportDataReady={handleExportDataReady}
          />
        )}
      </div>
    </>
  );
};

export default ShiftReportsPage;
