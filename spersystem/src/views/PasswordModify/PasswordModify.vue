<template>
    <div class="password-modify">
        <!-- 面板组件 -->
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>修改密码</span>
            </div>
            <div class="text item">
                <!-- 添加账号表单 -->
                <el-form size="mini" :model="passwordModifyForm" status-icon :rules="rules" ref="passwordModifyForm" label-width="100px" class="demo-ruleForm">
                  
                    <!-- 旧的密码 -->
                    <el-form-item label="旧的密码" prop="oldPassword">
                        <el-input type="text" v-model="passwordModifyForm.oldPassword" autocomplete="off"></el-input>
                    </el-form-item>

                    <!-- 新的密码 -->
                    <el-form-item label="新的密码" prop="newPassword">
                        <el-input type="text" v-model="passwordModifyForm.newPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 确认新密码 -->
                    <el-form-item label="确认新密码" prop="checkNewPwd">
                        <el-input type="text" v-model="passwordModifyForm.checkNewPwd" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 登录按钮&重置按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('passwordModifyForm')">确定修改</el-button>
                        <el-button @click="resetForm('passwordModifyForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
// 引入qs库
import qs from "qs";

export default {
  data() {
    // 自定义密码的验证
    const pass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 3 || value.length > 6) {
        callback(new Error("长度在 3 - 6 位"));
      } else {
        if (this.passwordModifyForm.checkNewPwd !== "") {
          this.$refs.passwordModifyForm.validateField("checkNewPwd");
        }
        callback();
      }
    };

    // 自定义确认新密码的验证
    const checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.passwordModifyForm.newPassword) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };

    // 自定义检查旧密码是否正确的函数
    const checkOldPwd = (rule, value, callback) => {
      // 获取当前登录的账户
      let username = window.localStorage.getItem("username");

      // 发送ajax给后端 把用户输入的旧密码发送给后端 和 数据库中的密码对比是否一致
      this.axios
        .get(
          `http://127.0.0.1:3000/users/checkOldPwd?oldPwd=${value}&username=${username}`
        )
        .then(response => {
          // 接收后端返回的错误码 和 提示信息、
          let { error_code, reason } = response.data;
          if (error_code !== 0) {
            // 错误提示
            callback(new Error(reason));
          } else {
            // 正确的回调
            callback();
          }
        })
        .catch(err => {
          console.log(err);
        });
    };

    return {
      // 添加账号表单数据
      passwordModifyForm: {
        oldPassword: "",
        newPassword: "",
        checkNewPwd: ""
      },
      // 验证规则
      rules: {
        // 旧密码验证
        oldPassword: [
          { required: true, validator: checkOldPwd, trigger: "blur" }
        ],
        // 新密码验证
        newPassword: [{ required: true, validator: pass, trigger: "blur" }],

        // 确认新密码
        checkNewPwd: [{ required: true, validator: checkPass, trigger: "blur" }]
      }
    };
  },
  methods: {
    // 点击登录按钮 触发这个函数
    submitForm(formName) {
      // 获取表单组件 调用验证方法
      this.$refs[formName].validate(valid => {
        // 如果所有验证通过 valid就是true
        if (valid) {
          // 收集参数
          let params = {
            username: window.localStorage.getItem("username"),
            oldPassword: this.passwordModifyForm.oldPassword,
            newPassword: this.passwordModifyForm.newPassword
          };

          // 发送ajax给后端
          this.axios
            .post(
              "http://127.0.0.1:3000/users/savenewpwd",
              qs.stringify(params)
            )
            .then(response => {
              // 接收后端数据
              let { error_code, reason } = response.data;
              // 判断 如果成功   
              if (error_code === 0) {
                // 清除token
                window.localStorage.removeItem("token");

                // 弹出提示
                this.$message({
                  type: "success",
                  message: reason
                });
                setTimeout(() => {
                  // 跳转到登录页面
                  this.$router.push("/login");
                }, 1000);
              } else {
                // 弹出错误提示
                this.$message.error(reason);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // 否则就是false
          return false;
        }
      });
    },
    // 点击重置按钮 触发这个函数
    resetForm(formName) {
      // this.$refs.loginForm.resetFields() 获取整个表单组件 调用重置方法
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
.password-modify {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-card__body {
      text-align: left;
      .el-form {
        width: 290px;
        .el-form-item {
          margin-bottom: 24px;
        }
      }
    }
  }
}
</style>


