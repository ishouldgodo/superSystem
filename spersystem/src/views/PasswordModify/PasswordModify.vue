<template>
    <div class="password-modify">
          <el-main>
            <el-card class="box-card">
                <!-- 面板标题 -->
                <div slot="header" class="clearfix">
                    <span>密码修改</span>
                </div>

                <!-- 面板内容 -->
                <div class="text item">
                    <!-- 添加账户表单 -->
                    <el-form :model="editPwdForm" status-icon :rules="rules" ref="editPwdForm" label-width="100px" class="demo-ruleForm">
                        <!-- 密码 -->
                        <el-form-item label="旧的密码" prop="oldPwd">
                            <el-input type="text" v-model="editPwdForm.oldPwd" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item label="新的密码" prop="newPwd">
                            <el-input type="text" v-model="editPwdForm.newPwd" autocomplete="off"></el-input>
                        </el-form-item>
                        <!-- 确认密码 -->
                        <el-form-item label="确认新密码" prop="confirmPwd">
                            <el-input type="text" v-model="editPwdForm.confirmPwd"></el-input>
                        </el-form-item>
                       
                        <!-- 添加按钮 -->
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('editPwdForm')">修改</el-button>
                            <el-button @click="resetForm('editPwdForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </el-main>
    </div>
</template>
<script>

// 暴露出去   暴露的是当前组件的vue实例对象


// axios自带一个依赖库 qs 主要帮我们处理post请求的参数问题
import qs from 'qs'

// 引入头部组件 和 尾部组件



// export default {
    
// }
export default {
  data() {
    // 自定义验证规则 -- 验证旧密码是否正确
    const checkOldPwd = (rule, value, callback) => {
        // 发送请求 验证旧密是否正确 (把用户输入的旧密码传给后端)----这里必须要传一次看看是否存在
        this.axios.get(`http://127.0.0.1:3000/users/checkoldpwd?oldPwd=${value}`)
        .then(response => {
            // 如果正确 那么通过 直接绿色勾勾
            if (response.data.rstCode === 1) {
                // 直接调用就是验证通过
                callback();
            } else if (response.data.rstCode === 0) {
                // 否则 就是旧密码不正确
                callback(new Error(response.data.msg))
            }
        })
    }
    // 自定义一个验证密码一致性的函数
    const checkPwd = (rule, value, callback) => {
      // 非空验证
      if (value === "") {
        // 输出不能为空的提示
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editPwdForm.newPwd) {
        // 一致性验证
        // 输出密码不一致的回调
        callback(new Error("两次密码不一致"));
      } else {
        // 成功提示（绿色勾勾）
        callback();
      }
    };
    return {
      // 修改密码表单数据对象
      editPwdForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      // 验证的字段
      rules: {
        // 验证旧密码-验证是否正确
        oldPwd: [
          { required: true, validator: checkOldPwd, trigger: "blur" } 
        ],
        // 验证新密码
        newPwd: [
          { required: true, message: "新密码不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 6, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证确认密码 --- 自定义验证规则（validator： 自己定义的函数的名字）
        confirmPwd: [
          { required: true, validator: checkPwd, trigger: "blur" } 
        ]
      }
    }
  },
 
   methods: {
    // 表单提交触发的函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发送一个请求 把修改后的新密码发送给后端
          this.axios.get(`http://127.0.0.1:3000/users/savenewpwd?newPwd=${this.editPwdForm.newPwd}`)
            .then(response => {
              // 接收后端响应的数据 判断
              if (response.data.rstCode === 1) {
                // 成功
                // 弹出成功的提示
                this.$message({
                  type: 'success',
                  message: response.data.msg
                }) 
                // 跳转到登录页面
                setTimeout(() => {
                  this.$router.push('/login')
                }, 1000)
              } else {
                // 弹出失败的提示
                this.$message.error(response.data.msg);
              }
            })
         
        } else {
          console.log("前端验证不通过, 不能发送");
          return false;
        }
      });
    },
    // 重置表单触发的函数
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};



</script>

<style lang="less">
// 在这里对表单进行样式的修饰哦
.password-modify {
  width: 100%;
  display: flex; // 让这个盒子 变为一个可以伸缩的盒子
  flex-direction: column; // 方向是 纵向
  // 主体
  .el-main {
    flex: 1; // 自动增长 撑满
    .el-card {
      .el-card__header {  //密码修改的样似
        font-weight: 600;
        font-size: 20px;
        background-color: #f1f1f1;
        text-align: left;
      }
      .el-card__body {
        .item {
            .el-form {
                width: 300px;
                .el-form-item {
                    .el-form-item__label {
                        height: 35px;
                        line-height: 35px;
                    }
                    .el-form-item__content {
                        height: 35px;
                        line-height: 35px;
                        .el-input__inner {
                            height: 35px;
                            line-height: 35px;
                        }
                    }
                }
            }
        }
      }
    }
  }
}
</style>


