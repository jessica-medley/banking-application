import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserContext from "./components/app-context";

import "./App.css";
import Home from "./components/home.js";
import CreateAccount from "./components/createaccount.js";
import Deposit from "./components/deposit.js";
import Withdraw from "./components/withdraw.js";
import AllData from "./components/alldata.js";
import NavBar from "./components/navbar";

export default function App() {
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(100);
  const value = { users, setUsers, balance, setBalance };

  return (
    <BrowserRouter>
      <NavBar />
      <UserContext.Provider value={value}>
        <div className="container" style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/index.html" element={<Home />} />
            <Route path="/CreateAccount/" element={<CreateAccount />} />
            <Route path="/deposit/" element={<Deposit />} />
            <Route path="/withdraw/" element={<Withdraw />} />
            <Route path="/alldata/" element={<AllData />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}
