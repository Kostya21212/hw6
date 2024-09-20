import React, { useState, useEffect } from "react";
import UserForm from "../components/UserForm/UserForm";
import UserResult from "../components/UserResult/UserResult";
import Battle from "../components/Battle/Battle";
import githubService from "../../services/githubServices/githubServices";

const Users = () => {
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [user1Repos, setUser1Repos] = useState([]);
  const [user2Repos, setUser2Repos] = useState([]);
  const [user1Score, setUser1Score] = useState(null);
  const [user2Score, setUser2Score] = useState(null);
  const [battleStarted, setBattleStarted] = useState(false);

  const handleUserSubmit = async (username, setUser, setError) => {
    try {
      const userData = await githubService.getUser(username);
      setUser(userData);
      setError(false);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    const fetchReposAndCalculateScores = async () => {
      if (battleStarted && user1 && user2) {
        try {
          const user1Repos = await githubService.getRepos(user1.login);
          const user2Repos = await githubService.getRepos(user2.login);

          setUser1Repos(user1Repos);
          setUser2Repos(user2Repos);

          const user1Stars = user1Repos.reduce(
            (sum, repo) => sum + repo.stargazers_count,
            0
          );
          const user2Stars = user2Repos.reduce(
            (sum, repo) => sum + repo.stargazers_count,
            0
          );

          setUser1Score(user1.followers + user1Stars);
          setUser2Score(user2.followers + user2Stars);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchReposAndCalculateScores();
  }, [battleStarted, user1, user2]);

  const handleBattle = () => {
    setBattleStarted(true);
  };

  const resetUsers = () => {
    setUser1(null);
    setUser2(null);
    setUser1Repos([]);
    setUser2Repos([]);
    setUser1Score(null);
    setUser2Score(null);
    setBattleStarted(false);
  };

  return (
    <div className="Users">
      <h1>GitHub Battle</h1>
      <div className="user-inputs">
        <UserForm
          onSubmit={(username) =>
            handleUserSubmit(username, setUser1, setError1)
          }
          userData={user1}
          error={error1}
          onReset={() => setUser1(null)}
        />
        <UserForm
          onSubmit={(username) =>
            handleUserSubmit(username, setUser2, setError2)
          }
          userData={user2}
          error={error2}
          onReset={() => setUser2(null)}
        />
      </div>
      {user1 && user2 && !battleStarted && (
        <button onClick={handleBattle}>Battle!</button>
      )}
      {battleStarted && (
        <Battle
          user1={user1}
          user2={user2}
          user1Score={user1Score}
          user2Score={user2Score}
        />
      )}
      <div className="user-results">
        {user1 && user1Repos.length > 0 && (
          <UserResult user={user1} repos={user1Repos} score={user1Score} />
        )}
        {user2 && user2Repos.length > 0 && (
          <UserResult user={user2} repos={user2Repos} score={user2Score} />
        )}
      </div>
      {user1Score !== null && user2Score !== null && (
        <div className="battle-result">
          <h2>{user1Score > user2Score ? "User 1 Wins!" : "User 2 Wins!"}</h2>
          <button onClick={resetUsers}>Restart 🔄</button>
        </div>
      )}
    </div>
  );
};

export default Users;
