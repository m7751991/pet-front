import axios from "../utils/axios";

class AccountService {
  getAllAccounts() {
    return axios.get(`/account`);
  }

  createAccount(account) {
    return axios.post(`/account`, account, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  updateAccount(id, account) {
    return axios.put(`/account/${id}`, account, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  deleteAccount(id) {
    return axios.delete(`/account/${id}`);
  }
}

export default new AccountService();
