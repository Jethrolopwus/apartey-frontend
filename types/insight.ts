export interface StatsByCategory {
  category: string;
  total: number;
  successful: number;
  successRate: number;
  changeFromLastMonth: number | string;
}

export interface TotalReviews {
  count: number;
  changeFromLastMonth: number;
}

export interface CountryPerformance {
  country: string;
  count: number;
  percentage: string;
}

export interface TypeDistribution {
  type: string;
  count: number;
  percentage: string;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}

export interface MonthlyTrends {
  All: MonthlyTrend[];
  Rent: MonthlyTrend[];
  Sale: MonthlyTrend[];
  Swap: MonthlyTrend[];
}

export interface InsightStatsResponse {
  statsByCategory: StatsByCategory[];
  totalSuccessfulTransactions: number;
  totalReviews: TotalReviews;
  countryPerformance: CountryPerformance[];
  typeDistribution: TypeDistribution[];
  monthlyTrends: MonthlyTrends;
}
