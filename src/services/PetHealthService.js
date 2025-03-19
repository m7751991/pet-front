import axios from "../utils/axios";

class PetHealthService {
  getAllHealthRecords() {
    return axios.get(`/petHealth`);
  }

  createHealthRecord(record) {
    return axios.post(`/petHealth`, record, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  updateHealthRecord(id, record) {
    return axios.put(`/petHealth/${id}`, record);
  }

  deleteHealthRecord(id) {
    return axios.delete(`/petHealth/${id}`);
  }
}

export default new PetHealthService();
