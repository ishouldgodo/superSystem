<template>
    <div class="top">
        <el-row>
            <el-col :span="12">
                <div  class="title">
                    <i class="el-icon-menu"></i>
                    华联超市管理系统
                </div>
            </el-col>
            <el-col :span="12">
                <div class="top-right">
                    <el-row>
                        <el-col :span="18">
                            欢迎您! 
                        <el-dropdown trigger="click"  @command="handleCommand">
                            <span class="el-dropdown-link">
                                {{username}} <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        </el-col>
                        <el-col :span="6">
                             <div class="avatar">
                                <img style="border-radius: 50%;" width="50px" height="50px" src="../myimg.gif" alt="">
                             </div>
                        </el-col>

                    </el-row>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
        data () {
        return {
            username: ''
        }
    },

    methods: {
        // 点击下拉框选项 触发函数
        handleCommand (command) {
            // 判断 点击的是个人中心 还是退出登录
            if (command === 'personal') {
                // 如果是个人中心 直接跳转到个人中心组件
                this.$router.push('/personal')
            } else if (command === 'logout') {
                // 发送ajax请求 给后端
                this.axios.get('http://127.0.0.1:3000/users/logout')
                  .then(response => {
                      // 退出成功   
                      if (response.data.rstCode === 1) {
                          // 弹出提示信息
                          this.$message({
                              type: 'success',
                              message: response.data.msg
                          })
                          setTimeout(() => {
                              // 跳转到登录页面
                            this.$router.push('/login')
                          }, 1000)
                      }
                  })
            }
        }
    },


    created () {
        // 发送请求 获取用户名
        this.axios.get('http://127.0.0.1:3000/users/getusername')
        .then(response => {
            // 直接把后端响应的用户名赋值给data里面的 username
            this.username = response.data;
        })
    }



}


  

</script>
<style lang="less">
    .top {
        // background-color: red;
        border-bottom: 2px solid green;
        .title {
            text-align: left;
            font-size: 20px;
            font-weight: 900;
        }
        .top-right {
            color: #2d3a4b;
            text-align: right;
            .username {
               font-weight: 600;
            }
            .avatar {
                width: 52px;
                height: 52px;
                margin-top: 4px;
                margin-left: 30px;
                border-radius: 50%;
                img {
                    border-radius: 50%;
                }
            }
        }
    }
</style>


