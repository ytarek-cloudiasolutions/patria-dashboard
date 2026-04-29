import { MapPin, Box, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
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
import type {
  BranchStats,
  RegionRevenue,
  RegionDistribution,
  BranchReport,
} from "../types";

interface BranchTabProps {
  stats: BranchStats;
  regionRevenues: RegionRevenue[];
  regionDistribution: RegionDistribution[];
  reports: BranchReport[];
}

const DonutCenter = ({ total }: { total: number }) => (
  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
    <tspan x="50%" dy="-6" fontSize="22" fontWeight="700" fill="#28293D">
      {total}
    </tspan>
    <tspan x="50%" dy="20" fontSize="12" fill="#6B6B6B">
      Total
    </tspan>
  </text>
);

const BranchTab = ({
  stats,
  regionRevenues,
  regionDistribution,
  reports,
}: BranchTabProps) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <OverviewCard
          data={{
            title: "Number of Regions",
            value: stats.numberOfRegions,
            icon: <MapPin size={18} />,
            iconColor: "text-[#B56C00]",
            badgeColor: "bg-[#FFF5DC]",
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
            title: "Highest Revenue Region",
            value: stats.highestRevenueRegion as unknown as number,
            icon: <Activity size={18} />,
            iconColor: "text-[#7A1A7A]",
            badgeColor: "bg-[#F5E0F5]",
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Revenue per region bar */}
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
          <p className="mb-4 text-[14px] font-bold text-[#28293D]">
            Revenue per region
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={regionRevenues}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0EDE8"
                vertical={false}
              />
              <XAxis
                dataKey="region"
                tick={{ fontSize: 9, fill: "#8B8B8B" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8B8B8B" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="revenue" fill="#5C4A0E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution donut */}
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
          <p className="mb-4 text-[14px] font-bold text-[#28293D]">
            Distribution of requests to regions
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={regionDistribution}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {regionDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
                <DonutCenter total={32} />
              </Pie>
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 10, color: "#6B6B6B" }}>
                    {value}
                  </span>
                )}
                wrapperStyle={{ fontSize: 10 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-5">#</TableHead>
            <TableHead className="px-5">REGION/BRANCH</TableHead>
            <TableHead className="px-5"># OF ORDERS</TableHead>
            <TableHead className="px-5">CASHIER ORDERS</TableHead>
            <TableHead className="px-5">APP ORDERS</TableHead>
            <TableHead className="px-5">TOTAL REVENUE</TableHead>
            <TableHead className="px-5">AVR. ORDER</TableHead>
            <TableHead className="px-5">% OF TOTAL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="px-5 py-4 text-[#6B6B6B]">{r.id}</TableCell>
              <TableCell className="px-5 py-4 font-semibold text-[#28293D]">
                {r.region}
              </TableCell>
              <TableCell className="px-5 py-4 text-[#28293D]">
                {r.orders}
              </TableCell>
              <TableCell className="px-5 py-4 text-[#28293D]">
                {r.cashierOrders}
              </TableCell>
              <TableCell className="px-5 py-4 text-[#28293D]">
                {r.appOrders}
              </TableCell>
              <TableCell className="px-5 py-4 font-semibold text-[#059B5A]">
                {r.totalRevenue}
              </TableCell>
              <TableCell className="px-5 py-4 text-[#28293D]">
                {r.avgOrder}
              </TableCell>
              <TableCell className="px-5 py-4 text-[#28293D]">
                {r.percentOfTotal}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BranchTab;
