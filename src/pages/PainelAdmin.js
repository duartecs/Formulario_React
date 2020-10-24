import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import NavBar from "../Components/NavBar";
import UserCard from "../Components/UserCard";
import "../css/Form.css";

const PagesPainelAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [token, setToken] = useState();
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });
  const [resposta, setResposta] = useState("");
  const [editCard, setEditCard] = useState('');
  const [toggle, setToggle] = useState(false);

  const history = useHistory();
  const location = useLocation();

  if (location.state === undefined || location.state.user.login !== "admin") {
    history.push({ pathname: "/login" });
  }

  if (token === undefined) {
    setToken(location.state.token);
  } 

  useEffect(() => {
    axios
        .get("http://localhost:5000/cadastro", {
          headers: { autenticate: token },
        })
        .then((response) => {
          setUsuarios(response.data)
        })
        .catch((erro) => {
          console.log(erro);
        });
  }, [token, toggle]);

  const deletePerfil = (user) => {
    if (user.login !== "admin") {
      const _id = user._id;
      axios
        .delete("http://localhost:5000/cadastro", {
          params: { _id },
          headers: { autenticate: token },
        })
        .then((response) => {
          if (response.status === 200) {
            setToggle(!toggle);
          }
        })
        .catch((erro) => {
          console.log(erro);
        });
    } else {
      boxMessage("Não é possivel excluir o ADMIN BOLADO!","red")
    }
  };

  const editPerfil = (user) => {
    if(editCard === ''){
      setEditCard(user._id)
    }else{
      setEditCard('')
      setToggle(!toggle)
    }
  };

  const boxMessage = (message, color)=>{

      setResposta(message);
      setDisplayResposta({ display: "flex", backgroundColor: color});
    const delayMessage = setInterval(()=>{
      setDisplayResposta({ display: "none"});
      clearInterval(delayMessage);
    },[2000]);

  }

  return (
    <>
      <NavBar />
      <p className="Resposta" style={displayResposta}>
        {resposta}
      </p>
      <h1>Painel ADMIN</h1>
      <div className="PainelADM">
        {usuarios.map((user) => (
          <div className="Cards" key={user._id}>
            <UserCard valores={user} editCard={editCard === user._id ? true : false} token={token} editPerfil={editPerfil} boxMessage={boxMessage}/>
            <div className="DisplayButtons">
              <button
                className="Botao adm"
                style={{ background: "darkred" }}
                onClick={() => deletePerfil(user)}
              >
                Excluir
              </button>
              <button
                className="Botao adm"
                style={{ background: "darkblue" }}
                onClick={()=>editPerfil(user)}
              >
                {editCard === '' ? "Editar" : "Cancelar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PagesPainelAdmin;
