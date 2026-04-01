"use client";
import React, { useState } from 'react';
import './app.css';
import { ApiResult } from './commonTypes';
import MainWindowComponent from './MainWindowComponent';
// Itemの型定義
type Sql = 
   string;
;

const App: React.FC = () => {
  const [sql,setSql] = useState<Sql>("");
  const [result, setResult] = useState<ApiResult<any[]>|null>(null);
  const [spinner,setSpinner]=useState<boolean>(false);
  const [csvPath,setCsvPath]=useState<string>('');
  const [gssPath,setGssPath]=useState<string>('');
  const execSql = async(e: React.FormEvent) => {
    setSpinner(true);
    try{
      e.preventDefault();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stats/getData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: sql,params:[] ,csv_path:csvPath,gss_path:gssPath}),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    }catch(e:unknown){
      const errres={status:'ng',error: e instanceof Error ? e.message : String(e),data:[]};
      setResult(errres);
    }
    setSpinner(false);
  };
  

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#c0c6c9]">
      {!!spinner&&(
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      
      <form onSubmit={execSql} className="flex flex-col gap-4 w-full max-w-md">
        <textarea
          placeholder="sql"
          value={sql}
          onChange={(e) => {setSql(e.target.value);
                            e.target.style.height = "auto"; // textareaサイズ拡大処理
                            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="border rounded px-3 py-2 overflow-hidden resize-none"
          required
        />
        <input 
          type='text'
          placeholder="csv/path"
          value={csvPath}
          onChange={(e)=>{setCsvPath(e.target.value);}}
          />
          <input 
          type='text'
          placeholder="gss-path"
          value={gssPath}
          onChange={(e)=>{setGssPath(e.target.value);}}
          />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
        >
          execute
        </button>
      </form>
      <MainWindowComponent result={result} />
    </div>
  );
};

export default App;