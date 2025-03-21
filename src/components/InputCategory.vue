<template>
  <el-dialog
    v-model="visible"
    :title="id ? '编辑宠物类型' : '添加宠物类型'"
    width="40%"
    :close-on-click-modal="false"
    destroy-on-close
    class="custom-dialog"
  >
    <el-form :model="formData" ref="formRef" label-width="100px" :rules="rules">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入类别名称" />
      </el-form-item>
      <el-form-item label="添加日期" prop="createTime">
        <el-date-picker
          v-model="formData.createTime"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="选择日期"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" plain>取 消</el-button>
        <el-button type="primary" @click="submitForm">
          {{ id ? "保 存" : "添 加" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import PetCategoryService from "@/services/PetCategoryService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  createTime: null,
});

const rules = {
  name: [
    { required: true, message: "请输入类别名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  createTime: [
    { required: true, message: "请选择添加日期", trigger: "change" },
  ],
};

const formRef = ref(null);
const id = ref();

const openModal = val => {
  visible.value = true;
  if (val) {
    id.value = val;
    PetCategoryService.getAllCategories()
      .then(response => {
        const category = response.data.find(cat => cat.id === val);
        if (category) {
          formData.value = category;
        }
      })
      .catch(() => {
        ElMessage.error("获取类别信息失败，请重试。");
      });
  } else {
    id.value = null;
    formData.value = {
      name: "",
      createTime: null,
    };
  }
};

defineExpose({
  openModal,
});

const emit = defineEmits(["reload"]);

const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (id.value) {
          await PetCategoryService.updateCategory(id.value, formData.value);
          ElMessage.success("类别修改成功！");
        } else {
          await PetCategoryService.createCategory(formData.value);
          ElMessage.success("类别添加成功！");
        }
        emit("reload");
        visible.value = false;
        formData.value = { name: "", createTime: null };
      } catch (error) {
        ElMessage.error(
          id.value ? "类别修改失败，请重试。" : "类别添加失败，请重试。"
        );
      }
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
  padding: 32px 24px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
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

:deep(.el-date-editor.el-input) {
  width: 100%;
}

:deep(.el-date-editor .el-input__wrapper) {
  padding-left: 12px;
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

:deep(.el-button--primary) {
  background-color: #409eff;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
}

:deep(.el-form--label-top .el-form-item__label) {
  margin-bottom: 8px;
}
</style>
