<template>
  <div class="dashboard">
    <div class="header">
      <h2>欢迎, {{ userStore.username }}</h2>
      <el-button type="danger" @click="logout">登出</el-button>
    </div>
    <div class="content-wrapper">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/dashboard/pet-info">
          <i class="el-icon-menu"></i>
          <span class="title">宠物信息</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/pet-health">
          <i class="el-icon-menu"></i>
          <span class="title">健康监测</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/pet-category">
          <i class="el-icon-menu"></i>
          <span class="title">类别管理</span>
        </el-menu-item>
        <el-menu-item
          index="/dashboard/account"
          v-if="userStore.userInfo.isAdmin"
        >
          <i class="el-icon-menu"></i>
          <span class="title">账号管理</span>
        </el-menu-item>
      </el-menu>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { onMounted } from "vue";

const userStore = useUserStore();
const router = useRouter();
onMounted(() => {
  console.log(userStore.getAuth, "????");
});
function logout() {
  userStore.clearUser(); // 清除用户信息
  router.push("/login"); // 重定向到登录页面
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background-color: #3a3f44;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.content-wrapper {
  display: flex;
  flex: 1;
}

.el-menu-vertical-demo {
  width: 200px;
  min-height: 100%;
  border-right: 1px solid #e0e0e0;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
}
</style>
