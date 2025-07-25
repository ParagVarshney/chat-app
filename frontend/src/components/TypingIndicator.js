import React from 'react';

function TypingIndicator({ typingUser }) {
  return (
    <div>
      {typingUser && <p><em>{typingUser} is typing...</em></p>}
    </div>
  );
}

export default TypingIndicator;

