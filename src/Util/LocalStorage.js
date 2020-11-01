const LocalStorage = {
  setToken: (token) => {
    localStorage.setItem("solo-arena/token", token);
  },

  getToken: () => {
    return localStorage.getItem("solo-arena/token");
  },

  removeToken: () => {
    localStorage.removeItem("solo-arena/token");
  },
};

export default LocalStorage;
