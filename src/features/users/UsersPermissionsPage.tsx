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
import UsersTabs from "./components/UsersTabs";
import AppUsersOverview from "./components/AppUsersOverview";
import AppUsersTable from "./components/AppUsersTable";
import AppUserDetailsDialog from "./components/AppUserDetailsDialog";
import BlockCustomerDialog from "./components/BlockCustomerDialog";

import {
  APP_USERS,
  APP_USER_STATUS_FILTER,
  INITIAL_USERS,
  ROLE_DEFAULT_PAGES,
  ROLE_FILTER_OPTIONS,
} from "./data";
import type {
  AppUser,
  PermissionPage,
  UserAccount,
  UserFormData,
  UserRole,
  UsersTab,
} from "./types";

const DELETE_TYPE_BY_ROLE: Record<
  UserRole,
  "admin" | "manager" | "user" | "staff"
> = {
  Admin: "admin",
  Manager: "manager",
  User: "user",
  Staff: "staff",
  "POS/Cashier": "staff",
};

const UsersPermissionsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<UsersTab>("users");

  // Users tab
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | undefined>();
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  // App users tab
  const [appUsers, setAppUsers] = useState<AppUser[]>(APP_USERS);
  const [appSearch, setAppSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [viewingAppUser, setViewingAppUser] = useState<AppUser | null>(null);
  const [blockingAppUser, setBlockingAppUser] = useState<AppUser | null>(null);

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

  const filteredAppUsers = useMemo(() => {
    const q = appSearch.toLowerCase().trim();
    return appUsers.filter((user) => {
      if (statusFilter !== "all" && user.status !== statusFilter) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.includes(q)
      );
    });
  }, [appUsers, appSearch, statusFilter]);

  const userCounts = useMemo(
    () => ({
      totalUsers: users.length,
      administrators: users.filter((u) => u.role === "Admin").length,
      managers: users.filter((u) => u.role === "Manager").length,
    }),
    [users],
  );

  const appCounts = useMemo(
    () => ({
      totalUsers: appUsers.length,
      blockedUsers: appUsers.filter((u) => u.status === "Blocked").length,
      activeUsers: appUsers.filter((u) => u.status === "Active").length,
    }),
    [appUsers],
  );

  // --- Users handlers -------------------------------------------------------

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

  // --- App users handlers ---------------------------------------------------

  const confirmToggleBlock = () => {
    if (!blockingAppUser) return;
    const id = blockingAppUser.id;
    const nextStatus =
      blockingAppUser.status === "Active" ? "Blocked" : "Active";
    setAppUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)),
    );
    setViewingAppUser((current) =>
      current && current.id === id ? { ...current, status: nextStatus } : current,
    );
    setBlockingAppUser(null);
  };

  return (
    <>
      {(isRoleFilterOpen || isStatusFilterOpen) && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("User's & Permissions")}
          description={t("User Roles & Module Permissions")}
        />
        {tab === "users" && (
          <DefaultButton
            data={{
              buttonText: t("Create New User Account"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsCreateOpen(true),
            }}
          />
        )}
      </div>

      {tab === "users" ? (
        <UsersOverview
          totalUsers={userCounts.totalUsers}
          administrators={userCounts.administrators}
          managers={userCounts.managers}
        />
      ) : (
        <AppUsersOverview
          totalUsers={appCounts.totalUsers}
          blockedUsers={appCounts.blockedUsers}
          activeUsers={appCounts.activeUsers}
        />
      )}

      <UsersTabs
        active={tab}
        usersCount={users.length}
        appUsersCount={appUsers.length}
        onChange={setTab}
      />

      {tab === "users" ? (
        <>
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
                options={ROLE_FILTER_OPTIONS.map((o) => ({
                  ...o,
                  label: t(o.label),
                }))}
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
        </>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <SearchInputField
                value={appSearch}
                onChange={setAppSearch}
                placeholder={t("Search users...")}
              />
            </div>
            <div className="sm:w-72">
              <DropdownSelect
                options={APP_USER_STATUS_FILTER.map((o) => ({
                  ...o,
                  label: t(o.label),
                }))}
                selected={statusFilter}
                onSelect={setStatusFilter}
                onOpenChange={setIsStatusFilterOpen}
                placeholder={t("Status")}
                align="end"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>
          </div>

          <AppUsersTable
            users={filteredAppUsers}
            onView={setViewingAppUser}
            onToggleStatus={setBlockingAppUser}
          />
        </>
      )}

      {/* Users dialogs */}
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
          type: deletingUser ? DELETE_TYPE_BY_ROLE[deletingUser.role] : "user",
          typeBeforeName: true,
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* App users dialogs */}
      <AppUserDetailsDialog
        user={viewingAppUser}
        onOpenChange={(open) => !open && setViewingAppUser(null)}
        onBlock={setBlockingAppUser}
      />

      <BlockCustomerDialog
        user={blockingAppUser}
        open={!!blockingAppUser}
        onOpenChange={(open) => !open && setBlockingAppUser(null)}
        onConfirm={confirmToggleBlock}
      />
    </>
  );
};

export default UsersPermissionsPage;
