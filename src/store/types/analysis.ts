export interface AnalysisState {
    analysisLoading: boolean;
    error: string | null;
    analysisSuccess: boolean;
    message: string;
    monthly_analysis: MonthlyAnalysis | null;
    weekly_analysis: WeeklyAnalysis | null;
    daily_analysis: DailyAnalysis | null;
}

export interface GetMonthlyAnalysisRequest {
    month: number;
    year: number;
}

export interface GetWeeklyAnalysisRequest {
    week: number;
    month: number;
    year: number;
}

export interface GetDailyAnalysisRequest {
    day: number;
    month: number;
    year: number;
}

export interface GetMonthlyAnalysisResponse {
    success: boolean;
    message: string;
    data: MonthlyAnalysis;
}

export interface GetWeeklyAnalysisResponse {
    success: boolean;
    message: string;
    data: WeeklyAnalysis;
}

export interface GetDailyAnalysisResponse {
    success: boolean;
    message: string;
    data: DailyAnalysis;
}

export interface MonthlyAnalysis {
    month: number;
    year: number;
    spent_amount: number;
    owed_to_amount: number;
    owed_by_amount: number;
}

export interface WeeklyAnalysis {
    week: number;
    month: number;
    year: number;
    spent_amount: number;
    owed_to_amount: number;
    owed_by_amount: number;
}

export interface DailyAnalysis {
    day: number;
    month: number;
    year: number;
    spent_amount: number;
    owed_to_amount: number;
    owed_by_amount: number;
}
