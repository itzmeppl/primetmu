import React, { useState } from "react";
import "../App.css";
import "../default-placeholder-300x300.png";

function Upload() {
  const [fields, setFields] = useState(0);

  const showInfo = (e) => {
    const value = e.target.value;

    if (value === "Product"){
      setFields(1);
    }    
  }

  return (
    <div>
      <form id="form">
        <label>Title:<input name="Title" type="text"></input></label>
        <br></br>        
        {fields === 0 && (
          <div id="group" style={{textAlign: "center"}}>
            <h3 style={{textAlign: "center"}}>Type of Ad: </h3>
            <label><input name="cat" type="radio" value="Product" onClick={showInfo}></input> Product</label>
            <label><input name="cat" type="radio" value="Service" onClick={showInfo}></input> Service</label>
          </div>
        )}
        {fields === 1 && (
          <div id="group">
              <label>Item: <input name="item"></input></label><br></br>
              <label>Description: <input type="text" name="description"></input></label>
              <h3>Photos: </h3>
              <label>
                <input type="file" style={{display: "none"}}></input>
                <img src="https://join.travelmanagers.com.au/wp-content/uploads/2017/09/default-placeholder-300x300.png" alt="default img"></img>
              </label>
              <br></br>
              <br></br>
              <h4 style={{display:"block", "margin-left":"auto", "margin-right": "2px", "margin-top":"0px", "float": "left"}}>Keywords:</h4>
              <textarea rows="5" cols="33" style={{"margin-right": "5%"}}></textarea>
              <label>Location: <input type="text" name="location" style={{width: "25%"}}></input></label> 
          </div>
        )}  
      </form>
    </div>
  );
}

export default Upload;
