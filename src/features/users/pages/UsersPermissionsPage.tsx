import { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  Briefcase,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import OverviewCard from "@/shared/components/OverviewCard";
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
    <div className="min-h-screen bg-[#FAFAFA] px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#28293D]">
            Users & Permissions
          </h1>
          <p className="text-[14px] text-[#8B8B8B] mt-1">
            User Roles & Module Permissions
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-[5px] bg-[#5C4A1E] text-white text-[14px] font-semibold hover:bg-[#3d3012] transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          Create New User Account
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <OverviewCard
          data={{
            title: "Total Users",
            value: totalUsers,
            icon: <Users className="size-5" />,
            badgeColor: "bg-[#F5F0EA]",
            iconColor: "text-[#5C4A1E]",
          }}
        />
        <OverviewCard
          data={{
            title: "Administrators",
            value: administrators,
            icon: <UserCheck className="size-5" />,
            badgeColor: "bg-[#E6F9F5]",
            iconColor: "text-[#00897B]",
          }}
        />
        <OverviewCard
          data={{
            title: "Managers",
            value: managers,
            icon: <Briefcase className="size-5" />,
            badgeColor: "bg-[#FFF0E6]",
            iconColor: "text-[#E07B39]",
          }}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8B8B8B]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
            className="h-11 pl-4 pr-10 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] appearance-none cursor-pointer focus:outline-none focus:border-[#5C4A1E] min-w-[120px]"
          >
            {roleOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#8B8B8B]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
        <UsersTable
          users={filteredUsers}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Dialogs */}
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
