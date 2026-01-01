import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Legend,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getCreditCardUsage,
  getRecentTransactions,
} from "@/api/analytics";

import {
  SummaryResponse,
  CategoryBreakdown,
  MonthlyTrend,
  CreditCardUsage,
  Transaction,
} from "@/types/analytics";
import { useState, useEffect } from "react";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#8b5cf6", "#64748b"];

export default function Dashboard() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[] | null>(null);
  const [monthly, setMonthly] = useState<MonthlyTrend[] | null>(null);
  const [cards, setCards] = useState<CreditCardUsage[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSummary(),
      getCategoryBreakdown(),
      getMonthlyTrends(),
      getCreditCardUsage(),
      getRecentTransactions(),
    ])
      .then(([s, c, m, cc, t]) => {
        setSummary(s);
        setCategories(c);
        setMonthly(m);
        setCards(cc);
        setTransactions(t);
      })
      .finally(() => setLoading(false));
  }, [])

  const summaryCards = summary
    ? [
        {
          title: "Total Balance",
          value: `$${summary.total_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          color: "bg-green-500",
        },
        {
          title: "Monthly Income",
          value: `$${summary.total_income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          color: "bg-indigo-500",
        },
        {
          title: "Monthly Expenses",
          value: `$${summary.total_expense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          color: "bg-red-500",
        },
      ]
    : [];

  const categoryTotal = (categories ?? []).reduce((sum, item) => sum + item.amount, 0);

  const categoryChartData = (categories ?? []).map((c) => ({
    name: c.category_id,
    value: c.amount,
  }));

  const monthlyChartData = (monthly ?? []).map((m) => ({
    month: String(m.month),
    income: m.income,
    expense: m.expense,
  }));

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <AppHeader title="Save It" notificationsCount={3} />
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <AppHeader title="Save It" notificationsCount={3} />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((s) => (
          <Card key={s.title} className={`${s.color} text-white rounded-3xl shadow-xl`}>
            <CardContent className="p-6">
              <p className="text-sm opacity-80">{s.title}</p>
              <p className="text-2xl font-semibold mt-2">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 rounded-3xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Recent Transactions</h2>
              <Button variant="outline">View All</Button>
            </div>
            <ul className="space-y-4">
              <li className="flex justify-between">Groceries <span className="text-red-500">- $120.00</span></li>
              <li className="flex justify-between">Salary <span className="text-green-500">+ $5,200.00</span></li>
              <li className="flex justify-between">Dining Out <span className="text-red-500">- $150.00</span></li>
              <li className="flex justify-between">Electric Bill <span className="text-red-500">- $250.00</span></li>
            </ul>
            <Button className="mt-6 w-full">+ Add Expense</Button>
          </CardContent>
        </Card>

        {/* Credit Card Usage */}
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">Credit Card Usage</h2>
            {(cards ?? []).map((card, i) => (
              <div
                key={card.id}
                className={cn("rounded-xl p-4 text-white", i % 3 === 0 ? "bg-blue-500" : i % 3 === 1 ? "bg-red-500" : "bg-cyan-500")}
              >
                <p className="text-sm opacity-80">
                  {card.name} •••• {card.last_four}
                </p>
                <p className="text-xl font-semibold">${card.used.toFixed(2)}</p>
                <div>
                  <div className="h-2 bg-white rounded" style={{ width: `${(card.used / card.limit) * 100}%`}} />
                </div>
                <p className="text-xs mt-1">${Math.round((card.used / card.limit) * 100)} % of ${card.limit}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Expense Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                {categoryChartData.map((item, i) => {
                  const pct = categoryTotal ? Math.round((item.value / categoryTotal) * 100) : 0;

                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      labelLine={false}
                      label={({ percent = 0 }) => `${Math.round(percent * 100)}%`}
                    >
                      {categoryChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => {
                        const v = typeof value === "number" ? value : Number(value ?? 0);
                        const pct = categoryTotal ? Math.round((v / categoryTotal) * 100) : 0;
                        return [`${v} (${pct}%)`, "Amount"];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Spending Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
                <Tooltip />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
