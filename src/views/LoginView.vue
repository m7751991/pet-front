<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h2>欢迎登录</h2>
        <p>宠物管理系统</p>
      </div>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名">
            <template #prepend
              ><el-icon><Paperclip /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          >
            <template #prepend
              ><el-icon><Key /></el-icon
            ></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-button-container">
            <el-button type="primary" @click="onSubmit" icon="key"
              >登录</el-button
            >
            <el-button type="primary" @click="onRegister" icon="Postcard"
              >注册</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthService from "../services/AuthService";
import { useUserStore } from "../store/user";
import { ElMessage } from "element-plus";

const router = useRouter();
const userStore = useUserStore();

const loginForm = ref({
  username: "",
  password: "",
});

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const loginFormRef = ref(null);

const onRegister = () => {
  router.push("/register");
};

const onSubmit = () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      AuthService.login(loginForm.value)
        .then(response => {
          console.log("登录成功", response.data.user);
          // 将登录信息存储到 Pinia
          userStore.setUser(
            loginForm.value.username,
            response.data.token,
            response.data.user
          );
          router.push({
            path: "/dashboard/pet-info",
          });
        })
        .catch(error => {
          ElMessage.error("登录失败");
          console.error("登录失败", error);
          // 处理登录失败逻辑
        });
    } else {
      console.log("表单验证失败");
      return false;
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #409eff;
  margin-bottom: 10px;
  font-size: 24px;
}

.login-header p {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-button) {
  width: 45%;
  margin: 0 10px;
  border-radius: 4px;
  padding: 12px 20px;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-input__inner) {
  padding: 12px 15px;
}

.login-button-container {
  display: flex;
  justify-content: space-between;
}
</style>
