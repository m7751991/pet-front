import axios from "../utils/axios";

class AuthService {
  login(user) {
    return axios.post(`/auth/login`, user);
  }

  register(user) {
    return axios.post(`/auth/register`, user);
  }
}

export default new AuthService();
