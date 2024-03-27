import React, { useState } from "react";
import "../App.css";

function Upload() {
  const [fields, setFields] = useState(0);
  const [isService, setService] = useState(0);
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const showInfo = (e) => {
    const value = e.target.value;

    if (value === "Wanted") {
      setFields(1);
      setCategory("wanted");
    } else if (value === "For-Sale") {
      setFields(1);
      setCategory("sale");
    } else if (value === "Service") {
      setFields(1);
      setService(1);
      setCategory("service");
    }
  }

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setImageUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append("title", e.target.elements.title.value);
    formData.append("item_type", e.target.elements.item_type.value);
    formData.append("category", category);
    formData.append("description", e.target.elements.description.value);
    formData.append("location", e.target.elements.location.value);
    formData.append("price", e.target.elements.price.value);
    formData.append("image_path", imageFile); // Use the same name as expected on the server side

    try {
      // Send form data to the server
      const response = await fetch("http://localhost:3001/api/ads", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form id="form" onSubmit={handleSubmit}>
        <br></br>
        {fields === 0 && (
          <div id="group" style={{ textAlign: "center" }}>
            <h3 style={{ textAlign: "center" }}>Type of Ad: </h3>
            <label><input name="cat" type="radio" value="Wanted" onClick={showInfo}></input> Product Wanted</label>
            <label><input name="cat" type="radio" value="For-Sale" onClick={showInfo}></input> Product For Sale</label>
            <label><input name="cat" type="radio" value="Service" onClick={showInfo}></input> Service</label>
          </div>
        )}
        {fields === 1 && isService === 0 && (
          <div id="group">
            <label>Title:<input name="title" type="text"></input></label><br></br>
            <label for="item_type">Item Type</label>
            <select id="item_type" name="item_type">
              <option value={"textbook"}>Textbook</option>
              <option value={"supplies"}>Supplies</option>
              <option value={"stationary"}>Stationary</option>
            </select><br></br>
            <label>Description: <input type="text" name="description"></input></label><br></br>
            <label>Price: <input name="price"></input></label><br></br>
            <label>Location: <input type="text" name="location" style={{ width: "25%" }}></input></label><br></br>
            <h3>Upload Photo:</h3>
            <label>
              <input type="file" name="image" onChange={handleFileChange} />
            </label>
            <br></br>
            {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px", maxHeight: "300px" }} />}
            <br></br>
            {/* <h4 style={{ display: "block", "margin-left": "auto", "margin-right": "2px", "margin-top": "0px", "float": "left" }}>Keywords:</h4> */}
            {/* <textarea rows="5" cols="33" style={{ "margin-right": "5%" }}></textarea> */}
            <button type="submit">Submit</button>
          </div>
        )}
        {fields === 1 && isService === 1 && (
          <div id="group">
            <label>Title:<input name="title" type="text"></input></label><br></br>
            <label for="item_type">Item Type</label>
            <select id="item_type" name="item_type">
              <option value={"textbook"}>Textbook Exchanges</option>
              <option value={"tutoring"}>Tutoring</option>
              <option value={"group"}>Study Groups</option>
            </select><br></br>
            <label>Description: <input type="text" name="description"></input></label><br></br>
            <label>Price: <input name="price"></input></label><br></br>
            <label>Location: <input type="text" name="location" style={{ width: "25%" }}></input></label><br></br>
            <button type="submit">Submit</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Upload;
