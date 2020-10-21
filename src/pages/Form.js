import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "../css/Form.css";
import mascaraCPF from "../Util/MascaraCPF"
import NavBar from "./NavBar";

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

    //verificar se existe algum campo em branco
    for (var element in valores) {
      valores[element] !== "" ? (count = count + 1) : (count = 0);
    }

    //gatilho para habilitar o botão de submmit
    count === 8
      ? setDisplayButton({ backgroundColor: "blue", isDisable: false })
      : (count = 0);
  };

  const onChangeCPF = (ev) =>{
    const { name, value } = ev.target;
    setValores({ ...valores, [name]: mascaraCPF(value) });
  }

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
      <form onSubmit={onSubmit}>
        <div className="Form">
          <label htmlFor="login">Login:</label>
          <input
            name="login"
            type="text"
            onChange={onChange}
            value={valores.login}
          />
        </div>
        <div className="Form">
          <label htmlFor="senha">Senha:</label>
          <input
            name="senha"
            type="password"
            onChange={onChange}
            value={valores.senha}
          />
        </div>
        <div className="Form">
          <label htmlFor="confirmar_senha">Confirme a senha:</label>
          <input
            name="confirmar_senha"
            type="password"
            onChange={onChange}
            value={valores.confirmar_senha}
          />
          <p className="Alerta" style={displayPassword}>
            Os campos de senha devem ser iguais, favor digite novamente!
          </p>
        </div>
        <div className="Form">
          <label htmlFor="nome">Nome:</label>
          <input
            name="nome"
            type="text"
            onChange={onChange}
            value={valores.nome}
          />
        </div>
        <div className="Form">
          <label htmlFor="cpf">CPF:</label>
          <input
            name="cpf"
            type="text"
            maxLength="14"
            placeholder="Somente numeros"
            onChange={onChangeCPF}
            value={valores.cpf}
          />
        </div>
        <div className="Form">
          <label htmlFor="email">E-mail:</label>
          <input
            name="email"
            type="email"
            onChange={onChange}
            value={valores.email}
          />
        </div>
        <div className="Form">
          <label htmlFor="confirmar_email">Confirme o e-mail:</label>
          <input
            name="confirmar_email"
            type="email"
            onChange={onChange}
            value={valores.confirmar_email}
          />
          <p className="Alerta" id="alerta-email" style={displayEmail}>
            Os campos de e-mail devem ser iguais, favor digite novamente!
          </p>
        </div>
        <div className="Form">
          <label htmlFor="idade">Idade:</label>
          <input
            name="idade"
            type="number"
            onChange={onChange}
            value={valores.idade}
          />
        </div>
        <div className="Bottons">
          <button
            className="Botao"
            id="BotaoSubmmit"
            type="submit"
            disabled={displayButton.isDisable}
            style={displayButton}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PagesForm;
