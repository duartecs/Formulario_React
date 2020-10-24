import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "../css/Form.css";
import mascaraCPF from "../Util/MascaraCPF";
import NavBar from "../Components/NavBar";
import Form from "../Components/Form";

//variaveis de controle
var statusPassword = false;
var statusEmail = false;
var count = 0;

//objeto que vai receber os valores do form
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

//Page FORM
const PagesForm = () => {
  const history = useHistory();

  //States para atualizar valores do form e mensagens de aviso
  const [valores, setValores] = useState(valoresForm);
  const [displayPassword, setDisplayPassword] = useState({ display: "none" });
  const [displayEmail, setDisplayEmail] = useState({ display: "none" });
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });
  const [displayButton, setDisplayButton] = useState({
    backgroundColor: "grey",
    isDisable: true,
  });
  const [resposta, setResposta] = useState("");

  //função atualiza a cada dado alterado no form
  const onChange = (ev) => {
    //extrair os valores dos inputs
    const { name, value } = ev.target;

    //setar os novos valores do state
    setValores({ ...valores, [name]: value });

    console.log(valores);

    //verificar se existe algum campo em branco
    for (var element in valores) {
      valores[element] !== "" ? (count = count + 1) : (count = 0);
    }

    //gatilho para habilitar o botão de submmit
    count === 8
      ? setDisplayButton({ backgroundColor: "blue", isDisable: false })
      : (count = 0);
  };

  const onChangeCPF = (ev) => {
    const { name, value } = ev.target;
    setValores({ ...valores, [name]: mascaraCPF(value) });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    //validar a senha
    if (valores.senha === valores.confirmar_senha) {
      setDisplayPassword({ display: "none" });
      statusPassword = true;
    } else {
      setDisplayPassword({ display: "flex" });
      statusPassword = false;
    }

    //validar o email
    if (valores.email === valores.confirmar_email) {
      setDisplayEmail({ display: "none" });
      statusEmail = true;
    } else {
      setDisplayEmail({ display: "flex" });
      statusEmail = false;
    }

    //Senha ok e email ok realiza o post
    if (statusPassword === true && statusEmail === true) {
      axios
        .post("http://localhost:5000/cadastro", valores)
        .then((response) => {
          console.log(response);
          setResposta("Cadastro salvo com sucesso!");
          setDisplayResposta({ display: "flex", backgroundColor: "green" });
          setDisplayButton({ backgroundColor: "grey", isDisable: true });
          setValores(valoresForm);
          history.push("/login");
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

  //JSX FORM
  return (
    <div>
      <NavBar />
      <p className="Resposta" style={displayResposta}>
        {resposta}
      </p>
      <h1 className="Titulo">PAGE FORM</h1>
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
      <Form
        name={"confirmar_senha"}
        type={"password"}
        onChange={onChange}
        value={valores.confirmar_senha}
        onSubmit={onSubmit}
        text={"Confirme a senha:"}
      />
      <p className="Alerta" style={displayPassword}>
        Os campos de senha devem ser iguais, favor digite novamente!
      </p>
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
        onChange={onChangeCPF}
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
      />
      <Form
        name={"confirmar_email"}
        type={"email"}
        onChange={onChange}
        value={valores.confirmar_email}
        onSubmit={onSubmit}
        text={"Confirme o e-mail:"}
      />
      <p className="Alerta" id="alerta-email" style={displayEmail}>
        Os campos de e-mail devem ser iguais, favor digite novamente!
      </p>
      <Form
        name={"idade"}
        type={"number"}
        onChange={onChange}
        value={valores.idade}
        onSubmit={onSubmit}
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
          Cadastrar
        </button>
      </div>
    </div>
  );
};

export default PagesForm;
