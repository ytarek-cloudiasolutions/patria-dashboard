import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Zap, Target, RefreshCw, Plus } from "lucide-react";

import RevenueExpensesChart from "../components/RevenueExpensesChart";

import PerformanceIndicators from "../components/PerformanceIndicators";
import TransactionsTable from "../components/TransactionsTable";
import OverviewCard from "@/shared/components/OverviewCard";
import AddTransactionDialog from "../components/AddTransactiondialog";
import RevenueBreakdown from "../components/RevenueBreakDown";
import { transactionsData } from "../data";
import type { Transaction, FinancialTab, NewTransactionForm } from "../types";



let idCounter = 100;

const FinancialHubPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsData);
  const [activeTab, setActiveTab] = useState<FinancialTab>("overview");
  const [dialogOpen, setDialogOpen] = useState(false);

  // --- Derived stats ---
  const totalRevenue = useMemo(
    () => transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0),
    [transactions]
  );

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // --- Tab data ---
  const expenseRows = useMemo(
    () => transactions.filter((t) => t.type === "expense" && !t.isSalary),
    [transactions]
  );

  const salaryRows = useMemo(
    () => transactions.filter((t) => t.isSalary),
    [transactions]
  );

  // --- Add transaction ---
  const handleAddTransaction = (form: NewTransactionForm) => {
    const newTxn: Transaction = {
      id: `txn-${++idCounter}`,
      statement: form.statement,
      category: form.category as Transaction["category"],
      amount: form.type === "income" ? form.amount : -form.amount,
      date: form.date,
      type: form.type,
      isSalary: form.isSalary,
      status: "Registered",
    };
    setTransactions((prev) => [newTxn, ...prev]);
  };

  const tabs: { key: FinancialTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "expenses", label: "Expenses" },
    { key: "salaries", label: "Salaries" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#28293D]">Financial Hub</h1>
          <p className="text-[14px] text-[#8B8B8B] mt-1">
            Revenue, expense, and profitability management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTransactions(transactionsData)}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E5E5E5] bg-white hover:bg-[#F5F0EA] transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="size-4 text-[#5C4A1E]" />
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-[5px] bg-[#5C4A1E] text-white text-[14px] font-semibold hover:bg-[#3d3012] transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            New Transaction
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <OverviewCard
          data={{
            title: "Total Revenue",
            value: `EGP ${totalRevenue.toLocaleString()}`,
            icon: <TrendingUp className="size-5" />,
            badgeColor: "bg-[#FFF0E6]",
            iconColor: "text-[#E07B39]",
          }}
        />
        <OverviewCard
          data={{
            title: "Total Expenses",
            value: `EGP ${totalExpenses.toLocaleString()}`,
            icon: <TrendingDown className="size-5" />,
            badgeColor: "bg-[#FFF0F0]",
            iconColor: "text-[#C90000]",
          }}
        />
        <OverviewCard
          data={{
            title: "Net Profit",
            value: `EGP ${netProfit.toLocaleString()}`,
            icon: <Zap className="size-5" />,
            badgeColor: "bg-[#E6F9F5]",
            iconColor: "text-[#00897B]",
          }}
        />
        <OverviewCard
          data={{
            title: "Profit Margin",
            value: `${profitMargin.toFixed(1)}%`,
            icon: <Target className="size-5" />,
            badgeColor: "bg-[#FFF8E6]",
            iconColor: "text-[#F5A623]",
          }}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E5E5] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-8 py-3 text-[14px] font-medium transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "border-b-2 border-[#5C4A1E] text-[#5C4A1E]"
                : "text-[#8B8B8B] hover:text-[#28293D]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-5">
          <RevenueExpensesChart revenue={totalRevenue} expenses={-totalExpenses} />

          <div className="grid grid-cols-2 gap-5">
            <RevenueBreakdown transactions={transactions} />
            <PerformanceIndicators transactions={transactions} totalOrders={20} />
          </div>

          {/* Statement table */}
          <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
            <TransactionsTable transactions={transactions} showStatus={false} />
          </div>
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
          <TransactionsTable transactions={expenseRows} showStatus />
        </div>
      )}

      {activeTab === "salaries" && (
        <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
          <TransactionsTable transactions={salaryRows} showStatus />
        </div>
      )}

      {/* Dialog */}
      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default FinancialHubPage;