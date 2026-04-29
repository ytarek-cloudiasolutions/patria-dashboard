import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import ActionButton from "@/shared/components/ActionButton";
import { Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { CATEGORY_COLORS } from "../data";
import type { Supplier } from "../types";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

const CategoryBadge = ({ label, index }: { label: string; index: number }) => (
  <span
    className={cn(
      "rounded-full px-3 py-1 text-[11px] font-semibold",
      CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    )}
  >
    {label}
  </span>
);

const SuppliersTable = ({
  suppliers,
  onEdit,
  onDelete,
}: SuppliersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-5 py-3">SUPPLIER NAME</TableHead>
          <TableHead className="px-5 py-3">CONTACT PERSON</TableHead>
          <TableHead className="px-5 py-3">CONTACT INFO</TableHead>
          <TableHead className="px-5 py-3">CATEGORIES</TableHead>
          <TableHead className="px-5 py-3">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id} className="hover:bg-[#FAFAF8]">
            {/* Supplier Name */}
            <TableCell className="px-5 py-4 whitespace-nowrap">
              <p className="text-[14px] font-semibold text-[#28293D]">
                {supplier.name}
              </p>
              <p className="text-[12px] text-[#6B6B6B]">{supplier.status}</p>
            </TableCell>

            {/* Contact Person */}
            <TableCell className="px-5 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
              {supplier.contactPerson}
            </TableCell>

            {/* Contact Info */}
            <TableCell className="px-5 py-4 whitespace-nowrap">
              {supplier.email !== supplier.phone && (
                <p className="text-[13px] text-[#28293D]">{supplier.email}</p>
              )}
              <p className="text-[13px] text-[#6B6B6B]">{supplier.phone}</p>
            </TableCell>

            {/* Categories */}
            <TableCell className="px-5 py-4 whitespace-nowrap">
              <div className="flex flex-wrap gap-1.5">
                {supplier.categories.map((cat, i) => (
                  <CategoryBadge key={cat} label={cat} index={i} />
                ))}
              </div>
            </TableCell>

            {/* Actions */}
            <TableCell className="px-5 py-4 whitespace-nowrap">
              <div className="flex items-center gap-3">
                <ActionButton
                  data={{
                    icon: <Pencil size={16} />,
                    iconColor: "text-[#7A6518]",
                    onClick: () => onEdit(supplier),
                  }}
                />
                <ActionButton
                  data={{
                    icon: <Trash2 size={16} />,
                    iconColor: "text-[#C90000]",
                    onClick: () => onDelete(supplier),
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SuppliersTable;
