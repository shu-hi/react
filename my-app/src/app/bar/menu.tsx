"use client";
import React, {useEffect, useState } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";
import Modal from "react-modal";
interface Props{
  setMode:(mode:'default'|'approach'|'admin')=>void;
  setLogin: (status: number) => void;
  setToken: (token: string) => void;
}


function Menu({setMode,setLogin, setToken}:Props) {
  const loginStatus=sessionStorage.getItem('login_status');
  const name=sessionStorage.getItem('name');
  const job_class=loginStatus?parseInt(loginStatus):0;
  const [isOpen,setIsOpen]=useState(false);
  const customStyles = {
    content: {
      top: '25%', // 上端を中央に
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)', // 中央に配置
      width: '100%',
      minWidth: '40%',
      zIndex: 10000, // モーダルが前面に来るように
    },
  };
  function logout():void{
    sessionStorage.clear();
    setToken('');
    setLogin(0);
    //window.location.reload();
  };
  return (
    <div className="App" >
      <header className='flex justify-between items-center px-5 py-3 bg-zinc-700'>
        <p className='ml-3'>{name}</p>
        <img className="w-20 mx-auto" src="https://img.icons8.com/fluent/344/year-of-tiger.png" />
        <button 
          style={{display:(isOpen?'none':'block')}} 
          onClick={()=>{
            setIsOpen(true);
          }}
          className='text-xl bg-white p-3 rounded-lg mr-3'>
              =
        </button>
      </header> 
      <Modal isOpen={isOpen} style={customStyles}>
        <div className='justify-center'>
          <div>
            <button 
              className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
              onClick={()=>{
                setMode('default');
                setIsOpen(false);
              }}>
                home
            </button>
          </div>
          <div>
            <button 
              className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
              onClick={()=>{
                setMode('approach');
                setIsOpen(false);
              }}>
                approach
            </button>
          </div>
          {(job_class==2||job_class==3)&&(
          <div>
            <button 
              className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded"
              onClick={()=>{
                setMode('admin');
                setIsOpen(false);
              }}>
                admin
            </button>
          </div>
          )}
          <div>
            <button 
              className="w-full bg-pink-700 hover:bg-zinc-700 text-white font-bold py-2 px-4 mb-6 rounded"
              onClick={()=>{
                logout();
                setIsOpen(false);}}>
                  log out
            </button>
          </div>
          <div className='flex justify-center'>
            <button 
              className="p-1 mb-3 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              onClick={()=>{
                setIsOpen(false);
              }}>
                ×
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Menu;


