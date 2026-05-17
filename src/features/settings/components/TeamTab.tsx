import { useState } from "react";
import { ChevronDown, Plus, Users } from "lucide-react";
import type { TeamMember, TeamPermission, TeamRole } from "../types";
import InviteMemberDialog from "./InviteMemberDialog";

interface Props {
  initialMembers: TeamMember[];
}

const PERMISSION_STYLES: Record<TeamPermission, string> = {
  "View Only": "border-[#0066FF] text-[#0066FF]",
  "Edit Only": "border-[#A000FF] text-[#A000FF]",
  "Full Access": "border-[#00A85A] text-[#00A85A]",
};

const TeamTab = ({ initialMembers }: Props) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);

  const handleRoleChange = (id: string, role: TeamRole) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, role } : member))
    );
  };

  return (
    <>
      <section className="overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white shadow-[0_12px_22px_rgba(0,0,0,0.12)]">
        <div className="flex h-[80px] items-center justify-between bg-[#F5F0EA] px-[24px]">
          <div className="flex items-center gap-[18px]">
            <Users className="size-8 text-[#000000]" />
            <div>
              <h2 className="text-[24px] font-bold leading-none text-[#333333]">
                Team Management
              </h2>
              <p className="mt-[7px] text-[14px] font-medium text-[#727272]">
                Manage administrator roles and access levels
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="flex h-[43px] items-center gap-[14px] rounded-[5px] bg-primary px-[28px] text-[17px] font-bold text-white transition-colors hover:bg-[#7A5C10]"
          >
            <Plus className="size-5" />
            Invite Member
          </button>
        </div>

        <div className="overflow-x-auto px-[15px] pb-[33px] pt-[34px]">
          <table className="w-full min-w-[770px]">
            <thead>
              <tr className="border-b border-[#E1E1E5] text-left text-[13px] font-bold text-[#28293D]">
                <th className="pb-[14px] pl-[5px]">MEMBER</th>
                <th className="pb-[14px]">CONTACT</th>
                <th className="pb-[14px]">ROLE</th>
                <th className="pb-[14px] text-center">PERFORMANCE</th>
                <th className="pb-[14px] text-center">PERMISSIONS</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="h-[76px] pl-[5px] align-middle">
                    <p className="text-[15px] font-bold text-[#333333]">
                      {member.name}
                    </p>
                    <p className="mt-[6px] text-[13px] font-medium text-[#8F8F8F]">
                      {member.subRole}
                    </p>
                  </td>
                  <td className="align-middle">
                    <p className="text-[15px] font-bold text-[#333333]">
                      {member.email}
                    </p>
                    <p className="mt-[6px] text-[13px] font-medium text-[#8F8F8F]">
                      {member.phone}
                    </p>
                  </td>
                  <td className="align-middle">
                    <div className="relative w-[165px]">
                      <select
                        value={member.role}
                        onChange={(event) =>
                          handleRoleChange(
                            member.id,
                            event.target.value as TeamRole
                          )
                        }
                        className="h-[54px] w-full appearance-none rounded-[13px] border border-[#E1E1E5] bg-white px-[14px] pr-[42px] text-[17px] font-medium text-[#000000] focus:outline-none focus:border-primary"
                      >
                        <option value="Staff">Staff</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-[15px] top-1/2 size-7 -translate-y-1/2 text-[#000000]" />
                    </div>
                  </td>
                  <td className="text-center align-middle text-[16px] font-medium text-[#000000]">
                    {member.performance}
                  </td>
                  <td className="text-center align-middle">
                    <span
                      className={`inline-flex h-[27px] min-w-[98px] items-center justify-center rounded-full border px-[14px] text-[15px] font-semibold leading-none ${
                        PERMISSION_STYLES[member.permission]
                      }`}
                    >
                      {member.permission}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={(data) => console.log("Invite:", data)}
      />
    </>
  );
};

export default TeamTab;
