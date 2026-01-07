"use client";
import React, {useEffect, useState } from 'react';
import { setFlagsFromString } from 'v8';
import { Session } from 'inspector/promises';
import { toast } from "react-hot-toast";
import SpinnerOverlay from "./SpinnerOverlay";

interface LoginProps {
  setLogin: (status: number) => void;
  setToken: (token: string) => void;
}
type LoginApiResponse = {
  status: string;
  data: null|{access_token:string;job_class:string;first_name:string;}
  err:string|null;
};

function Login({ setLogin, setToken}: LoginProps) {
  const [user_input_id, setUserInputId] = useState('');
  const [user_input_pass, setUserInputPass] = useState('');
  const [spinner,setSpinner]=useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpinner(true);
    try {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bar/login`,
        {
          method:"POST",
          headers: {
                    "Content-Type": "application/json"
                },
          body: JSON.stringify({ id: user_input_id,password:user_input_pass })
        }
      );
      const data: LoginApiResponse = await res1.json();
      console.log(data);
      if(data.status=='ok'&&data.data?.access_token){
        sessionStorage.setItem('access_token',data.data.access_token);
        sessionStorage.setItem('login_status',data.data.job_class);
        setToken(data.data.access_token);
        setLogin(parseInt(data.data.job_class,10));
        sessionStorage.setItem('name',data.data.first_name);
      }else{
        toast.error("wrong id or password");
      }
      setSpinner(false);
    } catch (err) {
      console.error('Error logging in:', err);
      setSpinner(false);
    }
  };

  return (
    <div className="App flex h-screen bg-zinc-700" >
     <SpinnerOverlay
        visible={spinner}
      />
      <div className="w-full max-w-xs m-auto bg-zinc-100 rounded p-5">
        <header>
          <img className="w-20 mx-auto mb-5" src="https://img.icons8.com/fluent/344/year-of-tiger.png" />
        </header> 
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="block mb-2 text-zinc-500">ID</label>
            <input
              type="text"
              placeholder="id"
              className="w-full p-2 mb-6 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              value={user_input_id}
              onChange={(e) => setUserInputId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-zinc-500">Password</label>
            <input
              type="text"
              placeholder="password"
              className="w-full p-2 mb-6 text-zinc-700 border-b-2 border-zinc-500 outline-none focus:bg-gray-300"
              value={user_input_pass}
              onChange={(e) => setUserInputPass(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="w-full bg-zinc-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">
              log in
            </button>
          </div>
        </form>
        <footer>
          <a className="text-zinc-700 hover:text-pink-700 text-sm float-left" href="#">Forgot Password?</a>
          <a className="text-zinc-700 hover:text-pink-700 text-sm float-right" href="#">Create Account</a>
        </footer>
      </div>
    </div>
  );
}

export default Login;


