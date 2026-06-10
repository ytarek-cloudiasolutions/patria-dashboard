import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Switch } from "@/shared/components/ui/switch";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Category } from "../types";

interface CategoriesTableProps {
  categories: Category[];
  onToggleActive: (id: number, active: boolean) => void;
  onDelete: (category: Category) => void;
}

const RowActions = ({
  category,
  onToggleActive,
  onDelete,
}: {
  category: Category;
  onToggleActive: (id: number, active: boolean) => void;
  onDelete: (category: Category) => void;
}) => (
  <div className="flex items-center justify-end gap-4">
    <Switch
      checked={category.active}
      onCheckedChange={(val) => onToggleActive(category.id, val)}
      className="data-[state=checked]:bg-[#059B5A] ring-[#059B5A33]"
    />
    <button
      type="button"
      onClick={() => onDelete(category)}
      aria-label={`Delete ${category.name}`}
      className="cursor-pointer text-[#C90000]"
    >
      <Trash2 className="size-4.5" />
    </button>
  </div>
);

const Thumb = ({ category }: { category: Category }) => (
  <img
    src={category.imageUrl}
    alt=""
    className="size-12 shrink-0 rounded-[10px] object-cover"
  />
);

const CategoriesTable = ({
  categories,
  onToggleActive,
  onDelete,
}: CategoriesTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <Thumb category={category} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold text-[#28293D]">
                {category.name}
              </p>
              <p className="text-[12px] text-[#8B8B8B]">
                {category.itemCount} {t("items")}
              </p>
            </div>
            <RowActions
              category={category}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          </div>
        ))}
        {categories.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No categories found.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("IMAGE")}</TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("CATEGORY NAME")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center">
                {t("ITEMS IN CATEGORY")}
              </TableHead>
              <TableHead className="pe-6 py-4 text-end">
                {t("ACTIONS")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4">
                  <Thumb category={category} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]">
                  {category.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-center text-[14px] font-medium text-[#28293D]">
                  {category.itemCount}
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <RowActions
                    category={category}
                    onToggleActive={onToggleActive}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No categories found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CategoriesTable;
