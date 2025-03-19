<template>
  <el-dialog v-model="visible" title="录入宠物信息">
    <el-form :model="formData" ref="formRef">
      <el-form-item
        label="名称"
        required
        label-width="100px"
        prop="name"
        :rules="[{ required: true, message: '名称是必填项', trigger: 'blur' }]"
      >
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item
        label="年龄"
        required
        label-width="100px"
        prop="age"
        :rules="[{ required: true, message: '年龄是必填项', trigger: 'blur' }]"
      >
        <el-input v-model="formData.age" type="number" />
      </el-form-item>
      <el-form-item
        label="健康状态"
        required
        label-width="100px"
        prop="healthStatus"
        :rules="[
          { required: true, message: '健康状态是必填项', trigger: 'blur' },
        ]"
      >
        <el-input v-model="formData.healthStatus" />
      </el-form-item>
      <el-form-item
        label="病情描述"
        label-width="100px"
        prop="conditionDescription"
      >
        <el-input type="textarea" v-model="formData.diseaseDescription" />
      </el-form-item>
      <el-form-item
        label="是否治疗"
        required
        label-width="100px"
        prop="isUnderTreatment"
      >
        <el-switch v-model="formData.isUnderTreatment" />
      </el-form-item>
      <el-form-item
        label="创建时间"
        required
        format="YYYY-MM-DD"
        label-width="100px"
        prop="createTime"
        :rules="[
          { required: true, message: '创建时间是必填项', trigger: 'change' },
        ]"
      >
        <el-date-picker v-model="formData.createTime" type="datetime" />
      </el-form-item>
      <el-form-item
        label="类别"
        required
        label-width="100px"
        prop="category"
        :rules="[
          { required: true, message: '类别是必填项', trigger: 'change' },
        ]"
      >
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
import { ref, defineExpose, onMounted, defineEmits } from "vue";
import PetCategoryService from "@/services/PetCategoryService";
import PetInfoService from "@/services/PetInfoService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  age: null,
  healthStatus: "",
  conditionDescription: "",
  isUnderTreatment: false,
  creationTime: null,
  category: null,
});

const formRef = ref();
const categories = ref([]);
const updateId = ref();

const openModal = id => {
  visible.value = true;
  if (id) {
    updateId.value = id;
    // 获取宠物信息
    PetInfoService.getPetById(id)
      .then(response => {
        const petData = response.data;
        formData.value = petData;
      })
      .catch(() => {
        ElMessage.error("获取宠物信息失败，请重试。");
        visible.value = false;
      });
  } else {
    // 重置表单
    formData.value = {
      name: "",
      age: null,
      healthStatus: "",
      conditionDescription: "",
      isUnderTreatment: false,
      creationTime: null,
      category: null,
    };
  }
};

defineExpose({
  openModal,
});

const emit = defineEmits(["reload"]);
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
  formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (updateId.value) {
          await PetInfoService.updatePet(updateId.value, formData.value);
        } else {
          await PetInfoService.createPet(formData.value);
        }
        ElMessage.success("宠物信息提交成功！");
        visible.value = false;
        emit("reload");
      } catch (error) {
        ElMessage.error("宠物信息提交失败，请重试。");
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
