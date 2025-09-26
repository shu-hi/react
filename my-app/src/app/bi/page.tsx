"use client";
import React, { useState } from 'react';
import './app.css';

// Itemの型定義
type Sql = 
   string;
;
type ApiResult = {
  status: string;
  error: string;
  data: any;
};
const App: React.FC = () => {
  const [sql,setSql] = useState<Sql>("");
  const [result, setResult] = useState<ApiResult|null>(null);
  const [plotUrl, setPlotUrl] = useState<string | null>(null);

  const execSql = async(e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://54.65.233.242/api/head", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql: sql,params:[] }),
  });
  const data = await res.json();
  console.log(data);
  setResult(data);
  };
  const getColumn=async(text:string)=>{
    const match = (text.match(/from (\S+)/i) || [])[1] || "";
    if(match){
      const res = await fetch("http://54.65.233.242/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: "describe "+match,params:[] }),
    });
    const data = await res.json();
    console.log(data);
    setResult(data);
    }
  }
  const makePlot=async()=>{
    try{
      const res=await fetch("http://54.65.233.242/api/plot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: sql,params:[] }),
      });
      if (!res.ok) {
      throw new Error("Plot request failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob); // 一時URLを作成
    setPlotUrl(url);
    } catch (err) {
      console.error("Error generating plot:", err);
    }
  }
  
  

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <button type="button" onClick={makePlot}>plot</button>
      {plotUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Plot</h2>
          <img src={plotUrl} alt="Plot Image" className="border rounded max-w-full" />
        </div>
      )}

      <form onSubmit={execSql} className="flex flex-col gap-4 w-full max-w-md">
        <textarea
          placeholder="sql"
          value={sql}
          onChange={(e) => {setSql(e.target.value);
                            getColumn(e.target.value);
                            e.target.style.height = "auto"; // textareaサイズ拡大処理
                            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="border rounded px-3 py-2 overflow-hidden resize-none"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          execute
        </button>
      </form>
      {result && result.status === 'ok' && result.data?.length > 0 && (
          <div className="mt-8 p-4 border rounded w-5/5">
            <h2 className="text-2xl font-semibold mb-2">result(head)</h2>
            <table className="table-auto border-collapse border max-h-screen max-w-screen overflow-auto">
              <thead>
                <tr>
                  {Object.keys(result.data[0]).map((key) => (
                    <th key={key} className="border px-2 py-1 bg-gray-100 text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="border px-2 py-1 text-sm">
                        {value === null ? '-' : String(value).slice(0,25)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {result && result.status === 'ng' && result.error?.length > 0 && (
          <div className="mt-8 p-4 border rounded w-4/5">
            {result.error}
          </div>
        )}
    </div>
  );
};

export default App;
