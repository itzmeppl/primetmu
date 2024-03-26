import React, { useState, useEffect } from "react";
import "../App.css";

function Admin() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/posts')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch users');
        }
      })
      .then(data => {
        setUsers(data); // Set the fetched users data
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []); // Empty dependency array to fetch data only once when the component mounts

  return (
    <div>

      <h1>Admin Dashboard</h1>
      <table>
        <tr>
          <th>User Id</th>
          <th>User Name</th>
          <th>Actions</th>
        </tr>
        
        {users.map(user => (
          <tr>
            <td key={user.id}>{user._id} </td>
            <td key={user.id}>{user.username} </td>
            <td><button>Delete User</button></td>
          </tr>
        ))}

      </table>
      
    </div>
  );
}


export default Admin;
