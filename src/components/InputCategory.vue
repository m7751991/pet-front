<template>
  <el-dialog v-model="visible" title="录入宠物类型">
    <el-form :model="formData" ref="formRef">
      <el-form-item label="类别名称" required prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="添加日期" required prop="createTime">
        <el-date-picker
          v-model="formData.createTime"
          type="date"
          format="YYYY-MM-DD"
          placeholder="选择日期"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import PetCategoryService from "@/services/PetCategoryService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  createTime: null,
});

const formRef = ref(null);
const id = ref();

const openModal = val => {
  visible.value = true;
  if (val) {
    id.value = val;
    PetCategoryService.getAllCategories()
      .then(response => {
        const category = response.data.find(cat => cat.id === val);
        if (category) {
          formData.value = category;
        }
      })
      .catch(() => {
        ElMessage.error("获取类别信息失败，请重试。");
      });
  }
};
defineExpose({
  openModal,
});
const emit = defineEmits(["reload"]);

const submitForm = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (id.value) {
          await PetCategoryService.updateCategory(id.value, formData.value);
          ElMessage.success("类别修改成功！");
        } else {
          await PetCategoryService.createCategory(formData.value);
          ElMessage.success("类别添加成功！");
        }
        emit("reload");
        visible.value = false;
        formData.value = { name: "", createDate: null, isAvailable: true }; // Reset form data
      } catch (error) {
        ElMessage.error("类别添加失败，请重试。");
      }
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
