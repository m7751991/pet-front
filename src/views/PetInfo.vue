<template>
  <div>
    <h1 style="display: flex">
      宠物信息管理
      <el-button style="margin-left: auto" type="primary" @click="openModal"
        >添加信息</el-button
      >
    </h1>
    <el-table :data="pets" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="age" label="年龄" width="100" />
      <el-table-column prop="healthStatus" label="健康状态" width="180" />
      <el-table-column prop="diseaseDescription" label="病情描述" />
      <el-table-column prop="isUnderTreatment" label="是否治疗" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.isUnderTreatment ? 'success' : 'info'">
            {{ scope.row.isUnderTreatment ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #default="scope">
          {{ new Date(scope.row.createTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="category.name" label="类别" width="120" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editPet(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="deletePet(scope.row)"
            type="text"
            size="small"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <InputPetInfo ref="showModal" @reload="fetchPets"></InputPetInfo>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PetInfoService from "../services/PetInfoService";
import InputPetInfo from "@/components/InputPetInfo.vue";
import { ElMessage, ElMessageBox } from "element-plus";

const pets = ref([]);
const showModal = ref();

const openModal = () => {
  showModal.value.openModal();
};

const fetchPets = () => {
  PetInfoService.getAllPets()
    .then(response => {
      pets.value = response.data;
    })
    .catch(() => {
      ElMessage.error("获取宠物信息失败，请重试。");
    });
};

const editPet = pet => {
  ElMessage.info(`编辑宠物：${pet.name}`);
  // 实现编辑逻辑
  showModal.value.openModal(pet.id);
};

const deletePet = pet => {
  ElMessageBox.confirm(`确认删除宠物：${pet.name}？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      PetInfoService.deletePet(pet.id)
        .then(() => {
          ElMessage.success("删除成功！");
          fetchPets();
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
  fetchPets();
});
</script>

<style scoped>
/* 样式 */
</style>
