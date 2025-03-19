<template>
  <el-dialog v-model="visible" title="录入宠物信息">
    <el-form :model="formData" ref="formRef">
      <el-form-item label="名称" required label-width="100px">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="年龄" required label-width="100px">
        <el-input v-model="formData.age" type="number" />
      </el-form-item>
      <el-form-item label="健康状态" required label-width="100px">
        <el-input v-model="formData.healthStatus" />
      </el-form-item>
      <el-form-item label="病情描述" label-width="100px">
        <el-input type="textarea" v-model="formData.conditionDescription" />
      </el-form-item>
      <el-form-item label="是否治疗" required label-width="100px">
        <el-switch v-model="formData.isTreated" />
      </el-form-item>
      <el-form-item label="创建时间" required label-width="100px">
        <el-date-picker v-model="formData.creationTime" type="datetime" />
      </el-form-item>
      <el-form-item label="类别" required label-width="100px">
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
    <div class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, onMounted } from "vue";
import PetCategoryService from "@/services/PetCategoryService";
import PetInfoService from "@/services/PetInfoService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  age: null,
  // Add more fields as needed
});

const formRef = ref(null);
const categories = ref([]);
const openModal = () => {
  visible.value = true;
};
defineExpose({
  openModal,
});

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

const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      PetInfoService.createPet(formData.value)
        .then(() => {
          ElMessage.success("宠物信息提交成功！");
          visible.value = false;
        })
        .catch(() => {
          ElMessage.error("宠物信息提交失败，请重试。");
        });
    } else {
      console.log("Form validation failed");
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
/* Add any necessary styles */
</style>
