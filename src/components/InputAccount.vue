<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加用户"
    width="40%"
    :close-on-click-modal="false"
    destroy-on-close
    class="custom-dialog"
  >
    <el-form :model="newAccount" ref="form" label-width="100px" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="newAccount.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="newAccount.password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>

      <div class="form-section">
        <div class="section-title">权限设置</div>
        <el-form-item label="管理员权限" prop="isAdmin">
          <el-switch
            v-model="newAccount.isAdmin"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </div>

      <el-form-item label="注册时间" prop="registerTime">
        <el-date-picker
          v-model="newAccount.registerTime"
          type="datetime"
          placeholder="选择日期时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" plain>取 消</el-button>
        <el-button type="primary" @click="addAccount">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import AccountService from "../services/AccountService";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const newAccount = ref({
  username: "",
  password: "",
  isAdmin: false,
  registerTime: new Date(),
});

const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
  registerTime: [
    { required: true, message: "请选择注册时间", trigger: "change" },
  ],
};

const form = ref();

const openModal = () => {
  dialogVisible.value = true;
  // 重置表单
  newAccount.value = {
    username: "",
    password: "",
    isAdmin: false,
    registerTime: new Date(),
  };
  // 清除验证
  if (form.value) {
    form.value.resetFields();
  }
};

defineExpose({
  openModal,
});

const emit = defineEmits(["reload"]);

const addAccount = () => {
  form.value.validate(valid => {
    if (valid) {
      AccountService.createAccount(newAccount.value)
        .then(() => {
          ElMessage.success("用户添加成功！");
          dialogVisible.value = false;
          emit("reload");
        })
        .catch(res => {
          ElMessage.error(res.response.data.message || "添加失败，请重试");
        });
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

.form-section {
  margin: 24px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
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

:deep(.el-switch) {
  margin-left: 8px;
}

:deep(.el-switch__label) {
  color: #606266;
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

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-button--primary) {
  background-color: #409eff;
}

:deep(.el-button--primary:hover) {
  background-color: #66b1ff;
}
</style>
