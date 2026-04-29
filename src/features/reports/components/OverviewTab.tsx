import {
  Activity,
  Box,
  Tag,
  Truck,
  Coffee,
  Layers,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
import type {
  OverviewStats,
  DailyRevenuePoint,
  TopProduct,
  CouponPerformance,
  DeliveryPerformance,
  RoastingDistribution,
  GrindingDistribution,
  EODSession,
} from "../types";

interface OverviewTabProps {
  stats: OverviewStats;
  dailyRevenue: DailyRevenuePoint[];
  topProducts: TopProduct[];
  couponPerformance: CouponPerformance[];
  deliveryPerformance: DeliveryPerformance[];
  roastingDistribution: RoastingDistribution[];
  grindingDistribution: GrindingDistribution[];
  eodSessions: EODSession[];
  detailedExport: boolean;
  onToggleDetailedExport: () => void;
}

const ChartCard = ({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-[15px] font-bold text-[#28293D]">{title}</p>
        {subtitle && <p className="text-[11px] text-[#6B6B6B]">{subtitle}</p>}
      </div>
      <span className="text-[#6B6B6B]">{icon}</span>
    </div>
    {children}
  </div>
);

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

const OverviewTab = ({
  stats,
  dailyRevenue,
  topProducts,
  couponPerformance,
  deliveryPerformance,
  roastingDistribution,
  grindingDistribution,
  eodSessions,
  detailedExport,
  onToggleDetailedExport,
}: OverviewTabProps) => {
  const maxQty = Math.max(...topProducts.map((p) => p.quantity));
  const maxDelivery = Math.max(...deliveryPerformance.map((d) => d.orders));

  const couponChartData = [
    { name: "Revenue", value: 1300, fill: "#059B5A" },
    { name: "Discount", value: 600, fill: "#C90000" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <OverviewCard
          data={{
            title: "Total Revenue",
            value: stats.totalRevenue as unknown as number,
            icon: <span className="text-lg">$</span>,
            iconColor: "text-[#B56C00]",
            badgeColor: "bg-[#FFF5DC]",
          }}
        />
        <OverviewCard
          data={{
            title: "Average Demand",
            value: stats.averageDemand as unknown as number,
            icon: <Activity size={18} />,
            iconColor: "text-[#1A7A45]",
            badgeColor: "bg-[#E0F5EC]",
          }}
        />
        <OverviewCard
          data={{
            title: "Number of Orders",
            value: stats.numberOfOrders,
            icon: <Box size={18} />,
            iconColor: "text-[#B56C00]",
            badgeColor: "bg-[#FFF5DC]",
          }}
        />
        <OverviewCard
          data={{
            title: "Number of Customers",
            value: stats.numberOfCustomers,
            icon: <Users size={18} />,
            iconColor: "text-[#7A1A7A]",
            badgeColor: "bg-[#F5E0F5]",
          }}
        />
      </div>

      {/* Daily Revenue + Top Products */}
      <div className="grid grid-cols-2 gap-5">
        <ChartCard
          title="Daily revenue"
          subtitle="Daily revenue trend"
          icon={<Activity size={16} />}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={dailyRevenue}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A6518" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7A6518" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0EDE8"
                vertical={false}
              />
              <XAxis
                dataKey="date"
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7A6518"
                strokeWidth={2}
                strokeDasharray="5 3"
                fill="url(#revGrad)"
                dot={{ fill: "#7A6518", r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top products by quantity"
          subtitle="Top products by quantity"
          icon={<Box size={16} />}
        >
          <div className="flex flex-col gap-2 pt-2">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-[11px] text-[#6B6B6B]">
                  {p.name}
                </span>
                <div className="flex-1 rounded-full bg-[#F5F0EA] h-5">
                  <div
                    className="h-5 rounded-full bg-[#5C4A0E]"
                    style={{ width: `${(p.quantity / maxQty) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[11px] text-[#6B6B6B]">
                  {p.quantity}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Coupon + Delivery Performance */}
      <div className="grid grid-cols-2 gap-5">
        <ChartCard
          title="Coupon performance"
          subtitle="Promo code ROI"
          icon={<Tag size={16} />}
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={couponChartData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0EDE8"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#8B8B8B" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8B8B8B" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {couponChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: "#6B6B6B" }}>
                    {value}
                  </span>
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Delivery performance"
          subtitle="Promo code ROI"
          icon={<Truck size={16} />}
        >
          <div className="flex flex-col gap-2 pt-2">
            {deliveryPerformance.map((d) => (
              <div key={d.driver} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-[11px] text-[#6B6B6B]">
                  {d.driver}
                </span>
                <div className="flex-1 rounded-full bg-[#F5F0EA] h-5">
                  <div
                    className="h-5 rounded-full bg-[#3D5C1A]"
                    style={{ width: `${(d.orders / maxDelivery) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-[11px] text-[#6B6B6B]">
                  {d.orders}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Roasting + Grinding Distribution */}
      <div className="grid grid-cols-2 gap-5">
        <ChartCard
          title="Roasting Levels Distribution"
          subtitle="By roast quantity in orders"
          icon={<Coffee size={16} />}
        >
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roastingDistribution}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {roastingDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                  <DonutCenter total={100} />
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
        </ChartCard>

        <ChartCard
          title="Distribution of grinding types"
          subtitle="By item quantity in orders"
          icon={<Layers size={16} />}
        >
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={grindingDistribution}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {grindingDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                  <DonutCenter total={100} />
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
        </ChartCard>
      </div>

      {/* EOD Sessions */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#E5E5E5] bg-[#FAFAF8] px-5 py-4">
          <span className="text-[#6B6B6B]">🔒</span>
          <div>
            <p className="text-[14px] font-bold text-[#28293D]">
              End of Day (EOD) Sessions
            </p>
            <p className="text-[11px] text-[#6B6B6B] uppercase tracking-wide">
              End-of-day register sessions
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5">DATE</TableHead>
              <TableHead className="px-5">OPEN/CLOSED</TableHead>
              <TableHead className="px-5">REVENUE</TableHead>
              <TableHead className="px-5">CASH / CARD</TableHead>
              <TableHead className="px-5">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eodSessions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="px-5 py-4 font-semibold text-[#28293D]">
                  {s.date}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-[#28293D]">
                  {s.openedBy} / {s.closedBy}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] font-semibold text-[#28293D]">
                  {s.revenue}
                </TableCell>
                <TableCell className="px-5 py-4 text-[13px] text-[#28293D]">
                  Cash: {s.cash} &nbsp; Card: {s.card}
                </TableCell>
                <TableCell className="px-5 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${s.status === "Open" ? "border-[#A8DFC4] text-[#1A7A45]" : "border-[#F5A8A8] text-[#C90000]"}`}
                  >
                    {s.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Data Export */}
      <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <FileSpreadsheet size={16} className="text-[#6B6B6B]" />
          <span className="text-[15px] font-bold text-[#28293D]">
            Data export
          </span>
        </div>
        <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-[10px] border border-[#E5E5E5] px-4 py-3">
          <input
            type="checkbox"
            checked={detailedExport}
            onChange={onToggleDetailedExport}
            className="h-4 w-4 accent-[#5C4A0E]"
          />
          <span className="text-[13px] text-[#28293D]">
            Detailed export (each line = product)
          </span>
        </label>
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: "Orders",
              format: "EXCEL",
              icon: <FileSpreadsheet size={16} />,
            },
            { label: "Inventory", format: "PDF", icon: <Box size={16} /> },
            {
              label: "Audit Log",
              format: "EXCEL",
              icon: <ShieldCheck size={16} />,
            },
            { label: "Customers", format: "EXCEL", icon: <Users size={16} /> },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3 hover:bg-[#F5F0EA] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#6B6B6B]">{item.icon}</span>
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-[#28293D]">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-[#6B6B6B]">{item.format}</p>
                </div>
              </div>
              <Download size={14} className="text-[#6B6B6B]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
