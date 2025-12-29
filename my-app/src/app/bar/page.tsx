"use client";
import React, {useEffect, useState } from 'react';
import './app.css';
import Login from './login';
import { Session } from 'inspector/promises';

function App() {
  const [login, setLogin] = useState(0);
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const storedToken = sessionStorage.getItem('access_token');
    const loginStatus=sessionStorage.getItem('login_status');console.log(loginStatus);
    if (storedToken&&loginStatus) {
      setToken(storedToken);  
      setLogin(parseInt(loginStatus,10));
    }
  }, []);
  function logout():void{
    sessionStorage.clear();
    setToken('');
    setLogin(0);
    window.location.reload();
  };
  return (
    
    <div className="App" >
      {!([1, 2, 3].includes(login))?(
      <Login />
      ):(
        <div className="App">
          {token}
          <button type='button' onClick={()=>logout()}>log out</button>
        </div>
      )}
    </div>
    
  );
}

export default App;


