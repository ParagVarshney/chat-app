import React from 'react';

function OnlineUsersList({ users }) {
  return (
    <div>
      <h4>Online Users ({users.length}):</h4>
      <ul>
        {users.map((u, i) => <li key={i}>{u.username}</li>)}
      </ul>
    </div>
  );
}

export default OnlineUsersList;

