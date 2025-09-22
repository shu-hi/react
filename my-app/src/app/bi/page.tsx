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
  const execSql = async(e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://54.65.233.242/api/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql: sql,params:[] }),
  });
  const data = await res.json();
  console.log(data);
  setResult(data);
  };


  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">フォーム</h1>
      <form onSubmit={execSql} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="sql"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          送信
        </button>
      </form>
      {result && result.status === 'ok' && result.data?.length > 0 && (
          <div className="mt-8 p-4 border rounded w-4/5">
            <h2 className="text-2xl font-semibold mb-2">結果</h2>
            <table className="table-auto border-collapse border">
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
                        {value === null ? '-' : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default App;
