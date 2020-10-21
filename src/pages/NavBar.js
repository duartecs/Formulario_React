import React from "react";
import { Link } from "react-router-dom";
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
          <li>
            <Link to="/login">LOGIN</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
