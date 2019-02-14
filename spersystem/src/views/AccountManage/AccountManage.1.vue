<template>
    <div class="account-manage">
         <!-- 面板组件 -->
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>账号管理</span>
            </div>
            <div class="text item">
                <!-- 账号管理表格 -->
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">

                    <!-- 单选框 -->
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    
                    <!-- 账号 -->
                    <el-table-column prop="username" label="账号"> </el-table-column>

                    <!-- 用户组 -->
                    <el-table-column prop="usergroup" label="用户组"></el-table-column>

                    <!-- 日期 -->
                    <el-table-column label="创建日期">
                    <template slot-scope="scope">{{ scope.row.cdate|formatCdate }}</template>
                    </el-table-column>

                    <!-- 操作 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleEdit(scope.row.id),dialogFormVisible=true">   <!-- 这里在给它绑定一个点击事件  中间用逗号 隔开 -->
                               <i class="el-icon-edit"></i> 编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)">
                               <i class="el-icon-delete"></i>  删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>


                <!-- 修改弹出的模态框    这个框会用来实现数据回填  和 将修改后的数据发送给后端-->
                <el-dialog title="修改用户" :visible.sync="dialogFormVisible" width="30%">
                    <!-- 修改用户表单 -->
                    <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                      <!-- 账号 -->
                      <el-form-item label="账号" prop="username">
                        <el-input type="text" v-model="editForm.username" autocomplete="off"></el-input>
                      </el-form-item>
                      <!-- 密码 -->
                      <el-form-item label="密码" prop="password">
                        <el-input type="text" v-model="editForm.password" autocomplete="off"></el-input>
                      </el-form-item>
                      <!-- 用户组 -->
                      <el-form-item label="选择用户组" prop="usergroup">
                        <el-select v-model="editForm.usergroup" placeholder="请选择用户组">
                          <el-option label="超级管理员" value="超级管理员"></el-option>
                          <el-option label="普通用户" value="普通用户"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取 消</el-button>
                      <!-- <el-button type="primary" @click="submitForm('editForm')">确 定</el-button> -->
                      <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
                    </div>
                </el-dialog>

           <!-- 选择按钮 -->
          <!-- <div style="margin-top: 20px">
            <el-button type="danger" @click="batchDel">批量删除</el-button>
            <el-button @click="toggleSelection">取消选择</el-button>
          </div> -->


            </div>
        </el-card>
    </div>
</template>
<script>
// 暴露出去   暴露的是当前组件的vue实例对象
import moment from 'moment';

export default {
  data() {
    return {
      dialogFormVisible: false, // 控制修改模态框的显示和隐藏的变量
      tableData: [], // 用户账号列表的数据
      editId: '', // 保存要修改的数据的id
      seletedUser: [], // 保存选中的用户数据
      // 和修改表单双向绑定的数据
      editForm: { 
        username: "",
        password: "",
        usergroup: ""
      },
      // 验证的字段 修改表单的验证规则
      rules: {
        // 验证用户名
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 6, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证密码
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }, // 非空验证
          { min: 3, max: 6, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],
        // 验证用户组
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change" } // 非空验证
        ]
      }
    };
    
    
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit() {},

    // 删除功能的实现
    handleDelete(id) {
    // alert(id);
    this.axios.get(`http://127.0.0.1:3000/users/deluser?id=${id}`)
    .then(response=>{
      // console.log(response.data);
      if(response.data.rstCode===1){
        this.$message({
          type:'success',
          message:response.data.msg
        })
        // 重新请求一下所有账号的数据 
        this.getUserList();
      }else{
        this.$message.error(response.data.msg);
      }
    })
    },

    
    // 封装一个请求所有用户账号数据的函数---把它封装在method方法下
    getUserList(){
     this.axios.get("http://127.0.0.1:3000/users/userslist")
    .then(response=>{
        this.tableData=response.data;
        })
    }
  },

// -----------------------------------------
  
      // 表单提交触发的函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 收集修改后的新数据 和 一个原来的id
          let params = {
            username: this.editForm.username,
            password: this.editForm.password,
            usergroup: this.editForm.usergroup,
            editId: this.editId
          }

          // 发送ajax 把修改后的新数据 和 原来的id 一起发送给后端
          this.axios.post('http://127.0.0.1:3000/users/saveedit',
          qs.stringify(params),
          { Header: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          ).then(response => {
            // 根据后端响应的数据判断
            if (response.data.rstCode === 1) {
              // 成功 弹出修改成功的提示
              this.$message({
                type: 'success',
                message: response.data.msg
              })
              // 重新调用一下获取数据的方法（刷新一遍页面 获取最新数据）
              this.getUserList()
            } else {
              this.$message.error(response.data.msg);
            }
          })

          // 关闭模态框
          this.dialogFormVisible = false;

        } else {
          console.log("前端验证不通过, 不能发送");
          return false;
        }
      });
    },

// ------------------------------------------------
  filters:{
    formatCdate(value){
     return moment(value).format("YYYY-MM-DD HH:mm:ss")
    }
  },
  // 生命周期钩子函数
  created() {
  // 调用methods下封装所有请求方法的函数
     this.getUserList();
  },
};
</script>
<style lang="less">
.account-manage {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
  }
}
</style>


