"use client";
import React, {useEffect, useState } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";
interface LoginProps {
  setLogin: (status: number) => void;
  setToken: (token: string) => void;
}
type HealthCheckApiResponse = {
  status: string;
  data: null|{[key:string]:boolean}[];
  err:string|null;
};


function HealthCheckBoxes({ setLogin, setToken }: LoginProps) {
  const [healthCheck, setHealthCheck] = useState<{[key:string]:boolean}>({});
  const [inputDate, setInputDate] = useState('');
  const [visible, setVisible] = useState(true);
  const storedToken = sessionStorage.getItem('access_token');
  function getFormattedDate(): string {
    const today = new Date();
    
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるので +1
    const day = today.getDate().toString().padStart(2, '0'); // 2桁にするために0埋め
  
    return `${year}-${month}-${day}`;
  }
  const formatedDateString = getFormattedDate()
  useEffect(() => {
    
    fetchHealthData();
    setInputDate(formatedDateString);
    
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formatedDateString);
    try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/set_health_check`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`
                },
          body: JSON.stringify({ date: inputDate,healthCheck})
        }
      );
      const data: {status:string,data:any,err:null|string} = await res1.json();
      if(data&&data.status=='ok'){
        toast.success('登録成功しました');
        setVisible(false);
      }else{
        toast.error('登録に失敗しました。')
      }
    } catch (err) {
      console.error('Error setting checklist:', err);
    }
  };
  const fetchHealthData=async()=>{
      try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/get_health_check`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`,
                },
          body: JSON.stringify({ date: formatedDateString})
        }
      );
      
      const data: HealthCheckApiResponse = await res1.json();
      if(data.status=='ok'&& data.data && data.data.length == 1){
        setVisible(false);
        setHealthCheck(data.data[0]);
        
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  const checkList={"attr_1":["原材料の受け入れの確認","外装、におい、品温、包装の状態など"],
                    "attr_2":["冷蔵・冷凍庫内の温度の確認","機器温度チェックシートに記入漏れはないか？"],
                    "attr_3":["交差（二次）汚染の防止","	用途別仕様（まな板やダスターの使い分け）、冷蔵庫内の区分けなど"],
                    "attr_4":["器具などの洗浄・消毒","使用したあとの器具など"],
                    "attr_5":["下痢、腹痛、発熱、吐き気、嘔吐等の症状はない","食品に直接触れない"],
                    "attr_6":["手指等に外傷（やけど、切り傷等の化膿創）無ければチェック","食品に触れないポジションにつく,手袋を着用"],
                    "attr_7":["手のひらから見て、指先から爪先が見えないくらい短く切っている","見えていたら爪を切る"],
                    "attr_8":["作業着等は清潔なものに交換している（洗濯した物を使用）","責任者判断"],
                    "attr_9":["マニュアル通りの手洗いを実行",""],
                    "attr_10":["衛生的な手洗いの実施","トイレ後、調理前、ゴミを触ったあとなど"],
                    "attr_11":["非加熱で提供","洗浄・冷蔵・調理前後の手洗い等が問題なく行われたか？"],
                  };
  
  return (
    <div className="App flex bg-zinc-700" >
      <div className="w-full max-w-xs m-auto bg-zinc-100 rounded p-5">
        <header>
          <img className="w-20 mx-auto mb-5" src="https://img.icons8.com/fluent/344/year-of-tiger.png" />
        </header> 
        <form onSubmit={handleSubmit} className="health-check-form" style={{display:visible?'block':'none'}}>
          <div>
            <label className="block mb-2 text-zinc-500">ID</label>
            <input
              type="date"
              placeholder="id"
              className="w-full p-2 mb-6 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              value={formatedDateString}
              onChange={(e)=>setInputDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            {Object.entries(checkList).map(([key, values]) => (
              <div key={key} className="mb-4">
                <input type='checkbox'
                        name={key}
                        checked={healthCheck[key] || false}
                        onChange={(e)=>{
                          let _copy = { ...healthCheck };
                          _copy[key]=e.target.checked;
                          setHealthCheck(_copy);
                        }}/>
                <span>
                  {values[0]}
                </span>
                <br />
                <span className='text-sm'>
                  {values[1]}
                </span>
              </div>
            ))}
          </div>
          <div>
            <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">
              submit
            </button>
          </div>
        </form>
        <button style={{display:Object.keys(healthCheck).length>0?'block':'none'}} onClick={()=>setVisible(visible?false:true)} className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">{visible?'非表示':'登録済み内容を確認'}</button>
      </div>
    </div>
  );
}

export default HealthCheckBoxes;


