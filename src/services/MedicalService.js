import axios from "../utils/axios";

class MedicalService {
  // 创建就医记录
  createMedicalRecord(data) {
    return axios.post("/medical/record", data);
  }

  // 获取就医记录列表
  getMedicalRecords() {
    return axios.get("/medical/records");
  }

  // 获取单条就医记录
  getMedicalRecordById(id) {
    return axios.get(`/medical/record/${id}`);
  }

  // 更新就医记录
  updateMedicalRecord(id, data) {
    return axios.put(`/medical/record/${id}`, data);
  }

  // 删除就医记录
  deleteMedicalRecord(id) {
    return axios.delete(`/medical/record/${id}`);
  }

  // 创建预约
  createAppointment(data) {
    return axios.post("/medical/appointment", data);
  }

  // 更新预约
  updateAppointment(id, data) {
    return axios.put(`/medical/appointment/${id}`, data);
  }

  // 获取预约列表
  getAppointments() {
    return axios.get("/medical/appointments");
  }
}

export default new MedicalService();
