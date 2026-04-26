interface Props {
  revenue: number;
  expenses: number;
}

const RevenueExpensesChart = ({ revenue, expenses }: Props) => {
  const total = revenue + Math.abs(expenses);
  const revenuePercent = total > 0 ? (revenue / total) * 100 : 50;
  const expensesPercent = total > 0 ? (Math.abs(expenses) / total) * 100 : 50;
  const balance = revenue - Math.abs(expenses);
  const balancePercent = revenue > 0 ? ((balance / revenue) * 100).toFixed(1) : "0.0";
  const isNegativeBalance = balance < 0;

  return (
    <div className="bg-white rounded-[16px] border border-[#E5E5E5] p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-[#28293D]">Revenues versus expenses</h2>
        <span
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${
            isNegativeBalance
              ? "bg-[#FFF0F0] text-[#C90000] border-[#FECACA]"
              : "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]"
          }`}
        >
          {isNegativeBalance ? "↘" : "↗"} Balance = {isNegativeBalance ? "" : "+"}{balancePercent}%
        </span>
      </div>

      {/* Stacked Bar */}
      <div className="flex rounded-[8px] overflow-hidden h-[52px] mb-3">
        <div
          className="flex items-center justify-center bg-[#2E7D32] transition-all"
          style={{ width: `${revenuePercent}%` }}
        >
          <div className="text-center">
            <p className="text-white text-[10px] font-medium opacity-80">Revenue</p>
            <p className="text-white text-[13px] font-bold">EGP {revenue.toLocaleString()}</p>
          </div>
        </div>
        <div
          className="flex items-center justify-center bg-[#C62828] transition-all"
          style={{ width: `${expensesPercent}%` }}
        >
          <div className="text-center">
            <p className="text-white text-[10px] font-medium opacity-80">Revenue</p>
            <p className="text-white text-[13px] font-bold">EGP {Math.abs(expenses).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4">
        <span className="flex items-center gap-1.5 text-[12px] text-[#28293D]">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32] inline-block" />
          Revenue ({revenuePercent.toFixed(1)}%)
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#28293D]">
          <span className="w-2 h-2 rounded-full bg-[#C62828] inline-block" />
          Expenses ({expensesPercent.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
};

export default RevenueExpensesChart;