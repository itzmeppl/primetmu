import React, {useState, useEffect} from 'react';
import Cookies from "js-cookie";
import "../App.css";

function Login() {
  const [users,setUsers] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/posts')
    .then(response => response.json())
    .then(data => setUsers(data));
  }, []); 
  console.log(users);

  const getLogin = () => {
    const user = Cookies.get("Username");
    const found = users.find(temp => temp.username === user);
    if (user && found){
      return 1;
    }
    return 0;
  }
  
  const handleLogin = (e) => {
    e.preventDefault();
    let login_user = e.target.elements.username.value;
    login_user = login_user.trim();
    let login_pass = e.target.elements.password.value;  
    login_pass = login_pass.trim(); 
    const found = users.find(user => user.username === login_user && user.password === login_pass);
    
    if(found && found.admin){
      console.log("welcome admin");
      window.open('./Admin');
    }  
    else if (found){
      console.log("SUCCESS! You've logged in!");
      const setFound = () => {Cookies.set('Username', login_user, {expires: (1 / 48)})};
      setFound();
      console.log(setFound);
      window.open('./');
      window.close();
    }
    else{
      console.log("Incorrect Username or Password!");
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
