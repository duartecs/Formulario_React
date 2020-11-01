import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Form.css";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import Form from "../Components/Form";
import Authenticate from "../Service/Authenticate";
import AccessDB from "../Service/AccessDB";
import LocalStorage from "../Util/LocalStorage";
import StoreContext from "../Components/Context";

const valoresLogin = {
  email: "",
  senha: "",
};

var count = 0;

const PagesLogin = () => {
  const [valores, setValores] = useState(valoresLogin);
  const [displayButton, setDisplayButton] = useState({
    backgroundColor: "grey",
    isDisable: true,
  });
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });

  const history = useHistory();
  const { setToken } = useContext(StoreContext);

  const onChange = (ev) => {
    //extrair os valores dos inputs
    const { name, value } = ev.target;

    //setar os novos valores do state
    setValores({ ...valores, [name]: value });

    //verificar se existe algum campo em branco
    for (var element in valores) {
      valores[element] !== "" ? (count = count + 1) : (count = 0);
    }

    //gatilho para habilitar o botão de submmit
    count === 2
      ? setDisplayButton({ backgroundColor: "blue", isDisable: false })
      : (count = 0);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const idFirebase = await Authenticate.login(valores);

    if (idFirebase === null) {
      setDisplayResposta({ display: "flex", backgroundColor: "red" });
    } else {
      //verificar se o email ja esta verificado, caso contrario redirecionar para a pagina de verificação
      const user = await AccessDB.findUser(idFirebase);
      console.log(user);
      LocalStorage.setToken(user.token);
      console.log(LocalStorage.getToken());
      setToken(user.token);
      console.log(user.consult.login);
      user.consult.login === "admin"
        ? history.push("/painel-adm")
        : history.push("/perfil");
    }
  };

  return (
    <div>
      <NavBar />
      <Message
        type={"fixed"}
        display={displayResposta}
        className={"Resposta"}
        message={"Login/Senha invalido"}
      />
      <h1 className="Titulo">LOGIN</h1>
      <Form
        name={"email"}
        type={"email"}
        onChange={onChange}
        value={valores.email}
        onSubmit={onSubmit}
        text={"E-mail:"}
      />
      <Form
        name={"senha"}
        type={"password"}
        onChange={onChange}
        value={valores.senha}
        onSubmit={onSubmit}
        text={"Senha:"}
      />
      <div className="Bottons">
        <button
          className="Botao"
          id="BotaoLogin"
          type="submit"
          disabled={displayButton.isDisable}
          style={displayButton}
          onClick={onSubmit}
        >
          Entrar
        </button>
        <Link to="/cadastro" className="Botao" id="BotaoCadastro">
          Novo cadastro
        </Link>
      </div>
      <h2>Entrar com a conta Google: </h2>
      <button onClick={Authenticate.Google}>Google</button>
    </div>
  );
};

export default PagesLogin;
