<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑预约' : '新增预约'"
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
            filterable
          >
            <el-option
              v-for="pet in pets"
              :key="pet.id"
              :label="pet.name"
              :value="pet.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="预约日期" prop="appointmentDate">
          <el-date-picker
            v-model="formData.appointmentDate"
            type="datetime"
            placeholder="选择预约日期时间"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </div>

      <div class="form-grid">
        <el-form-item label="预约医院" prop="hospital">
          <el-input v-model="formData.hospital" placeholder="请输入医院名称" />
        </el-form-item>

        <el-form-item label="预约科室" prop="department">
          <el-select
            v-model="formData.department"
            placeholder="请选择科室"
            filterable
            allow-create
          >
            <el-option
              v-for="dept in departments"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="就诊原因" prop="reason">
        <el-input
          type="textarea"
          v-model="formData.reason"
          placeholder="请详细描述就诊原因"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="备注信息" prop="notes">
        <el-input
          type="textarea"
          v-model="formData.notes"
          placeholder="请输入备注信息（选填）"
          :rows="3"
        />
      </el-form-item>

      <div class="form-grid">
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input
            v-model="formData.contactPhone"
            placeholder="请输入联系电话"
          />
        </el-form-item>

        <el-form-item label="预约状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="待确认" value="pending">
              <el-tag size="small">待确认</el-tag>
            </el-option>
            <el-option label="已确认" value="confirmed">
              <el-tag size="small" type="success">已确认</el-tag>
            </el-option>
            <el-option label="已取消" value="cancelled">
              <el-tag size="small" type="info">已取消</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" plain>取 消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ formData.id ? "保 存" : "提 交" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import MedicalService from "../services/MedicalService";
import PetInfoService from "../services/PetInfoService";

const visible = ref(false);
const formRef = ref(null);
const pets = ref([]);

// 预设科室列表
const departments = ref([
  "普通门诊",
  "内科",
  "外科",
  "骨科",
  "皮肤科",
  "眼科",
  "牙科",
  "影像科",
]);

const formData = ref({
  id: null,
  petName: "",
  appointmentDate: null,
  hospital: "",
  department: "",
  reason: "",
  notes: "",
  contactPhone: "",
  status: "pending",
});

const rules = {
  petName: [{ required: true, message: "请选择宠物", trigger: "change" }],
  appointmentDate: [
    { required: true, message: "请选择预约日期", trigger: "change" },
  ],
  hospital: [{ required: true, message: "请输入预约医院", trigger: "blur" }],
  department: [{ required: true, message: "请选择科室", trigger: "change" }],
  reason: [
    { required: true, message: "请输入就诊原因", trigger: "blur" },
    { min: 10, message: "就诊原因不能少于10个字符", trigger: "blur" },
  ],
  contactPhone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  status: [{ required: true, message: "请选择预约状态", trigger: "change" }],
};

// 禁用过去的日期
const disabledDate = time => {
  return time < Date.now() - 8.64e7; // 禁用今天之前的日期
};

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
const openModal = (appointment = null) => {
  visible.value = true;

  if (appointment) {
    formData.value = { ...appointment };
  } else {
    formData.value = {
      id: null,
      petName: "",
      appointmentDate: null,
      hospital: "",
      department: "",
      reason: "",
      notes: "",
      contactPhone: "",
      status: "pending",
    };
  }

  fetchPets();
};

// 提交表单
const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (formData.value.id) {
          await MedicalService.updateAppointment(
            formData.value.id,
            formData.value
          );
          ElMessage.success("预约修改成功");
        } else {
          await MedicalService.createAppointment(formData.value);
          ElMessage.success("预约提交成功");
        }
        visible.value = false;
        emit("reload");
      } catch (error) {
        console.log(error, "error");

        ElMessage.error(
          formData.value.id ? "修改失败，请重试" : "提交失败，请重试"
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

:deep(.el-select) {
  width: 100%;
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

:deep(.el-tag) {
  width: 100%;
  text-align: center;
  margin-right: 0;
}
</style>
