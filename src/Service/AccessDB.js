import axios from "axios";

const AccessDB = {
  findUserLogin: (idFirebase) => {
    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:5000/login", { login: idFirebase })
        .then((res) => {
          resolve(res.data);
        })
        .catch((erro) => {
          console.log(erro);
          reject(false);
        });
    });
  },

  findUser: (token) => {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:5000/cadastro", {
          headers: { authenticate: token },
        })
        .then((res) => {
          console.log(res);
          resolve(res.data);
        })
        .catch((erro) => {
          console.log(erro);
          reject(erro);
        });
    });
  },

  putUser: (token, newValue) => {
    return new Promise((resolve, reject) => {
      axios
        .put("http://localhost:5000/cadastro", newValue, {
          headers: { authenticate: token },
        })
        .then((res) => {
          resolve("Cadastro atualizado")
        })
        .catch((erro) => {
          console.log(erro);
          reject(erro);
        });
    });
  },
};

export default AccessDB;
