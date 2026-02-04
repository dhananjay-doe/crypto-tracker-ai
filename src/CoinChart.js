import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CoinChart({ coinId }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        
       
        const prices = response.data.prices.map(price => price[1]);
        const labels = response.data.prices.map(price => {
          let date = new Date(price[0]);
          return date.toLocaleDateString();
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Price (7 Days)',
              data: prices,
              borderColor: '#61dafb',
              backgroundColor: 'rgba(97, 218, 251, 0.1)',
              fill: true,
              tension: 0.4, 
            },
          ],
        });
      } catch (error) {
        console.error("Chart data error:", error);
      }
    };
    fetchChartData();
  }, [coinId]);

  if (!chartData) return <p>Loading Chart...</p>;

  return <Line data={chartData} options={{ responsive: true, elements: { point: { radius: 0 } } }} />;
}

export default CoinChart;