export interface SummaryResponse {
    total_balance: number;
    total_expense: number;
    total_income: number;
}

export interface CategoryBreakdown {
  category_id: string;
  amount: number;
}

export interface MonthlyTrend {
  month: number;
  income: number;
  expense: number;
}

export interface CreditCardUsage {
  id: string;
  name: string;
  last_four: string;
  limit: number;
  used: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string;
  transaction_date: string;
  category_id?: string;
}