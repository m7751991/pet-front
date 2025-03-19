<template>
  <el-dialog v-model="visible" title="录入健康信息">
    <el-form :model="formData" ref="formRef">
      <el-form-item label="名称" required prop="name">
        <el-input v-model="formData.name" :disabled="isPre" />
      </el-form-item>
      <el-form-item label="年龄" required prop="age">
        <el-input v-model="formData.age" type="number" :disabled="isPre" />
      </el-form-item>
      <el-form-item label="是否接种疫苗" required prop="hasVaccine">
        <el-switch v-model="formData.hasVaccine" :disabled="isPre" />
      </el-form-item>
      <el-form-item label="疫苗品牌" required prop="vaccineBrand">
        <el-input v-model="formData.vaccineBrand" :disabled="isPre" />
      </el-form-item>
      <el-form-item label="疫苗针数" required prop="vaccineCount">
        <el-input
          v-model="formData.vaccineCount"
          type="number"
          :disabled="isPre"
        />
      </el-form-item>
      <el-form-item label="是否接种狂犬疫苗" required prop="hasRabiesVaccine">
        <el-switch v-model="formData.hasRabiesVaccine" :disabled="isPre" />
      </el-form-item>
      <el-form-item label="类别" required prop="category">
        <el-select
          v-model="formData.category"
          placeholder="请选择类别"
          :disabled="isPre"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" v-if="!isPre">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, onMounted, defineEmits } from "vue";
import PetHealthService from "@/services/PetHealthService";
import PetCategoryService from "@/services/PetCategoryService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  age: null,
  hasVaccine: false,
  vaccineBrand: "",
  vaccineCount: null,
  hasRabiesVaccine: false,
  category: null,
});

const formRef = ref(null);
const id = ref(null);
const isPre = ref(false);
const categories = ref([]);
const isEdit = ref(false);

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

const resetForm = () => {
  formData.value = {
    name: "",
    age: null,
    hasVaccine: false,
    vaccineBrand: "",
    vaccineCount: null,
    hasRabiesVaccine: false,
    category: null,
  };
};

const openModal = (val, v = false) => {
  visible.value = true;
  isPre.value = v;
  if (val) {
    isEdit.value = true;
    id.value = val;
    // 获取健康信息记录
    PetHealthService.getHealthRecordById(id.value)
      .then(response => {
        const healthData = response.data;
        formData.value = {
          name: healthData.name,
          age: healthData.age,
          hasVaccine: healthData.hasVaccine,
          vaccineBrand: healthData.vaccineBrand,
          vaccineCount: healthData.vaccineCount,
          hasRabiesVaccine: healthData.hasRabiesVaccine,
          category: healthData.category?.id,
        };
      })
      .catch(() => {
        ElMessage.error("获取健康信息失败，请重试。");
        visible.value = false;
      });
  } else {
    isEdit.value = false;
    resetForm();
  }
};

defineExpose({
  openModal,
});

const emit = defineEmits(["reload"]);

const submitForm = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const request = isEdit.value
        ? PetHealthService.updateHealthRecord(id.value, formData.value)
        : PetHealthService.createHealthRecord(formData.value);

      request
        .then(() => {
          ElMessage.success(
            isEdit.value ? "健康信息更新成功！" : "健康信息提交成功！"
          );
          visible.value = false;
          emit("reload");
        })
        .catch(() => {
          ElMessage.error(
            isEdit.value
              ? "健康信息更新失败，请重试。"
              : "健康信息提交失败，请重试。"
          );
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
</style>
