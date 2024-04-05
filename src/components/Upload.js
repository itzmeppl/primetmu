import React, { useState } from "react";
import Cookies from "js-cookie";
import "../App.css";

function Upload() {
  const username = Cookies.get('Username');
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
    const title = e.target.elements.title.value;
    const keywords = e.target.elements.keywords.value;
    const newKeywords = { title, keywords };
    formData.append("title", title);
    formData.append("username", username);
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
      alert("Upload Successful!");
    } catch (error) {
      alert("Upload Failed!");
      console.error("Error:", error);
    }

    try {
      const response = await fetch("http://localhost:3001/api/keywords", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newKeywords)
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
          <div className="ad-types-form">
            <h2 style={{ textAlign: "center" }}>Type of Ad: </h2>
            <label><input name="cat" type="radio" value="Wanted" onClick={showInfo}></input>Product Wanted </label>
            <label><input name="cat" type="radio" value="For-Sale" onClick={showInfo}></input>Product For Sale </label>
            <label><input name="cat" type="radio" value="Service" onClick={showInfo}></input>Service</label>
          </div>
        )}
        {fields === 1 && isService === 0 && (
          <div className="form-page">
            <table>
              <tr>
                <th colspan="2">Upload Item</th>
              </tr>
              <tr>
                <td>Title:</td>
                <td><input name="title" type="text"></input></td>
              </tr>
              <tr>
                <td>Item Type:</td>
                <td>
                  <select id="item_type" name="item_type">
                    <option value="textbook">Textbook</option>
                    <option value="supplies">Supplies</option>
                    <option value="stationary">Stationary</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Price:</td>
                <td><input type="text" name="price"></input></td>
              </tr>
              <tr>
                <td>Location:</td>
                <td><input type="text" name="location"></input></td>
              </tr>
              <tr>
                <td>Description:</td>
                <td><textarea name="description" rows="5" cols="33"></textarea></td>
              </tr>
              <tr>
                <td>Keywords:</td>
                <td><textarea name="keywords" rows="5" cols="33"></textarea></td>
              </tr>
              <tr>
                <td>Upload Photo:</td>
                <td>
                  <label>
                    <input type="file" name="image" onChange={handleFileChange} />
                  </label>
                </td>
                <br></br>
                {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px", maxHeight: "300px" }} />}
                <br></br>
              </tr>
              <tr>
                <td colspan="2"><button type="submit">Submit</button></td>
              </tr>
            </table>
          </div>
        )}
        {fields === 1 && isService === 1 && (
          <div className="form-page">
            <table>
              <tr>
                <th colspan="2">Upload Item</th>
              </tr>
              <tr>
                <td>Title:</td>
                <td><input name="title" type="text"></input></td>
              </tr>
              <tr>
                <td>Item Type:</td>
                <td>
                  <select id="item_type" name="item_type">
                    <option value="textbook">Textbook Exchanges</option>
                    <option value="tutoring">Tutoring</option>
                    <option value="group">Study Groups</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Price:</td>
                <td><input type="text" name="price"></input></td>
              </tr>
              <tr>
                <td>Location:</td>
                <td><input type="text" name="location"></input></td>
              </tr>
              <tr>
                <td>Description:</td>
                <td><textarea name="description" rows="5" cols="33"></textarea></td>
              </tr>
              <tr>
                <td>Keywords:</td>
                <td><textarea name="keywords" rows="5" cols="33"></textarea></td>
              </tr>
              <tr>
                <td colspan="2"><button type="submit">Submit</button></td>
              </tr>
            </table>
          </div>
        )}
      </form>
    </div>
  );
}

export default Upload;
