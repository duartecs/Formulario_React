import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import StorageContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";
import Authenticate from "../Service/Authenticate";
import Mascara from "../Util/Mascara";
import util from "../Util/VerifyObject";
import LocalStorage from "../Util/LocalStorage";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import { Button } from "../Components/Button";
import Form from "../Components/Form";
import Popup from "../Components/Popup/Popup";

import "../css/Form.css";

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
  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayEmail, setDisplayEmail] = useState(false);
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });
  const [displayButton, setDisplayButton] = useState(false);
  const [resposta, setResposta] = useState("");
  const [popup, showPopup] = useState(false);
  const [completRegister, setCompletRegister] = useState(false);
  const { setToken, userGoogle } = useContext(StorageContext);

  useEffect(() => {
    userGoogle !== null && setCompletRegister(true);
    console.log("to no effect");
  }, [userGoogle]);

  if (completRegister) {
    setValores(util.editModel({ ...valores, ...userGoogle }));
    setCompletRegister(false);
  }

  const onChange = (ev) => {
    const { name, value } = ev.target;

    switch (ev.target.name) {
      case "cpf":
        setValores({ ...valores, [name]: Mascara.CPF(value) });
        break;
      case "idade":
        setValores({ ...valores, [name]: Mascara.Idade(value) });
        break;
      default:
        setValores({ ...valores, [name]: value });
        break;
    }
    util.isEmpty(valores) === 0
      ? setDisplayButton(true)
      : setDisplayButton(false);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    if (userGoogle === null) {
      valores.senha === valores.confirmar_senha
        ? setDisplayPassword(false)
        : setDisplayPassword(true);
      valores.email === valores.confirmar_email
        ? setDisplayEmail(false)
        : setDisplayEmail(true);
    } else {
      setDisplayPassword(true);
      setDisplayEmail(true);
    }

    if (displayPassword && displayEmail) {
      var newValues = {};
      if (userGoogle === null) {
        const idFirebase = await Authenticate.cadastrar(valores);
        newValues = util.verifyObject(valuesRegister, {
          ...idFirebase,
          ...valores,
        });
      } else {
        newValues = util.verifyObject(valuesRegister, valores);
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
          setDisplayButton(false);
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
          display={{ display: displayPassword ? "flex" : "none" }}
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
        placeholder={"___.___.___-__"}
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
          display={{ display: displayEmail ? "flex" : "none" }}
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
        <Button
          desactive={displayButton ? false : true}
          onClick={onSubmit}
          disabled={displayButton ? false : true}
        >
          {userGoogle === null ? "Cadastrar" : "Finalizar Cadastro"}
        </Button>
      </div>
    </div>
  );
};

export default PagesRegister;
