import React, { useState } from "react";
import { useEffect } from "react";
import util from "../Util/VerifyObject";
import mascaraCPF from "../Util/MascaraCPF"
import axios from "axios";

const valoresForm = {
  _id: "",
  login: "",
  senha: "",
  nome: "",
  cpf: "",
  idade: "",
  email: "",
};

 const UserCard = (props) => {
  const [valores, setValores] = useState(valoresForm);
  const [token, setToken] = useState("");
  const [displayButton, setDisplayButton] = useState({display: "none"});

  useEffect(() => {
    if(props.editCard){
      setDisplayButton({display: "flex", backgroundColor: "darkblue", isDisable: false})
    }else{
      setDisplayButton({display: "none"})
    }
    props.valores.senha = '';
    setValores(props.valores);
    setToken(props.token);
  }, [props]);

  const onChange = (ev) => {
    const { name, value } = ev.target;
    setValores({ ...valores, [name]: value });
  };
  const onChangeCPF = (ev) =>{
    const { name, value } = ev.target;
    setValores({ ...valores, [name]: mascaraCPF(value) });
  }

  const onSubmit = (ev) => {
    ev.preventDefault();

    if(
      valores.login !== '' &&
      valores.nome !== '' &&
      valores.cpf !== '' &&
      valores.idade !== '' &&
      valores.email!== ''){
        const newValores = util.preRequestPUT(util.verifyObject(valoresForm,valores));
        console.log(newValores);
        axios
          .put("http://localhost:5000/cadastro", newValores, {
            headers: { autenticate: token },
          })
          .then((response) => {
            console.log(response)
            props.boxMessage("Cadastro atualizado","green")
            props.editPerfil();
          })
          .catch((erro) => {
            console.log(erro);
          });
      }else{
        console.log("Favor preencher os campos")
      }
  };
  return (
    <div className="CardUser">
      <form onSubmit={onSubmit}>
        <div className="FormUser">
          <label className="labelUser" htmlFor="login">
            Login:
          </label>
          <input
            name="login"
            type="text"
            value={valores.login}
            disabled={!props.editCard}
            onChange={onChange}
          />
        </div>
        <div className="FormUser">
          <label className="labelUser" htmlFor="senha">
            Senha:
          </label>
          <input
            name="senha"
            type="password"
            placeholder="Digite a nova senha"
            value={valores.senha}
            disabled={!props.editCard}
            onChange={onChange}
          />
        </div>
        <div className="FormUser">
          <label className="labelUser" htmlFor="nome">
            Nome:
          </label>
          <input
            name="nome"
            type="text"
            value={valores.nome}
            disabled={!props.editCard}
            onChange={onChange}
          />
        </div>
        <div className="FormUser">
          <label className="labelUser" htmlFor="cpf">
            CPF:
          </label>
          <input
            name="cpf"
            type="text"
            maxLength="14"
            placeholder="Somente numeros"
            onChange={onChangeCPF}
            value={valores.cpf}
            disabled={!props.editCard}
          />
        </div>
        <div className="FormUser">
          <label className="labelUser" htmlFor="email">
            E-mail:
          </label>
          <input
            name="email"
            type="email"
            value={valores.email}
            disabled={!props.editCard}
            onChange={onChange}
          />
        </div>
        <div className="FormUser">
          <label className="labelUser" htmlFor="idade">
            Idade:
          </label>
          <input
            name="idade"
            type="number"
            value={valores.idade}
            disabled={!props.editCard}
            onChange={onChange}
          />
        </div>
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
      </form>
    </div>
  );
};

export default UserCard;
