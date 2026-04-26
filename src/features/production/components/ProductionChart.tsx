import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import { Activity } from "lucide-react";
import type { ChartDataPoint } from "../types";


interface ProductionChartProps {
  data: ChartDataPoint[];
}

const chartConfig: ChartConfig = {
  efficiency: {
    label: "Efficiency",
    color: "#7A6518",
  },
};

const ProductionChart = ({ data }: ProductionChartProps) => {
  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[16px] font-bold text-[#28293D]">Production</p>
          <p className="text-[11px] text-[#6B6B6B]">Manufacturing &amp; Quality Control</p>
        </div>
        <Activity size={18} className="text-[#7A6518]" />
      </div>

      <ChartContainer config={chartConfig} className="h-[180px] w-full">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7A6518" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#7A6518" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
          <XAxis
            dataKey="batch"
            tick={{ fontSize: 10, fill: "#8B8B8B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10, fill: "#8B8B8B" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[20, 40, 60, 80, 100]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="efficiency"
            stroke="#7A6518"
            strokeWidth={2}
            strokeDasharray="5 3"
            fill="url(#efficiencyGradient)"
            dot={{ fill: "#7A6518", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#5C4A0E" }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default ProductionChart;