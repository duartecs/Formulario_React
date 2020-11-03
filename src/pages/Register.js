import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import StorageContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";
import Authenticate from "../Service/Authenticate";
import mascaraCPF from "../Util/MascaraCPF";
import mascaraIdade from "../Util/MascaraIdade";
import verifyObject from "../Util/VerifyObject";
import LocalStorage from "../Util/LocalStorage";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import Form from "../Components/Form";
import Popup from "../Components/Popup/Popup";

import "../css/Form.css";

var statusPassword = false;
var statusEmail = false;

const valoresForm = {
  login: "",
  senha: "",
  confirmar_senha: "",
  nome: "",
  cpf: "",
  idade: "",
  email: "",
  confirmar_email: "",
};

const valuesRegister = {
  id_firebase: "",
  login: "",
  nome: "",
  cpf: "",
  idade: "",
  email: "",
};

const PagesRegister = () => {
  const history = useHistory();

  const [valores, setValores] = useState(valoresForm);
  const [displayPassword, setDisplayPassword] = useState({ display: "none" });
  const [displayEmail, setDisplayEmail] = useState({ display: "none" });
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });
  const [displayButton, setDisplayButton] = useState({
    backgroundColor: "grey",
    isDisable: true,
  });
  const [resposta, setResposta] = useState("");
  const [popup, showPopup] = useState(false);
  const [completRegister, setCompletRegister] = useState(false);
  const { setToken, userGoogle } = useContext(StorageContext);

  useEffect(() => {
    userGoogle !== null && setCompletRegister(true);
    console.log("to no effect");
  }, [userGoogle]);

  if (completRegister) {
    setValores(verifyObject.editModel({ ...valores, ...userGoogle }));
    console.log(valores);
    setCompletRegister(false);
  }

  const onChange = (ev) => {
    const { name, value } = ev.target;

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
    verifyObject.isEmpty(valores) === 0 &&
      setDisplayButton({ backgroundColor: "blue", isDisable: false });
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    if (userGoogle === null) {
      if (valores.senha === valores.confirmar_senha) {
        setDisplayPassword({ display: "none" });
        statusPassword = true;
      } else {
        setDisplayPassword({ display: "flex" });
        statusPassword = false;
      }
      if (valores.email === valores.confirmar_email) {
        setDisplayEmail({ display: "none" });
        statusEmail = true;
      } else {
        setDisplayEmail({ display: "flex" });
        statusEmail = false;
      }
    } else {
      statusPassword = true;
      statusEmail = true;
    }

    if (statusPassword && statusEmail) {
      var newValues = {};
      if (userGoogle === null) {
        const idFirebase = await Authenticate.cadastrar(valores);
        newValues = verifyObject.verifyObject(valuesRegister, {
          ...idFirebase,
          ...valores,
        });
      } else {
        newValues = verifyObject.verifyObject(valuesRegister, valores);
      }
      AccessDB.postUser(newValues)
        .then((res) => {
          if (userGoogle === null) {
            changePopup(true);
          } else {
            AccessDB.findUserLogin(valores.id_firebase).then((res) => {
              LocalStorage.setToken(res.token);
              setToken(res.token);
              res.consult.login === "admin"
                ? history.push("/painel-adm")
                : history.push("/perfil");
            });
          }
        })
        .catch((erro) => {
          setDisplayButton({ backgroundColor: "grey", isDisable: true });
          setResposta(erro.response.data);
          setDisplayResposta({ display: "flex", backgroundColor: "red" });
          console.log(erro.response.data);
        });
    } else {
      console.log("dados divergentes");
    }
  };

  const changePopup = (event) => {
    if (event) {
      Authenticate.verificarEmail()
        .then((res) => {
          showPopup(true);
        })
        .catch((erro) => {
          console.log(erro);
        });
    } else {
      showPopup(false);
      history.push("/login");
    }
  };

  return (
    <div>
      {popup && (
        <Popup
          closePopup={changePopup}
          title={"Email de verificação enviado"}
          message={
            "Por favor, verifique sua caixa de entrada para confirmar sua conta de email."
          }
        />
      )}
      <NavBar />
      <Message
        type={"fixed"}
        display={displayResposta}
        className={"Resposta"}
        message={resposta}
      />
      <h1>{userGoogle === null ? "PAGE FORM" : "Complete seu cadastro"}</h1>
      {userGoogle !== null && (
        <h3>Por favor, precisamos de mais algumas informações para terminar</h3>
      )}
      <Form
        name={"login"}
        type={"text"}
        onChange={onChange}
        value={valores.login}
        onSubmit={onSubmit}
        text={"Login:"}
      />
      {userGoogle === null && (
        <Form
          name={"senha"}
          type={"password"}
          onChange={onChange}
          value={valores.senha}
          onSubmit={onSubmit}
          text={"Senha:"}
        />
      )}
      {userGoogle === null && (
        <Form
          name={"confirmar_senha"}
          type={"password"}
          onChange={onChange}
          value={valores.confirmar_senha}
          onSubmit={onSubmit}
          text={"Confirme a senha:"}
        />
      )}
      {userGoogle === null && (
        <Message
          type={"fixed"}
          display={displayPassword}
          className={"Alerta"}
          message={
            "Os campos de senha devem ser iguais, favor digite novamente!"
          }
        />
      )}
      <Form
        name={"nome"}
        type={"text"}
        onChange={onChange}
        value={valores.nome}
        onSubmit={onSubmit}
        text={"Nome:"}
      />
      <Form
        name={"cpf"}
        type={"text"}
        onChange={onChange}
        value={valores.cpf}
        onSubmit={onSubmit}
        text={"CPF:"}
        maxLength={"14"}
        placeholder={"Somente numeros"}
      />
      <Form
        name={"email"}
        type={"email"}
        onChange={onChange}
        value={valores.email}
        onSubmit={onSubmit}
        text={"E-mail:"}
        isDisable={userGoogle === null ? false : true}
      />
      {userGoogle === null && (
        <Form
          name={"confirmar_email"}
          type={"email"}
          onChange={onChange}
          value={valores.confirmar_email}
          onSubmit={onSubmit}
          text={"Confirme o e-mail:"}
        />
      )}
      {userGoogle === null && (
        <Message
          type={"fixed"}
          display={displayEmail}
          className={"Alerta"}
          message={
            "Os campos de e-mail devem ser iguais, favor digite novamente!"
          }
        />
      )}
      <Form
        name={"idade"}
        type={"text"}
        onChange={onChange}
        value={valores.idade}
        onSubmit={onSubmit}
        maxLength={"2"}
        text={"Idade:"}
      />
      <div className="Bottons">
        <button
          className="Botao"
          id="BotaoSubmmit"
          type="submit"
          disabled={displayButton.isDisable}
          style={displayButton}
          onClick={onSubmit}
        >
          {userGoogle === null ? "Cadastrar" : "Finalizar Cadastro"}
        </button>
      </div>
    </div>
  );
};

export default PagesRegister;
