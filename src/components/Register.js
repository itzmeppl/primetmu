import React from "react";
import "../App.css";

function Register() {
  const handleSignUp = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    const newUser = { username, password };
    
    if (!username || !password){
      alert('You need to enter both the username and password!');
    }
    else{
      fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to register user');
        }
      })
      .then(data => {
        alert("You've successfully registered!");

      })
      .catch(error => {
        console.error('Error:', error);
        alert('That username already exists!');
        window.open("../login");
      });

    }
  };

  return (
    <div>
      <h2>Create an account</h2>
      <form className="register-form" onSubmit={handleSignUp}>
        <input type="text" name="username" placeholder="username"></input>
        <input type="password" name="password" placeholder="password"></input>
        <button type="submit">Sign Up</button>
      </form>

    </div>
  );
}

export default Register;