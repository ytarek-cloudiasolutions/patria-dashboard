import { useState } from "react";
import { Users, Plus, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { TeamMember, TeamPermission, TeamRole } from "../types";
import InviteMemberDialog from "./InviteMemberDialog";

interface Props {
  initialMembers: TeamMember[];
}

const PERMISSION_STYLES: Record<TeamPermission, string> = {
  "View Only": "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
  "Edit Only": "bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]",
  "Full Access": "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]",
};

const TeamTab = ({ initialMembers }: Props) => {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);

  const handleRoleChange = (id: string, role: TeamRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
      {/* Colored header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#F5F0EA]">
        <div className="flex items-center gap-3">
          <div className="bg-white/60 p-2 rounded-[10px]">
            <Users className="size-4 text-[#5C4A1E]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#28293D]">
              Team Management
            </p>
            <p className="text-[12px] text-[#8B8B8B] font-normal">
              Manage administrator roles and access levels
            </p>
          </div>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[5px] bg-[#5C4A1E] text-white text-[13px] font-semibold hover:bg-[#3d3012] transition-colors cursor-pointer"
        >
          <Plus className="size-3.5" />
          Invite Member
        </button>
      </div>

      {/* Table with its own clean header */}
      <Table>
        <TableHeader className="bg-white">
          <TableRow>
            <TableHead className="pl-6">MEMBER</TableHead>
            <TableHead>CONTACT</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>PERFORMANCE</TableHead>
            <TableHead>PERMISSIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="border-b border-[#F5F5F5]">
              <TableCell className="pl-6 py-3">
                <p className="text-[13px] font-semibold text-[#28293D]">
                  {member.name}
                </p>
                <p className="text-[11px] text-[#8B8B8B]">{member.subRole}</p>
              </TableCell>
              <TableCell>
                <p className="text-[12px] text-[#28293D]">{member.email}</p>
                <p className="text-[11px] text-[#8B8B8B]">{member.phone}</p>
              </TableCell>
              <TableCell>
                <div className="relative w-[110px]">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(member.id, e.target.value as TeamRole)
                    }
                    className="w-full h-8 pl-2.5 pr-7 rounded-[6px] border border-[#E5E5E5] bg-white text-[12px] text-[#23252A] appearance-none cursor-pointer focus:outline-none focus:border-[#5C4A1E]"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-[#8B8B8B]" />
                </div>
              </TableCell>
              <TableCell>
                <span className="text-[12px] text-[#28293D]">
                  {member.performance}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${PERMISSION_STYLES[member.permission]}`}
                >
                  {member.permission}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={(data) => console.log("Invite:", data)}
      />
    </div>
  );
};

export default TeamTab;
