import axios from "../utils/axios";

class AuthService {
  login(user) {
    return axios.post(`/auth/login`, user);
  }

  logout() {
    // 实现登出逻辑
  }

  register(user) {
    return axios.post(`/auth/register`, user);
  }
}

export default new AuthService();
