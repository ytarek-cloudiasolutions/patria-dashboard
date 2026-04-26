import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import ActionButton from "@/shared/components/ActionButton";
import { PAGE_ICONS } from "../data";
import type { User, UserRole } from "../types";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const ROLE_BADGE: Record<UserRole, string> = {
  Staff: "bg-[#F5F5F5] text-[#374151] border border-[#E5E7EB]",
  Admin: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
  Manager: "bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]",
  User: "bg-[#F5F0EA] text-[#5C4A1E] border border-[#D6C4A0]",
};

const UsersTable = ({ users, onEdit, onDelete }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4">USER PROFILE</TableHead>
          <TableHead>ROLE</TableHead>
          <TableHead>AVAILABLE PAGES</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="border-b border-[#F0F0F0]">
            <TableCell className="pl-4 py-4">
              <p className="text-[14px] font-semibold text-[#28293D]">
                {user.name}
              </p>
              <p className="text-[12px] text-[#8B8B8B]">{user.email}</p>
            </TableCell>

            <TableCell>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${ROLE_BADGE[user.role]}`}
              >
                {user.role}
              </span>
            </TableCell>

            <TableCell>
              {user.availablePages.length === 0 ? (
                <span className="text-[#8B8B8B] text-[13px]">—</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {user.availablePages.map((page) => (
                    <span
                      key={page}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#F9FAFB] border border-[#E5E7EB] text-[11px] text-[#374151]"
                    >
                      <span className="text-[10px]">{PAGE_ICONS[page]}</span>
                      {page}
                    </span>
                  ))}
                </div>
              )}
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                <ActionButton
                  data={{
                    icon: <Pencil className="size-4" />,
                    iconColor: "text-[#5C4A1E] hover:text-[#3d3012]",
                    onClick: () => onEdit(user),
                  }}
                />
                <ActionButton
                  data={{
                    icon: <Trash2 className="size-4" />,
                    iconColor: "text-[#C90000] hover:text-[#a00000]",
                    onClick: () => onDelete(user),
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}

        {users.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center py-10 text-[#8B8B8B] text-[13px]"
            >
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
