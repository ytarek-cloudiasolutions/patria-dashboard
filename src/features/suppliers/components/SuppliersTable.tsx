import { SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import ActionButton from "@/shared/components/ActionButton";
import CategoryBadge from "./CategoryBadge";
import type { Supplier } from "../types";

interface SuppliersTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

const SupplierActions = ({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: Supplier;
  onEdit: (s: Supplier) => void;
  onDelete: (s: Supplier) => void;
}) => (
  <div className="flex items-center gap-3">
    <ActionButton
      data={{
        icon: <SquarePen size={16} />,
        iconColor: "text-[#000000]",
        ariaLabel: `Edit ${supplier.name}`,
        onClick: () => onEdit(supplier),
      }}
    />
    <ActionButton
      data={{
        icon: <Trash2 size={16} />,
        iconColor: "text-[#C90000]",
        ariaLabel: `Delete ${supplier.name}`,
        onClick: () => onDelete(supplier),
      }}
    />
  </div>
);

const ContactInfo = ({ supplier }: { supplier: Supplier }) => (
  <div>
    {supplier.email && (
      <p className="text-[13px] text-[#28293D]">{supplier.email}</p>
    )}
    <p className="text-[13px] text-[#6B6B6B]" dir="ltr">{supplier.phone}</p>
  </div>
);

const SuppliersTable = ({
  suppliers,
  onEdit,
  onDelete,
}: SuppliersTableProps) => {
  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-[#28293D]">
                  {supplier.name}
                </p>
                <p className="text-[12px] text-[#6B6B6B]">{supplier.status}</p>
              </div>
              <SupplierActions
                supplier={supplier}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  Contact Person
                </p>
                <p className="text-[#28293D]">{supplier.contactPerson}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  Contact Info
                </p>
                <ContactInfo supplier={supplier} />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {supplier.categories.map((category) => (
                <CategoryBadge key={category} label={category} />
              ))}
            </div>
          </div>
        ))}

        {suppliers.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            No suppliers found.
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">SUPPLIER NAME</TableHead>
              <TableHead className="px-6 py-4">CONTACT PERSON</TableHead>
              <TableHead className="px-6 py-4">CONTACT INFO</TableHead>
              <TableHead className="px-6 py-4">CATEGORIES</TableHead>
              <TableHead className="px-6 py-4">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <p className="text-[14px] font-semibold text-[#28293D]">
                    {supplier.name}
                  </p>
                  <p className="text-[12px] text-[#6B6B6B]">{supplier.status}</p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {supplier.contactPerson}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <ContactInfo supplier={supplier} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {supplier.categories.map((category) => (
                      <CategoryBadge key={category} label={category} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <SupplierActions
                    supplier={supplier}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}

            {suppliers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  No suppliers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default SuppliersTable;
