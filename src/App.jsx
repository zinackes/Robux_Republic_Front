import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "@/pages/Home.jsx";
import Register from "@/pages/Register.jsx";
import Login from "@/pages/Login.jsx";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AuthRoute from "@/routes/AuthRoute.jsx";

function App() {

  return (
    <>
      <Routes>
        <Route path={"/"} element={<Home/>}/>
          <Route path={"/login"} element={<Login/>}/>
          <Route path={"/register"} element={<Register/>}/>
          <Route path={"/"} element={<Home/>}/>

          {/* Route auth*/}
          <Route element={<AuthRoute/>}>
            <Route path={"/dashboard"} element={<Home/>}/>
            <Route path={"/profile"} element={<Home/>}/>
          </Route>
      </Routes>
    </>
  )
}

export default App
