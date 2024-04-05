import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Services() {
  const [ads, setAds] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [tutoring, setTutoring] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/ads')
      .then(response => response.json())
      .then(data => setAds(data.filter(data => data.category === "service")));
  }, []);

  useEffect(() => {
    setExchanges(ads.filter(ads => ads.item_type === "exchange"));
    setTutoring(ads.filter(ads => ads.item_type === "tutoring"));
    setGroups(ads.filter(ads => ads.item_type === "group"));
  }, [ads]);

  return (
    <div>
      <div className="ad-page">
        <h1>Academic Services</h1>
        <h2>Tutoring: </h2>
        <div className="ad-container">
          {tutoring.map((ad, index) => (
            <div className="ad-box" key={index}>
              <Link to={`/services/${ad.item_type}/${ad._id}`}>
                <div className="ad-list-info">
                  <h3>{ad.title}</h3>
                  <h2>${ad.price}</h2>
                  <p>{ad.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <h2>Textbook Exchanges: </h2>
        <div className="ad-container">
          {exchanges.map((ad, index) => (
            <div className="ad-box" key={index}>
              <Link to={`/services/${ad.item_type}/${ad._id}`}>
                <div className="ad-list-info">
                  <h3>{ad.title}</h3>
                  <h2>${ad.price}</h2>
                  <p>{ad.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <h2>Study Groups: </h2>
        <div className="ad-container">
          {groups.map((ad, index) => (
            <div className="ad-box" key={index}>
              <Link to={`/services/${ad.item_type}/${ad._id}`}>
                <div className="ad-list-info">
                  <h3>{ad.title}</h3>
                  <h2>${ad.price}</h2>
                  <p>{ad.summary}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;
