import React, { useContext } from "react";
import { Link } from "react-router-dom";
import StorageContext from "../Components/Context";
import LocalStorage from "../Util/LocalStorage";
import Authenticate from "../Service/Authenticate";
import "../css/NavBar.css";

export default () => {
  const { setToken, setUserGoogle } = useContext(StorageContext);

  const logout = () => {
    Authenticate.logout();
    LocalStorage.removeToken();
    setToken(null);
    setUserGoogle(null);
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li id="cadastro">
            <Link to="/cadastro">CADASTRO</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/login">LOGIN</Link>
          </li>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </>
  );
};
