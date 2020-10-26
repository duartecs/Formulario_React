import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../css/Form.css";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import Form from "../Components/Form";
import axios from "axios";

const valoresLogin = {
  login: "",
  senha: "",
};

var count = 0;

const PagesLogin = () => {
  const history = useHistory();

  const [valores, setValores] = useState(valoresLogin);
  const [displayButton, setDisplayButton] = useState({
    backgroundColor: "grey",
    isDisable: true,
  });
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });

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

  const onSubmit = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:5000/login", valores)
      .then((response) => {
        if (response.data.consult.login === "admin") {
          history.push({
            pathname: "/painel-adm",
            state: { token: response.data.token, user: response.data.consult },
          });
        } else {
          history.push({
            pathname: "/perfil",
            state: { token: response.data.token, user: response.data.consult },
          });
        }
      })
      .catch((erro) => {
        setDisplayResposta({ display: "flex", backgroundColor: "red" });
        console.log(erro);
      });
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
        name={"login"}
        type={"text"}
        onChange={onChange}
        value={valores.login}
        onSubmit={onSubmit}
        text={"Login:"}
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
    </div>
  );
};

export default PagesLogin;
