import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import axios from 'axios';
import "../App.css";

function Product() {
    const [position, setPosition] = useState({ lat: 43.66, lng: -79.38 });
    const [open, setOpen] = useState(false);
    const [changed, setChanged] = useState(0);
    const [ads, setAds] = useState([]);
    const paramId = useParams();

    useEffect(() => {
        fetch('http://localhost:3001/api/ads')
            .then(response => response.json())
            .then(data => setAds(data.filter(data => data._id === paramId._id)));
    }, []);

    const [cart, setCart] = useState(() => {
        const cartCookie = Cookies.get('cart');
        console.log("Cart cookie:", cartCookie);
        return cartCookie && Array.isArray(JSON.parse(cartCookie)) ? JSON.parse(cartCookie) : [];
    });

    const handleAddToCart = (ad) => {
        const updatedCart = [...cart, ad];
        setCart(updatedCart);
        Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
        alert('Item successfully added to cart');
    };

    const newRoom = async () => {
        const curUser = Cookies.get("Username");
        const otherUser = ads[0].username;
        console.log("adding New Room to: ", curUser, ", ", otherUser);
        // const room = curUser.concat(otherUser);
        fetch('http://localhost:3001/api/users/newRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ curUser: curUser, otherUser: otherUser })
        })
    }

    const showLoc = async (location) => {
        if (changed === 0) {
            console.log(location);
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    location
                )}&key=${"AIzaSyCW_HWUU38n61hXn0X9oVZ3yLR4Of_0P2U"}`
            );

            const data = response.data;


            if (!data || data.status === 'ZERO_RESULTS') {
                console.log("OOPS");
            }
            else {
                const coordinates = data.results[0].geometry.location;
                setPosition({ lat: coordinates.lat, lng: coordinates.lng });
                setChanged(1);
            }
        }
    };

    return (
        <div>
            <div className="ad-page">
                {ads.map((ad, index) => (
                    <div className="ad-display" key={index}>
                        <div className="image-container">
                            {ad.image_path && (
                                <img src={`http://localhost:3001/${ad.image_path}`} alt={ad.title}></img>
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
                                    newRoom();
                                    window.location.href = "/message";
                                }}
                            ></input>
                            <input
                                type="button"
                                value="Add to Cart"
                                className="add-button"
                                onClick={() => {
                                    handleAddToCart(ad);
                                }}
                            ></input><br></br>
                            <br></br>
                            {showLoc(ad.location) &&
                                (<APIProvider apiKey={"AIzaSyCW_HWUU38n61hXn0X9oVZ3yLR4Of_0P2U"}>
                                    <div style={{ height: "300px", width: "300px" }}>
                                        <Map zoom={12} center={position} mapId={"b7a93d0452ec7c3"}>
                                            <AdvancedMarker position={position} onClick={() => setOpen(true)}>
                                                <Pin
                                                    background={"grey"}
                                                    borderColor={"green"}
                                                    glyphColor={"purple"}
                                                />
                                            </AdvancedMarker>

                                            {open && <InfoWindow position={position}></InfoWindow>}
                                        </Map>
                                    </div>
                                </APIProvider>)
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Product;