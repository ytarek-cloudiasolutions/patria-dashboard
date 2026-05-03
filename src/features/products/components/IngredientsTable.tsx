import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Ingredient } from "../types";

interface IngredientsTableProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredientId: number) => void;
}

const IngredientsTable = ({
  ingredients,
  onEdit,
  onDelete,
}: IngredientsTableProps) => {
  return (
    <Table>
      <colgroup>
        <col style={{ width: "40px" }} />
        <col style={{ width: "363px" }} />
        <col style={{ width: "138.75px" }} />
        <col style={{ width: "138.75px" }} />
        <col style={{ width: "138.75px" }} />
        <col style={{ width: "138.75px" }} />
      </colgroup>
      <TableHeader>
        <TableRow className="h-10 border-b border-[#E9EAEE]">
          <TableHead className="text-[12px] font-semibold text-[#646B80]">
            IMAGE
          </TableHead>
          <TableHead className="text-[12px] font-semibold text-[#646B80]">
            Name
          </TableHead>
          <TableHead className="text-[12px] font-semibold text-[#646B80]">
            CATEGORY
          </TableHead>
          <TableHead className="text-[12px] font-semibold text-[#646B80]">
            PRICE
          </TableHead>
          <TableHead className="text-[12px] font-semibold text-[#646B80]">
            INITIAL QUANTITY
          </TableHead>
          <TableHead className="pr-4 text-right text-[12px] font-semibold text-[#646B80]">
            ACTIONS
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="[&_tr:hover]:bg-transparent">
        {ingredients.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="py-10 text-center text-[14px] text-[#8B8B8B]"
            >
              No ingredients found.
            </TableCell>
          </TableRow>
        ) : (
          ingredients.map((ingredient) => (
            <TableRow
              key={ingredient.id}
              className="h-16 border-b border-[#F2F3F7]"
            >
              <TableCell>
                <div className="size-10 shrink-0 overflow-hidden rounded-[8px] border border-[#F2F3F7] bg-[#F8F8F8]">
                  <img
                    src={ingredient.imageUrl}
                    alt={ingredient.name}
                    className="size-full object-cover"
                  />
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="text-333333-14-semibold">{ingredient.name}</p>
                  <p className="text-8B8B8B-12-normal">
                    {ingredient.description}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <Badge className="rounded-[30px] bg-primary px-3 py-1 text-[#FFFFFF] text-[12px] font-semibold">
                  {ingredient.category}
                </Badge>
              </TableCell>

              <TableCell className="text-[14px] font-medium text-[#333333]">
                <p className="text-000000-13-semibold">
                  <span className="text-000000-13-medium">EGP</span>{" "}
                  {ingredient.price.toFixed(2)}
                </p>
              </TableCell>

              <TableCell className="text-000000-13-medium">
                {ingredient.initialQuantity} Piece(s)
              </TableCell>

              <TableCell className="pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-[#000000] hover:bg-transparent hover:text-[#333333]"
                    onClick={() => onEdit(ingredient)}
                  >
                    <Pencil className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-[#C90000] hover:bg-transparent hover:text-[#C90000]"
                    onClick={() => onDelete(ingredient.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default IngredientsTable;
