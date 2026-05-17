import {
  BadgeCheck,
  Gift,
  Home,
  MapPin,
  Pencil,
  Settings,
  ShoppingBag,
  Store,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { PagePermission, User, UserRole } from "../types";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const ROLE_BADGE: Record<UserRole, string> = {
  Staff: "border-[#000000] text-[#000000] bg-[#EDEDED]",
  Admin: "border-[#0066FF] text-[#0066FF] bg-[#EAF1FF]",
  Manager: "border-[#E18A00] text-[#D68500] bg-[#FFF5E4]",
  User: "border-[#A000FF] text-[#A000FF] bg-[#F8ECFF]",
};

const PAGE_ICON_MAP: Record<PagePermission, ReactNode> = {
  Home: <Home className="size-[13px]" />,
  "Order Management": <ShoppingBag className="size-[13px]" />,
  "Product Catalog": <Store className="size-[13px]" />,
  "Customer Base": <Users className="size-[13px]" />,
  "Offers & Discounts": <BadgeCheck className="size-[13px]" />,
  Profile: <UserRound className="size-[13px]" />,
  "General Settings": <Settings className="size-[13px]" />,
  "Users & Permissions": <Gift className="size-[13px]" />,
  "Branches & Locations": <MapPin className="size-[13px]" />,
};

const PAGE_COLOR_MAP: Record<PagePermission, string> = {
  Home: "text-[#C57A00]",
  "Order Management": "text-[#E18A00]",
  "Product Catalog": "text-[#0066FF]",
  "Customer Base": "text-[#A000FF]",
  "Offers & Discounts": "text-[#00A85A]",
  Profile: "text-[#7A7A43]",
  "General Settings": "text-[#696969]",
  "Users & Permissions": "text-[#FF0000]",
  "Branches & Locations": "text-[#000000]",
};

const UsersTable = ({ users, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px]">
        <thead className="bg-[#F5F0EA]">
          <tr className="text-left text-[17px] font-bold text-[#28293D]">
            <th className="h-[51px] pl-[33px]">USER PROFILE</th>
            <th className="h-[51px]">ROLE</th>
            <th className="h-[51px] text-center">AVAILABLE PAGES</th>
            <th className="h-[51px] text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="h-[78px] pl-[42px] align-middle">
                <p className="text-[18px] font-bold leading-none text-[#333333]">
                  {user.name}
                </p>
                <p className="mt-[10px] text-[15px] font-medium leading-none text-[#8F8F8F]">
                  {user.email}
                </p>
              </td>

              <td className="align-middle">
                <span
                  className={`inline-flex h-[27px] min-w-[64px] items-center justify-center rounded-full border px-[14px] text-[15px] font-semibold leading-none ${
                    ROLE_BADGE[user.role]
                  }`}
                >
                  {user.role}
                </span>
              </td>

              <td className="align-middle">
                {user.availablePages.length === 0 ? (
                  <div className="text-center text-[17px] font-medium text-[#8F8F8F]">
                    —
                  </div>
                ) : (
                  <div className="mx-auto flex max-w-[460px] flex-wrap justify-center gap-x-[7px] gap-y-[6px]">
                    {user.availablePages.map((page) => (
                      <span
                        key={page}
                        className="inline-flex h-[20px] items-center gap-[5px] rounded-full border border-[#DADADA] bg-white px-[9px] text-[13px] font-bold leading-none text-[#000000]"
                      >
                        <span className={PAGE_COLOR_MAP[page]}>
                          {PAGE_ICON_MAP[page]}
                        </span>
                        {page}
                      </span>
                    ))}
                  </div>
                )}
              </td>

              <td className="align-middle">
                <div className="flex items-center justify-center gap-[22px]">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="text-[#000000] transition-colors hover:text-primary"
                    aria-label={`Edit permissions for ${user.name}`}
                  >
                    <Pencil className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    className="text-[#FF0000] transition-colors hover:text-[#C90000]"
                    aria-label={`Delete ${user.name}`}
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="py-12 text-center text-[15px] font-medium text-[#8F8F8F]"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
