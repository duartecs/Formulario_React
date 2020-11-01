import axios from "axios";


const AccessDB = {
    findUser: (idFirebase) => {
    return new Promise((resolve, reject) =>{
      axios
      .post("http://localhost:5000/login", {login: idFirebase})
      .then((response) => {
        resolve (response.data)
        // if (response.data.consult.login === "admin") {
        //   history.push({
        //     pathname: "/painel-adm",
        //     state: { token: response.data.token, user: response.data.consult },
        //   });
        // } else {
        //   history.push({
        //     pathname: "/perfil",
        //     state: { token: response.data.token, user: response.data.consult },
        //   });
        // }
      })
      .catch((erro) => {
        console.log(erro);
        reject (false)
      });

    })
    }

}

export default AccessDB;
