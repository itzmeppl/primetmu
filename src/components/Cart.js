import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import "../Cart.css";

function Cart() {
  const [cart, setCart] = useState(() => {
    const cartData = Cookies.get('cart');
    return cartData ? JSON.parse(cartData) : [];
  });

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart));
  }, [cart]); 
  
  const handleDelete = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    Cookies.set('cart', JSON.stringify(updatedCart)); 
  };

  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += parseFloat(item.price);
  });
    return (
      <div>
      {cart.length === 0 ? (
        <h2 className="empty-cart">No items in cart</h2>
      ) : (
        <div>
          <div className="ad-page">
            {cart.map((ad, index) => (
              <div className="ad-display-checkout" key={index}>
                <div className="image-container-checkout">
                  {ad.image_path && (
                    <img src={`http://localhost:3001/${ad.image_path}`} alt={ad.title}></img>
                  )}
                </div>
                <div className="ad-info-checkout">
                  <h2>{ad.title}</h2>
                  <h2>${ad.price}</h2>
                  <input
                    type="button"
                    value="Delete"
                    className="add-button"
                    onClick={() => {
                      handleDelete(index)
                    }}
                  ></input>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-section">
            <h2>Subtotal ({cart.length} items): ${(totalPrice).toFixed(2)}</h2>
            <h2>Tax: ${(totalPrice*0.13).toFixed(2)}</h2>
            <h2>Total: ${(totalPrice*1.13).toFixed(2)}</h2>
            <input
              type="button"
              value="Proceed to Checkout"
              className="add-button"
              onClick={() => {
                window.location.href = "/payment";
              }}
            ></input>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;