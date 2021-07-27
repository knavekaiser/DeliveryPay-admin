import React, { createContext, useState } from "react";

export const SiteContext = createContext();
export const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <SiteContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
