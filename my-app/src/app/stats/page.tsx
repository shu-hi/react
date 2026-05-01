"use client";
import React, { useState } from 'react';
import './app.css';
import { ApiResult } from './commonTypes';
import MainWindowComponent from './MainWindowComponent';
import SubWindowComponent from './SubWindowComponent';
import ResultWindowComponent from './ResultWindowComponent';
import FilePathSetComponent from './FilePathSetComponent';
import { CLIENT_STATIC_FILES_PATH } from 'next/dist/shared/lib/constants';


const App: React.FC = () => {
  const [sql_1,setSql_1] = useState<string>("");
  const [sql_2,setSql_2] = useState<string>("");
  const [result_1, setResult_1] = useState<ApiResult<any[]>|null>(null);
  const [result_2, setResult_2] = useState<ApiResult<any[]>|null>(null);
  const [spinner,setSpinner]=useState<boolean>(false);
  const [csvPath,setCsvPath]=useState<string[]>(['']);
  const [gssPath,setGssPath]=useState<string[]>(['']);
  const [statsResult,setStatsResult]=useState<ApiResult<any[]>|null>(null);
  const [expectation,setExpectation]=useState<number>(0);
  
  const commandList={t_1:'single t-test',paired_t:'paired t-test',unpaired_t:'un-paired t-test'}
  const execute=async(command:string,sqlNumber:1|2,type:'init'|'getData'|'getStats')=>{
    setSpinner(true);
    try{
      const sql=sqlNumber==1?sql_1:sql_2;
      const payloadDict={init:{ csv_path:csvPath,gss_path:gssPath,query:''},
                          getData:{ query: sql,params:[] ,csv_path:csvPath,gss_path:gssPath},
                          getStats:{ type:command,expectation:expectation,both_side:true,target:'target',query_1:sql_1,query_2:sql_2}}
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stats/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadDict[type]),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if(type=='getStats'){
        setStatsResult(data);
      }else{
        if(sqlNumber==1){
          setResult_1(data);
        }else{
          setResult_2(data);
        }
        
      }
    }catch(e:unknown){
      const errres={status:'ng',error: e instanceof Error ? e.message : String(e),data:[],blob:''};
      if(sqlNumber==1){
        setResult_1(errres);
      }else{
        setResult_2(errres);
      }
    }
    setSpinner(false);
  };

  return (
    <div className="min-h-screen items-center justify-center p-8 bg-[#c0c6c9]">
      {!!spinner&&(
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className='grid-item border rounded'>
            <FilePathSetComponent setFilePath={setGssPath} filePath={gssPath} sheetType='gss'/>
            <FilePathSetComponent setFilePath={setCsvPath} filePath={csvPath} sheetType='csv'/>
            <button onClick={(e)=>execute('',1,'init')}>initialize</button>
            <textarea
              placeholder="sql_1"
              value={sql_1}
              onChange={(e) => {setSql_1(e.target.value);
                                e.target.style.height = "auto"; // textareaサイズ拡大処理
                                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="border rounded px-3 py-2 overflow-hidden resize-none w-4/5"
              required
            />
              
            <button
              onClick={(e)=>execute('',1,'getData')}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              execute
            </button>
            <textarea
              placeholder="sql_2"
              value={sql_2}
              onChange={(e) => {setSql_2(e.target.value);
                                e.target.style.height = "auto"; // textareaサイズ拡大処理
                                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="border rounded px-3 py-2 overflow-hidden resize-none w-4/5"
              required
            />
              
            <button
              onClick={(e)=>execute('',2,'getData')}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              execute
            </button>
          <div>
            <input 
              type='number'
              placeholder="expectation"
              value={expectation}
              onChange={(e)=>{setExpectation(e.target.valueAsNumber)}}
              />:expectation
            </div>
            {Object.entries(commandList).map(([command,description])=>(<div key={command}><button onClick={(e)=>execute(command,1,'getStats')}>{description}</button></div>))}
          
        </div>
        <SubWindowComponent subResult={statsResult} />
        <MainWindowComponent result={result_1} />
        <ResultWindowComponent statsResult={statsResult} />
        <MainWindowComponent result={result_2} />
      </div>
    </div>
  );
};

export default App;