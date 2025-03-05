import React from 'react';

const LogoutButton = ({ onClick, children }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

export default LogoutButton;
