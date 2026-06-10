import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import DropdownSelect from "@/shared/components/DropdownSelect";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";

import CreateUserDialog from "./components/CreateUserDialog";
import ModifyPermissionsDialog from "./components/ModifyPermissionsDialog";
import UsersOverview from "./components/UsersOverview";
import UsersTable from "./components/UsersTable";

import { INITIAL_USERS, ROLE_DEFAULT_PAGES, ROLE_FILTER_OPTIONS } from "./data";
import type {
  PermissionPage,
  UserAccount,
  UserFormData,
  UserRole,
} from "./types";

const DELETE_TYPE_BY_ROLE: Record<
  UserRole,
  "admin" | "manager" | "user" | "staff"
> = {
  Admin: "admin",
  Manager: "manager",
  User: "user",
  Staff: "staff",
};

const UsersPermissionsPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | undefined>();
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role === (roleFilter as UserRole);
      if (!matchesRole) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.includes(q)
      );
    });
  }, [users, search, roleFilter]);

  const counts = useMemo(
    () => ({
      totalUsers: users.length,
      administrators: users.filter((u) => u.role === "Admin").length,
      managers: users.filter((u) => u.role === "Manager").length,
    }),
    [users],
  );

  const handleCreate = (data: UserFormData) => {
    const role = (data.role || "Staff") as UserRole;
    const newUser: UserAccount = {
      id: Date.now(),
      name: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      role,
      pages: [...ROLE_DEFAULT_PAGES[role]],
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleEdit = (user: UserAccount) => {
    setEditingUser(user);
    setIsModifyOpen(true);
  };

  const handleSaveEdit = (
    id: number,
    role: UserRole,
    pages: PermissionPage[],
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role, pages } : u)),
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    setDeletingUser(null);
  };

  return (
    <>
      {isRoleFilterOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("User's & Permissions")}
          description={t("User Roles & Module Permissions")}
        />
        <DefaultButton
          data={{
            buttonText: t("Create New User Account"),
            icon: <Plus className="size-4.5" />,
            onClick: () => setIsCreateOpen(true),
          }}
        />
      </div>

      <UsersOverview
        totalUsers={counts.totalUsers}
        administrators={counts.administrators}
        managers={counts.managers}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInputField
            value={search}
            onChange={setSearch}
            placeholder={t("Search users...")}
          />
        </div>
        <div className="sm:w-72">
          <DropdownSelect
            options={ROLE_FILTER_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
            selected={roleFilter}
            onSelect={setRoleFilter}
            onOpenChange={setIsRoleFilterOpen}
            placeholder={t("Role")}
            align="end"
            className="md:w-full"
            contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
          />
        </div>
      </div>

      <UsersTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={setDeletingUser}
      />

      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleCreate}
      />

      <ModifyPermissionsDialog
        open={isModifyOpen}
        user={editingUser}
        onOpenChange={setIsModifyOpen}
        onSave={handleSaveEdit}
      />

      <DeleteDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        data={{
          item: deletingUser?.name ?? "",
          type: deletingUser
            ? DELETE_TYPE_BY_ROLE[deletingUser.role]
            : "user",
          typeBeforeName: true,
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default UsersPermissionsPage;
