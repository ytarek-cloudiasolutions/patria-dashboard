import { SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Ingredient } from "../types";
import { formatEgp } from "../utils";

interface IngredientsTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

const RawIngredientBadge = () => {
  const { t } = useTranslation();
  return (
    <Badge className="h-6 rounded-full border border-[#725400] bg-primary px-3 py-0 text-[11px] font-semibold text-white">
      {t("Raw Ingredient")}
    </Badge>
  );
};

const RowActions = ({
  ingredient,
  onEdit,
  onDelete,
}: {
  ingredient: Ingredient;
  onEdit: (i: Ingredient) => void;
  onDelete: (i: Ingredient) => void;
}) => (
  <div className="flex items-center justify-end gap-4">
    <button
      type="button"
      onClick={() => onEdit(ingredient)}
      aria-label={`Edit ${ingredient.name}`}
      className="cursor-pointer text-[#000000] hover:text-primary"
    >
      <SquarePen className="size-4.5" />
    </button>
    <button
      type="button"
      onClick={() => onDelete(ingredient)}
      aria-label={`Delete ${ingredient.name}`}
      className="cursor-pointer text-[#C90000]"
    >
      <Trash2 className="size-4.5" />
    </button>
  </div>
);

const Thumb = ({ ingredient }: { ingredient: Ingredient }) => (
  <img
    src={ingredient.imageUrl}
    alt=""
    className="size-12 shrink-0 rounded-[10px] object-cover"
  />
);

const IngredientsTable = ({
  ingredients,
  onEdit,
  onDelete,
}: IngredientsTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start gap-3">
              <Thumb ingredient={ingredient} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-[#28293D]">
                  {ingredient.name}
                </p>
                <p className="line-clamp-2 text-[12px] text-[#8B8B8B]">
                  {ingredient.description}
                </p>
              </div>
              <RawIngredientBadge />
            </div>
            <div className="mb-3 flex items-center justify-between text-[13px]">
              <span className="font-semibold text-[#28293D]" dir="ltr">
                {formatEgp(ingredient.price)}
              </span>
              <span className="text-[#28293D]">
                {ingredient.quantity} {t(ingredient.unit)}
              </span>
            </div>
            <RowActions
              ingredient={ingredient}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
        {ingredients.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No ingredients found.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">
                {t("IMAGE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("Name")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("CATEGORY")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("PRICE")}
              </TableHead>
              <TableHead className="px-6 py-4 text-start">
                {t("INITIAL QUANTITY")}
              </TableHead>
              <TableHead className="pe-6 py-4 text-end">
                {t("ACTIONS")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4">
                  <Thumb ingredient={ingredient} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-[14px] font-semibold text-[#28293D]">
                    {ingredient.name}
                  </p>
                  <p className="max-w-72 truncate text-[12px] text-[#8B8B8B]">
                    {ingredient.description}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <RawIngredientBadge />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]">
                  {formatEgp(ingredient.price)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {ingredient.quantity} {t(ingredient.unit)}
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <RowActions
                    ingredient={ingredient}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
            {ingredients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No ingredients found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default IngredientsTable;
