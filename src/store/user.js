import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: {},
    username: localStorage.getItem("username") || "",
    token: localStorage.getItem("token") || "",
  }),
  getters: {
    getAuth: state => state.userInfo,
  },
  actions: {
    setUser(username, token, userInfo) {
      console.log(userInfo, "userInfouserInfouserInfo");

      this.username = username;
      this.userInfo = userInfo;
      this.token = token;
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
    },
    clearUser() {
      this.username = "";
      this.token = "";
      localStorage.removeItem("username");
      localStorage.removeItem("token");
    },
  },
});
