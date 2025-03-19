<template>
  <div>
    <h1 style="display: flex">
      宠物健康监测
      <el-button style="margin-left: auto" type="primary" @click="openModal"
        >添加信息</el-button
      >
    </h1>
    <el-table :data="categories" style="width: 100%">
      <el-table-column prop="name" label="类别名称" width="180" />

      <el-table-column prop="createTime" label="添加日期" width="180">
        <template #default="scope">
          {{ new Date(scope.row.createTime).toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editCategory(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="deleteCategory(scope.row)"
            type="text"
            size="small"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <InputCategory ref="showModal" @reload="fetchCategories"></InputCategory>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PetCategoryService from "../services/PetCategoryService";
import { ElMessage, ElMessageBox } from "element-plus";
import InputCategory from "@/components/InputCategory.vue";

const categories = ref([]);
const showModal = ref();

const openModal = () => {
  showModal.value.openModal();
};

const fetchCategories = () => {
  PetCategoryService.getAllCategories()
    .then(response => {
      categories.value = response.data;
    })
    .catch(() => {
      ElMessage.error("获取类别信息失败，请重试。");
    });
};

const editCategory = category => {
  ElMessage.info(`编辑类别：${category.name}`);
  showModal.value.openModal(category.id);
  // 实现编辑逻辑
};

const deleteCategory = category => {
  ElMessageBox.confirm(`确认删除类别：${category.name}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      PetCategoryService.deleteCategory(category.id)
        .then(() => {
          ElMessage.success("删除成功！");
          fetchCategories();
        })
        .catch(r => {
          let res = r?.response?.data;
          ElMessage.error(res.message);
        });
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
/* 样式 */
</style>
