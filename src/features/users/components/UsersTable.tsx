import { SquareArrowOutUpRight, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import ActionButton from "@/shared/components/ActionButton";
import RoleBadge from "./RoleBadge";
import PageChip from "./PageChip";
import type { UserAccount } from "../types";

interface UsersTableProps {
  users: UserAccount[];
  onEdit: (user: UserAccount) => void;
  onDelete: (user: UserAccount) => void;
}

const PagesList = ({ pages }: { pages: UserAccount["pages"] }) => {
  if (pages.length === 0) {
    return (
      <div className="flex w-full justify-center">
        <span className="text-[14px] text-[#8B8B8B]">—</span>
      </div>
    );
  }
  return (
    <div className="flex max-w-105 flex-wrap items-center gap-1.5">
      {pages.map((page) => (
        <PageChip key={page} page={page} />
      ))}
    </div>
  );
};

const UserActions = ({
  user,
  onEdit,
  onDelete,
}: {
  user: UserAccount;
  onEdit: (u: UserAccount) => void;
  onDelete: (u: UserAccount) => void;
}) => (
  <div className="flex items-center gap-3">
    <ActionButton
      data={{
        icon: <SquareArrowOutUpRight size={18} />,
        iconColor: "text-[#000000]",
        ariaLabel: `Edit ${user.name}`,
        onClick: () => onEdit(user),
      }}
    />
    <ActionButton
      data={{
        icon: <Trash2 size={18} />,
        iconColor: "text-[#C90000]",
        ariaLabel: `Delete ${user.name}`,
        onClick: () => onDelete(user),
      }}
    />
  </div>
);

const UsersTable = ({ users, onEdit, onDelete }: UsersTableProps) => {
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#28293D]">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[#8B8B8B]">
                  {user.email}
                </p>
              </div>
              <UserActions user={user} onEdit={onEdit} onDelete={onDelete} />
            </div>

            <div className="mb-3">
              <RoleBadge role={user.role} />
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                Available pages
              </p>
              <PagesList pages={user.pages} />
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            No users found.
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">USER PROFILE</TableHead>
              <TableHead className="px-6 py-4">ROLE</TableHead>
              <TableHead className="px-6 py-4 text-center">AVAILABLE PAGES</TableHead>
              <TableHead className="px-6 py-4">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="px-6 py-4">
                  <p className="text-[14px] font-semibold text-[#28293D]">
                    {user.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#8B8B8B]">
                    {user.email}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <PagesList pages={user.pages} />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <UserActions
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UsersTable;
