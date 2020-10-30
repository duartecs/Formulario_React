import React, { useState } from "react";
import Form from "../Components/Form";
import firebaseApp from "../Util/Firebase";
import firebase from 'firebase/app';
import 'firebase/auth';

const valoresLogin = {
  email: "",
  senha: "",
};

const Authenticate = (props) => {
  const [valores, setValores] = useState(valoresLogin);
  const onChange = (ev) => {
    //extrair os valores dos inputs
    const { name, value } = ev.target;

    //setar os novos valores do state
    setValores({ ...valores, [name]: value });
  };

  const cadastrar = () => {
    //registrar email e senha
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(valores.email, valores.senha)
      .then((response) => {
        console.log(response.user.email);
        console.log(response.user.displayName);
        console.log(response.user.emailVerified);
        console.log(response.user.uid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const autenticar = () => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(valores.email, valores.senha)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    firebaseApp
      .auth()
      .signOut()
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Google = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebaseApp
      .auth()
      .signInWithPopup(provider)
      .then((response) => {
        console.log(response);
        var token = response.credential.accessToken;
        console.log(token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const verificarEmail = () => {
    var actionCodeSettings = {
      url: 'http://localhost:3000/login',
      handleCodeInApp: false,
    };
    firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
    .then(()=> {
        console.log("email enviado")
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Form
        name={"email"}
        type={"email"}
        onChange={onChange}
        value={valores.email}
        onSubmit={cadastrar}
        text={"E-mail:"}
      />
      <Form
        name={"senha"}
        type={"password"}
        onChange={onChange}
        value={valores.senha}
        onSubmit={cadastrar}
        text={"Senha:"}
      />
      <button onClick={cadastrar}>CADASTRAR EMAIL E SENHA</button>
      <br />
      <br />
      <button onClick={autenticar}>AUTENTICAR</button>
      <br />
      <button onClick={logout}>LOGOUT</button>
      <br />
      <br />
      <button onClick={Google}>Google</button>
      <br />
      <br />
      <button onClick={verificarEmail}>verificar Email</button>
    </>
  );
};

export default Authenticate;
