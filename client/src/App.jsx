// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import Home from './elements/Home';
// import Create from './elements/Create';
// import Edit from './elements/Edit';
// import Read from './elements/Read';

import AddArea from "./elements/AddArea";
import Profile from "./elements/Profile";
function App(){
  return(
    <BrowserRouter>
      <Routes>
        {/* <Route path="/students" element={<Home />}/>
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />}/>
        <Route path="/read/:id" element={<Read />}/> */}
        <Route path="/add_area" element={<AddArea />}/>
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;

// VALIDATION
// import { useState } from "react"
// import axios from "axios"

// function Form() {

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // validation
//     if(!email){
//       alert("Email required")
//       return
//     }

//     if(password.length < 6){
//       alert("Password must be 6 characters")
//       return
//     }

//     // send to server
//     try{
//       await axios.post("http://localhost:5000/login", {
//         email,
//         password
//       })
//     }catch(err){
//       console.log(err)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         value={email}
//         onChange={(e)=>setEmail(e.target.value)}
//         placeholder="Email"
//       />

//       <input
//         type="password"
//         value={password}
//         onChange={(e)=>setPassword(e.target.value)}
//         placeholder="Password"
//       />

//       <button type="submit">Submit</button>
//     </form>
//   )
// }

// export default Form