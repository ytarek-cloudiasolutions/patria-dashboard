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
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { RevenuePoint } from "../types";

interface RevenueTrendChartProps {
  data: RevenuePoint[];
}

const chartConfig = {
  value: {
    label: "Revenue",
    color: "#8F6900",
  },
} satisfies ChartConfig;

const CustomYTick = (props: any) => {
  const { x, y, payload } = props;
  const tickX = typeof x === "number" ? Math.max(x - 65, 0) : 0;
  return (
    <text
      x={tickX}
      y={y + 3}
      fill="#595959"
      fontSize={10}
      fontWeight={500}
      textAnchor="start"
      dominantBaseline="middle"
    >
      {`EGP\u00A0${payload.value}`}
    </text>
  );
};

const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
  const { t } = useTranslation();

  return (
    <Card className="gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between rounded-t-[16px] bg-[#F5F0EA] px-4 py-3 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-[18px] font-bold leading-[19.26px] tracking-[0.36px] text-[#333333]">
            {t("Revenue trend")}
          </CardTitle>
          <p className="text-[12px] font-normal leading-[16.80px] tracking-[0.24px] text-[#595959]">
            {t("Last 7 days")}
          </p>
        </div>
        <Activity className="size-6 text-[#000000]" />
      </CardHeader>
      <CardContent className="px-2 py-6 sm:px-4 sm:py-6" dir="ltr" style={{ direction: "ltr" }}>
        <ChartContainer
          config={chartConfig}
          className="h-56 w-full sm:h-64 lg:h-72 aspect-auto [direction:ltr]"
          dir="ltr"
          style={{ direction: "ltr" }}
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8F6900" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#8F6900" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EFEFEF" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              interval={0}
              tick={{ fill: "#595959", fontSize: 10, fontWeight: 500 }}
            />
            <YAxis
              orientation="left"
              axisLine={false}
              tickLine={false}
              width={75}
              domain={[0, 8000]}
              ticks={[0, 2000, 4000, 6000, 8000]}
              tick={<CustomYTick />}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => (
                    <span className="font-semibold text-[#333333]">
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
              stroke="#8F6900"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3.5, fill: "#8F6900", stroke: "#FFFFFF", strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: "#8F6900", stroke: "#FFFFFF", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;
