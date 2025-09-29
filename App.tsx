import React, { useState, useCallback } from 'react';
import type { StockDataPoint, PredictionPoint } from './types';
import { getStockAnalysis } from './services/geminiService';
import StockInput from './components/StockInput';
import StockChart from './components/StockChart';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionPoint[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTicker, setCurrentTicker] = useState<string | null>(null);
  const [isMockAnalysis, setIsMockAnalysis] = useState<boolean>(false);

  const handleAnalysis = useCallback(async (selectedTicker: string) => {
    if (!selectedTicker) {
      setError('Please enter a stock ticker.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStockData([]);
    setAnalysis('');
    setPredictionData([]);
    setIsMockAnalysis(false);
    setCurrentTicker(selectedTicker.toUpperCase());

    try {
      // Get historical data, analysis, and prediction from the Gemini service
  const aiResponse = await getStockAnalysis(selectedTicker.toUpperCase());
      
      setStockData(aiResponse.historicalData);
      setAnalysis(aiResponse.analysis);
      setPredictionData(aiResponse.prediction);
      setIsMockAnalysis(aiResponse.isMock ?? false);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setStockData([]);
      setAnalysis('');
      setPredictionData([]);
      setCurrentTicker(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-accent" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 11h1v5H2V11zm3 0h1v5H5V11zm3 0h1v5H8V11zm3 0h1v5h-1V11zm3-9h1v14h-1V2zM2 2h1v7H2V2zm3 0h1v7H5V2zm3 0h1v7H8V2zm3 0h1v7h-1V2z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-primary font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-2">
            <ChartIcon />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Stock Trend Forecaster</h1>
          </div>
          <p className="text-lg text-gray-400">
            Analyze historical stock data and get forecasts for any stock.
          </p>
        </header>

        <div className="max-w-3xl mx-auto mb-10">
          <StockInput
            ticker={ticker}
            setTicker={setTicker}
            onAnalyze={handleAnalysis}
            isLoading={isLoading}
          />
        </div>

        {error && (
          <div className="max-w-4xl mx-auto my-6 p-4 bg-red-900/50 border border-highlight-red rounded-lg text-center text-red-200">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        
      {isLoading && (
       <div className="flex flex-col items-center justify-center h-64">
         <LoadingSpinner />
         <p className="mt-4 text-gray-300 text-lg">
           Generating data and analysis for <span className="font-bold text-accent">{currentTicker}</span>...
         </p>
       </div>
      )}

        {!isLoading && stockData.length > 0 && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <StockChart data={stockData} predictionData={predictionData} ticker={currentTicker!} />
            </div>
            <div className="lg:col-span-2">
              <AnalysisDisplay analysis={analysis} isMock={isMockAnalysis} />
            </div>
          </div>
        )}

        {!isLoading && !error && stockData.length === 0 && (
           <div className="text-center py-16 px-6 bg-secondary rounded-lg max-w-4xl mx-auto">
              <ChartIcon />
              <h2 className="mt-4 text-2xl font-semibold text-white">Welcome to the Forecaster</h2>
              <p className="mt-2 text-gray-400">
                Enter any stock ticker (e.g., GOOGL, RELIANCE.NS) to begin your analysis.
              </p>
          </div>
        )}

      </main>
      <footer className="text-center p-4 mt-10 text-gray-500 text-sm">
  <p>Disclaimer: This is a project for demonstration purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
};

export default App;