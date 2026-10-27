import { SquarePen, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { Product } from "../types";
import { discountLabel, formatEgp } from "../utils";

interface ProductsTableProps {
  products: Product[];
  togglingProductId: string | null;
  isLoading?: boolean;
  isMutating?: boolean;
  onToggleAvailability: (id: string, available: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  selectedIds: string[];
  onSelectedIdsChange: (ids: string[]) => void;
}

const StatusBadge = ({ available }: { available: boolean }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 min-w-24 rounded-full border px-3 py-0 text-[12px] font-semibold",
        available
          ? "bg-[#E2F4ED] text-[#059B5A] border-current"
          : "bg-[#DCDCDC] text-[#23252A] border-[#595959]"
      )}
    >
      {available ? t("Available") : t("Out Of Stock")}
    </Badge>
  );
};

const CategoryBadge = ({ category }: { category: string }) => (
  <Badge className="h-6 rounded-full border border-[#725400] bg-primary px-3 py-0 text-[11px] font-semibold text-white">
    {category}
  </Badge>
);

const PriceCell = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p className="text-[14px] font-semibold text-[#28293D]" dir="ltr">
        {formatEgp(product.price)}
      </p>
      {product.discount && (
        <p className="mt-0.5 text-[11px] font-medium text-[#595959]" dir="ltr">
          {t(discountLabel(product.discount))}
        </p>
      )}
    </div>
  );
};

const RowActions = ({
  product,
  onToggleAvailability,
  onEdit,
  onDelete,
  togglingProductId,
  isMutating = false,
}: {
  product: Product;
  onToggleAvailability: (id: string, available: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  togglingProductId: string | null;
  isMutating?: boolean;
}) => {
  const isTogglingThis = togglingProductId === product.id;
  return (
    <div className="flex items-center justify-end gap-4">
      {isTogglingThis ? (
        <div className="flex size-9 items-center justify-center">
          <Loader2 className="size-4.5 animate-spin text-[#059B5A]" />
        </div>
      ) : (
        <Switch
          checked={product.available}
          disabled={isMutating || togglingProductId !== null}
          onCheckedChange={(val) => onToggleAvailability(product.id, val)}
          className="data-[state=checked]:bg-[#059B5A] ring-[#059B5A33]"
        />
      )}
      <button
        type="button"
        disabled={isMutating || togglingProductId !== null}
        onClick={() => onEdit(product)}
        aria-label={`Edit ${product.name}`}
        className="group/edit cursor-pointer text-[#000000] disabled:opacity-50 transition-transform duration-150 active:scale-90"
      >
        <SquarePen className="size-4.5 transition-transform duration-150 group-hover/edit:scale-115" />
      </button>
      <button
        type="button"
        disabled={isMutating || togglingProductId !== null}
        onClick={() => onDelete(product)}
        aria-label={`Delete ${product.name}`}
        className="group/del cursor-pointer text-[#C90000] disabled:opacity-50 transition-transform duration-150 active:scale-90"
      >
        <Trash2 className="size-4.5 transition-transform duration-150 group-hover/del:scale-115" />
      </button>
    </div>
  );
};

const ProductThumb = ({ product }: { product: Product }) => (
  <img
    src={product.imageUrl}
    alt=""
    className="size-12 shrink-0 rounded-[10px] object-cover transition-transform duration-200 hover:scale-105"
  />
);

const SelectionCheckbox = ({
  checked,
  onCheckedChange,
  ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
}) => (
  <span className={`inline-flex rounded-[10px] p-1 ${checked ? "bg-[#624F1C1A]" : ""}`}>
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => onCheckedChange(value === true)}
      aria-label={ariaLabel}
      className="size-5 cursor-pointer rounded-[5.994px] border-[#8F6900] bg-white shadow-[0_1.998px_3.996px_0_rgba(27,28,29,0.04)]"
    />
  </span>
);

const ProductsTable = ({
  products,
  togglingProductId,
  isLoading = false,
  isMutating = false,
  onToggleAvailability,
  onEdit,
  onDelete,
  selectedIds,
  onSelectedIdsChange,
}: ProductsTableProps) => {
  const { t } = useTranslation();
  const allSelected = products.length > 0 && products.every((product) => selectedIds.includes(product.id));
  const toggleSelection = (id: string, checked: boolean) => onSelectedIdsChange(
    checked ? [...new Set([...selectedIds, id])] : selectedIds.filter((selectedId) => selectedId !== id),
  );
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
              >
                <div className="mb-3 flex items-start gap-3">
                  <SelectionCheckbox checked={selectedIds.includes(product.id)} onCheckedChange={(checked) => toggleSelection(product.id, checked)} ariaLabel={`Select ${product.name}`} />
                  <ProductThumb product={product} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-[#28293D]">
                      {product.name}
                    </p>
                    <p className="line-clamp-2 text-[12px] text-[#8B8B8B]">
                      {product.description}
                    </p>
                  </div>
                  <StatusBadge available={product.available} />
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <CategoryBadge category={product.category} />
                  <PriceCell product={product} />
                </div>
                <RowActions
                  product={product}
                  onToggleAvailability={onToggleAvailability}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  togglingProductId={togglingProductId}
                  isMutating={isMutating}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block [&_[data-slot=table-container]]:overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[52px] px-3 py-4 text-center">
                <SelectionCheckbox checked={allSelected} onCheckedChange={(checked) => onSelectedIdsChange(checked ? [...new Set([...selectedIds, ...products.map((product) => product.id)])] : selectedIds.filter((id) => !products.some((product) => product.id === id)))} ariaLabel={t("Select all products")} />
              </TableHead>
              <TableHead className="ps-6 py-4 text-start">
                {t("IMAGE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("PRODUCT")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("CATEGORY")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("PRICE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("STATUS")}
              </TableHead>
              <TableHead className="pe-6 py-4 text-end">
                {t("ACTIONS")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-[14px] text-[#8B8B8B]"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-[#FAFAF8]">
                    <TableCell className="w-[52px] px-3 py-4 text-center">
                      <SelectionCheckbox checked={selectedIds.includes(product.id)} onCheckedChange={(checked) => toggleSelection(product.id, checked)} ariaLabel={`Select ${product.name}`} />
                    </TableCell>
                    <TableCell className="ps-6 py-4">
                      <ProductThumb product={product} />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <p className="text-[14px] font-semibold text-[#28293D]">
                        {product.name}
                      </p>
                      <p className="max-w-72 truncate text-[12px] text-[#8B8B8B]">
                        {product.description}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <CategoryBadge category={product.category} />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <PriceCell product={product} />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge available={product.available} />
                    </TableCell>
                    <TableCell className="pe-6 py-4 whitespace-nowrap">
                      <RowActions
                        product={product}
                        onToggleAvailability={onToggleAvailability}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        togglingProductId={togglingProductId}
                        isMutating={isMutating}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProductsTable;
