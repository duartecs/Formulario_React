import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "../css/Form.css";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import Form from "../Components/Form";
import Popup from "../Components/Popup/Popup";
import Authenticate from "../Service/Authenticate";
import AccessDB from "../Service/AccessDB";
import LocalStorage from "../Util/LocalStorage";
import StorageContext from "../Components/Context";
import { Button, Gbutton } from "../Components/Button";
import BotaoGoogle from "../Images/Google.png";

const valoresLogin = {
  email: "",
  senha: "",
};

var count = 0;

const PagesLogin = () => {
  const [valores, setValores] = useState(valoresLogin);
  const [displayButton, setDisplayButton] = useState(false);
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });
  const [popup, showPopup] = useState(false);
  const [popupEmail, setPopupEmail] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupPassword, setPopupPassword] = useState(false);

  const history = useHistory();
  const { setToken, setUserGoogle } = useContext(StorageContext);

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
    count === 2 ? setDisplayButton(true) : (count = 0);
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    let idFirebase = "";
    try {
      idFirebase = await Authenticate.login(valores);
      if (idFirebase.emailVerified) {
        const user = await AccessDB.findUserLogin(idFirebase.id_firebase);
        LocalStorage.setToken(user.token);
        setToken(user.token);
        user.consult.login === "admin"
          ? history.push("/painel-adm")
          : history.push("/perfil");
      } else {
        await Authenticate.verificarEmail();
        setPopup(false);
      }
    } catch (error) {
      setDisplayResposta({ display: "flex", backgroundColor: "red" });
    }
  };

  const changePassword = (ev) => {
    const { name, value } = ev.target;
    setPopupEmail({ ...popupEmail, [name]: value });
  };

  const submmitPassword = () => {
    Authenticate.redefinirSenha(popupEmail)
      .then(() => {
        console.log("email enviado");
        showPopup(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setPopup = (type) => {
    if (type) {
      setPopupTitle("Redefinição de senha");
      setPopupMessage(
        "Por favor, informe seu email para enviar a redefinição de senha"
      );
      setPopupPassword(true);
      showPopup(true);
    } else {
      setPopupTitle("Email de verificação enviado");
      setPopupMessage(
        "Por favor, antes de efetuar o login verifique sua caixa de entrada para confirmar sua conta de email."
      );
      setPopupPassword(false);
      showPopup(true);
    }
  };

  const GoogleLogin = async () => {
    Authenticate.Google()
      .then((res) => {
        AccessDB.findUserLogin(res.user.uid)
          .then((user) => {
            LocalStorage.setToken(user.token);
            setToken(user.token);
            user.consult.login === "admin"
              ? history.push("/painel-adm")
              : history.push("/perfil");
          })
          .catch(() => {
            setUserGoogle({
              id_firebase: res.user.uid,
              nome: res.user.displayName,
              email: res.user.email,
            });
            history.push("/cadastro");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {popup && (
        <Popup
          closePopup={showPopup}
          title={popupTitle}
          message={popupMessage}
          onChange={popupPassword ? changePassword : false}
          submmit={popupPassword ? submmitPassword : false}
        />
      )}
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
        <Button
          desactive={displayButton ? false : true}
          disabled={displayButton ? false : true}
          onClick={onSubmit}
        >
          Entrar
        </Button>
        <Button
          onClick={() => {
            setPopup(true);
          }}
        >
          Esqueci minha senha
        </Button>
        <Gbutton as="a" href="/cadastro">
          Novo cadastro
        </Gbutton>
      </div>

      <h3>Entrar com uma conta Google: </h3>
      <div className="Bottons">
        <button className="BtnGoogle" onClick={GoogleLogin}>
          <img src={BotaoGoogle} alt="Botton Google" />
        </button>
      </div>
    </div>
  );
};

export default PagesLogin;
