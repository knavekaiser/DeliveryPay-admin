import React, { createContext, useState, useEffect } from "react";

export const SiteContext = createContext();
export const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [config, setConfig] = useState({});
  useEffect(() => {
    fetch("/api/siteConfig")
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setConfig(data.config || {});
        }
      });
  }, []);
  return (
    <SiteContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        config,
        setConfig,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
