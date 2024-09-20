import React from "react";

const UserResult = ({ user, repos, score }) => {
  return (
    <div className="user-result">
      <h2>{user.login}</h2>
      <img src={user.avatar_url} alt={user.login} />
      <p>Followers: {user.followers}</p>
      <p>
        Repositories stars:{" "}
        {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
      </p>
      <h3>Total score: {score}</h3>
    </div>
  );
};

export default UserResult;
