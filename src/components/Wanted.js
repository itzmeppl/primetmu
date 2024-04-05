import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Wanted() {
    const [ads, setAds] = useState([]);
    const [textbooks, setTextbooks] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [stationary, setStationary] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/ads')
            .then(response => response.json())
            .then(data => setAds(data.filter(data => data.category === "wanted")));
    }, []);

    useEffect(() => {
        setTextbooks(ads.filter(ads => ads.item_type === "textbook"));
        setSupplies(ads.filter(ads => ads.item_type === "supplies"));
        setStationary(ads.filter(ads => ads.item_type === "stationary"));
    }, [ads]);

    return (
        <div>
            <div className="ad-page">
                <h1>Items Wanted</h1>
                <h2>Textbooks: </h2>
                <div className="ad-container">
                    {textbooks.map((ad, index) => (
                        <div className="ad-box" key={index}>
                            <Link to={`/wanted/${ad.item_type}/${ad._id}`}>
                                <span className="ad-list-image">
                                    <img src={`http://localhost:3001/${ad.image_path}`} alt={ad.title}></img>
                                </span>
                                <div className="ad-list-info">
                                    <h3>{ad.title}</h3>
                                    <h2>${ad.price}</h2>
                                    <p>{ad.summary}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <h2>Supplies: </h2>
                <div className="ad-container">
                    {supplies.map((ad, index) => (
                        <div className="ad-box" key={index}>
                            <Link to={`/wanted/${ad.item_type}/${ad._id}`}>
                                <span className="ad-list-image">
                                    <img src={`http://localhost:3001/${ad.image_path}`} alt={ad.title}></img>
                                </span>
                                <div className="ad-list-info">
                                    <h3>{ad.title}</h3>
                                    <h2>${ad.price}</h2>
                                    <p>{ad.summary}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <h2>Stationary: </h2>
                <div className="ad-container">
                    {stationary.map((ad, index) => (
                        <div className="ad-box" key={index}>
                            <Link to={`/wanted/${ad.item_type}/${ad._id}`}>
                                <span className="ad-list-image">
                                    <img src={`http://localhost:3001/${ad.image_path}`} alt={ad.title}></img>
                                </span>
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

export default Wanted;
