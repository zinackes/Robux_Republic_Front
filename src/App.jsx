import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "@/pages/Home.jsx";
import Register from "@/pages/Register.jsx";
import Login from "@/pages/Login.jsx";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AuthRoute from "@/routes/AuthRoute.jsx";
import VerifRoute from "@/routes/VerifRoute.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import BankAccount from "@/pages/BankAccount.jsx";

function App() {

  return (
    <>
      <Routes>
        <Route path={"/"} element={<Home/>}/>
          <Route path={"/"} element={<Home/>}/>

          {/* Route auth*/}
          <Route element={<AuthRoute/>}>
            <Route path={"/dashboard"} element={<Dashboard/>}/>
            <Route path={"/profile"} element={<Home/>}/>
            <Route path={"/bank-account/:account"} element={<BankAccount/>}/>
          </Route>

          <Route element={<VerifRoute/>}>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/register"} element={<Register/>}/>
          </Route>


      </Routes>
    </>
  )
}

export default App
