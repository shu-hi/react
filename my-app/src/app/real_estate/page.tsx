"use client";
import React, { useEffect, useState } from 'react';
import './app.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

type Props = {
  years: number[];
  ages: string[];
  data: number[][];
};
type Population = {
  years: number[];
  ages: string[];
  data: number[][];
};

type ApiResponse = {
  x: number;
  y: number;
  zoom_level: number;
  population: Population;
};

function App() {
  const [mapHtml, setMapHtml] = useState('');
  const [query, setQuery] = useState('');
  const [years, setYears] = useState<number[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[][]>([]);

  React.useEffect(() => {
    const initialMap = async () => {
      try {
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tile2map?x=139.6995&y=35.6905&zoom_level=15`
        );
        const html = await res2.text();
        setMapHtml(html);
      } catch (err) {
        console.error("Error fetching map:", err);
      }
    };
  
    //initialMap();
  }, []); 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/q2tile/${encodeURIComponent(query)}`
      );
      const data: ApiResponse = await res1.json();
      console.log(data);
      setYears(data.population.years);
      setAges(data.population.ages);
      setChartData(data.population.data);
      const res2 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tile2map?x=${data.x}&y=${data.y}&zoom_level=${data.zoom_level}`
      );
      const html = await res2.text();
  
      setMapHtml(html);
    } catch (err) {
      console.error('Error fetching map:', err);
    }
  };

  return (
    <div className="App" >
      <h1>Folium Map in React</h1>
      <div className='main-body'>
        <div className='map' dangerouslySetInnerHTML={{ __html: mapHtml }} />
        <div>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="address"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <button type="submit">
            🔎
          </button>
        </form>
        {years.length > 0 && (
          <div style={{ width: "600px", height: "400px" }}>
            <PopulationStackedChart
              years={years}
              ages={ages}
              data={chartData}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default App;


function PopulationStackedChart({ years, ages, data }: Props) {
  const datasets = ages.map((age, idx) => ({
    label: age,
    data: data.map((row) => row[idx]),
    backgroundColor: `hsl(${idx * 18}, 70%, 60%)`,
  }));

  return (
    <Bar
      data={{
        labels: years,
        datasets,
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: "人口",
            },
          },
        },
      }}
    />
  );
}