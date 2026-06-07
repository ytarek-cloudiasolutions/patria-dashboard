import { Activity } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PRODUCTION_CHART_DATA } from "../data";

const HEIGHT = 200;
const WIDTH = 320;
const PADDING = { top: 16, right: 16, bottom: 28, left: 32 };

const ProductionChart = () => {
  const data = PRODUCTION_CHART_DATA;
  const max = 100;
  const innerW = WIDTH - PADDING.left - PADDING.right;
  const innerH = HEIGHT - PADDING.top - PADDING.bottom;

  const points = data.map((d, i) => {
    const x = PADDING.left + (innerW * i) / Math.max(1, data.length - 1);
    const y = PADDING.top + innerH - (d.value / max) * innerH;
    return { x, y, label: d.label, value: d.value };
  });

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${path} L${points[points.length - 1].x},${PADDING.top + innerH} L${points[0].x},${PADDING.top + innerH} Z`;

  const gridLines = [100, 80, 60, 40, 20];

  return (
    <Card className="h-full gap-0 overflow-hidden rounded-2xl bg-white py-0 ring-0">
      <div className="flex items-center justify-between gap-6 bg-[#F5F0EA] px-6.5 py-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-[20px] font-bold text-[#333333]">Production</h3>
          <p className="text-[12px] font-normal text-[#595959]">
            Manufacturing &amp; Quality Control
          </p>
        </div>
        <Activity size={20} className="size-6 text-[#28293D]" />
      </div>

      <CardContent className="flex h-full flex-col gap-8 px-4 py-3">
        <div className="flex-1">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-full w-full"
            preserveAspectRatio="none"
            role="img"
            aria-label="Production trend chart"
          >
            <defs>
              <linearGradient id="prod-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8F6900" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8F6900" stopOpacity="0" />
              </linearGradient>
              <clipPath id="prod-reveal">
                <rect x="0" y="0" height={HEIGHT} width="0">
                  <animate
                    attributeName="width"
                    from="0"
                    to={WIDTH}
                    dur="1.4s"
                    begin="0s"
                    fill="freeze"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                  />
                </rect>
              </clipPath>
            </defs>

            {/* horizontal grid lines */}
            {gridLines.map((g) => {
              const y = PADDING.top + innerH - (g / max) * innerH;
              return (
                <g key={g}>
                  <line
                    x1={PADDING.left}
                    x2={WIDTH - PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="#F0F0F0"
                    strokeWidth={1}
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 3}
                    fontSize={9}
                    fill="#8B8B8B"
                    textAnchor="end"
                  >
                    {g}%
                  </text>
                </g>
              );
            })}

            {/* Animated reveal group — area + line + points unmask left→right */}
            <g clipPath="url(#prod-reveal)">
              <path d={areaPath} fill="url(#prod-area)" stroke="none" />

              <path
                d={path}
                fill="none"
                stroke="#8F6900"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray="6 5"
              />

              {points.map((p) => (
                <circle
                  key={p.label}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill="#8F6900"
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                />
              ))}
            </g>

            {/* x-axis labels — anchor first/last to keep them inside the viewBox */}
            {points.map((p, i) => {
              const anchor =
                i === 0
                  ? "start"
                  : i === points.length - 1
                    ? "end"
                    : "middle";
              return (
                <text
                  key={`label-${p.label}`}
                  x={p.x}
                  y={HEIGHT - 8}
                  fontSize={10}
                  fill="#8B8B8B"
                  textAnchor={anchor}
                >
                  {p.label}
                </text>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionChart;
