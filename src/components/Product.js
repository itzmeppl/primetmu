import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

function Product() {
    const [ads, setAds] = useState([]);
    const paramId = useParams();

    useEffect(() => {
        fetch('http://localhost:3001/api/ads')
            .then(response => response.json())
            .then(data => setAds(data.filter(data => data.item_id.toString() === paramId.item_id)));
    }, []);

    return (
        <div>
            <div className="ad-page">
                {ads.map((ad, index) => (
                    <div className="ad-display" key={index}>
                        <div className="image-container">
                            {ad.image_path && (
                                <img src={`http://localhost:3001/image_upload/${ad.image_path}`} alt={ad.title}></img>
                            )}
                        </div>
                        <div className="ad-info">
                            <h2>{ad.title}</h2>
                            <h2>${ad.price}</h2>
                            <h3>Description:</h3>
                            <p>{ad.description}</p>
                            <h3>About this Item:</h3>
                            <p>{ad.summary}</p>
                            <input
                                type="button"
                                value="Message Seller"
                                className="message-button"
                                onClick={() => {
                                    window.location.href = "/message";
                                }}
                            ></input>
                            <input
                                type="button"
                                value="Add to Cart"
                                className="add-button"
                                onClick={() => {
                                    window.location.href = "/cart";
                                }}
                            ></input>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Product;
