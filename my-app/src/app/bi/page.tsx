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
  const [didResult,setDid]=useState<ApiResult|null>(null);
  const [llresult,setllResult]=useState<ApiResult|null>(null);
  const [memo,showMemo]=useState<0|1>(0);
  const [spinner,setSpinner]=useState<0|1>(0);
  const [del_outlier,setDelOutlier]=useState<boolean>(false);
  const execSql = async(e: React.FormEvent) => {
    setSpinner(1);
    e.preventDefault();
    const res = await fetch("http://54.65.233.242/api/head", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql: sql,params:[] }),
    });
    const data = await res.json();
    setSpinner(0);
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
  const makeDid=async()=>{
    setSpinner(1);
    const res=await fetch("http://54.65.233.242/api/did", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: sql,params:[],del_outlier:del_outlier }),
    });
    const data = await res.json();
    console.log(data);
    setSpinner(0);
    setDid(data);
  }
  const makeLifelines=async()=>{
    setSpinner(1);
    const res=await fetch("http://54.65.233.242/api/lifelines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: sql,params:[]}),
    });
    const data = await res.json();
    console.log(data);
    setSpinner(0);
    setllResult(data);
  }
  const makePlot=async()=>{
    setSpinner(1);
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
    setSpinner(0);
  }
  const makeHist=async()=>{
    setSpinner(1);
    try{
      const res=await fetch("http://54.65.233.242/api/hist", {
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
    setSpinner(0);
  }
  

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#c0c6c9]">
      {!!spinner&&(
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <button type="button" onClick={makePlot} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">plot</button>
      <button type="button" onClick={makeHist} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">hist</button>
      {plotUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Plot</h2>
          <img src={plotUrl} alt="Plot Image" className="border rounded max-w-full" />
        </div>
      )}
      <button type="button" onClick={makeDid} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">did(must include target,treated,period_flg)</button>
      <label>del outlier</label><input type="checkbox" onChange={(e)=>setDelOutlier(e.target.checked)} />
      {didResult&&didResult.status==='ok'&&didResult.data.summary &&(
        <div>
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Coef</th>
              <th>StdErr</th>
              <th>t</th>
              <th>P-value</th>
              <th>CI Lower(95%信頼区間)</th>
              <th>CI Upper(95%信頼区間)</th>
              <th>outlier</th>
            </tr>
          </thead>
          <tbody>
            {didResult.data.summary.map((row, i) => (
              <tr key={i}>
                <td>{row.Variable}</td>
                <td>{row.Coef.toFixed(3)}</td>
                <td>{row.StdErr.toFixed(3)}</td>
                <td>{row.t.toFixed(2)}</td>
                <td>{row["P>|t|"]}</td>
                <td>{row.CI_lower.toFixed(3)}</td>
                <td>{row.CI_upper.toFixed(3)}</td>
                <td>{row.outlier}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <img src={`data:image/png;base64,${didResult.data.plot}`} alt="DID Plot" />
        
        </div>
      )}
      <button type="button" onClick={makeLifelines} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">lifelines(must include duration,event)</button>
      {llresult && llresult.status === 'ok' && llresult.data?.length > 0 && (
        <div className="mt-8 p-4 border rounded w-5/5">
          <table className="table-auto border-collapse border">
            <thead>
            <tr>
              <th className="border px-4 py-2">Variable</th>
              <th className="border px-4 py-2">Coef</th>
              <th className="border px-4 py-2">exp(coef)=lisk variation rate</th>
              <th className="border px-4 py-2">p</th>
            </tr>
          </thead>
          <tbody>
            {llresult.data.map(row => (
              <tr key={row.variable}>
                <td className="border px-4 py-2">{row.variable}</td>
                <td className="border px-4 py-2">{row.coef}</td>
                <td className="border px-4 py-2">{row["exp(coef)"]}</td>
                <td className="border px-4 py-2">{row.p}</td>
              </tr>
            ))}
            </tbody>
            </table>
          </div>)}
      <button type="button" onClick={()=>showMemo(1)}>show memo</button>
      {memo===1&&(
        <div>{didmemo}
        <br></br>
        {lifelinememo}
        <br></br><button type="button" onClick={()=>showMemo(0)}className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">hide memo</button></div>
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
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
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
                    <th key={key} className="border px-2 py-1 bg-gray-200 text-gray-800 text-left">
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
        {((result && result.status === 'ng' && result.error?.length > 0)||(didResult && didResult.status === 'ng' && didResult.error?.length > 0)) && (
          <div className="mt-8 p-4 border rounded w-4/5">
            {result?.error}
            {didResult?.error}
          </div>
        )}
    </div>
  );
};

export default App;
const didmemo=`select 
date_format(order_time,'%m-%d')as order_date,
m_seller_id,
sum(suryou) as target,
1 as treated,
case when order_time<='2023-11-13' then 0 
when order_time between '2023-11-14' and '2023-11-27' then 1 
else 2 
end as period_flag 
from dami2.order_dat_m as orders inner join 
(select 
distinct seller_id as id_list 
from crush.crush_item_dat 
where event_num=3)
as treated_cos on orders.m_seller_id=treated_cos.id_list where order_time between '2023-08-01' and '2024-02-01' group by juchubi,m_seller_id 
union all 
select 
date_format(order_time,'%m-%d')as order_date,
m_seller_id,
sum(suryou) as target,
0 as treated,
case when order_time<='2023-11-13' then 0 
when order_time between '2023-11-14' and '2023-11-27' then 1 
else 2 
end as period_flag 
from dami2.order_dat_m as orders
left join 
(select 
distinct seller_id as id_list 
from crush.crush_item_dat
where event_num=3)as treated_cos on orders.m_seller_id=treated_cos.id_list
where order_time between '2023-08-01' and '2024-02-01' and treated_cos.id_list is null 
group by order_date,m_seller_id`;
const lifelinememo=`
select 
case when sm.closed_date is not null then datediff(sm.closed_date,sm.moushikomi_date) else datediff(CURDATE(),sm.moushikomi_date) end as duration, 
case when sm.closed_date is not null then 1 else 0 end as event, 
case when (case when sm.closed_date is not null then datediff(sm.closed_date,latest.latest_order) else datediff(CURDATE(),latest.latest_order) end) >30 then 1 else 0 end as no_order_for_month, 
uriage/greatest(1,case when sm.closed_date is not null then datediff(sm.closed_date,sm.moushikomi_date) else datediff(CURDATE(),sm.moushikomi_date) end) as order_per_day 
from dami2.seller_master as sm 
inner join ( select max(order_time) as latest_order, m_seller_id,sum(kingaku) as uriage from dami2.order_dat_m group by m_seller_id) as latest on sm.id=latest.m_seller_id where sm.site='m' `