import { Users, Box, Clock } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import OverviewCard from "@/shared/components/OverviewCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { cn } from "@/lib/utils";
import type {
  EmployeeStats,
  EmployeeRevenueShare,
  EmployeeRequestCount,
  EmployeeReport,
  ShiftDetail,
} from "../types";

interface EmployeeTabProps {
  stats: EmployeeStats;
  revenueShares: EmployeeRevenueShare[];
  requestCounts: EmployeeRequestCount[];
  reports: EmployeeReport[];
  shiftDetails: ShiftDetail[];
}

const DonutCenter = ({ label }: { label: string }) => (
  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
    <tspan x="50%" fontSize="13" fontWeight="700" fill="#28293D">
      {label}
    </tspan>
  </text>
);

const EmployeeTab = ({
  stats,
  revenueShares,
  requestCounts,
  reports,
  shiftDetails,
}: EmployeeTabProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <OverviewCard
          data={{
            title: "Total Employees",
            value: stats.totalEmployees,
            icon: <Users size={18} />,
            iconColor: "text-[#7A1A7A]",
            badgeColor: "bg-[#F5E0F5]",
          }}
        />
        <OverviewCard
          data={{
            title: "Total Orders",
            value: stats.totalOrders,
            icon: <Box size={18} />,
            iconColor: "text-[#B56C00]",
            badgeColor: "bg-[#FFF5DC]",
          }}
        />
        <OverviewCard
          data={{
            title: "Total Revenue",
            value: stats.totalRevenue as unknown as number,
            icon: <span className="text-lg">$</span>,
            iconColor: "text-[#1A7A45]",
            badgeColor: "bg-[#E0F5EC]",
          }}
        />
        <OverviewCard
          data={{
            title: "Total Working Hours",
            value: stats.totalWorkingHours as unknown as number,
            icon: <Users size={18} />,
            iconColor: "text-[#7A1A7A]",
            badgeColor: "bg-[#F5E0F5]",
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Revenue Share Donut */}
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Users size={15} className="text-[#6B6B6B]" />
            <p className="text-[14px] font-bold text-[#28293D]">
              Each employee's share of the revenue
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={revenueShares}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
              >
                {revenueShares.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
                <DonutCenter label="EGP 169.70" />
              </Pie>
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: "#6B6B6B" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Requests per employee Bar */}
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Box size={15} className="text-[#6B6B6B]" />
            <p className="text-[14px] font-bold text-[#28293D]">
              Number of requests per employee
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={requestCounts}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0EDE8"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#8B8B8B" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8B8B8B" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                {requestCounts.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: "#6B6B6B" }}>
                    {value === "orders" ? "Orders" : value}
                  </span>
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Report Table */}
      <div className="rounded-[16px] border border-[#E5E5E5] overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] bg-[#FAFAF8] px-5 py-4">
          <Users size={15} className="text-[#6B6B6B]" />
          <div>
            <p className="text-[14px] font-bold text-[#28293D]">
              Report of each employee
            </p>
            <p className="text-[11px] text-[#6B6B6B]">
              Detailed per-user breakdown for selected period
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">#</TableHead>
              <TableHead className="px-4">EMPLOYEE</TableHead>
              <TableHead className="px-4">ROLE</TableHead>
              <TableHead className="px-4"># ORDERS</TableHead>
              <TableHead className="px-4">CASHIER</TableHead>
              <TableHead className="px-4">APP ORDERS</TableHead>
              <TableHead className="px-4">REVENUE</TableHead>
              <TableHead className="px-4">AVR. ORDER</TableHead>
              <TableHead className="px-4">WORKING HRS</TableHead>
              <TableHead className="px-4">TOP PRODUCT</TableHead>
              <TableHead className="px-4">REVENUE %</TableHead>
              <TableHead className="px-4">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="px-4 py-4 text-[#6B6B6B]">
                  {r.id}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <p className="text-[13px] font-semibold text-[#28293D]">
                    {r.name}
                  </p>
                  <p className="text-[11px] text-[#6B6B6B]">{r.email}</p>
                </TableCell>
                <TableCell className="px-4 py-4">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-semibold",
                      r.roleColor,
                    )}
                  >
                    {r.role}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-4 text-[13px] text-[#28293D]">
                  {r.orders}
                </TableCell>
                <TableCell className="px-4 py-4 text-[13px] text-[#28293D]">
                  {r.cashierOrders}
                </TableCell>
                <TableCell className="px-4 py-4 text-[13px] text-[#28293D]">
                  {r.appOrders}
                </TableCell>
                <TableCell className="px-4 py-4 text-[13px] font-semibold text-[#059B5A]">
                  EGP {r.revenue.toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-4 text-[13px] text-[#28293D]">
                  EGP {r.avgOrder}
                </TableCell>
                <TableCell className="px-4 py-4 text-[13px] text-[#28293D]">
                  {r.workingHrs}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <p className="text-[12px] font-semibold text-[#28293D]">
                    {r.topProduct}
                  </p>
                  <p className="text-[10px] text-[#6B6B6B]">
                    {r.topProductItems} Items
                  </p>
                </TableCell>
                <TableCell className="px-4 py-4 text-[13px] text-[#28293D]">
                  {r.revenuePercent}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold",
                      r.status === "Open"
                        ? "border-[#A8DFC4] text-[#1A7A45]"
                        : "border-[#F5A8A8] text-[#C90000]",
                    )}
                  >
                    {r.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Shift Details */}
      <div className="rounded-[16px] border border-[#E5E5E5] overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] bg-[#FAFAF8] px-5 py-4">
          <Clock size={15} className="text-[#6B6B6B]" />
          <p className="text-[14px] font-bold text-[#28293D]">Shift Details</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5">CUSTOMER</TableHead>
              <TableHead className="px-5">SHIFT START</TableHead>
              <TableHead className="px-5">SHIFT END</TableHead>
              <TableHead className="px-5">DURATION</TableHead>
              <TableHead className="px-5">NO. OF ORDERS</TableHead>
              <TableHead className="px-5">REVENUE</TableHead>
              <TableHead className="px-5">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shiftDetails.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="px-5 py-4 font-semibold text-[#28293D]">
                  {s.customer}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-[#6B6B6B]">
                  {s.shiftStart}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-[#6B6B6B]">
                  {s.shiftEnd}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-[#28293D]">
                  {s.duration}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-[#28293D]">
                  {s.orders}
                </TableCell>
                <TableCell className="px-5 py-4 font-semibold text-[#059B5A]">
                  EGP {s.revenue.toLocaleString()}
                </TableCell>
                <TableCell className="px-5 py-4">
                  <span className="rounded-full border border-[#F5A8A8] px-3 py-1 text-[11px] font-semibold text-[#C90000]">
                    {s.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTab;
