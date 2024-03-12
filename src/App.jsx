import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Wanted from "./components/Wanted";
import ForSale from "./components/ForSale";
import Services from "./components/Services";
import Upload from "./components/Upload";
import "./App.css";

export default function App() {
  const [preview_button, setPreview_button] = useState(true);

  const changePreview_button = () => {
    setPreview_button(!preview_button);
    if (preview_button) {
    } else {
    }
  };

  return (
    <div style={{ background: "#002D72" }}>
      <head>
        <title>Site Name</title>
      </head>

      <div className="global-header">
        <header>
          <h1 style={{ display: "block", margin: "auto" }}>CPS630 Project</h1>
        </header>
        <input
          type="button"
          value="Upload Items"
          className="upload-button"
          onClick={() => {
            window.location.href = "../Upload";
            changePreview_button;
          }}
          style={{ float: "right" }}
        ></input>
        <br></br>
        <hr></hr>
      </div>

      <nav>
        Pages:
        <a href="/">Home</a> |<a href="/wanted">Wanted</a> |
        <a href="/for-sale">For Sale</a> |<a href="/services">Services</a>
      </nav>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wanted" element={<Wanted />} />
          <Route path="/for-sale" element={<ForSale />} />
          <Route path="/services" element={<Services />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>

      <body></body>
    </div>
  );
}
