"use client";
import React, {useEffect, useState } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { keyframes } from '@mui/material';

import SpinnerOverlay from "./SpinnerOverlay";


interface LoginProps {
  setLogin: (status: number) => void;
  setToken: (token: string) => void;
}

function Admin({ setLogin, setToken }: LoginProps) {
  const [addUser,setAddUser]=useState<{[key:string]:string}>({});
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
    setAddUser((prevState) => ({
                    ...prevState, 
                    hired_date: formatedDateString,
                  })); 
    
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formatedDateString);
    try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/set_user`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storedToken}`
                },
          body: JSON.stringify({ addUser})
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
  const checkList={"first_name":["first_name"],
                    "last_name":["last_name"],
                    "user_id":["login_id"],
                    "user_pass":["login_password"],
                  };
  
  return (
    <div className="App flex bg-zinc-700" >
      <SpinnerOverlay
        visible={spinner}
      />
      <div className="w-full max-w-xs m-auto bg-zinc-100 rounded p-5">
        <header>
          add_user
        </header> 
        <form onSubmit={handleSubmit} className="fridge-check-form">
          
          <div>
            {Object.entries(checkList).map(([key, values]) => (
              <div key={key} className="mb-4">
                <span>
                  {values[0]}
                </span>
                <input type='text'
                        className="w-full p-2 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                        name={key}
                        value={addUser[key] || ''}
                        onChange={(e)=>{
                          let _copy = { ...addUser };
                          _copy[key]=e.target.value;
                          setAddUser(_copy);
                        }}/>
              </div>
            ))}
          </div>
          <div>
            <input
              type="date"
              placeholder="hired_date"
              className="w-full p-2 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              value={formatedDateString}
              onChange={(e)=>{
                  setAddUser((prevState) => ({
                    ...prevState, 
                    hired_date: e.target.value,
                  }));                  
                }}
              required
            />
          </div>
          <div>
            <select
                className="w-full p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
                defaultValue=""
                onChange={(e)=>{
                  setAddUser((prevState) => ({
                    ...prevState, 
                    job_class: e.target.value,
                  }));                  
                }}
                required>
                  <option value="" disabled hidden>選択してください</option>
                  <option value={1}>バイト</option>
                  <option value={2}>管理者</option>
                  <option value={3}>システム</option>
              </select>
          </div>
          <div>
            <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Admin;


