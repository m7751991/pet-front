import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo:
      localStorage.getItem("userInfo") != "undefined"
        ? JSON.parse(localStorage.getItem("userInfo"))
        : {},
    username: localStorage.getItem("username") || "",
    token: localStorage.getItem("token") || "",
  }),
  getters: {
    getAuth: state => state.userInfo,
  },
  actions: {
    setUser(username, token, userInfo) {
      this.username = username;
      this.userInfo = userInfo;
      this.token = token;
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      console.log(userInfo, "userInfo");

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    clearUser() {
      this.username = "";
      this.token = "";
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
});
