"use client";
import React, {useEffect, useState } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { keyframes } from '@mui/material';

import SpinnerOverlay from "./SpinnerOverlay";

type ApproachApiResponse = {
  status: string;
  data: null|{[key:string]:string}[];
  err:string|null;
};
interface LoginProps {
  setLogin: (status: number) => void;
  setToken: (token: string) => void;
}

function Approach({ setLogin, setToken }: LoginProps) {
  const [approachSearchResult, setApproachSearchResult] = useState<{[key:string]:string}[]>([]);
  const [query,setQuery]=useState('');
  const [approach,setApproach]=useState<{[key:string]:string}>({});
  const [inputDate, setInputDate] = useState('');
  const [spinner,setSpinner]=useState(false);
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
    setInputDate(formatedDateString);
    
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formatedDateString);
    try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/set_approach`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`
                },
          body: JSON.stringify({ date: inputDate,approach})
        }
      );
      const data: {status:string,data:any,err:null|string} = await res1.json();
      if(data&&data.status=='ok'){
        toast.success('登録成功しました');
      }else{
        toast.error('登録に失敗しました。')
      }
    } catch (err) {
      console.error('Error setting checklist:', err);
    }
  };
  const searchApproach=async(e: React.FormEvent)=>{
    e.preventDefault();
    setSpinner(true);
      try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/approach_search`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`,
                },
          body: JSON.stringify({ query:query})
        }
      );
      
      const data: ApproachApiResponse = await res1.json();
      if(data.status=='ok'&& data.data && data.data.length >0){
        setApproachSearchResult(data.data);
        
      }else{
        
        setApproachSearchResult([{co_name:'not found'}]);
      }
      setSpinner(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setSpinner(false);
    }
  };
  const checkList={"co_name":["組織名"],
                    "approach_media":["媒体"],
                    "comment":["コメント"],
                  };
  
  return (
    <div className="App flex bg-zinc-700" >
      <SpinnerOverlay
        visible={spinner}
      />
      <div className="w-full max-w-xs m-auto bg-zinc-100 rounded p-5">
        <header>
          イベントアプローチ
        </header> 
        <form onSubmit={searchApproach} className="fridge-check-form">
          <div>
            <label className="block mb-2 text-zinc-500">search</label>
            <input
              type="text"
              placeholder="co_name"
              className="w-full p-2 mb-6 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              required
            />
          </div>          
          <div>
            <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">
              search
            </button>
          </div>
        </form>
        <form onSubmit={handleSubmit} className="fridge-check-form">
          <div>
            <input
              type="date"
              placeholder="date"
              className="w-full p-2 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              value={formatedDateString}
              onChange={(e)=>setInputDate(e.target.value)}
              required
            />
          </div>
          <div>
            {Object.entries(checkList).map(([key, values]) => (
              <div key={key} className="mb-4">
                <span>
                  {values[0]}
                </span>
                <input type='text'
                        className="w-full p-2 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                        name={key}
                        value={approach[key] || ''}
                        onChange={(e)=>{
                          let _copy = { ...approach };
                          _copy[key]=e.target.value;
                          setApproach(_copy);
                        }}/>
              </div>
            ))}
          </div>
          
          <div>
            <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">
              submit
            </button>
          </div>
        </form>
      </div>
      <Modal isOpen={approachSearchResult.length >0}>
        {Object.entries(approachSearchResult).map(([key,values])=>(
          <div key={key}>
            {values.co_name}
            <br />
            {values.approach_media}
            <br />
            {values.comment}
            <br />
            {values.date}
          </div>
        ))}
        <div className='flex justify-center'>
            <button 
              className="p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              onClick={()=>{
                setApproachSearchResult([]);
              }}>
                ×
            </button>
          </div>
      </Modal>
    </div>
  );
}

export default Approach;


