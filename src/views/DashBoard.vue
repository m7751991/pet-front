<template>
  <div class="dashboard">
    <div class="header">
      <div class="header-left">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
        <h2>宠物健康管理系统</h2>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click">
          <span class="user-info">
            <el-avatar :size="36" icon="UserFilled" class="user-avatar" />
            <span class="username">{{ userStore.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">
                <el-icon><SwitchButton /></el-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="content-wrapper">
      <el-menu
        active-text-color="#3b82f6"
        background-color="#ffffff"
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        text-color="#333"
        router
      >
        <template v-for="item in menuItems" :key="item.index">
          <el-menu-item
            :index="item.index"
            v-if="
              !item.isAdmin || (item.isAdmin && userStore?.userInfo?.isAdmin)
            "
          >
            <el-icon :size="18" class="menu-icon">
              <component :is="item.icon"></component>
            </el-icon>
            <span class="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../store/user";
import { onMounted, ref } from "vue";
import { Pet, FirstAidKit, Folder, Cpu, User } from "@element-plus/icons-vue";

const userStore = useUserStore();
const router = useRouter();
const menuItems = ref([
  { index: "/dashboard/pet-info", title: "宠物信息", icon: Pet },
  { index: "/dashboard/pet-health", title: "健康监测", icon: FirstAidKit },
  { index: "/dashboard/pet-category", title: "类别管理", icon: Folder },
  { index: "/dashboard/medical-management", title: "医疗管理", icon: Cpu },
  { index: "/dashboard/account", title: "账号管理", icon: User, isAdmin: true },
]);

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
  background-color: #f8fafc;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: #ffffff;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  height: 36px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.header-left h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
  background: linear-gradient(45deg, #3b82f6, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: #f1f5f9;
}

.user-avatar {
  border: 2px solid #e0e7ff;
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: #4b5563;
}

.content-wrapper {
  display: flex;
  flex: 1;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

.el-menu-vertical-demo {
  width: 240px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-right: none !important;
  padding: 10px 0;
}

:deep(.el-menu-item) {
  margin: 4px 10px;
  border-radius: 8px;
  height: 50px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(45deg, #3b82f6, #4f46e5) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

:deep(.el-menu-item.is-active .menu-icon) {
  color: white !important;
}

:deep(.el-menu-item .menu-icon) {
  margin-right: 10px;
}

:deep(.el-menu-item:hover) {
  background-color: #f1f5f9 !important;
}

:deep(.el-menu-item.is-active:hover) {
  background: linear-gradient(45deg, #3b82f6, #4f46e5) !important;
}

.content {
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

/* 添加路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
