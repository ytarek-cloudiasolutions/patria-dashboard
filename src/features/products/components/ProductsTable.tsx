import { SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
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
import ProductStatusBadge from "./ProductStatusBadge";
import type { Product } from "../types";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  onToggleActive: (productId: number, checked: boolean) => void;
}

const ProductsTable = ({
  products,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductsTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-[16px] border border-[#E5E5E5]">
      <Table className="min-w-175">
        <colgroup>
          <col className="w-12" />
          <col className="w-80" />
          <col className="w-32" />
          <col className="w-32" />
          <col className="w-32" />
          <col className="w-32" />
        </colgroup>
        <TableHeader>
          <TableRow className="h-10 border-b border-[#E9EAEE]">
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              IMAGE
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              PRODUCT
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              CATEGORY
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              PRICE
            </TableHead>
            <TableHead className="text-[12px] font-semibold text-[#646B80]">
              STATUS
            </TableHead>
            <TableHead className="pr-4 text-center text-[12px] font-semibold text-[#646B80]">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:hover]:bg-transparent">
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-[14px] text-[#8B8B8B]"
              >
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow
                key={product.id}
                className="h-16 border-b border-[#F2F3F7]"
              >
                <TableCell>
                  <div className="size-10 shrink-0 overflow-hidden rounded-[8px] border border-[#F2F3F7] bg-[#F8F8F8]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <p className="text-333333-14-semibold">{product.name}</p>
                    <p className="text-8B8B8B-12-normal">
                      {product.description}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge className="rounded-[30px] bg-primary px-3 py-1 text-[#FFFFFF] text-[12px] font-semibold">
                    {product.category}
                  </Badge>
                </TableCell>

                <TableCell className="text-[14px] font-medium text-[#333333]">
                  <p className="text-000000-13-semibold">
                    <span className="text-000000-13-medium">EGP</span>{" "}
                    {product.price.toFixed(2)}
                  </p>
                  {product.discountLabel ? (
                    <p className="text-595959-11-semibold">
                      <span className="text-595959-11-normal">Discount:</span>{" "}
                      {product.discountLabel}
                    </p>
                  ) : null}
                </TableCell>

                <TableCell>
                  <ProductStatusBadge status={product.status} />
                </TableCell>

                <TableCell className="pr-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <div>
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={(checked) =>
                          onToggleActive(product.id, checked)
                        }
                        aria-label={`Toggle ${product.name} active status`}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-[#000000] hover:bg-transparent hover:text-[#333333]"
                      onClick={() => onEdit(product)}
                    >
                      <SquarePen className="size-4.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-[#C90000] hover:bg-transparent hover:text-[#C90000]"
                      onClick={() => onDelete(product.id)}
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

export default ProductsTable;
