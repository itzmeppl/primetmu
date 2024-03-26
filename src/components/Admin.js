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
        
        {users.map(user => (
          <tr>
            <td key={user.id}>{user.username}
              `<button>delete</button>`
            </td>
          </tr>
        ))}

      </table>
      
    </div>
  );
}


export default Admin;
