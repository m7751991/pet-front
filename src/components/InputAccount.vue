<template>
  <el-dialog v-model="dialogVisible" title="添加用户">
    <el-form :model="newAccount" ref="form">
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
        label-width="120px"
      >
        <el-input v-model="newAccount.username"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        label-width="120px"
      >
        <el-input type="password" v-model="newAccount.password"></el-input>
      </el-form-item>
      <el-form-item label="是否管理员" prop="isAdmin" label-width="120px">
        <el-switch v-model="newAccount.isAdmin"></el-switch>
      </el-form-item>
      <el-form-item label="添加日期" prop="registerTime" label-width="120px">
        <el-date-picker
          v-model="newAccount.registerTime"
          type="datetime"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="display: flex; justify-content: center">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addAccount">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import AccountService from "../services/AccountService";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const newAccount = ref({
  username: "",
  password: "",
  isAdmin: false,
  registerTime: new Date(),
});
const form = ref();

const openModal = () => {
  dialogVisible.value = true;
};
defineExpose({
  openModal,
});

const emit = defineEmits(["reload"]);

const addAccount = () => {
  form.value.validate(valid => {
    if (valid) {
      AccountService.createAccount(newAccount.value)
        .then(() => {
          ElMessage.success("用户添加成功！");
          dialogVisible.value = false;
          emit("reload");
        })
        .catch(res => {
          ElMessage.error(res.response.data.message);
        });
    } else {
      ElMessage.error("请填写正确的信息。");
    }
  });
};
</script>
