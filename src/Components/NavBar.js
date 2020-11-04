import React, { useContext } from "react";
import { Link } from "react-router-dom";
import StorageContext from "../Components/Context";
import LocalStorage from "../Util/LocalStorage";
import Authenticate from "../Service/Authenticate";

import "../css/NavBar.css";

export default () => {
  const { token, setToken, setUserGoogle } = useContext(StorageContext);

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
          <li>{token === null && <Link to="/cadastro">CADASTRO</Link>}</li>
        </ul>
        <ul>
          <li>{token === null && <Link to="/login">LOGIN</Link>}</li>
          <li>{token !== null && <Link to="/perfil">PERFIL</Link>}</li>
          <li>
            {token !== null && (
              <button className="BtnLogout" onClick={logout}>
                LOGOUT
              </button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};
