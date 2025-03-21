<template>
  <el-dialog
    v-model="visible"
    :title="isPre ? '查看健康信息' : isEdit ? '编辑健康信息' : '添加健康信息'"
    width="50%"
    :close-on-click-modal="false"
    destroy-on-close
    class="custom-dialog"
  >
    <el-form :model="formData" ref="formRef" label-width="120px">
      <div class="form-grid">
        <el-form-item
          label="名称"
          required
          prop="name"
          :rules="[
            { required: true, message: '名称是必填项', trigger: 'blur' },
          ]"
        >
          <el-input v-model="formData.name" :disabled="isPre" />
        </el-form-item>
        <el-form-item
          label="年龄"
          required
          prop="age"
          :rules="[
            { required: true, message: '年龄是必填项', trigger: 'blur' },
          ]"
        >
          <el-input v-model="formData.age" type="number" :disabled="isPre" />
        </el-form-item>
      </div>

      <div class="form-section">
        <div class="section-title">疫苗信息</div>
        <div class="form-grid">
          <el-form-item
            label="是否接种疫苗"
            prop="hasVaccine"
            :rules="[
              {
                required: true,
                message: '请选择是否接种疫苗',
                trigger: 'change',
              },
            ]"
          >
            <el-switch
              v-model="formData.hasVaccine"
              :disabled="isPre"
              active-text="是"
              inactive-text="否"
              @change="handleVaccineChange"
            />
          </el-form-item>
          <el-form-item
            label="疫苗品牌"
            prop="vaccineBrand"
            :required="formData.hasVaccine"
            :rules="[
              {
                required: formData.hasVaccine,
                message: '疫苗品牌是必填项',
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="formData.vaccineBrand"
              :disabled="isPre || !formData.hasVaccine"
              placeholder="请输入疫苗品牌"
            />
          </el-form-item>
          <el-form-item
            label="疫苗针数"
            prop="vaccineCount"
            :required="formData.hasVaccine"
            :rules="[
              {
                required: formData.hasVaccine,
                message: '疫苗针数是必填项',
                trigger: 'blur',
              },
              {
                type: 'number',
                min: 0,
                message: '针数不能小于0',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              v-model="formData.vaccineCount"
              :disabled="isPre || !formData.hasVaccine"
              :min="0"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="是否接种狂犬疫苗"
            prop="hasRabiesVaccine"
            :rules="[
              {
                required: true,
                message: '请选择是否接种狂犬疫苗',
                trigger: 'change',
              },
            ]"
          >
            <el-switch
              v-model="formData.hasRabiesVaccine"
              :disabled="isPre"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </div>
      </div>

      <el-form-item
        label="类别"
        prop="category"
        :rules="[{ required: true, message: '请选择类别', trigger: 'change' }]"
      >
        <el-select
          v-model="formData.category"
          placeholder="请选择类别"
          :disabled="isPre"
          style="width: 100%"
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
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false" plain>取 消</el-button>
        <el-button v-if="!isPre" type="primary" @click="submitForm">
          {{ isEdit ? "保 存" : "提 交" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, onMounted, defineEmits, nextTick } from "vue";
import PetHealthService from "@/services/PetHealthService";
import PetCategoryService from "@/services/PetCategoryService";
import { ElMessage } from "element-plus";

const visible = ref(false);
const formData = ref({
  name: "",
  age: null,
  hasVaccine: false,
  vaccineBrand: "",
  vaccineCount: 0,
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
    vaccineCount: 0,
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

// 添加处理疫苗开关变化的函数
const handleVaccineChange = async value => {
  if (!value) {
    // 如果关闭疫苗开关，清空相关字段
    formData.value.vaccineBrand = "";
    formData.value.vaccineCount = 0;
  }
  await nextTick();
  try {
    // 重新验证表单
    if (formRef.value) {
      await formRef.value.validateField(["vaccineBrand", "vaccineCount"]);
    }
  } catch (error) {
    console.log(error, "error");
  }
};
</script>

<style scoped>
.custom-dialog {
  border-radius: 8px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-section {
  margin: 24px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: none;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  border-color: #409eff;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

:deep(.el-switch) {
  margin-left: 8px;
}

:deep(.el-switch__label) {
  color: #606266;
}

.dialog-footer {
  padding: 16px 24px;
  text-align: right;
  background: #f9fafb;
  border-top: 1px solid #f0f0f0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.dialog-footer .el-button {
  padding: 9px 20px;
  font-weight: 500;
  transition: all 0.3s;
  min-width: 88px;
}

.dialog-footer .el-button:hover {
  transform: translateY(-1px);
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-right: 0;
}
</style>
