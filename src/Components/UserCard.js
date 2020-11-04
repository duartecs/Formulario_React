import React, { useState, useContext, useEffect } from "react";
import StorageContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";
import { Button } from "../Components/Button";
import Form from "../Components/Form";
import util from "../Util/VerifyObject";
import Mascara from "../Util/Mascara";

const valoresForm = {
  _id: "",
  login: "",
  senha: "",
  nome: "",
  cpf: "",
  idade: "",
  email: "",
};

const UserCard = ({ user, editCard, editPerfil, boxMessage, setToggle }) => {
  const { token } = useContext(StorageContext);

  const [valores, setValores] = useState(valoresForm);
  const [displayButton, setDisplayButton] = useState(false);

  useEffect(() => {
    if (editCard) {
      setDisplayButton(true);
    } else {
      setDisplayButton(false);
    }
    user.senha = "";
    setValores(user);
  }, [editCard, user]);

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
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (
      valores.login !== "" &&
      valores.nome !== "" &&
      valores.cpf !== "" &&
      valores.idade !== "" &&
      valores.email !== ""
    ) {
      const newValores = util.preRequestPUT(
        util.verifyObject(valoresForm, valores)
      );
      console.log(newValores);
      AccessDB.putUser(token, newValores)
        .then((res) => {
          boxMessage("Cadastro atualizado", "green");
          editPerfil();
          setToggle();
        })
        .catch((erro) => {
          console.log(erro);
        });
    } else {
      console.log("Favor preencher os campos");
    }
  };

  return (
    <div className="CardUser">
      <Form
        name={"login"}
        className={"FormUser"}
        type={"text"}
        onChange={onChange}
        value={valores.login}
        onSubmit={onSubmit}
        text={"Login:"}
        isDisable={!editCard}
      />
      <Form
        name={"senha"}
        className={"FormUser"}
        type={"password"}
        onChange={onChange}
        value={valores.senha}
        onSubmit={onSubmit}
        text={"Senha:"}
        placeholder={"Digite a nova senha"}
        isDisable={!editCard}
      />
      <Form
        name={"nome"}
        type={"text"}
        onChange={onChange}
        value={valores.nome}
        onSubmit={onSubmit}
        text={"Nome:"}
        className={"FormUser"}
        isDisable={!editCard}
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
        className={"FormUser"}
        isDisable={!editCard}
      />
      <Form
        name={"email"}
        type={"email"}
        onChange={onChange}
        value={valores.email}
        onSubmit={onSubmit}
        text={"E-mail:"}
        className={"FormUser"}
        isDisable={!editCard}
      />
      <Form
        name={"idade"}
        type={"text"}
        onChange={onChange}
        value={valores.idade}
        onSubmit={onSubmit}
        maxLength={"2"}
        text={"Idade:"}
        className={"FormUser"}
        isDisable={!editCard}
      />
      <div
        className="Bottons"
        style={{ display: displayButton ? "flex" : "none" }}
      >
        <Button>Salvar alterações</Button>
      </div>
    </div>
  );
};

export default UserCard;
