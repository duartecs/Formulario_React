import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";
import Form from "../Components/Form";
import util from "../Util/VerifyObject";
import mascaraCPF from "../Util/MascaraCPF";
import mascaraIdade from "../Util/MascaraIdade";

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
  const { token } = useContext(StoreContext);

  const [valores, setValores] = useState(valoresForm);
  const [displayButton, setDisplayButton] = useState({ display: "none" });

  useEffect(() => {
    if (editCard) {
      setDisplayButton({
        display: "flex",
        backgroundColor: "darkblue",
        isDisable: false,
      });
    } else {
      setDisplayButton({ display: "none" });
    }
    user.senha = "";
    setValores(user);
  }, [editCard, user]);

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
      <div className="Bottons">
        <button
          className="Botao"
          type="submit"
          disabled={displayButton.isDisable}
          style={displayButton}
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
};

export default UserCard;
