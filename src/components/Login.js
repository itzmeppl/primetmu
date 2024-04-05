import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import "../App.css";

function Login() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);
  console.log(users);

  const getLogin = () => {
    const user = Cookies.get("Username");
    const found = users.find(temp => temp.username === user);
    if (user && found) {
      return 1;
    }
    return 0;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const login_user = e.target.elements.username.value;
    const login_pass = e.target.elements.password.value;
    const setFound = () => { Cookies.set('Username', login_user, { expires: (1 / 48) }) };

    try {
      console.log("username", login_user);
      console.log("pass", login_pass);
      const response = await fetch('http://localhost:3001/api/usersLogin', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify({ username: login_user, password: login_pass }),
      });
      if (response.ok) {
        console.log('User data sent successfully.');
        switch (response.status) {
          case 200:
            console.log("Welcome admin");
            window.location.href = "./admin";
            setFound();
            break;
          case 201:
            console.log("SUCCESS! You've logged in!");
            window.location.href = "./";
            setFound();
            break;
          default:
            console.error('An unexpected error occurred');
            break;
        }
      } else {
        console.error('Error sending user data.');
        alert("Error: Incorrect username or password.");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {getLogin() === 0 &&
        (<form className="login-form" onSubmit={handleLogin}>
          <div></div>
          <input type="text" name="username" placeholder="username"></input>
          <input type="password" name="password" placeholder="password"></input>
          <button type="submit">Login</button>
        </form>)
      }
      {getLogin() === 1 && (<h3>Logged In!</h3>)}
    </div>
  );
}

export default Login;
