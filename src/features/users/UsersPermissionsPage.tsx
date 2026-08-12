import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, UserCircle } from "lucide-react";
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
import { updateCustomer } from "@/features/customers/api/customersApi";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

import {
  APP_USER_STATUS_FILTER,
  ROLE_FILTER_OPTIONS,
} from "./data";
import { useUsers } from "./hooks/useUsers";
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
  superadmin: "admin",
  admin: "admin",
  manager: "manager",
  cashier: "staff",
  kitchen: "staff",
  staff: "staff",
};

const UsersPermissionsPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<UsersTab>("users");

  // Users tab
  const {
    users,
    loading,
    getUsersList,
    createNewUser,
    updateUserInfo,
    deleteUserInfo,
  } = useUsers();

  const [usersLoaded, setUsersLoaded] = useState(false);
  const usersStarted = useRef(loading.fetch);

  useEffect(() => {
    if (loading.fetch) {
      usersStarted.current = true;
    } else if (usersStarted.current) {
      setUsersLoaded(true);
    }
  }, [loading.fetch]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | undefined>();
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserAccount | null>(null);

  // Fetch lists on mount
  useEffect(() => {
    getUsersList({ limit: 500 });
  }, [getUsersList]);

  // App users tab
  const [blockedCustomerIds, setBlockedCustomerIds] = useState<Set<string | number>>(new Set());
  const [appSearch, setAppSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [viewingAppUser, setViewingAppUser] = useState<AppUser | null>(null);
  const [blockingAppUser, setBlockingAppUser] = useState<AppUser | null>(null);

  const staffUsers = useMemo(() => {
    return users.filter((u) => u._type !== "customer");
  }, [users]);

  const customerUsers = useMemo(() => {
    return users.filter((u) => u._type === "customer");
  }, [users]);

  const appUsers = useMemo<AppUser[]>(() => {
    return customerUsers.map((c) => ({
      id: String(c.id),
      name: c.name,
      email: c.email,
      phone: c.phone || "—",
      status: blockedCustomerIds.has(c.id) ? "Blocked" : "Active",
      totalOrders: c.totalOrders || 0,
      purchasesValue: c.totalPurchases || c.lifetimeValue || 0,
      orders: [],
    }));
  }, [customerUsers, blockedCustomerIds]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return staffUsers.filter((user) => {
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
  }, [staffUsers, search, roleFilter]);

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
      totalUsers: staffUsers.length,
      administrators: staffUsers.filter((u) => u.role === "admin" || u.role === "superadmin").length,
      managers: staffUsers.filter((u) => u.role === "manager").length,
    }),
    [staffUsers],
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
    const role = (data.role || "staff") as UserRole;
    createNewUser({
      name: data.fullName.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      role,
      // Was silently dropped before — the backend had no phone field on
      // createUserSchema either (now added), so it never persisted.
      phone: data.phone?.trim() || undefined,
    });
  };

  const handleEdit = (user: UserAccount) => {
    setEditingUser(user);
    setIsModifyOpen(true);
  };

  const handleSaveEdit = (
    id: string | number,
    role: UserRole,
    pages: PermissionPage[],
    backupWarehouseId: string,
    virtualShift: string,
  ) => {
    // Was only ever persisting `role` — the page-permission checkboxes,
    // backup warehouse, and virtual shift picked in the dialog were
    // collected and then silently discarded.
    updateUserInfo(String(id), {
      role,
      pages,
      backupWarehouseId: backupWarehouseId === "none" ? "" : backupWarehouseId,
      virtualShift,
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    deleteUserInfo(String(deletingUser.id));
    setDeletingUser(null);
  };

  // --- App users handlers ---------------------------------------------------

  const confirmToggleBlock = async () => {
    if (!blockingAppUser) return;
    const id = blockingAppUser.id;
    // Was local-only (Set state) with no backend call — the "Blocked" badge
    // reset on every page refresh and the customer could still log in.
    const willBlock = !blockedCustomerIds.has(id);
    try {
      await updateCustomer(String(id), { isActive: !willBlock });
      setBlockedCustomerIds((prev) => {
        const next = new Set(prev);
        if (willBlock) next.add(id);
        else next.delete(id);
        return next;
      });
      setViewingAppUser((current) => {
        if (current && current.id === id) {
          return {
            ...current,
            status: current.status === "Active" ? "Blocked" : "Active",
          };
        }
        return current;
      });
      showSuccessToast(willBlock ? t("Customer blocked") : t("Customer unblocked"));
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to update customer status"));
    } finally {
      setBlockingAppUser(null);
    }
  };

  const isLoading = !usersLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <UserCircle className="size-16 animate-spin text-primary" />
      </div>
    );
  }

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
        usersCount={staffUsers.length}
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
