"use client";
import React, {useEffect, useState } from 'react';
import './app.css';
import Login from './login';


function App() {
  const [login, setLogin] = useState(false);
  const [token, setToken] = useState('');
  const handleLoginSuccess = (token: string) => {
    setToken(token);
    setLogin(true); // ログイン状態にする
  };
  return (
    
    <div className="App" >
      {!login?(
      <Login onLoginSuccess={handleLoginSuccess} ></Login>
      ):(
        <div>
          {token}
        </div>
      )}
    </div>
    
  );
}

export default App;


