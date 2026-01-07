"use client";
import React, {useEffect, useState } from 'react';
import './app.css';
import Login from './login';
import HealthCheckBoxes from './check';
import FridgeInputs from './fridge';
import Shift from './shift';
import Approach from './approach';
import Menu from './menu';
import Admin from './admin';
import { Session } from 'inspector/promises';

function App() {
  const [login, setLogin] = useState(0);
  const [token, setToken] = useState('');
  const [mode,setMode]=useState<'default'|'approach'|'admin'>('default');
  useEffect(() => {
    const storedToken = sessionStorage.getItem('access_token');
    const loginStatus=sessionStorage.getItem('login_status');console.log(loginStatus);
    if (storedToken&&loginStatus) {
      setToken(storedToken);  
      setLogin(parseInt(loginStatus,10));
    }
  }, []);
  
  return (
    
    <div className="App" >
      {!([1, 2, 3].includes(login))?(//ログインしていなければログイン画面　1:バイト,2:管理者,3:システム
        <Login setLogin={setLogin} setToken={setToken}/>
      ):(
        <div className="App">
          
          <Menu setMode={setMode}setLogin={setLogin}setToken={ setToken}/>
          
          {mode==='default'&&(
            <div>
              <FridgeInputs />
              <HealthCheckBoxes setLogin={setLogin} setToken={setToken}/>
              <Shift setLogin={setLogin} setToken={setToken}/>
            </div>
          )}
          {mode==='approach'&&(
            <div>
              <Approach setLogin={setLogin} setToken={setToken}/>
            </div>
          )}
          {mode==='admin'&&(
            <div>
              <Admin setLogin={setLogin} setToken={setToken}/>
            </div>
          )}
          
        </div>
      )}
    </div>
    
  );
}

export default App;


