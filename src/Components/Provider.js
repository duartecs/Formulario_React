import React, { useState } from "react";
import Context from "./Context";
import useStorage from "../Util/LocalStorage";

const StorageProvider = ({ children }) => {
  const [token, setToken] = useState(useStorage.getToken());
  const [userGoogle, setUserGoogle] = useState(useStorage.getToken());

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        userGoogle,
        setUserGoogle
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StorageProvider;
