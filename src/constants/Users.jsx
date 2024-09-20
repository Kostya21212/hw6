import React, { useState, useEffect } from "react";
import UserForm from "../components/UserForm/UserForm";
import UserResult from "../components/UserResult/UserResult";
import githubService from "../../services/githubServices/githubServices";
const Users = () => {
  const initialUserState = {
    data: null,
    error: false,
    repos: [],
    score: null,
  };

  const [user1, setUser1] = useState(initialUserState);
  const [user2, setUser2] = useState(initialUserState);
  const [battleStarted, setBattleStarted] = useState(false);

  const handleUserSubmit = async (username, setUser) => {
    try {
      const userData = await githubService.getUser(username);
      setUser({ ...initialUserState, data: userData });
    } catch {
      setUser({ ...initialUserState, error: true });
    }
  };

  useEffect(() => {
    const fetchReposAndCalculateScores = async () => {
      if (battleStarted && user1.data && user2.data) {
        try {
          const [user1Repos, user2Repos] = await Promise.all([
            githubService.getRepos(user1.data.login),
            githubService.getRepos(user2.data.login),
          ]);

          const user1Stars = user1Repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
          const user2Stars = user2Repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

          setUser1(prevState => ({
            ...prevState,
            repos: user1Repos,
            score: prevState.data.followers + user1Stars,
          }));
          setUser2(prevState => ({
            ...prevState,
            repos: user2Repos,
            score: prevState.data.followers + user2Stars,
          }));
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchReposAndCalculateScores();
  }, [battleStarted, user1.data, user2.data]);

  const handleBattle = () => {
    setBattleStarted(true);
  };

  const resetUsers = () => {
    setUser1(initialUserState);
    setUser2(initialUserState);
    setBattleStarted(false);
  };

  const determineWinner = () => {
    if (user1.score > user2.score) {
      return 'User 1 Wins! 🥳';
    } else if (user1.score < user2.score) {
      return 'User 2 Wins! 🥳';
    } else {
      return 'It\'s a tie! 🤝';
    }
  };

  return (
    <div className="Users">
      <h1>GitHub Battle</h1>
      <div className="user-inputs">
        <UserForm
          onSubmit={(username) => handleUserSubmit(username, setUser1)}
          userData={user1.data}
          error={user1.error}
          onReset={() => setUser1(initialUserState)}
        />
        <UserForm
          onSubmit={(username) => handleUserSubmit(username, setUser2)}
          userData={user2.data}
          error={user2.error}
          onReset={() => setUser2(initialUserState)}
        />
      </div>
      {user1.data && user2.data && !battleStarted && (
        <button onClick={handleBattle}>Battle!</button>
      )}
      <div className="user-results">
        {user1.data && user1.repos.length > 0 && (
          <UserResult
            user={user1.data}
            repos={user1.repos}
            score={user1.score}
          />
        )}
        {user2.data && user2.repos.length > 0 && (
          <UserResult
            user={user2.data}
            repos={user2.repos}
            score={user2.score}
          />
        )}
      </div>
      {user1.score !== null && user2.score !== null && (
        <div className="battle-result">
          <h2>{determineWinner()}</h2>
          <button onClick={resetUsers}>Restart 🔄</button>
        </div>
      )}
    </div>
  );
};

export default Users;
