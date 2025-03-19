<template>
  <el-dialog v-model="visible" title="录入健康信息">
    <el-form :model="formData" ref="formRef">
      <el-form-item label="名称" required>
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="年龄" required>
        <el-input v-model="formData.age" type="number" />
      </el-form-item>
      <el-form-item label="是否接种疫苗" required>
        <el-switch v-model="formData.hasVaccine" />
      </el-form-item>
      <el-form-item label="疫苗品牌" required>
        <el-input v-model="formData.vaccineBrand" />
      </el-form-item>
      <el-form-item label="疫苗针数" required>
        <el-input v-model="formData.vaccineCount" type="number" />
      </el-form-item>
      <el-form-item label="是否接种狂犬疫苗" required>
        <el-switch v-model="formData.hasRabiesVaccine" />
      </el-form-item>
      <el-form-item label="类别" required>
        <el-select v-model="formData.category" placeholder="请选择类别">
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, onMounted } from "vue";
import PetHealthService from "@/services/PetHealthService";
import PetCategoryService from "@/services/PetCategoryService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  age: null,
  // Add more fields as needed
});

const formRef = ref(null);
const categories = ref([]);

const fetchCategories = () => {
  PetCategoryService.getAllCategories()
    .then(response => {
      categories.value = response.data;
    })
    .catch(() => {
      ElMessage.error("获取类别信息失败，请重试。");
    });
};

onMounted(() => {
  fetchCategories();
});

const openModal = () => {
  visible.value = true;
};
defineExpose({
  openModal,
});
const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      PetHealthService.createHealthRecord(formData.value)
        .then(() => {
          ElMessage.success("健康信息提交成功！");
        })
        .catch(() => {
          ElMessage.error("健康信息提交失败，请重试。");
        });

      visible.value = false;
    } else {
      console.log("Form validation failed");
    }
  });
};
</script>

<style scoped>
/* Add any necessary styles */
</style>
