import React from "react";
import NavBar from "../Components/NavBar";
import Authenticate from "../Components/Authenticate"

const PagesHome = (props) => {
  return (
    <div>
      <NavBar />
      <h1>PAGE HOME</h1>
      <Authenticate />
    </div>
  );
};

export default PagesHome;
