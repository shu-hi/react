"use client";
import React, {useEffect, useState } from 'react';
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
import { RevalidateStore } from 'next/dist/server/app-render/work-unit-async-storage.external';
import { Source_Serif_4 } from 'next/font/google';

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
  sum:number[]
};


type ApiResponse = {
  x: number;
  y: number;
  zoom_level: number;
  population: Props;
  population_rate:Rates;
};
type Rates={data:(string|number)[][],year:string[]}

function App() {
  const [mapHtml, setMapHtml] = useState('');
  const [query, setQuery] = useState('');
  const [years, setYears] = useState<number[]>([]);
  const [sum, setSum] = useState<number[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[][]>([]);
  const [rateData,setRateData]=useState<Rates>({data: [],year: [],});
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
      setSum(data.population.sum);
      setRateData(data.population_rate);
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
              sum={sum}
            />
          </div>
          
        )}
        <div>
            <PopulationComparison
              population_rate={rateData}
              population_sum={sum}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


function PopulationStackedChart({ years, ages, data,sum }: Props) {
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
function PopulationComparison({ population_rate, population_sum }: { population_rate: Rates, population_sum: number[] }){
  console.log("popurate",population_rate.data);
  if(!population_rate.data[0]){
    return <div>nainai</div>;
  }
  
  console.log(population_rate.data[0]);
  return (
    <div>
      <h2>人口比較（2025年基準）</h2>
      <div style={{display:'flex'}}>
      <div style={{border:'solid',maxWidth:'100px',textAlign: 'center',padding: '5px',}}>
        {population_rate.data[0][1]}
        <div style={{border:'solid',textAlign: 'center',padding: '5px',}}>
          {population_rate.data[1][1]}
          <div style={{border:'solid',textAlign: 'center',padding: '5px',}}>
            メッシュ
          </div>
        </div>
      </div>
      <div>
      <table>
        <thead>
          <tr>
            {population_rate.year.slice(4,9).map((year,i)=>{
              return(
                <th
                  key={i}>
                  {year}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>         
            {population_rate.data[0].slice(4,9).map((popsum, i) => {
              const growthFrom2025 = (Number(popsum) - Number(population_rate.data[0][4])) / Number(population_rate.data[0][4])*10; // 各年の伸び幅計算
              const color = getColorForGrowth(growthFrom2025);
              return (
                <td
                  key={i}
                  style={{
                    backgroundColor: color,
                    textAlign: 'center',
                    padding: '10px',
                  }}
                >
                  {popsum.toLocaleString()}
                  {makeInnerDiv(i,population_rate.data[1].slice(4,9),makeInnerDiv(i,population_sum.slice(0, 5),null))}
                </td>
              );
            })}
          </tr> 
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th colSpan={10}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {[...Array(10)].map((_, i:number) => parseFloat(((i/10)-0.5).toFixed(1))).map((num,index)=>{
              const color = getColorForGrowth(num);
              return (
              <td key={index}
                style={{
                  backgroundColor: color,
                  textAlign: 'center',
                  padding: '10px',}}>
                  {Math.round((num)*10)+"%"}
              </td>);
            })}
          </tr>
        </tbody>
      </table>
      </div>
      </div>
    </div>
  );
}
const getColorForGrowth = (growthPercentage: number): string => {
  return `rgba(${255-(growthPercentage+1)*100}, ${255-(growthPercentage+1)*100},  ${255-(growthPercentage+1)*100},1)`; // デフォルト (白)
};
const makeInnerDiv=(index:number,givenarr:(number|string)[],innerDiv:React.JSX.Element|null)=>{
  const popuarr=givenarr;
  const growthFrom2025 = (Number(popuarr[index]) - Number(popuarr[0])) / Number(popuarr[0])*10; // 各年の伸び幅計算
  const color = getColorForGrowth(growthFrom2025);
  //const color = `rgba(0, 149, 217, ${(growthFrom2025+0.5)})`;
  return(
    <div
      style={{
          backgroundColor: color,
          textAlign: 'center',
          padding: '10px',
          border: 'solid',
        }}
    >
     {popuarr[index].toLocaleString()} 
     {innerDiv}    
    </div>
  )
};