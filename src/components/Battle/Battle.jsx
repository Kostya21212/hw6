import React from "react";

const Battle = ({ user1, user2, user1Score, user2Score, onBattle }) => {
  return (
    <div className="battle">
      {user1 && user2 && <button onClick={onBattle}>Battle!</button>}
      {user1 && user2 && user1Score !== null && user2Score !== null && (
        <div className="battle-result">
          <h2>{user1Score > user2Score ? "User 1 Wins!" : "User 2 Wins!"}</h2>
          <button onClick={() => window.location.reload()}>Restart 🔄</button>
        </div>
      )}
    </div>
  );
};

export default Battle;
