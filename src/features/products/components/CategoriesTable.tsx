import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { ProductCategory } from "../types";

interface CategoriesTableProps {
  categories: ProductCategory[];
  onDelete: (categoryId: number) => void;
  onToggleActive: (categoryId: number, checked: boolean) => void;
}

const CategoriesTable = ({
  categories,
  onDelete,
  onToggleActive,
}: CategoriesTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-[16px] border border-[#E5E5E5]">
      <Table className="min-w-175">
        <colgroup>
          <col className="w-24" />
          <col className="w-80" />
          <col className="w-52" />
          <col className="w-32" />
        </colgroup>
        <TableHeader>
          <TableRow className="h-12 border-b border-[#E9EAEE]">
            <TableHead className="pl-7 text-[13px] font-semibold text-[#28293D]">
              IMAGE
            </TableHead>
            <TableHead className="text-[13px] font-semibold text-[#28293D]">
              CATEGORY NAME
            </TableHead>
            <TableHead className="text-center text-[13px] font-semibold text-[#28293D]">
              ITEMS IN CATEGORY
            </TableHead>
            <TableHead className="pr-8 text-center text-[13px] font-semibold text-[#28293D]">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:hover]:bg-transparent">
          {categories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-10 text-center text-[14px] text-[#8B8B8B]"
              >
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow
                key={category.id}
                className="h-17 border-b border-[#F2F3F7]"
              >
                <TableCell className="pl-7">
                  <div className="size-10 shrink-0 overflow-hidden rounded-[8px] border border-[#F2F3F7] bg-[#F8F8F8]">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="size-full object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell className="text-[14px] font-medium text-[#000000]">
                  {category.name}
                </TableCell>

                <TableCell className="text-center text-[14px] font-medium text-[#000000]">
                  {category.itemCount}
                </TableCell>

                <TableCell className="pr-8">
                  <div className="flex items-center justify-center gap-4">
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={(checked) =>
                        onToggleActive(category.id, checked)
                      }
                      aria-label={`Toggle ${category.name} category`}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-[#C90000] hover:bg-transparent hover:text-[#C90000]"
                      onClick={() => onDelete(category.id)}
                    >
                      <Trash2 className="size-4.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesTable;
