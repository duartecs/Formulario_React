import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PagesHome from "./pages/Home";
import PagesForm from "./pages/Form";
import PagesLogin from "./pages/Login";
import PagesPage404 from "./pages/Page404";
import PagesPerfil from "./pages/Perfil";
import PagesPainelAdmin from "./pages/PainelAdmin";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={PagesHome} />
          <Route path="/cadastro" component={PagesForm} />
          <Route path="/login" component={PagesLogin} />
          <Route path="/perfil" component={PagesPerfil} />
          <Route path="/painel-adm" component={PagesPainelAdmin} />
          <Route component={PagesPage404} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
