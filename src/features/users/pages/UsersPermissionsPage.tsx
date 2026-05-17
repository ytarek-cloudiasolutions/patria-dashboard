import { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  UserRound,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import UsersTable from "../components/UsersTable";
import CreateUserDialog from "../components/CreateUserDialog";
import EditPermissionsDialog from "../components/EditPermissionsDialog";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { usersData } from "../data";
import type {
  User,
  UserRole,
  NewUserForm,
  EditPermissionsForm,
} from "../types";

let idCounter = 50;

const UsersPermissionsPage = () => {
  const [users, setUsers] = useState<User[]>(usersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // --- Stats ---
  const totalUsers = users.length;
  const administrators = useMemo(
    () => users.filter((u) => u.role === "Admin").length,
    [users],
  );
  const managers = useMemo(
    () => users.filter((u) => u.role === "Manager").length,
    [users],
  );

  // --- Filtered list ---
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // --- Handlers ---
  const handleCreateUser = (form: NewUserForm) => {
    const newUser: User = {
      id: `u-${++idCounter}`,
      name: form.fullName,
      email: form.email,
      role: form.role,
      availablePages: form.pages,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleEditPermissions = (userId: string, data: EditPermissionsForm) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: data.role, availablePages: data.pages }
          : u,
      ),
    );
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const roleOptions: { value: UserRole | ""; label: string }[] = [
    { value: "", label: "Role" },
    { value: "Staff", label: "Staff" },
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "User", label: "User" },
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFB] px-5 py-8 md:px-6 lg:px-8 xl:px-[22px] xl:py-[55px]">
      <div className="mb-[32px] flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[39px] font-bold leading-[1.05] text-[#333333]">
            Users & Permissions
          </h1>
          <p className="mt-[9px] text-[19px] font-medium text-[#696969]">
            User Roles & Module Permissions
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="mt-[2px] flex h-[70px] items-center gap-[19px] rounded-[5px] bg-primary px-[40px] text-[20px] font-bold text-white transition-colors hover:bg-[#7A5C10]"
        >
          <Plus className="size-6" />
          Create New User Account
        </button>
      </div>

      <div className="mb-[30px] grid grid-cols-1 gap-[39px] lg:grid-cols-3">
        <div className="flex h-[142px] items-center justify-between rounded-[16px] border border-[#E1E1E5] bg-white px-[30px] shadow-[0_2px_5px_rgba(0,0,0,0.10)]">
          <div>
            <p className="text-[13px] font-bold text-[#28293D]">Total Users</p>
            <p className="mt-[12px] text-[26px] font-bold leading-none text-[#28293D]">
              {totalUsers}
            </p>
          </div>
          <div className="flex size-[57px] items-center justify-center rounded-[13px] bg-[#F5F0EA]">
            <Users className="size-7 text-[#000000]" />
          </div>
        </div>
        <div className="flex h-[142px] items-center justify-between rounded-[16px] border border-[#E1E1E5] bg-white px-[30px] shadow-[0_2px_5px_rgba(0,0,0,0.10)]">
          <div>
            <p className="text-[13px] font-bold text-[#28293D]">
              Administrators
            </p>
            <p className="mt-[12px] text-[26px] font-bold leading-none text-[#28293D]">
              {administrators}
            </p>
          </div>
          <div className="flex size-[57px] items-center justify-center rounded-[13px] bg-[#DDF6EB]">
            <UserCheck className="size-7 text-[#00A85A]" />
          </div>
        </div>
        <div className="flex h-[142px] items-center justify-between rounded-[16px] border border-[#E1E1E5] bg-white px-[30px] shadow-[0_2px_5px_rgba(0,0,0,0.10)]">
          <div>
            <p className="text-[13px] font-bold text-[#28293D]">Managers</p>
            <p className="mt-[12px] text-[26px] font-bold leading-none text-[#28293D]">
              {managers}
            </p>
          </div>
          <div className="flex size-[57px] items-center justify-center rounded-[13px] bg-[#FFF4E6]">
            <UserRound className="size-7 text-[#D68A00]" />
          </div>
        </div>
      </div>

      <div className="mb-[29px] grid grid-cols-1 gap-[40px] lg:grid-cols-[minmax(0,1fr)_424px]">
        <div className="relative min-w-0">
          <Search className="absolute left-[18px] top-1/2 size-6 -translate-y-1/2 text-[#8B8B8B]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-[61px] w-full rounded-[8px] border border-[#CACBD4] bg-white pl-[55px] pr-4 text-[20px] font-medium text-[#23252A] placeholder:text-[#9B9B9B] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="relative min-w-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
            className="h-[61px] w-full appearance-none rounded-[12px] border border-[#E1E1E5] bg-white px-[23px] pr-[56px] text-[21px] font-medium text-[#000000] focus:outline-none focus:border-primary"
          >
            {roleOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-[25px] top-1/2 size-8 -translate-y-1/2 text-[#000000]" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white">
        <UsersTable
          users={filteredUsers}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateUser}
      />

      <EditPermissionsDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
        onSubmit={handleEditPermissions}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        data={{ item: selectedUser?.name ?? "", type: "subscription" }}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UsersPermissionsPage;
