export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionPoint {
  date: string;
  predictedClose: number;
}

export interface AnalysisResponse {
    historicalData: StockDataPoint[];
    analysis: string;
    prediction: PredictionPoint[];
    isMock?: boolean;
}