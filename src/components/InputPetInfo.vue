<template>
  <el-dialog
    v-model="visible"
    :title="updateId ? '编辑宠物信息' : '添加宠物信息'"
    width="50%"
    :close-on-click-modal="false"
    destroy-on-close
    class="custom-dialog"
  >
    <el-form :model="formData" ref="formRef">
      <el-form-item
        label="名称"
        required
        label-width="100px"
        prop="name"
        :rules="[{ required: true, message: '名称是必填项', trigger: 'blur' }]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item
        label="年龄"
        required
        label-width="100px"
        prop="age"
        :rules="[{ required: true, message: '年龄是必填项', trigger: 'blur' }]"
      >
        <el-input v-model="formData.age" type="number" />
      </el-form-item>
      <el-form-item
        label="健康状态"
        required
        label-width="100px"
        prop="healthStatus"
        :rules="[
          { required: true, message: '健康状态是必填项', trigger: 'blur' },
        ]"
      >
        <el-input v-model="formData.healthStatus" />
      </el-form-item>
      <el-form-item
        label="病情描述"
        label-width="100px"
        prop="conditionDescription"
      >
        <el-input type="textarea" v-model="formData.diseaseDescription" />
      </el-form-item>
      <el-form-item
        label="是否治疗"
        required
        label-width="100px"
        prop="isUnderTreatment"
      >
        <el-switch v-model="formData.isUnderTreatment" />
      </el-form-item>
      <el-form-item
        label="创建时间"
        required
        format="YYYY-MM-DD"
        label-width="100px"
        prop="createTime"
        :rules="[
          { required: true, message: '创建时间是必填项', trigger: 'change' },
        ]"
      >
        <el-date-picker v-model="formData.createTime" type="datetime" />
      </el-form-item>
      <el-form-item
        label="类别"
        required
        label-width="100px"
        prop="category"
        :rules="[
          { required: true, message: '类别是必填项', trigger: 'change' },
        ]"
      >
        <el-select v-model="formData.category" placeholder="请选择类别">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" plain>取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, onMounted, defineEmits } from "vue";
import PetCategoryService from "@/services/PetCategoryService";
import PetInfoService from "@/services/PetInfoService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  age: null,
  healthStatus: "",
  conditionDescription: "",
  isUnderTreatment: false,
  creationTime: null,
  category: null,
});

const formRef = ref();
const categories = ref([]);
const updateId = ref();

const openModal = id => {
  visible.value = true;
  if (id) {
    updateId.value = id;
    // 获取宠物信息
    PetInfoService.getPetById(id)
      .then(response => {
        const petData = response.data;
        formData.value = petData;
      })
      .catch(() => {
        ElMessage.error("获取宠物信息失败，请重试。");
        visible.value = false;
      });
  } else {
    // 重置表单
    formData.value = {
      name: "",
      age: null,
      healthStatus: "",
      conditionDescription: "",
      isUnderTreatment: false,
      creationTime: null,
      category: null,
    };
  }
};

defineExpose({
  openModal,
});

const emit = defineEmits(["reload"]);
const fetchCategories = () => {
  PetCategoryService.getAllCategories()
    .then(response => {
      categories.value = response.data;
    })
    .catch(() => {
      ElMessage.error("获取类别信息失败，请重试。");
    });
};

onMounted(() => {
  fetchCategories();
});

const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (updateId.value) {
          await PetInfoService.updatePet(updateId.value, formData.value);
        } else {
          await PetInfoService.createPet(formData.value);
        }
        ElMessage.success("宠物信息提交成功！");
        visible.value = false;
        emit("reload");
      } catch (error) {
        ElMessage.error("宠物信息提交失败，请重试。");
      }
    } else {
      console.log("Form validation failed");
    }
  });
};
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

:deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

:deep(.el-dialog__body) {
  padding: 24px;
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
}

:deep(.el-switch) {
  margin-left: 8px;
}

:deep(.el-date-editor) {
  width: 100%;
}
</style>
