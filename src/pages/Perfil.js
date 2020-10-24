import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import util from "../Util/VerifyObject";
import mascaraCPF from "../Util/MascaraCPF";
import NavBar from "../Components/NavBar";
import Form from "../Components/Form";

import "../css/Form.css";

var statusPassword = false;
var statusEmail = false;

const valoresForm = {
  _id: "",
  login: "",
  nome: "",
  cpf: "",
  idade: "",
  email: "",
};

const PagesPerfil = () => {
  const history = useHistory();

  const [token, setToken] = useState();
  const [valores, setValores] = useState(valoresForm);
  const [valoresUsuario, setValoresUsuario] = useState(valoresForm);
  const [display, setDisplay] = useState({ isDisable: true });
  const [displayButton, setDisplayButton] = useState({ display: "none" });
  const [displayEditButton, setDisplayEditButton] = useState({
    display: "flex",
    background: "darkblue",
  });
  const [displayPassword, setDisplayPassword] = useState({ display: "none" });
  const [displayEmail, setDisplayEmail] = useState({ display: "none" });

  const location = useLocation();

  if (location.state === undefined) {
    history.push({ pathname: "/login" });
  }

  if (token === undefined) {
    setToken(location.state.token);
  }

  useEffect(() => {
    setValoresUsuario(util.verifyObject(valoresForm, location.state.user));
    setValores(valoresUsuario);
  }, [location, valoresUsuario]);

  const onChange = (ev) => {
    //extrair os valores dos inputs
    const { name, value } = ev.target;

    //setar os novos valores do state
    setValores({ ...valores, [name]: value });
  };

  const onChangeCPF = (ev) => {
    const { name, value } = ev.target;
    setValores({ ...valores, [name]: mascaraCPF(value) });
  };

  const editPerfil = () => {
    setDisplay({ isDisable: false });
    setDisplayButton({ display: "flex" });
    setDisplayEditButton({ display: "none" });
    setValores({ ...valores, email: "" });
  };

  const putPerfil = (ev) => {
    ev.preventDefault();
    if (valores.senha === "") {
      statusPassword = true;
    } else {
      //validar a senha
      if (valores.senha === valores.confirmar_senha) {
        setDisplayPassword({ display: "none" });
        statusPassword = true;
      } else {
        setDisplayPassword({ display: "flex" });
        statusPassword = false;
      }
    }
    if (valores.email === "" || valores.email === location.state.user.email) {
      statusEmail = true;
    } else {
      //validar o email
      if (valores.email === valores.confirmar_email) {
        setDisplayEmail({ display: "none" });
        statusEmail = true;
      } else {
        setDisplayEmail({ display: "flex" });
        statusEmail = false;
      }
    }
    //Senha ok e email ok realiza o post
    if (statusPassword === true && statusEmail === true) {
      const newValue = util.preRequestPUT(valores);
      axios
        .put("http://localhost:5000/cadastro", newValue, {
          headers: { autenticate: token },
        })
        .then((response) => {
          setValores(newValue);
          newValue.email === undefined &&
            setValores({ ...valores, email: valoresUsuario.email });
          cancel(false);
        })
        .catch((erro) => {
          console.log(erro);
        });
    } else {
      console.log("dados divergentes");
    }
  };

  const cancel = (toggle) => {
    if (toggle) {
      util.editModel(valores);
      setValores(valoresUsuario);
    }
    setDisplayButton({ display: "none" });
    setDisplay({ isDisable: true });
    setDisplayEditButton({ display: "flex", background: "darkblue" });
    setDisplayEmail({ display: "none" });
    setDisplayPassword({ display: "none" });
  };

  return (
    <div>
      <NavBar />
      <h1>Perfil</h1>
      <h1>Olá {valores.login}</h1>
      <Form
        name={"nome"}
        type={"text"}
        onChange={onChange}
        value={valores.nome}
        onSubmit={putPerfil}
        text={"Nome:"}
        isDisable={display.isDisable}
      />
      <div style={displayButton}>
        <Form
          name={"senha"}
          type={"password"}
          onChange={onChange}
          value={valores.senha}
          onSubmit={putPerfil}
          text={"Nova senha:"}
        />
      </div>
      <div style={displayButton}>
        <Form
          name={"confirmar_senha"}
          type={"password"}
          onChange={onChange}
          value={valores.confirmar_senha}
          onSubmit={putPerfil}
          text={"Confirme a nova senha:"}
        />
        <p className="Alerta" style={displayPassword}>
          Os campos de senha devem ser iguais, favor digite novamente!
        </p>
      </div>
      <Form
        name={"cpf"}
        type={"text"}
        onChange={onChangeCPF}
        value={valores.cpf}
        onSubmit={putPerfil}
        text={"CPF:"}
        maxLength={"14"}
        placeholder={"Somente numeros"}
        isDisable={display.isDisable}
      />
      <Form
        name={"email"}
        type={"email"}
        onChange={onChange}
        value={valores.email}
        onSubmit={putPerfil}
        text={display.isDisable ? "E-mail:" : "Novo e-mail:"}
        isDisable={display.isDisable}
      />
      <div style={displayButton}>
        <Form
          name={"confirmar_email"}
          type={"email"}
          onChange={onChange}
          value={valores.confirmar_email}
          onSubmit={putPerfil}
          text={"Confirme o novo e-mail:"}
        />
        <p className="Alerta" id="alerta-email" style={displayEmail}>
          Os campos de e-mail devem ser iguais, favor digite novamente!
        </p>
      </div>
      <Form
        name={"idade"}
        type={"number"}
        onChange={onChange}
        value={valores.idade}
        onSubmit={putPerfil}
        text={"Idade:"}
        isDisable={display.isDisable}
      />
      <div className="Bottons">
        <button
          className="Botao"
          id="BotaoCadastro"
          type="submit"
          onClick={putPerfil}
          style={displayButton}
        >
          Salvar alterações
        </button>
        <button
          className="Botao"
          id="BotaoCancelar"
          type="reset"
          onClick={() => cancel(true)}
          style={displayButton}
        >
          Cancelar
        </button>
      </div>

      <div className="Bottons">
        <button
          className="Botao"
          onClick={editPerfil}
          style={displayEditButton}
        >
          Editar perfil
        </button>
      </div>
    </div>
  );
};

export default PagesPerfil;