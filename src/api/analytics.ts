import api from "@/api/axios";
import {
    SummaryResponse,
    CategoryBreakdown,
    MonthlyTrend,
    CreditCardUsage,
    Transaction,
} from "@/types/analytics";

export const getSummary = async (): Promise<SummaryResponse> => {
    const res = await api.get("/analytics/summary");
    return res.data;
}

export const getCategoryBreakdown = async (): Promise<CategoryBreakdown[]> => {
  const res = await api.get("/analytics/category-breakdown");
  return res.data;
};

export const getMonthlyTrends = async (): Promise<MonthlyTrend[]> => {
  const res = await api.get("/analytics/monthly-trends");
  return res.data;
};

export const getCreditCardUsage = async (): Promise<CreditCardUsage[]> => {
  const res = await api.get("/analytics/credit-card-usage");
  return res.data;
};

export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const res = await api.get("/analytics/recent-transactions");
  return res.data;
};