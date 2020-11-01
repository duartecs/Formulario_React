import React, { useState, useContext, useEffect } from "react";
import NavBar from "../Components/NavBar";
import UserCard from "../Components/UserCard";
import Message from "../Components/Messages";
import StoreContext from "../Components/Context";
import AccessDB from "../Service/AccessDB";
import "../css/Form.css";

const PagesPainelAdmin = () => {
  const { token } = useContext(StoreContext);

  const [usuarios, setUsuarios] = useState([]);
  const [displayResposta, setDisplayResposta] = useState({ display: "none" });
  const [resposta, setResposta] = useState("");
  const [editCard, setEditCard] = useState("");
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    AccessDB.findUser(token)
      .then((res) => {
        setUsuarios(res);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, [token, toggle]);

  const deletePerfil = (user) => {
    if (user.login === "admin") {
      boxMessage("Não é possivel excluir o ADMIN BOLADO!", "red");
    } else {
      AccessDB.deleteUser(token, user._id)
        .then((res) => {
          boxMessage("Usuario excluido com Sucesso!", "green");
          setToggle(!toggle);
        })
        .catch((erro) => {
          console.log(erro);
        });
    }
  };

  const editPerfil = (user) => {
    editCard === "" ? setEditCard(user._id) : setEditCard("")
  };

  const boxMessage = (message, color) => {
    if (message === "reset") {
      setResposta("");
      setDisplayResposta({ display: "none" });
    } else {
      setResposta(message);
      setDisplayResposta({ display: "flex", backgroundColor: color });
    }
  };

  return (
    <>
      <NavBar />
      <Message
        type={"temp"}
        display={displayResposta}
        className={"Resposta"}
        message={resposta}
        boxMessage={boxMessage}
      />
      <h1>Painel ADMIN</h1>
      <div className="PainelADM">
        {usuarios.map((user) => (
          <div className="Cards" key={user._id}>
            <UserCard
              user={user}
              editCard={editCard === user._id ? true : false}
              editPerfil={editPerfil}
              setToggle={setToggle}
              boxMessage={boxMessage}
            />
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
                onClick={() => editPerfil(user)}
              >
                {editCard === "" ? "Editar" : "Cancelar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PagesPainelAdmin;
