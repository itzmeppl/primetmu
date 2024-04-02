import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function ForSale() {
  const [ads, setAds] = useState([]);
  const [textbooks, setTextbooks] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [stationary, setStationary] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/ads')
      .then(response => response.json())
      .then(data => setAds(data.filter(data => data.category === "sale")));
  }, []);

  useEffect(() => {
    setTextbooks(ads.filter(ads => ads.item_type === "textbook"));
    setSupplies(ads.filter(ads => ads.item_type === "supplies"));
    setStationary(ads.filter(ads => ads.item_type === "stationary"));
  }, [ads]);

  return (
    <div>
      <div className="ad-page">
        <h1>Items For Sale</h1>
        <h2>Textbooks: </h2>
        <div className="ad-container">
          {textbooks.map((ad, index) => (
            <div className="ad-box" key={index}>
              <Link to={`/for-sale/${ad.item_type}/${ad.item_id}`}>
                <span className="ad-list-image">
                  <img src={`http://localhost:3001/image_upload/${ad.image_path}`} alt={ad.title}></img>
                </span>
                <div className="ad-list-info">
                  <h3>{ad.title} - ${ad.price}</h3>
                  <p>{ad.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <br></br>
        <h2>Supplies: </h2>
        <div className="ad-container">
          {supplies.map((ad, index) => (
            <div className="ad-box" key={index}>
              <Link to={`/for-sale/${ad.item_type}/${ad.item_id}`}>
                <span className="ad-list-image">
                  <img src={`http://localhost:3001/image_upload/${ad.image_path}`} alt={ad.title}></img>
                </span>
                <div className="ad-list-info">
                  <h3>{ad.title} - ${ad.price}</h3>
                  <p>{ad.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <br></br>
        <h2>Stationary: </h2>
        <div className="ad-container">
          {stationary.map((ad, index) => (
            <div className="ad-box" key={index}>
              <Link to={`/for-sale/${ad.item_type}/${ad.item_id}`}>
                <span className="ad-list-image">
                  <img src={`http://localhost:3001/image_upload/${ad.image_path}`} alt={ad.title}></img>
                </span>
                <div className="ad-list-info">
                  <h3>{ad.title} - ${ad.price}</h3>
                  <p>{ad.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <br></br>
      </div>
    </div>
  );
}

export default ForSale;
