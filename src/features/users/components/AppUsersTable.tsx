import { Ban, Settings, ShieldCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { AppUser } from "../types";

interface AppUsersTableProps {
  users: AppUser[];
  onView: (user: AppUser) => void;
  onToggleStatus: (user: AppUser) => void;
}

const initial = (name: string) => name.trim().charAt(0).toUpperCase();

const StatusBadge = ({ status }: { status: AppUser["status"] }) => {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-20 items-center justify-center rounded-full border px-3 text-[12px] font-semibold",
        status === "Active"
          ? "border-[#059B5A] bg-white text-[#059B5A]"
          : "border-[#C90000] bg-[#C90000] text-white"
      )}
    >
      {t(status)}
    </span>
  );
};

const RowActions = ({
  user,
  onView,
  onToggleStatus,
}: {
  user: AppUser;
  onView: (u: AppUser) => void;
  onToggleStatus: (u: AppUser) => void;
}) => (
  <div className="flex items-center justify-center gap-3">
    <button
      type="button"
      onClick={() => onToggleStatus(user)}
      aria-label={
        user.status === "Active" ? `Block ${user.name}` : `Unblock ${user.name}`
      }
      className="cursor-pointer text-[#C7861E] hover:opacity-80"
    >
      {user.status === "Active" ? (
        <Ban className="size-4.5" />
      ) : (
        <ShieldCheck className="size-4.5" />
      )}
    </button>
    <button
      type="button"
      onClick={() => onView(user)}
      aria-label={`Manage ${user.name}`}
      className="cursor-pointer text-[#000000] hover:opacity-80"
    >
      <Settings className="size-4.5" />
    </button>
  </div>
);

const CustomerCell = ({ user }: { user: AppUser }) => (
  <div className="flex items-center gap-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-semibold text-white">
      {initial(user.name)}
    </div>
    <div className="min-w-0">
      <p className="truncate text-[14px] font-semibold text-[#28293D]">
        {user.name}
      </p>
      <p className="truncate text-[12px] text-[#8B8B8B]">{user.email}</p>
    </div>
  </div>
);

const AppUsersTable = ({
  users,
  onView,
  onToggleStatus,
}: AppUsersTableProps) => {
  const { t } = useTranslation();
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
              <CustomerCell user={user} />
              <StatusBadge status={user.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#28293D]" dir="ltr">
                {user.phone}
              </span>
              <RowActions
                user={user}
                onView={onView}
                onToggleStatus={onToggleStatus}
              />
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No users found.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">
                {t("Customer Information")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center">
                {t("Phone Number")}
              </TableHead>
              <TableHead className="px-6 py-4 text-center">
                {t("Status")}
              </TableHead>
              <TableHead className="pe-6 py-4 text-center">
                {t("ACTIONS")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4">
                  <CustomerCell user={user} />
                </TableCell>
                <TableCell
                  className="px-6 py-4 text-center text-[13px] text-[#28293D]"
                  dir="ltr"
                >
                  {user.phone}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex justify-center">
                    <StatusBadge status={user.status} />
                  </div>
                </TableCell>
                <TableCell className="pe-6 py-4">
                  <RowActions
                    user={user}
                    onView={onView}
                    onToggleStatus={onToggleStatus}
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
                  {t("No users found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AppUsersTable;
