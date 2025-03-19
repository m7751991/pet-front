<template>
  <div>
    <h1>账号管理</h1>
    <el-table :data="accounts" style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="isAdmin" label="是否管理员" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.isAdmin ? 'success' : 'info'">
            {{ scope.row.isAdmin ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isAdmin" label="创建日期" width="120">
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="viewDetails(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button @click="editAccount(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="deleteAccount(scope.row)"
            type="text"
            size="small"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AccountService from "../services/AccountService";
import { ElMessage, ElMessageBox } from "element-plus";

const accounts = ref([]);

const fetchAccounts = () => {
  AccountService.getAllAccounts()
    .then(response => {
      accounts.value = response.data;
    })
    .catch(() => {
      ElMessage.error("获取账号信息失败，请重试。");
    });
};

const viewDetails = account => {
  ElMessage.info(`查看账号：${account.username}`);
  // 实现查看详情逻辑
};

const editAccount = account => {
  ElMessage.info(`编辑账号：${account.username}`);
  // 实现编辑逻辑
};

const deleteAccount = account => {
  ElMessageBox.confirm(`确认删除账号：${account.username}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      AccountService.deleteAccount(account.id)
        .then(() => {
          ElMessage.success("删除成功！");
          fetchAccounts();
        })
        .catch(() => {
          ElMessage.error("删除失败，请重试。");
        });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

onMounted(() => {
  fetchAccounts();
});
</script>

<style scoped>
/* 样式 */
</style>
