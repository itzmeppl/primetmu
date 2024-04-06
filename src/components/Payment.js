import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import "../Cart.css";

function Payment() {
    const [cart, setCart] = useState(() => {
        const cartData = Cookies.get('cart');
        return cartData ? JSON.parse(cartData) : [];
      });
    
    useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart));
    }, [cart]); 
    

    let totalPrice = 0;
    cart.forEach((item) => {
    totalPrice += parseFloat(item.price);
    });
      
    const deleteAds = () => {
        let cart = Cookies.get("cart");
        cart = JSON.parse(cart);
        console.log(cart);

        cart.forEach(async (item) => {
            if (item.category !== "service"){
                const response = await fetch(`http://localhost:3001/api/ads/${item._id}`, {
                    method: 'DELETE',
                });
                if (!(response.ok)) {
                    await fetch(`http://localhost:3001/api/ads/${item.id}`, {
                    method: 'DELETE',
                    });
                }
            }});
        Cookies.set("cart", "[]");
    };

    return (
        <div className="payment-container">
            <h1>Payment Details</h1>
            <form>
            <label >Full Name:</label>
                <input
                    type="text"
                    id="card_number"
                    name="card_number"
                    placeholder="Enter your full name"
                    required
                />
                <label >Location:</label>
                <input
                    type="text"
                    id="card_number"
                    name="card_number"
                    placeholder="Enter your location"
                    required
                />

                <label >Card Number:</label>
                <input
                    type="text"
                    id="card_number"
                    name="card_number"
                    placeholder="Enter your card number"
                    required
                />

                <label >Expiry Date:</label>
                <input
                    type="text"
                    id="expiry_date"
                    name="expiry_date"
                    placeholder="MM/YY"
                    required
                />

                <label >CVV:</label>
                <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="Enter CVV"
                    required
                />
                <h2>Subtotal ({(cart.length)} items): ${(totalPrice).toFixed(2)}</h2>
                <h2>Tax: ${(totalPrice*0.13).toFixed(2)}</h2>
                <h2>Total: ${(totalPrice*1.13).toFixed(2)}</h2>
                <input
                    type="button"
                    value="Pay Now"
                    className="add-button"
                    onClick={() => {
                        deleteAds();
                        alert('Thank you for your purchase!');
                        window.location.href = "/";
              }}
           ></input>
            </form>
        </div>
    );
}

export default Payment;
