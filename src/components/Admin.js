import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch users');
        }
      })
      .then(data => { setUsers(data); })
      .catch(error => { console.error('Error:', error); });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/ads')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch users');
        }
      })
      .then(data => { setAds(data); })
      .catch(error => { console.error('Error:', error); });
  }, []);

  console.log(users);

  const deleteUser = async (userId) => {
    const response = await fetch (`http://localhost:3001/api/users/${userId}`, {
      method: 'DELETE',
    })

    if (response.ok){
    console.log('User deleted successfully');
    setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } else{
    console.log('Error deleting user!');
    }
  };

  const deleteAd = async(id) => {
    const response = await fetch (`http://localhost:3001/api/ads/${id}`, {
      method: 'DELETE', 
    })
    if (response.ok){
      alert('Ad deleted successfully!');
      window.open('./Admin');
      window.close();
    }
    else{
      alert('Ad delete failed!');
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>User Id</th>
            <th>User Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td><button onClick={() => deleteUser(user._id)}>Delete User</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Ads</h1>
      <table>
        <thead>
          <tr>
            <th>Ad ID</th>
            <th>Item ID</th>
            <th>Item Title</th>
            <th>Poster ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {ads.map(ad => (
            <tr key={ad._id}>
              <td>{ad._id}</td>
              <td>{ad.item_id}</td>
              <td>{ad.title}</td>
              <td>{ad.user_id}</td>
              <td><button onClick={() => deleteAd(ad._id)}>Delete Ad</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );

}

export default Admin;