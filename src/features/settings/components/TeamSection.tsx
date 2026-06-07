import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import SectionCard from "./SectionCard";
import { ROLE_OPTIONS } from "../data";
import type { PermissionLevel, TeamMember, TeamRole } from "../types";

interface TeamSectionProps {
  members: TeamMember[];
  onRoleChange: (id: number, role: TeamRole) => void;
  onInvite: () => void;
  onDropdownOpenChange: (open: boolean) => void;
}

const PERMISSION_STYLES: Record<PermissionLevel, string> = {
  "View Only": "border-[#004EF9] bg-[#EDF4FB] text-[#3574FF]",
  "Edit Only": "border-[#7E00D7] bg-[#F3E9FA] text-[#9524E4]",
};

const PermissionBadge = ({ level }: { level: PermissionLevel }) => (
  <Badge
    className={cn(
      "h-6 rounded-full border px-3 py-0 text-[11px] font-semibold",
      PERMISSION_STYLES[level],
    )}
  >
    {level}
  </Badge>
);

const RoleSelect = ({
  member,
  onRoleChange,
  onDropdownOpenChange,
}: {
  member: TeamMember;
  onRoleChange: (id: number, role: TeamRole) => void;
  onDropdownOpenChange: (open: boolean) => void;
}) => (
  <DropdownSelect
    options={ROLE_OPTIONS}
    selected={member.role}
    onSelect={(value) => onRoleChange(member.id, value as TeamRole)}
    onOpenChange={onDropdownOpenChange}
    align="start"
    className="h-10 md:w-36"
    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
  />
);

const TeamSection = ({
  members,
  onRoleChange,
  onInvite,
  onDropdownOpenChange,
}: TeamSectionProps) => (
  <SectionCard
    icon={<Users size={32} />}
    title="Team Management"
    subtitle="Manage administrator roles and access levels"
    contentClassName="px-0 py-0 sm:px-0 sm:py-0"
    action={
      <DefaultButton
        data={{
          buttonText: "Invite Member",
          icon: <span className="text-[18px] leading-none">+</span>,
          onClick: onInvite,
          className: "h-10 sm:h-11",
        }}
      />
    }
  >
    {/* Mobile cards */}
    <div className="flex flex-col gap-3 p-4 md:hidden">
      {members.map((member) => (
        <div
          key={member.id}
          className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-[#333333]">
                {member.name}
              </p>
              <p className="text-[12px] text-[#8B8B8B]">{member.roleLabel}</p>
            </div>
            <PermissionBadge level={member.permission} />
          </div>
          <div className="mb-3">
            <p className="text-[13px] text-[#28293D]">{member.email}</p>
            <p className="text-[12px] text-[#8B8B8B]" dir="ltr">{member.phone}</p>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
              {member.performance}
            </span>
          </div>
          <RoleSelect
            member={member}
            onRoleChange={onRoleChange}
            onDropdownOpenChange={onDropdownOpenChange}
          />
        </div>
      ))}
    </div>

    {/* Desktop table */}
    <div className="hidden md:block **:data-[slot=table-container]:rounded-none **:data-[slot=table-container]:border-0">
      <Table className="border-0">
        <TableHeader className="bg-white [&_tr:hover]:bg-white">
          <TableRow className="relative after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-[#E5E5E5]">
            <TableHead className="px-6 py-4">MEMBER</TableHead>
            <TableHead className="px-6 py-4 text-center">CONTACT</TableHead>
            <TableHead className="px-6 py-4 text-center">ROLE</TableHead>
            <TableHead className="px-6 py-4">PERFORMANCE</TableHead>
            <TableHead className="px-6 py-4">PERMISSIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:bg-[#FAFAF8]">
              <TableCell className="px-6 py-4">
                <p className="text-[14px] font-semibold text-[#333333]">
                  {member.name}
                </p>
                <p className="text-[12px] text-[#8B8B8B]">{member.roleLabel}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <p className="text-[13px] font-semibold text-[#28293D]">
                  {member.email}
                </p>
                <p className="text-[12px] text-[#8B8B8B]" dir="ltr">{member.phone}</p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <RoleSelect
                  member={member}
                  onRoleChange={onRoleChange}
                  onDropdownOpenChange={onDropdownOpenChange}
                />
              </TableCell>
              <TableCell className="px-6 py-4 text-[13px] font-semibold text-[#28293D] text-center">
                {member.performance}
              </TableCell>
              <TableCell className="px-6 py-4 text-center">
                <PermissionBadge level={member.permission} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
);

export default TeamSection;
