import React from "react";
import "./App.css";
import StoreProvider from "./Components/Provider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PagesHome from "./pages/Home";
import PagesForm from "./pages/Form";
import PagesLogin from "./pages/Login";
import PagesPage404 from "./pages/Page404";
import PagesPerfil from "./pages/Perfil";
import PagesPainelAdmin from "./pages/PainelAdmin";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <StoreProvider>
          <Switch>
            <Route exact path="/" component={PagesHome} />
            <Route path="/cadastro" component={PagesForm} />
            <Route path="/login" component={PagesLogin} />
            <PrivateRoute path="/perfil" component={PagesPerfil} />
            <PrivateRoute path="/painel-adm" component={PagesPainelAdmin} />
            <Route component={PagesPage404} />
          </Switch>
        </StoreProvider>
      </Router>
    </div>
  );
}

export default App;
