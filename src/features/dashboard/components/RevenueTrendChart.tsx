import { Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import type { RevenuePoint } from "../types";

interface RevenueTrendChartProps {
  data: RevenuePoint[];
}

const chartConfig = {
  value: {
    label: "Revenue",
    color: "#A17600",
  },
} satisfies ChartConfig;

const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
  return (
    <Card className="gap-0 rounded-[16px] border-[#F5F0EA] bg-white py-0 shadow-none">
      <CardHeader className="min-h-14 grid-cols-[1fr_auto] items-center rounded-t-[16px] bg-[#F5F0EA] px-4 py-3">
        <div>
          <CardTitle className="text-[18px] font-bold text-[#333333] mb-1">
            Revenue trend
          </CardTitle>
          <p className="text-[12px] text-[#595959]">Last 7 days</p>
        </div>
        <Activity className="size-5 text-[#000000]" />
      </CardHeader>
      <CardContent className="px-4 py-8">
        <ChartContainer
          config={chartConfig}
          className="h-71.25 w-full aspect-auto"
          initialDimension={{ width: 641, height: 304 }}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 8, right: 12, top: 6, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A17600" stopOpacity={0.26} />
                <stop offset="100%" stopColor="#A17600" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EFEFEF" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tickMargin={16}
              interval={1}
              tick={{ fill: "#595959", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={30}
              width={78}
              domain={[0, 8000]}
              ticks={[0, 2000, 4000, 6000, 8000]}
              tickFormatter={(value) => `EGP ${value}`}
              tick={{ fill: "#595959", fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => (
                    <span className="font-medium text-[#28293D]">
                      EGP {Number(value).toLocaleString()}
                    </span>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              fill="url(#revenueFill)"
              stroke="transparent"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#A17600"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: "#A17600", strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#A17600", stroke: "#FFFFFF" }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;
