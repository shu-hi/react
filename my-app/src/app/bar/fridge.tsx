"use client";
import React, {useEffect, useState } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";

type FridgeCheckApiResponse = {
  status: string;
  data: null|{[key:string]:number}[];
  err:string|null;
};


function FridgeInputs() {
  const [fridgeCheck, setFridgeCheck] = useState<{[key:string]:number}>({});
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/set_fridge_check`,
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
  const fetchHealthData=async()=>{
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
  const checkList={"attr_1":["カウンター内左"],
                    "attr_2":["カウンター内右"],
                    "attr_3":["ショーケース右"],
                    "attr_4":["ショーケース左"],
                    "attr_5":["ショーケース中央"],
                    "attr_6":["自分の検温"]
                  };
  
  return (
    <div className="App flex bg-zinc-700" >
      <div className="w-full max-w-xs m-auto bg-zinc-100 rounded p-5">
        <header>
          <img className="w-20 mx-auto mb-5" src="https://img.icons8.com/fluent/344/year-of-tiger.png" />
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
                <input type='number'
                        name={key}
                        value={fridgeCheck[key] || 36}
                        onChange={(e)=>{
                          let _copy = { ...fridgeCheck };
                          _copy[key]=+e.target.value;//+ for numberize
                          setFridgeCheck(_copy);
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
        <button style={{display:Object.keys(fridgeCheck).length>0?'block':'none'}} onClick={()=>setVisible(visible?false:true)} className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">{visible?'非表示':'登録済み内容を確認'}</button>
      </div>
    </div>
  );
}

export default FridgeInputs;


