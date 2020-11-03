import { createContext } from "react";

const StoreContext = createContext({
  token: null,
  setToken: () => {},
  userGoogle: null,
  setUserGoogle: () => {},
});

export default StoreContext;
