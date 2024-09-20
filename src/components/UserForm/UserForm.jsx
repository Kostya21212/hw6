import React, { useState } from "react";

const UserForm = ({ onSubmit, userData, error, onReset }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <div className="user-form">
      {userData ? (
        <div>
          <img src={userData.avatar_url} alt={userData.login} />
          <h3>{userData.login}</h3>
          <button onClick={onReset}>Reset</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub Username"
          />
          <button type="submit">Submit</button>
          {error && <p className="error-text">Username not exist.</p>}
        </form>
      )}
    </div>
  );
};

export default UserForm;
