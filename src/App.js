import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppContext from './components/app-context';
import { getUser, getAuthHeaderObj, handleTokenRefresh } from './util';

import './App.css';
import Home from './components/home.js';
import CreateAccount from './components/createaccount.js';
import Login from './components/login.js';
import Deposit from './components/deposit.js';
import Withdraw from './components/withdraw.js';
import Balance from './components/balance.js';
import AllData from './components/alldata.js';
import NavBar from './components/navbar';
import AlertBanner from './components/alertbanner.js';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [clientUser, setClientUser] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState('');
  const value = { signedIn, setSignedIn, clientUser, setClientUser, alertMessage, setAlertMessage };

  async function getAuthedUser(isRegenTokenRefresh = true) {
    try {
      const url = `http://localhost:3001/account/user`;
      const res = await fetch(url, {
        headers: getAuthHeaderObj(),
      });
      let data = await res.json();
      if (data.error && isRegenTokenRefresh) {
        data = await handleTokenRefresh(data, getAuthedUser);
        if (data && data.error && data.code === 1) {
          console.warn(data);
          return {};
        }
        return getUser();
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // If user exists, lets check to see if we're authenticated
  useEffect(() => {
    const user = getUser();
    if (user && user.name) {
      (async () => {
        const data = await getAuthedUser();
        if (data && data.name) {
          setClientUser(data);
        }
      })();
    }
  }, []);

  return (
    <BrowserRouter>
      <AppContext.Provider value={value}>
        <AlertBanner />
        <NavBar />
        <div className="container" style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/index.html" element={<Home />} />
            <Route path="/CreateAccount/" element={<CreateAccount />} />
            <Route path="/Login/" element={<Login />} />
            <Route path="/Deposit/" element={<Deposit />} />
            <Route path="/Withdraw/" element={<Withdraw />} />
            <Route path="/Balance/" element={<Balance />} />
            <Route path="/AllData/" element={<AllData />} />
          </Routes>
        </div>
      </AppContext.Provider>
    </BrowserRouter>
  );
}
