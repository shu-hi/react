"use client";
import React, {useEffect, useState } from 'react';
import './app.css';
import { setFlagsFromString } from 'v8';


type LoginApiResponse = {
  status: string;
  data: null|{access_token:string;token_type:string}
  err:string|null;
};
type LoginProps = {
  onLoginSuccess: (token: string) => void; // onLoginSuccess を親から受け取る
};

function Login({ onLoginSuccess }: LoginProps) {
  const [user_input_id, setUserInputId] = useState('');
  const [user_input_pass, setUserInputPass] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        onLoginSuccess(data.data.access_token);
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="App" >
      <h1>log in</h1>
      <div className='main-body'>
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              placeholder="id"
              className="border rounded px-3 py-2"
              value={user_input_id}
              onChange={(e) => setUserInputId(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="password"
              className="border rounded px-3 py-2"
              value={user_input_pass}
              onChange={(e) => setUserInputPass(e.target.value)}
              required
            />
            <button type="submit">
              log in
            </button>
          </form>
          
      </div>
    </div>
  );
}

export default Login;


