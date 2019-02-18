<template>
    <div class="account-manage">
         <!-- 面板组件 -->
       <el-card class="box-card">
            <div slot="header" class="clearfix" style="display: inline-block">
                <span>分类管理</span>
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
                    
                    <!-- 分类名称 -->
                    <el-table-column prop="cateName" label="分类名称"> </el-table-column>

                    <!-- 用户组 -->
                    <el-table-column prop="salePrice" label="商品名称"></el-table-column>

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

             


               <!-- 修改弹出的模态框 -->
                       <!-- 修改弹出的模态框    这个框会用来实现数据回填  和 将修改后的数据发送给后端-->
                      <el-dialog title="修改用户" :visible.sync="dialogFormVisible" width="30%">
                          <!-- 修改用户表单  你下面删了 -->
                          <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                            <!-- 名称 -->
                            <el-form-item label="名称" prop="username" >  
                              <el-input type="text" v-model="editForm.username" autocomplete="off"></el-input>
                            </el-form-item>
                           
                            <!-- 用户组 -->
                            <el-form-item label="商品分类" prop="usergroup">
                              <el-select v-model="editForm.usergroup" placeholder="商品分类">
                                <el-option label="日常用品" value="日常用品"></el-option>
                                <el-option label="水果" value="水果"></el-option>
                                  <el-option label="烟酒" value="烟酒"></el-option>
                                <el-option label="家厨电器" value="家厨电器"></el-option>
                                   <el-option label="调味品" value="调味品"></el-option>
                                <el-option label="奶粉区" value="奶粉区"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-form>
                          <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <!-- <el-button type="primary" @click="submitForm('editForm')">确 定</el-button> -->
                            <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
                          </div>
                      </el-dialog>
                      

                 <!-- 分页 -->
                <!-- <div style="margin-top: 20px; text-align: center;">
                   <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[1, 3, 5, 10, 20, 50]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                  </el-pagination>
                </div> -->

                <!-- 选择按钮    这是是实现批量删除的板块 -->
                  <div style="margin-top: 20px">
                      <el-button type="danger" @click="batchDel">批量删除</el-button>
                      <el-button @click="toggleSelection">取消选择</el-button>
                </div>
                

                
            </div>
        </el-card>
    </div>
</template>
<script>
// 暴露出去   暴露的是当前组件的vue实例对象
import moment from 'moment';

// 引入qs模块 用于处理post方式产参数
import qs from 'qs';



export default {
  data() {
    return {
      dialogFormVisible: false, // 控制修改模态框的显示和隐藏的变量
      tableData: [], // 用户账号列表的数据
      editId: '', // 保存要修改的数据的id
      seletedUser: [], // 保存选中的用户数据
      // 和修改表单双向绑定的数据
      editForm: { 
        // cateName: "",
        // password: "",
        // salePrice: "",
        username:"",
        usergroup:"",
      },
       
    

      // 验证的字段 修改表单的验证规则
      rules: {
        // 验证用户名
        username: [
          { required: true, message: "名称不能够为空", trigger: "blur" }, // 非空验证
          { min: 2, max: 16, message: "长度必须 3 到 6 个字符", trigger: "blur" } // 长度验证
        ],      
        // 验证用户组
        salePrice: [
          { required: true, message: "请选择用户组", trigger: "change" } // 非空验证
        ]
      }
    };
    
    
  },

   // 生命周期钩子函数
  created() {
  // 调用methods下封装所有请求方法的函数
     this.getUserList();
    //  this.getAccountListByPage();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

  
      // 这是编辑修改的函数 ----将你修改后的数据返回到数据库里面
    handleEdit(id) {
       // 把要修改的id 保存到一个变量里面
      this.editId = id;
      // 发送一个ajax 把需要修改的数据的id发送给后端
      this.axios.get(`http://127.0.0.1:3000/sort/edituser?id=${id}`)
        .then(response => {
          // 一一对应 把数据回填到模态框里面
          this.editForm.username = response.data[0].salePrice;
          // this.editForm.password = response.data[0].goodsNum;
          this.editForm.usergroup = response.data[0].cateName;
          // 回填号数据以后 再弹出模态框
          this.dialogFormVisible = true;
        })
    },

   // 删除账号函数---这一个有防止误删功能--后来添加哦
    handleDelete(id) {
      this.$confirm('你确定要删除吗？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发送ajax 把id传给后端
          this.axios
            .get(`http://127.0.0.1:3000/sort/deluser?id=${id}`)
            .then(response => {
              // 接收后端返回的错误码 和 提示信息
              let { rstCode, msg } = response.data;  //rstCode必须和后台的子段相对应起来
              // 判断
              if (rstCode === 1) {  // rstCode必须和后台的子段相对应起来
                // 弹出删除成功的提示
                this.$message({   //
                  type: "success",
                  message: msg  //msg也是必须要和后台的子端相对应起来
                });
                // 输出列表（再次调用请求所有用户账号的函数 由于之前已经删除了 所以再次请求 得到的是删除后的数据）
               this.getUserList();  
                // this.getAccountListByPage();


              } else {
                // 弹出删除失败的提示
                this.$message.error(msg);  //后台的提示信息
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },


    // --------------下面这个模块 就是批量删除的那个板块 
  // 取消选择的函数
    toggleSelection() {//
       // 取消选择
        // this.$refs.userlist.clearSelection();
        this.$refs.multipleTable.clearSelection();
    },

    // 当选择状态改变 触发这个函数
    handleSelectionChange(val) {//-----1
      // 把选中的数据 保存到一个变量里面
      this.seletedUser = val;
    
    },

     // 批量删除函数
    batchDel () {
      // 把需要批量删除的数据的id 取出来
      let idArr = this.seletedUser.map( v => v.id );
      // 判断 如果没有选中任何数据 那么就弹出请选择以后再操作 直接返回
      if (!idArr.length) {
        this.$message.error('请选择以后再操作! 你是不是傻！')
        return
      }
      // 收集参数
      let param = {
        idArr: JSON.stringify(idArr) // 把数组转为字符串
      }

      // 发送一个ajax请求 把这个id数组（里面是需要批量删除的数据的id）发送给后端---1
      this.axios.post('http://127.0.0.1:3000/sort/batchdel', 
      qs.stringify(param), // 处理参数
      { Header: { 'Content-Type': 'application/x-www-form-urlencoded' } } // 设置请求头
      ).then(response => {
        // 接收后端响应的数据 根据结果判断
        if (response.data.rstCode === 1) {
          // 成功 弹出批量删除成功的提示 
          this.$message({
            type: 'success',
            message: response.data.msg
          })
         
          // 刷新页面（重新获取一下最新数据）
          this.getUserList();
        //   this.getAccountListByPage()
        } else {
          // 失败 弹出错误信息
          this.$message.error(response.data.msg)
        }
      })

    },
   

   


 getUserList() {
      // 发送ajax请求 获取所有数据
      this.axios.get("http://127.0.0.1:3000/sort/sotrlist").then(response => {
        // 直接把请求到的所用用户账号的数据 赋值给 tableData 渲染用户账号列表
        this.tableData = response.data;
      });
    },



// -------------------------
    
     
    // 表单提交触发的函数---点击确定按钮  给后端数据
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 收集修改后的新数据 和 一个原来的id
          let params = {
            username: this.editForm.username,
            usergroup: this.editForm.usergroup,
            editId: this.editId
          }
          // 发送ajax 把修改后的新数据 和 原来的id 一起发送给后端
          this.axios.post('http://127.0.0.1:3000/sort/saveedit',
          qs.stringify(params),
          { Header: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          ).then(response => {
            // 根据后端响应的数据判断--
            if (response.data.rstCode === 1) {
              // 成功 弹出修改成功的提示
              this.$message({
                type: 'success',
                message: response.data.msg
              })
              // 重新调用一下获取数据的方法（刷新一遍页面 获取最新数据）
              this.getUserList()
              // this.getAccountListByPage

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

  },

  filters:{
    formatCdate(value){
     return moment(value).format("YYYY-MM-DD HH:mm:ss")
    }
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
      // display: inline-block;
    }
    .el-form {  //控制表单的宽度的
              width: 80%;
    }
   


    
  }
}
</style>


