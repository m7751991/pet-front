import axios from "../utils/axios";

class PetInfoService {
  getAllPets() {
    return axios.get(`/petInfo`);
  }

  createPet(pet) {
    return axios.post(`/petInfo`, pet, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  updatePet(id, pet) {
    return axios.put(`/petInfo/${id}`, pet);
  }

  deletePet(id) {
    return axios.delete(`/petInfo/${id}`);
  }
}

export default new PetInfoService();
