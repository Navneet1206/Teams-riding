import React, { createContext } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = io(import.meta.env.VITE_BACKEND_URL);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};