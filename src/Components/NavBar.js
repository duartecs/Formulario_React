import React from "react";
import { Link } from "react-router-dom";
import Authenticate from "../Service/Authenticate"
import "../css/NavBar.css";

export default () => {
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
            <button onClick={Authenticate.logout}>Logout</button>
          </li>
        </ul>
      </nav>
    </>
  );
};
