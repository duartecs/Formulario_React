import React, { useState, useContext, useEffect } from "react";
import util from "../Util/VerifyObject";
import Mascara from "../Util/Mascara";
import NavBar from "../Components/NavBar";
import Message from "../Components/Messages";
import { Button, Gbutton } from "../Components/Button";
import Form from "../Components/Form";
import StorageContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";
import Authenticate from "../Service/Authenticate";
import ImageStorage from "../Service/ImageStorage";

import "../css/Form.css";

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
  console.log("page");
  const { token } = useContext(StorageContext);

  const [valores, setValores] = useState(valoresForm);
  const [valoresUsuario, setValoresUsuario] = useState(valoresForm);
  const [display, setDisplay] = useState({ isDisable: true });
  const [displayButton, setDisplayButton] = useState(false);
  const [changePassword, setChangePassword] = useState({
    display: false,
    message: false,
    submmit: false,
  });
  const [valuePassword, setValuePassword] = useState({
    senha: "",
    confirmar_senha: "",
  });

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(null);
  const [editImage, setEditImage] = useState(false);

  useEffect(() => {
    if (valoresUsuario.login === undefined || valoresUsuario.login === "") {
      AccessDB.findUser(token)
        .then((user) => {
          setValoresUsuario(util.verifyObject(valoresForm, user.login === undefined ? user[0] : user));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setValores(valoresUsuario);
    }
  }, [token, valoresUsuario]);

  const onChangePassword = (ev) => {
    const { name, value } = ev.target;
    console.log(ev.target);
    setValuePassword({ ...valuePassword, [name]: value });
    util.isEmpty(valuePassword) === 0
      ? setChangePassword({ ...changePassword, submmit: true })
      : setChangePassword({ ...changePassword, submmit: false });
  };

  const putPassword = (ev) => {
    ev.preventDefault();
    valuePassword.senha === valuePassword.confirmar_senha
      ? setChangePassword({ ...changePassword, message: false })
      : setChangePassword({ ...changePassword, message: true });

    if (!changePassword.message && changePassword.submmit) {
      console.log(valuePassword)
      Authenticate.mudarSenha(valuePassword)
        .then((res) => {
          console.log(res)
        })
        .catch((erro) => {
          console.log(erro);
        });
    }
  };

  const onChange = (ev) => {
    const { name, value } = ev.target;
    console.log(ev.target);

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
    ImageStorage.upload(image, setProgress).then((url) => {
      AccessDB.putUser(token, { _id: valores._id, url })
        .then((res) => {
          //informar o usuario que a imagem foi atualizada
          setProgress(null);
          setEditImage(null);
          setImage(null);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const editPerfil = () => {
    setDisplay({ isDisable: false });
    setDisplayButton(true);
  };

  const putPerfil = (ev) => {
    ev.preventDefault();
    if (util.isEmpty(valores) === 0) {
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
      <Form
        name={"cpf"}
        type={"text"}
        onChange={onChange}
        value={valores.cpf}
        onSubmit={putPerfil}
        text={"CPF:"}
        maxLength={"14"}
        placeholder={"___.___.___-__"}
        isDisable={display.isDisable}
      />
      <Form
        name={"email"}
        type={"email"}
        onChange={onChange}
        value={valores.email}
        onSubmit={putPerfil}
        text={"E-mail:"}
        isDisable
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
            setChangePassword({ ...changePassword, display: true });
          }}
        >
          Mudar senha
        </Button>
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
      <div
        className="PasswordForm"
        style={{ display: changePassword.display ? "flex" : "none" }}
      >
        <Form
          name={"senha"}
          type={"password"}
          onChange={onChangePassword}
          value={valuePassword.senha}
          onSubmit={putPassword}
          text={"Nova senha:"}
        />
        <Form
          name={"confirmar_senha"}
          type={"password"}
          onChange={onChangePassword}
          value={valuePassword.confirmar_senha}
          onSubmit={putPassword}
          text={"Confirme a nova senha:"}
        />
        <Message
          type={"fixed"}
          display={{ display: changePassword.message ? "flex" : "none" }}
          className={"Alerta"}
          message={
            "Os campos de senha devem ser iguais, favor digite novamente!"
          }
        />
        <div className="Bottons">
          <Gbutton
            onClick={putPassword}
            desactive={changePassword.submmit ? false : true}
            disabled={changePassword.submmit ? false : true}
          >
            Mudar
          </Gbutton>
          <Button
            onClick={() => {
              setChangePassword({ ...changePassword, display: false });
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
