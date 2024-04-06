import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Wanted from "./components/Wanted";
import ForSale from "./components/ForSale";
import Services from "./components/Services";
import Upload from "./components/Upload";
import Login from "./components/Login";
import Register from "./components/Register";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Message from "./components/Message";
import Admin from "./components/Admin";
import "./App.css";

export default function App() {
  const [preview_button, setPreview_button] = useState(true);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
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
    if (user && found) {
      return 1;
    }
    return 0;
  };

  return (
    <div className="global-header">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Courgette&display=swap" rel="stylesheet" />
        <title>PrimeTMU</title>
      </head>

      <div className="main-header">
        <header>
          <a href="/" className="logo">PrimeTMU</a>
        </header>

        {checkLoggedIn() === 0 &&
          (<div className="user-auth">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>)
        }
        {checkLoggedIn() === 1 && <button type="button" onClick={() => { Cookies.remove("Username"); window.location.href = "./" }}>Logout</button>}
      </div>

      <div className="nav-container" style={{ color: "#002D72"}}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/wanted">Wanted</a></li>
          <li><a href="/for-sale">For Sale</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/message">Messages</a></li>
          <li><a href="/cart">Cart</a></li>
          <input
            type="button"
            value="Upload Items"
            className="upload-button"
            onClick={() => {
              window.location.href = "/upload";
              //changePreview_button;
            }}
          ></input>
        </ul>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wanted" element={<Wanted />} />
          <Route path="/for-sale" element={<ForSale />} />
          <Route path="/services" element={<Services />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:category/:type/:_id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/message" element={<Message />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
