import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import RegisterPage from "../views/RegisterPage.vue";
import DashBoard from "../views/DashBoard.vue";
import PetInfo from "../views/PetInfo.vue";
import PetHealth from "../views/PetHealth.vue";
import PetCategory from "../views/PetCategory.vue";
import Account from "../views/AccountView.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: RegisterPage },
  {
    path: "/dashboard",
    component: DashBoard,
    children: [
      { path: "pet-info", component: PetInfo },
      { path: "pet-health", component: PetHealth },
      { path: "pet-category", component: PetCategory },
      { path: "account", component: Account },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 添加路由守卫
// router.beforeEach((to, from, next) => {
// const isAuthenticated = !!localStorage.getItem("token"); // 假设使用 token 进行认证
// if (to.path === "/login" || to.path === "/register" || isAuthenticated) {
//   next();
// } else {
// next("/login");
// }
// });

export default router;
