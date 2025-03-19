<template>
  <div class="login-container">
    <el-card class="login-card">
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
          <el-button type="primary" @click="onSubmit" icon="key"
            >登录</el-button
          >
          <el-button type="primary" @click="onRegister" icon="Postcard"
            >注册</el-button
          >
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
          console.log("登录成功", response);
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
  background-color: #f5f5f5;
}
.login-card {
  width: 400px;
  padding: 20px;
}
</style>
