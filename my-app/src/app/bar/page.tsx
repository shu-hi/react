"use client";
import React, {useEffect, useState } from 'react';
import './app.css';
import Login from './login';
import HealthCheckBoxes from './check';
import FridgeInputs from './fridge';
import Shift from './shift';
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
    //window.location.reload();
  };
  return (
    
    <div className="App" >
      {!([1, 2, 3].includes(login))?(//ログインしていなければログイン画面　1:バイト,2:管理者,3:システム
        <Login setLogin={setLogin} setToken={setToken}/>
      ):(
        <div className="App">
          <FridgeInputs />
          <HealthCheckBoxes setLogin={setLogin} setToken={setToken}/>
          <Shift setLogin={setLogin} setToken={setToken}/>
          <button type='button' onClick={()=>logout()}>log out</button>
        </div>
      )}
    </div>
    
  );
}

export default App;


