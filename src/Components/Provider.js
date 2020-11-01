import React, { useState } from "react";
import Context from "./Context";
import useStorage from "../Util/LocalStorage";

const StoreProvider = ({ children }) => {
  const [token, setToken] = useState(useStorage.getToken());

  return (
    <Context.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StoreProvider;
