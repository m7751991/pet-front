<template>
  <div class="medical-management">
    <el-tabs v-model="activeTab" class="medical-tabs">
      <el-tab-pane label="就医记录" name="records">
        <div class="tab-header">
          <h3>就医记录管理</h3>
          <el-button type="primary" @click="openMedicalModal">
            添加就医记录
          </el-button>
        </div>

        <el-table
          :data="medicalRecords"
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="petName" label="宠物名称" width="120" />
          <el-table-column prop="visitDate" label="就诊日期" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.visitDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="hospital" label="就诊医院" width="180" />
          <el-table-column prop="doctor" label="主治医生" width="120" />
          <el-table-column prop="diagnosis" label="诊断结果" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button @click="viewRecord(scope.row)" type="primary" link>
                查看
              </el-button>
              <el-button @click="editRecord(scope.row)" type="primary" link>
                编辑
              </el-button>
              <el-button @click="deleteRecord(scope.row)" type="danger" link>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="预约管理" name="appointments">
        <div class="tab-header">
          <h3>预约管理</h3>
          <el-button type="primary" @click="openAppointmentModal">
            新增预约
          </el-button>
        </div>

        <el-table :data="appointments" style="width: 100%" v-loading="loading">
          <el-table-column prop="petName" label="宠物名称" width="120" />
          <el-table-column prop="appointmentDate" label="预约日期" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.appointmentDate) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            label="就诊原因"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column prop="hospital" label="预约医院" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getAppointmentStatusType(scope.row.status)">
                {{ getAppointmentStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button
                @click="editAppointment(scope.row)"
                type="primary"
                link
              >
                修改
              </el-button>
              <el-button
                @click="cancelAppointment(scope.row)"
                type="danger"
                link
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 就医记录弹窗 -->
    <InputMedicalRecord
      ref="medicalRecordModal"
      @reload="fetchMedicalRecords"
    />

    <!-- 预约弹窗 -->
    <InputAppointment ref="appointmentModal" @reload="fetchAppointments" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MedicalService from "../services/MedicalService";
import InputMedicalRecord from "../components/InputMedicalRecord.vue";
import InputAppointment from "../components/InputAppointment.vue";

const activeTab = ref("records");
const loading = ref(false);
const medicalRecords = ref([]);
const appointments = ref([]);
const medicalRecordModal = ref(null);
const appointmentModal = ref(null);

// 获取就医记录
const fetchMedicalRecords = async () => {
  loading.value = true;
  try {
    const response = await MedicalService.getMedicalRecords();
    medicalRecords.value = response.data;
  } catch (error) {
    ElMessage.error("获取就医记录失败");
  } finally {
    loading.value = false;
  }
};

// 获取预约记录
const fetchAppointments = async () => {
  loading.value = true;
  try {
    const response = await MedicalService.getAppointments();
    appointments.value = response.data;
  } catch (error) {
    ElMessage.error("获取预约记录失败");
  } finally {
    loading.value = false;
  }
};

// 打开就医记录弹窗
const openMedicalModal = (record = null) => {
  medicalRecordModal.value.openModal(record);
};

// 打开预约弹窗
const openAppointmentModal = (appointment = null) => {
  appointmentModal.value.openModal(appointment);
};

// 查看就医记录
const viewRecord = record => {
  openMedicalModal({ ...record, isView: true });
};

// 编辑就医记录
const editRecord = record => {
  openMedicalModal(record);
};

// 删除就医记录
const deleteRecord = record => {
  ElMessageBox.confirm(`确定要删除该就医记录吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await MedicalService.deleteMedicalRecord(record.id);
      ElMessage.success("删除成功");
      fetchMedicalRecords();
    } catch (error) {
      ElMessage.error("删除失败");
    }
  });
};

// 编辑预约
const editAppointment = appointment => {
  openAppointmentModal(appointment);
};

// 取消预约
const cancelAppointment = appointment => {
  ElMessageBox.confirm(`确定要取消该预约吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      await MedicalService.updateAppointment(appointment.id, {
        status: "cancelled",
      });
      ElMessage.success("取消预约成功");
      fetchAppointments();
    } catch (error) {
      ElMessage.error("取消预约失败");
    }
  });
};

// 格式化日期
const formatDate = date => {
  return new Date(date).toLocaleString();
};

// 获取就医记录状态类型
const getStatusType = status => {
  const types = {
    completed: "success",
    ongoing: "warning",
    pending: "info",
  };
  return types[status] || "info";
};

// 获取就医记录状态文本
const getStatusText = status => {
  const texts = {
    completed: "已完成",
    ongoing: "进行中",
    pending: "待处理",
  };
  return texts[status] || "未知";
};

// 获取预约状态类型
const getAppointmentStatusType = status => {
  const types = {
    confirmed: "success",
    pending: "warning",
    cancelled: "info",
  };
  return types[status] || "info";
};

// 获取预约状态文本
const getAppointmentStatusText = status => {
  const texts = {
    confirmed: "已确认",
    pending: "待确认",
    cancelled: "已取消",
  };
  return texts[status] || "未知";
};

onMounted(() => {
  fetchMedicalRecords();
  fetchAppointments();
});
</script>

<style scoped>
.medical-management {
  padding: 20px;
}

.medical-tabs {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

:deep(.el-table) {
  margin-top: 20px;
  border-radius: 8px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
}

:deep(.el-tag) {
  border-radius: 4px;
}
</style>
