import { useEffect, useState } from "react";
import { Package, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
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
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useCategories } from "@/features/categories";
import { api } from "@/config/api";
import { formatEgp } from "@/features/pos/utils";

interface ItemBalanceWarehouseRow {
  warehouseId: string;
  warehouseName: string;
  type: string;
  quantity: number;
  value: number;
  status: string;
}

interface ItemBalanceItem {
  productId: string;
  name: string;
  barcode: string | null;
  unit: string;
  category: string | null;
  totalQuantity: number;
  totalValue: number;
  status: string;
  warehouses: ItemBalanceWarehouseRow[];
}

const statusBadge = (status: string, t: (s: string) => string) => {
  if (status === "Out of Stock" || status === "Low") {
    return (
      <Badge className="h-7 px-4 rounded-[30px] bg-[#C90000] text-white border border-[#C90000] text-[13px] font-semibold tracking-[0.26px] shadow-none">
        {t(status)}
      </Badge>
    );
  }
  return (
    <Badge className="h-7 px-4 rounded-[30px] bg-[#E2F4ED] text-[#059B5A] border border-[#059B5A] text-[13px] font-semibold tracking-[0.26px] shadow-none">
      {t(status)}
    </Badge>
  );
};

const ItemBalanceView = () => {
  const { t } = useTranslation();
  const { categories, getCategories } = useCategories();
  const [category, setCategory] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [items, setItems] = useState<ItemBalanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleInquire = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get("/inventory/item-balance", {
        params: category ? { category } : undefined,
      });
      setItems(response.data?.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Category Select + Inquire Button Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative flex-1 w-full">
          {isDropdownOpen && (
            <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
          )}
          <DropdownSelect
            options={categories.map((c: any) => ({
              value: c._id || c.id,
              label: c.name,
            }))}
            selected={category}
            onSelect={setCategory}
            onOpenChange={setIsDropdownOpen}
            placeholder={t("--- Select the category ---")}
            align="start"
            className="w-full md:!w-full h-14"
            contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:!w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>

        <button
          type="button"
          onClick={handleInquire}
          disabled={loading}
          className="h-14 w-full sm:w-[204px] shrink-0 rounded-[5px] bg-[#8F6900] px-4 text-[16px] font-semibold text-white hover:bg-[#785800] transition-colors cursor-pointer disabled:opacity-60"
        >
          {loading ? <Loader2 className="mx-auto size-5 animate-spin" /> : t("Inquire")}
        </button>
      </div>

      {!hasSearched ? (
        <p className="py-10 text-center text-[14px] text-[#8B8B8B]">
          {t("Select a category and click Inquire to see item balances")}
        </p>
      ) : !loading && items.length === 0 ? (
        <p className="py-10 text-center text-[14px] text-[#8B8B8B]">
          {t("No items found")}
        </p>
      ) : (
        items.map((item) => (
          <div key={item.productId} className="flex flex-col gap-6">
            {/* Item Title & Summary Cards Section */}
            <div className="flex flex-col rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
              <div className="bg-[#F5F0EA] px-[26px] py-3 border-b border-[#E5E5E5]">
                <h3 className="text-[16px] font-bold text-[#333333]">{item.name}</h3>
                <p className="text-[14px] font-medium tracking-[0.28px] text-[#8B8B8B]">
                  {t("Barcode")}: {item.barcode || "—"} | {t("Unit")}: {item.unit} | {t("Category")}: {item.category || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
                <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                      {t("Total Quantity")}
                    </span>
                    <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                      {item.totalQuantity}
                    </span>
                  </div>
                  <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#F5F0EA]">
                    <Package size={24} className="text-[#8F6900]" />
                  </div>
                </div>

                <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                      {t("Total Value")}
                    </span>
                    <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                      {formatEgp(item.totalValue)}
                    </span>
                  </div>
                  <div className="flex size-[46px] items-center justify-center rounded-[11.15px] bg-[#E2F4ED]">
                    <DollarSign size={24} className="text-[#059B5A]" />
                  </div>
                </div>

                <div className="flex h-[115px] items-center justify-between overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] p-6 shadow-sm">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold tracking-[0.2px] text-black uppercase">
                      {t("Status")}
                    </span>
                    <span className="text-[20px] font-semibold tracking-[0.4px] text-black">
                      {t(item.status)}
                    </span>
                  </div>
                  <div
                    className="flex size-[46px] items-center justify-center rounded-[11.15px]"
                    style={{ backgroundColor: item.status === "Stable" ? "#E2F4ED" : "#C90000" }}
                  >
                    <AlertTriangle size={24} className={item.status === "Stable" ? "text-[#059B5A]" : "text-white"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Warehouse Breakdown Table */}
            <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F0EA] border-none">
                    <TableHead className="ps-8 py-4 text-start font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                      {t("WAREHOUSE")}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                      {t("TYPE")}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                      {t("QUANTITY")}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                      {t("VALUE")}
                    </TableHead>
                    <TableHead className="pe-8 py-4 text-center font-semibold text-[13px] uppercase tracking-[0.26px] text-[#28293D]">
                      {t("STATUS")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {item.warehouses.length === 0 ? (
                    <TableRow className="border-none">
                      <TableCell colSpan={5} className="py-6 text-center text-[13px] text-[#8B8B8B]">
                        {t("No per-warehouse breakdown recorded for this item yet")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    item.warehouses.map((row) => (
                      <TableRow key={row.warehouseId} className="border-none hover:bg-[#FAFAF8]">
                        <TableCell className="ps-8 py-5 whitespace-nowrap text-[14px] font-medium tracking-[0.28px] text-black">
                          {row.warehouseName}
                        </TableCell>
                        <TableCell className="px-6 py-5 whitespace-nowrap text-center">
                          <div className="inline-flex justify-center">
                            {row.type === "main" ? (
                              <Badge className="h-7 px-4 rounded-[30px] bg-[#8F6900] text-white border border-[#725400] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                                {t("MAIN WAREHOUSE")}
                              </Badge>
                            ) : (
                              <Badge className="h-7 px-4 rounded-[30px] bg-[#F5F0EA] text-[#8F6900] border border-[#8F6900] text-[13px] font-semibold tracking-[0.26px] shadow-none">
                                {t("Sub WAREHOUSE")}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-medium tracking-[0.28px] text-black">
                          {row.quantity}
                        </TableCell>
                        <TableCell className="px-6 py-5 whitespace-nowrap text-center text-[14px] font-semibold tracking-[0.28px] text-[#333333]" dir="ltr">
                          {formatEgp(row.value)}
                        </TableCell>
                        <TableCell className="pe-8 py-5 whitespace-nowrap text-center">
                          <div className="inline-flex justify-center">{statusBadge(row.status, t)}</div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ItemBalanceView;
