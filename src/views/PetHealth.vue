<template>
  <div>
    <h1 style="display: flex">
      宠物健康监测
      <el-button style="margin-left: auto" type="primary" @click="openModal"
        >添加信息</el-button
      >
    </h1>
    <el-table :data="healthRecords" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="age" label="年龄" width="100" />
      <el-table-column prop="hasVaccine" label="是否接种疫苗" width="150">
        <template #default="scope">
          <el-tag :type="scope.row.hasVaccine ? 'success' : 'info'">
            {{ scope.row.hasVaccine ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="vaccineBrand" label="疫苗品牌" width="180" />
      <el-table-column prop="vaccineCount" label="疫苗针数" width="120" />
      <el-table-column
        prop="hasRabiesVaccine"
        label="是否接种狂犬疫苗"
        width="180"
      >
        <template #default="scope">
          <el-tag :type="scope.row.hasRabiesVaccine ? 'success' : 'info'">
            {{ scope.row.hasRabiesVaccine ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="category.name" label="类别" width="120" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="viewDetails(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button @click="editRecord(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="deleteRecord(scope.row)"
            type="text"
            size="small"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <InputHealth ref="showModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PetHealthService from "../services/PetHealthService";
import { ElMessage, ElMessageBox } from "element-plus";
import InputHealth from "@/components/InputHealth.vue";

const healthRecords = ref([]);
const showModal = ref();

const openModal = () => {
  showModal.value.openModal();
};

const fetchHealthRecords = () => {
  PetHealthService.getAllHealthRecords()
    .then(response => {
      healthRecords.value = response.data;
    })
    .catch(() => {
      ElMessage.error("获取健康监测信息失败，请重试。");
    });
};

const viewDetails = record => {
  ElMessage.info(`查看健康记录：${record.name}`);
  // 实现查看详情逻辑
};

const editRecord = record => {
  ElMessage.info(`编辑健康记录：${record.name}`);
  // 实现编辑逻辑
};

const deleteRecord = record => {
  ElMessageBox.confirm(`确认删除健康记录：${record.name}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      PetHealthService.deleteHealthRecord(record.id)
        .then(() => {
          ElMessage.success("删除成功！");
          fetchHealthRecords();
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
  fetchHealthRecords();
});
</script>

<style scoped>
/* 样式 */
</style>
