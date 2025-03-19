import axios from "../utils/axios";

class PetCategoryService {
  getAllCategories() {
    return axios.get(`/petCategory`);
  }

  createCategory(category) {
    return axios.post(`/petCategory`, category, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  updateCategory(id, category) {
    return axios.put(`/petCategory/${id}`, category, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  deleteCategory(id) {
    return axios.delete(`/petCategory/${id}`);
  }
}

export default new PetCategoryService();
