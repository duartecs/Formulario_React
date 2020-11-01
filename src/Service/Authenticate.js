import firebaseApp from "../Util/Firebase";
import firebase from "firebase/app";
import "firebase/auth";

// response.user.email
// response.user.displayName
// response.user.emailVerified
// response.user.uid

const Authenticate = {
  cadastrar: ({ email, senha }) => {
    return new Promise((resolve, reject) => {
      firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, senha)
        .then((response) => {
          resolve(response.user.uid);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
  },

  login: ({ email, senha }) => {
    return new Promise((resolve, reject) => {
      firebaseApp
        .auth()
        .signInWithEmailAndPassword(email, senha)
        .then((response) => {
          resolve(response.user.uid);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
  },

  logout: () => {
    return new Promise((resolve, reject) => {
      firebaseApp
        .auth()
        .signOut()
        .then((response) => {
          resolve(true);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
  },

  Google: () => {
    return new Promise((resolve, reject) => {
      var Provider = new firebase.auth.GoogleAuthStoreProvider();
      firebaseApp
        .auth()
        .signInWithPopup(Provider)
        .then((response) => {
          resolve(true);
        })
        .catch((err) => {
          console.log(err);
          reject(false);
        });
    });
  },

  verificarEmail: () => {
    return new Promise((resolve, reject) => {
      var actionCodeSettings = {
        url: "http://localhost:3000/login",
        handleCodeInApp: false,
      };
      firebase
        .auth()
        .currentUser.sendEmailVerification(actionCodeSettings)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          reject(false);
        });
    });
  },
};

export default Authenticate;
