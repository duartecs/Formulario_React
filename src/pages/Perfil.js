import React, { useState, useContext, useEffect } from "react";
import util from "../Util/VerifyObject";
import mascaraCPF from "../Util/MascaraCPF";
import mascaraIdade from "../Util/MascaraIdade";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import Form from "../Components/Form";
import StoreContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";

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
  const { token } = useContext(StoreContext);

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

  useEffect(() => {
    if (valoresUsuario.login === undefined || valoresUsuario.login === "") {
      AccessDB.findUser(token)
        .then((user) => {
          setValoresUsuario(util.verifyObject(valoresForm, user));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setValores(valoresUsuario);
    }
  }, [token, valoresUsuario]);

  const onChange = (ev) => {
    //extrair os valores dos inputs
    const { name, value } = ev.target;

    //setar os novos valores do state
    switch (ev.target.name) {
      case "cpf":
        setValores({ ...valores, [name]: mascaraCPF(value) });
        break;
      case "idade":
        setValores({ ...valores, [name]: mascaraIdade(value) });
        break;
      default:
        setValores({ ...valores, [name]: value });
        break;
    }
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
    if (valores.email === "") {
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
    //Senha ok e email ok realiza o put
    if (statusPassword && statusEmail) {
      const newValue = util.preRequestPUT(valores);
      AccessDB.putUser(token, newValue)
        .then((res) => {
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
      </div>
      <Message
        type={"fixed"}
        display={displayPassword}
        className={"Alerta"}
        message={"Os campos de senha devem ser iguais, favor digite novamente!"}
      />
      <Form
        name={"cpf"}
        type={"text"}
        onChange={onChange}
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
      </div>
      <Message
        type={"fixed"}
        display={displayEmail}
        className={"Alerta"}
        message={
          "Os campos de e-mail devem ser iguais, favor digite novamente!"
        }
      />
      <Form
        name={"idade"}
        type={"text"}
        onChange={onChange}
        value={valores.idade}
        onSubmit={putPerfil}
        maxLength={"2"}
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
