import axios from "../utils/axios";

class AccountService {
  getAllAccounts() {
    return axios.get(`/account`);
  }

  createAccount(account) {
    return axios.post(`/account`, account);
  }

  updateAccount(id, account) {
    return axios.put(`/account/${id}`, account);
  }

  deleteAccount(id) {
    return axios.delete(`/account/${id}`);
  }
}

export default new AccountService();
