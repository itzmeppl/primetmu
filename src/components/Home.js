import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import axios from 'axios';

function Home() {
  const [changed, setChanged] = useState(1);
  const [ads, setAds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/ads')
      .then(response => response.json())
      .then(data => setAds(data));
  }, []);

  useEffect(() => {
    if (searchResults.length > 0) {
      console.log(searchResults);
    }
    setChanged(1);
  }, [searchResults]);

  const searchAds = async (event) => {
    event.preventDefault();
    setSearchResults([]);
    const filter = event.target.elements.attribute.value;
    const searchText = event.target.elements.search.value;
    console.log(searchText);
    if (!searchText) {
      alert("Please enter things to search!");
    }
    else {
      if (filter === "Title") {
        const tokens = searchText.split(' ');
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i]) {
            setChanged(0);
            const response = await axios.get(`http://localhost:3001/api/search?term=${filter}+${tokens[i]}`);
            const records = response.data;

            while (!changed) {
              console.log("WAITING");
            }

            const temp = [];

            if (searchResults.length === 0) {
              console.log("BYE");
              records.forEach(record => { temp.push(record.item_id) });
              setSearchResults(temp);
              
            }
            else {
              console.log("HI");
              records.forEach(record => {
                if (searchResults.includes(record.item_id)) {
                  temp.push(record.item_id);
                }
              })
              console.log("HI");
              setSearchResults(temp);
            }
          }
        }
      }
      else {
        setChanged(0);
        console.log(searchText);
        const response = await axios.get(`http://localhost:3001/api/search?term=${filter}+${searchText}`);
        const records = response.data;
        const temp = [];
        records.forEach(record => { temp.push(record.item_id) });
        setSearchResults(temp);
        console.log(temp);
      }
    }
  }

  return (
    <div>
      <h2>Search Items</h2>

      <form onSubmit={searchAds}>
        <select name="attribute" id="attribute" style={{ width: "40%" }}><option value="Title">Title</option><option value="Location">Location</option></select>
        <input type="text" placeholder="Search" id="search" style={{ width: '400px' }}></input>
        <button type="submit" style={{ border: "0px", width: "20%", float: "left" }}><img src="https://static.vecteezy.com/system/resources/thumbnails/009/652/218/small/magnifying-glass-icon-isolated-on-white-background-search-illustration-vector.jpg" width="30px" ></img></button>
      </form>

      {searchResults.length === 0 &&
        (<div className="search-ad-container">
          {ads.map((ad, index) => (
            <div className="ad-box" key={index}>
              <Link to={`/${ad.category}/${ad.item_type}/${ad._id}`}>
                <h4>{ad.title} - ${ad.price}</h4>
                <p>{ad.summary}</p>
              </Link>
            </div>
          ))}
        </div>)}

      {searchResults.length >= 1 &&
        (<div className="search-ad-container">
          {searchResults.map((id, index) => {
            const matchedAd = ads.find(ad => ad.item_id === id);
            return (
              <div className="ad-box" key={index}>
                <Link to={`/${matchedAd.category}/${matchedAd.item_type}/${matchedAd._id}`}>
                  <h4>{matchedAd.title} - ${matchedAd.price}</h4>
                  <p>{matchedAd.summary}</p>
                </Link>
              </div>
            );
          }
          )}
        </div>)
      }
    </div>

  )
}

export default Home;
