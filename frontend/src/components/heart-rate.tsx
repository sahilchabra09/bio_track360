import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

export default function HeartRateComponent() {
  const [ecgData, setEcgData] = useState<number[]>([]);  // ECG data
  const [timeLabels, setTimeLabels] = useState<string[]>([]);  // Time labels
  const [temperature, setTemperature] = useState<number | null>(null);  // Temperature state

  const chartData = {
    labels: timeLabels,
    datasets: [{
      label: 'ECG Data',
      data: ecgData,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
      tension: 0.1
    }]
  };

  const chartOptions = {
    animation: {
      duration: 0
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxTicksLimit: 20
        }
      },
      y: {
        title: {
          display: true,
          text: 'ECG Value'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Fetch sensor data and update chart every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  async function fetchSensorData() {
    try {
      console.log('Fetching sensor data...');

      const response = await fetch('https://rehab360.pythonanywhere.com/api/sensor-data/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetched data:', data);

      if (Array.isArray(data.ecg)) {
        const timeNow = new Date().toLocaleTimeString();

        setEcgData((prevEcgData) => {
          const updatedEcgData = [...prevEcgData, ...data.ecg];
          console.log('Updated ECG Data:', updatedEcgData);
          return updatedEcgData.slice(-140);  // Keep the last 140 data points
        });

        setTimeLabels((prevLabels) => {
          const updatedLabels = [...prevLabels, timeNow];
          console.log('Updated Time Labels:', updatedLabels);
          return updatedLabels.slice(-140);  // Keep the last 140 labels
        });

        // Update temperature
        setTemperature(data.temperature);  // Store the temperature in the state
      } else {
        console.error('Invalid ECG data format');
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }

  return (
    <div className="sensor-data-container">
      <h2 className="text-2xl font-bold mb-4">Heart Rate Monitor</h2>

      {/* Display Temperature */}
      <div className="mb-4">
        <h3 className="text-xl">Temperature: {temperature ? `${temperature} °C` : 'Loading...'}</h3>
      </div>

      {/* ECG Line Chart */}
      <div className="mb-6">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
