import React, { useState, useContext, useEffect } from "react";
import util from "../Util/VerifyObject";
import Mascara from "../Util/Mascara";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import { Button, Gbutton } from "../Components/Button";
import Form from "../Components/Form";
import StorageContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";
import ImageStorage from "../Service/ImageStorage";

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
  url: "",
};

const PagesPerfil = () => {
  const { token } = useContext(StorageContext);

  const [valores, setValores] = useState(valoresForm);
  const [valoresUsuario, setValoresUsuario] = useState(valoresForm);
  const [display, setDisplay] = useState({ isDisable: true });
  const [displayButton, setDisplayButton] = useState(false);
  const [displayPassword, setDisplayPassword] = useState({ display: "none" });
  const [displayEmail, setDisplayEmail] = useState({ display: "none" });

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [progress, setProgress] = useState(null);
  const [editImage, setEditImage] = useState(false);

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

  if (url !== null) {
    setValores({ ...valores, url: url });
    setEditImage(false);
    setProgress(null);
    setUrl(null);
  }

  const onChange = (ev) => {
    //extrair os valores dos inputs
    const { name, value } = ev.target;

    //setar os novos valores do state
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
  };

  const ImageChange = (e) => {
    e.target.files[0] && setImage(e.target.files[0]);
  };
  const ImageUpload = () => {
    ImageStorage.upload(image, setProgress, setUrl);
  };

  const editPerfil = () => {
    setDisplay({ isDisable: false });
    setDisplayButton(true);
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
    setDisplayButton(false);
    setDisplay({ isDisable: true });
    setDisplayEmail({ display: "none" });
    setDisplayPassword({ display: "none" });
  };

  return (
    <div>
      <NavBar />
      <h1>Perfil</h1>
      <h1>Olá {valores.login}</h1>
      <div className="ImageContainer">
        <img
          src={valores.url || "http://via.placeholder.com/100"}
          alt="Perfil"
        />
      </div>
      <Form
        name={"nome"}
        type={"text"}
        onChange={onChange}
        value={valores.nome}
        onSubmit={putPerfil}
        text={"Nome:"}
        isDisable={display.isDisable}
      />
      <div style={{ display: displayButton ? "flex" : "none" }}>
        <Form
          name={"senha"}
          type={"password"}
          onChange={onChange}
          value={valores.senha}
          onSubmit={putPerfil}
          text={"Nova senha:"}
        />
      </div>
      <div style={{ display: displayButton ? "flex" : "none" }}>
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
      <div style={{ display: displayButton ? "flex" : "none" }}>
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
      <div
        className="Bottons"
        style={{ display: displayButton ? "flex" : "none" }}
      >
        <Gbutton onClick={putPerfil}>Salvar alterações</Gbutton>
        <Button onClick={() => cancel(true)}>Cancelar</Button>
      </div>
      <div
        className="Bottons"
        style={{ display: displayButton ? "none" : "flex" }}
      >
        <Button onClick={editPerfil}>Editar perfil</Button>
        <Button
          onClick={() => {
            setEditImage(!editImage);
          }}
        >
          {valoresUsuario.url === null ? "Adicionar imagem" : "Editar imagem"}
        </Button>
      </div>
      <div
        style={{ display: editImage ? "flex" : "none" }}
        className="EditImage"
      >
        <input type="file" onChange={ImageChange} />
        <br />
        <br />
        {progress !== null && <progress value={progress} max="100" />}
        <div className="Bottons">
          <Gbutton onClick={ImageUpload}>Enviar</Gbutton>
          <Button
            onClick={() => {
              setEditImage(!editImage);
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PagesPerfil;
