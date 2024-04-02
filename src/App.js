import React, { useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Home from "./components/Home";
import Wanted from "./components/Wanted";
import ForSale from "./components/ForSale";
import Services from "./components/Services";
import Upload from "./components/Upload";
import Login from "./components/Login";
import Register from "./components/Register";
import Message from "./components/Message";
import "./App.css";

export default function App() {
  const [preview_button, setPreview_button] = useState(true);
  const [users,setUsers] = useState([]);
  useEffect(() => {
    try {
        fetch('http://localhost:3001/api/posts')
      .then(response => response.json())
      .then(data => setUsers(data));
    } catch (error) {

    }
    
  }, []); 
  
  const changePreview_button = () => {
    setPreview_button(!preview_button);
    if (preview_button) {
    } else {
    }
  };

  const checkLoggedIn = () => {
    const user = Cookies.get("Username");
    const found = users.find(temp => temp.username === user);
    if (user && found){
      return 1;
    }
    return 0;
  };
  //_______________________________
  const newRoom = () =>{
    const curUser = Cookies.get("Username");
    const otherUser = "andy";
    console.log("adding New Room to: ", curUser, ", ",otherUser);
    // const room = curUser.concat(otherUser);
    fetch('http://localhost:3001/api/posts/newRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({curUser: curUser, otherUser: otherUser})
      })
  }
  //_______________________________________
  return (
    <div style={{ background: "#002D72" }}>
      <head>
        <title>Site Name</title>
      </head>

      <div className="global-header">
        <header>
          <h1 style={{ display: "block", margin: "auto" }}>CPS630 Project</h1>
        </header>

        <br></br>
        {checkLoggedIn() === 0 &&
          (<div>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>)
        }

        {checkLoggedIn() === 1 && <button type="button" onClick={() => {Cookies.remove("Username"); window.location.href="./"}}>Logout</button>}
      </div>
        <button type="button" onClick={newRoom}>New Room</button>
      <nav>
        <a href="/">Home</a> |&nbsp;<a href="/wanted">Wanted</a> |&nbsp;
        <a href="/for-sale">For Sale</a> |&nbsp;
        <a href="/services">Services</a> |&nbsp;
        <a href="/message">Messages</a>
      </nav>
      <hr></hr>

      <input
        type="button"
        value="Upload Items"
        className="upload-button"
        onClick={() => {
          window.location.href = "../Upload";
          // changePreview_button;
        }}
        style={{ float: "right" }}
      ></input>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wanted" element={<Wanted />} />
          <Route path="/for-sale" element={<ForSale />} />
          <Route path="/services" element={<Services />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/message" element={<Message />} />
        </Routes>
      </BrowserRouter>

      <body></body>
    </div>
  );
}
