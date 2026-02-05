"use client";
import React, { useState, useEffect,useRef} from 'react';
import './app.css';
import CheckBoxes from './checkboxes';



// 型定義

const App: React.FC = () => {
  const [prefs,setPrefs] = useState<number[]>([]);
  const [spinner,setSpinner]=useState(false);
  const fetchMoney=async()=>{
    setSpinner(true);
    console.log(prefs);
      try {
        const res1 = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get_jnet_21`,
          {
            method:"POST",
            headers: {
                      "Content-Type": "application/json",
                  },
            body: JSON.stringify({ data: prefs})
          }
        );
        const data: any = await res1.json();
        if(data.status=='ok'&& data.data && data.data.length > 1){
          console.log(data.data);
          
        }
        setSpinner(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setSpinner(false);
    }
  };
  return (
    <div>
      <CheckBoxes prefs={prefs} setPrefs={setPrefs}/>
      <button type='button' onClick={()=>fetchMoney()}className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-0 px-4 mb-3 rounded">search</button>
    </div>
  );
};
export default App;
