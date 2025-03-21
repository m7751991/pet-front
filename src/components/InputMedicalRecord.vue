<template>
  <el-dialog
    v-model="visible"
    :title="getTitle"
    width="50%"
    :close-on-click-modal="false"
    destroy-on-close
    class="custom-dialog"
  >
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
      <div class="form-grid">
        <el-form-item label="宠物名称" prop="petName">
          <el-select
            v-model="formData.petName"
            placeholder="请选择宠物"
            :disabled="isView"
          >
            <el-option
              v-for="pet in pets"
              :key="pet.id"
              :label="pet.name"
              :value="pet.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="就诊日期" prop="visitDate">
          <el-date-picker
            v-model="formData.visitDate"
            type="datetime"
            placeholder="选择日期时间"
            :disabled="isView"
            style="width: 100%"
          />
        </el-form-item>
      </div>

      <div class="form-grid">
        <el-form-item label="就诊医院" prop="hospital">
          <el-input
            v-model="formData.hospital"
            placeholder="请输入医院名称"
            :disabled="isView"
          />
        </el-form-item>

        <el-form-item label="主治医生" prop="doctor">
          <el-input
            v-model="formData.doctor"
            placeholder="请输入医生姓名"
            :disabled="isView"
          />
        </el-form-item>
      </div>

      <el-form-item label="诊断结果" prop="diagnosis">
        <el-input
          type="textarea"
          v-model="formData.diagnosis"
          placeholder="请输入诊断结果"
          :rows="3"
          :disabled="isView"
        />
      </el-form-item>

      <el-form-item label="处方药物" prop="prescription">
        <el-input
          type="textarea"
          v-model="formData.prescription"
          placeholder="请输入处方药物"
          :rows="3"
          :disabled="isView"
        />
      </el-form-item>

      <el-form-item label="医生建议" prop="doctorAdvice">
        <el-input
          type="textarea"
          v-model="formData.doctorAdvice"
          placeholder="请输入医生建议"
          :rows="3"
          :disabled="isView"
        />
      </el-form-item>

      <el-form-item label="治疗状态" prop="status">
        <el-select
          v-model="formData.status"
          placeholder="请选择状态"
          :disabled="isView"
        >
          <el-option label="待处理" value="pending" />
          <el-option label="进行中" value="ongoing" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </el-form-item>

      <el-form-item label="复诊提醒" prop="followUpDate">
        <el-date-picker
          v-model="formData.followUpDate"
          type="datetime"
          placeholder="选择复诊日期时间"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="就医费用" prop="cost">
        <el-input-number
          v-model="formData.cost"
          :precision="2"
          :step="100"
          :min="0"
          :disabled="isView"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" plain>
          {{ isView ? "关 闭" : "取 消" }}
        </el-button>
        <el-button v-if="!isView" type="primary" @click="submitForm">
          {{ formData.id ? "保 存" : "提 交" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, defineExpose, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import MedicalService from "../services/MedicalService";
import PetInfoService from "../services/PetInfoService";

const visible = ref(false);
const formRef = ref(null);
const pets = ref([]);
const isView = ref(false);

const formData = ref({
  id: null,
  petName: "",
  visitDate: null,
  hospital: "",
  doctor: "",
  diagnosis: "",
  prescription: "",
  doctorAdvice: "",
  status: "pending",
  followUpDate: null,
  cost: 0,
});

const rules = {
  petName: [{ required: true, message: "请选择宠物", trigger: "change" }],
  visitDate: [{ required: true, message: "请选择就诊日期", trigger: "change" }],
  hospital: [{ required: true, message: "请输入就诊医院", trigger: "blur" }],
  doctor: [{ required: true, message: "请输入主治医生", trigger: "blur" }],
  diagnosis: [{ required: true, message: "请输入诊断结果", trigger: "blur" }],
  status: [{ required: true, message: "请选择治疗状态", trigger: "change" }],
};

const getTitle = computed(() => {
  if (isView.value) return "查看就医记录";
  return formData.value.id ? "编辑就医记录" : "添加就医记录";
});

// 获取宠物列表
const fetchPets = async () => {
  try {
    const response = await PetInfoService.getAllPets();
    pets.value = response.data;
  } catch (error) {
    ElMessage.error("获取宠物列表失败");
  }
};

// 打开弹窗
const openModal = (record = null) => {
  visible.value = true;
  isView.value = record?.isView || false;
  console.log(record, "record");
  if (record && record.isView) {
    formData.value = { ...record };
  } else {
    formData.value = { ...record };

    // formData.value = {
    //   id: null,
    //   petName: "",
    //   visitDate: null,
    //   hospital: "",
    //   doctor: "",
    //   diagnosis: "",
    //   prescription: "",
    //   doctorAdvice: "",
    //   status: "pending",
    //   followUpDate: null,
    //   cost: 0,
    // };
  }

  fetchPets();
};

// 提交表单
const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (formData.value.id) {
          await MedicalService.updateMedicalRecord(
            formData.value.id,
            formData.value
          );
          ElMessage.success("更新成功");
        } else {
          await MedicalService.createMedicalRecord(formData.value);
          ElMessage.success("添加成功");
        }
        visible.value = false;
        emit("reload");
      } catch (error) {
        ElMessage.error(
          formData.value.id ? "更新失败，请重试" : "添加失败，请重试"
        );
      }
    }
  });
};

defineExpose({
  openModal,
});

const emit = defineEmits(["reload"]);
</script>

<style scoped>
.custom-dialog {
  border-radius: 8px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: none;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  border-color: #409eff;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.dialog-footer {
  padding: 16px 24px;
  text-align: right;
  background: #f9fafb;
  border-top: 1px solid #f0f0f0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.dialog-footer .el-button {
  padding: 9px 20px;
  font-weight: 500;
  transition: all 0.3s;
  min-width: 88px;
}

.dialog-footer .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
