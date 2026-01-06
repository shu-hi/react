"use client";
import React, {useEffect, useState } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";

type FridgeCheckApiResponse = {
  status: string;
  data: null|{[key:string]:string}[];
  err:string|null;
};


function FridgeInputs() {
  const [fridgeCheck, setFridgeCheck] = useState<{[key:string]:string}>({});
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
    
    fetchFridgeData();
    setInputDate(formatedDateString);
    
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formatedDateString);
    try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/set_fridge_temp`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`
                },
          body: JSON.stringify({ date: inputDate,fridgeCheck})
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
  const fetchFridgeData=async()=>{
      try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/get_fridge_check`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`,
                },
          body: JSON.stringify({ date: formatedDateString})
        }
      );
      
      const data: FridgeCheckApiResponse = await res1.json();
      if(data.status=='ok'&& data.data && data.data.length == 1){
        setVisible(false);
        setFridgeCheck(data.data[0]);
        
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  const checkList={"fridge_1":["カウンター内左"],
                    "fridge_2":["カウンター内右"],
                    "fridge_3":["ショーケース右"],
                    "fridge_4":["ショーケース左"],
                    "fridge_5":["ショーケース中央"],
                    "body_temp":["自分の検温"]
                  };
  
  return (
    <div className="App flex bg-zinc-700" >
      <div className="w-full max-w-xs m-auto bg-zinc-100 rounded p-5">
        <header>
          <img className="w-20 mx-auto mb-5" src="https://img.icons8.com/fluent/344/year-of-tiger.png" />
          冷蔵庫温度/検温
        </header> 
        <form onSubmit={handleSubmit} className="fridge-check-form" style={{display:visible?'block':'none'}}>
          <div>
            <label className="block mb-2 text-zinc-500">Date</label>
            <input
              type="date"
              placeholder="date"
              className="w-full p-2 mb-6 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              value={formatedDateString}
              onChange={(e)=>setInputDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            {Object.entries(checkList).map(([key, values]) => (
              <div key={key} className="mb-4">
                <input type='tel'
                        className='w-30 border-b-2 border-zinc-500 outline-none focus:bg-gray-300'
                        placeholder="°C"
                        name={key}
                        value={fridgeCheck[key] !== undefined ? fridgeCheck[key] : ''}
                        onChange={(e)=>{
                          let _copy = { ...fridgeCheck };
                          _copy[key]=e.target.value;//+ for numberize
                          setFridgeCheck(_copy);
                        }}/>
                <span>
                  {values[0]}
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
        <button style={{display:Object.keys(fridgeCheck).length>0?'block':'none'}} onClick={()=>setVisible(visible?false:true)} className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-1 rounded">{visible?'非表示':'登録済み内容を確認'}</button>
      </div>
    </div>
  );
}

export default FridgeInputs;


