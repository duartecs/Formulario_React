import { createContext } from "react";

const StorageContext = createContext({
  token: null,
  setToken: () => {},
  userGoogle: null,
  setUserGoogle: () => {},
});

export default StorageContext;
