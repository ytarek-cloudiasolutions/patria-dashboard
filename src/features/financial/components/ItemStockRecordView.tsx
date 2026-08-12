import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Loader2,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import DropdownSelect from "@/shared/components/DropdownSelect";
import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useProducts } from "@/features/products/hooks/useProducts";
import { api } from "@/config/api";

interface LedgerRow {
  date: string;
  note: string | null;
  import: number;
  export: number;
  reference: string;
  transactionType: string;
  balance: number;
}

const ItemStockRecordView = () => {
  const { t } = useTranslation();
  const { products, getProducts } = useProducts();
  const [productId, setProductId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [ledger, setLedger] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    getProducts({ limit: 200 });
  }, [getProducts]);

  const handleLoadStockCard = async () => {
    if (!productId) return;
    setLoading(true);
    setHasLoaded(true);
    try {
      const response = await api.get("/inventory/stock-record", {
        params: {
          productId,
          from: fromDate || undefined,
          to: toDate || undefined,
        },
      });
      setProductName(response.data?.product?.name || "");
      setLedger(response.data?.ledger ?? []);
    } catch {
      setLedger([]);
    } finally {
      setLoading(false);
    }
  };

  const totalImports = ledger.reduce((sum, r) => sum + r.import, 0);
  const totalExports = ledger.reduce((sum, r) => sum + r.export, 0);
  const currentBalance = ledger.length ? ledger[ledger.length - 1].balance : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
        <div className="relative flex-1 w-full min-w-[200px]">
          {isDropdownOpen && (
            <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
          )}
          <DropdownSelect
            options={products.map((p: any) => ({
              value: p.id || p._id,
              label: p.name,
            }))}
            selected={productId}
            onSelect={setProductId}
            onOpenChange={setIsDropdownOpen}
            placeholder={t("--- Select the item ---")}
            align="start"
            className="w-full md:!w-full h-14"
            contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:!w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <DatePicker
            value={fromDate}
            onChange={setFromDate}
            placeholder={t("From")}
            popoverPlacement="bottom-right"
            withBackdrop
            className="flex-1 sm:w-[186.5px]"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-[18px] text-[16px] font-medium text-black"
          />

          <DatePicker
            value={toDate}
            onChange={setToDate}
            placeholder={t("To")}
            popoverPlacement="bottom-right"
            minDate={fromDate || undefined}
            withBackdrop
            className="flex-1 sm:w-[186.5px]"
            buttonClassName="h-[50px] rounded-[12px] border-[#E5E5E5] px-[18px] text-[16px] font-medium text-black"
          />
        </div>

        <button
          type="button"
          onClick={handleLoadStockCard}
          disabled={loading || !productId}
          className="h-14 w-full lg:w-[204px] shrink-0 rounded-[5px] bg-[#8F6900] px-4 text-[16px] font-semibold text-white hover:bg-[#785800] transition-colors cursor-pointer disabled:opacity-60"
        >
          {loading ? <Loader2 className="mx-auto size-5 animate-spin" /> : t("Load Stock Card")}
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Imports")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {totalImports} {t("Pcs")}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
            <TrendingUp size={24} className="text-[#059B5A]" />
          </div>
        </div>

        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Total Exports")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {totalExports} {t("Pcs")}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#C90000]">
            <TrendingDown size={24} className="text-white" />
          </div>
        </div>

        <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
              {t("Current balance")}
            </span>
            <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
              {currentBalance} {t("Pcs")}
            </span>
          </div>
          <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E5E5E5]">
            <Package size={24} className="text-[#595959]" />
          </div>
        </div>
      </div>

      {/* Stock Card Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#E5E5E5]">
          <h3 className="text-[18px] font-bold text-[#333333] tracking-[0.36px]">
            {productName ? `${t("Item Card")} — ${productName}` : t("Item Card")}
          </h3>
        </div>

        {!hasLoaded ? (
          <p className="py-10 text-center text-[14px] text-[#8B8B8B]">
            {t("Select an item and click Load Stock Card")}
          </p>
        ) : !loading && ledger.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-[#8B8B8B]">
            {t("No stock movements found in this range")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F0EA] border-b border-[#E5E5E5]">
                <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                  {t("NOTE")}
                </TableHead>
                <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                  {t("BALANCE")}
                </TableHead>
                <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                  {t("EXPORT")}
                </TableHead>
                <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                  {t("IMPORT")}
                </TableHead>
                <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                  {t("REFERENCE")}
                </TableHead>
                <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                  {t("TRANSACTION TYPE")}
                </TableHead>
                <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                  {t("DATE")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.map((row, index) => (
                <TableRow key={index} className="border-b border-[#E5E5E5] hover:bg-[#FAFAF8]">
                  <TableCell className="ps-8 py-5 whitespace-nowrap text-[12px] font-bold tracking-[0.24px] text-[#333333]">
                    {row.note || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-black">
                    {row.balance}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#C90000]">
                    {row.export > 0 ? `-${row.export}` : "-"}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#059B5A]">
                    {row.import > 0 ? `+${row.import}` : "-"}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-[#333333]">
                    {row.reference}
                  </TableCell>
                  <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                    <div className="inline-flex justify-center">
                      <Badge className="h-6 px-3 rounded-[30px] bg-[#DCDCDC] text-[#23252A] border border-[#595959] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                        {t(row.transactionType)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="pe-8 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black" dir="ltr">
                    {new Date(row.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ItemStockRecordView;
