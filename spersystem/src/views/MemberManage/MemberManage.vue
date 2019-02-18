<template>
    <div class="user-manage">
        <!-- 主体 -->
        <el-main>
            <el-card class="box-card">
                <!-- 面板标题 -->
                <div slot="header" class="clearfix">
                    <span>会员账号管理</span>
                </div>

                <!-- 面板内容 -->
                <div class="text item">
                    <!-- 账号管理列表 -->
                    <el-table ref="userlist"
                     :data="tableData" 
                     tooltip-effect="dark" 
                     style="width: 100%" 
                     @selection-change="handleSelectionChange">
                        <!-- 选择框 -->
                        <el-table-column type="selection">
                        </el-table-column>
                        <!-- 会员卡号  marketPrice-->
                        <el-table-column prop="marketPrice" label="会员卡号">
                        </el-table-column>
                        <!-- 会员姓名 -->
                        <el-table-column prop="costPrice" label="会员姓名">
                        </el-table-column>
                        <!-- 会员等级 -->
                        <el-table-column prop="cateName" label="会员等级">
                        </el-table-column>

                         <!-- 会员积分 -->
                        <el-table-column prop="unit" label="会员积分">
                        </el-table-column>


                        <!-- 售价 -->
                        <el-table-column prop="salePrice" label="地址">
                        </el-table-column>
                        <!-- 是否存销 -->
                        <el-table-column prop="goodsNum" label="手机号码">
                        </el-table-column>
                        <!-- 日期 -->
                        <el-table-column label="日期">
                            <template slot-scope="scope">{{ scope.row.cdate | formatCdate }}</template>
                        </el-table-column>
                        <!-- 操作 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">
                                    <i class="el-icon-edit"></i>
                                </el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                                    <i class="el-icon-delete"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 修改弹出的模态框 -->
                       <!-- 修改弹出的模态框    这个框会用来实现数据回填  和 将修改后的数据发送给后端-->
                      <el-dialog title="修改用户" :visible.sync="dialogFormVisible" width="30%">
                          <!-- 修改用户表单  你下面删了 -->
                          <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
                            <!-- 账号 -->
                            <el-form-item label="会员卡" prop="username">  
                              <el-input type="text" v-model="editForm.username" autocomplete="off"></el-input>
                            </el-form-item>
                            <!-- 密码 -->
                            <el-form-item label="手机号码" prop="password">
                              <el-input type="text" v-model="editForm.password" autocomplete="off"></el-input>
                            </el-form-item>
                            <!-- 用户组 -->
                            <el-form-item label="会员状态" prop="usergroup">
                              <el-select v-model="editForm.usergroup" placeholder="请选择会员状态">
                                <el-option label="启动" value="启动"></el-option>
                                <el-option label="禁用" value="禁用"></el-option>
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
                      <div style="margin-top: 20px; text-align: center;">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[1, 3, 5, 10, 20, 50]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                        </el-pagination>
                      </div>

                      <!-- 选择按钮    这是是实现批量删除的板块 -->
                        <div style="margin-top: 20px">
                            <el-button type="danger" @click="batchDel">批量删除</el-button>
                            <el-button @click="toggleSelection">取消选择</el-button>
                      </div>

                </div>
            </el-card>
        </el-main>
    </div>
</template>
<script>
// 引入moment 事件格式化插件
import moment from "moment";
// 

// 引入qs模块 用于处理post方式产参数
import qs from "qs";



// 暴露出去 暴露的是当前组件的vue实例对象（new Vue({  })）
export default {
  // 数据
  data() {
    return {
      // searchForm: {
      //   // 搜索表单
      //   cateName: "", // 分类名
      //   keyWord: "" // 关键字
      // },

      totalCount: 10, // 数据总条数
      currentPage: 1, // 当前页
      pageSize: 3, // 默认每页显示3条
      dialogFormVisible: false, // 控制修改模态框的显示和隐藏的变量
      tableData: [], // 用户账号列表的数据
      editId: "", // 保存要修改的数据的id
      seletedUser: [], // 保存选中的用户数据
     
       // 和修改表单双向绑定的数据
      editForm: { 
        username: "",
        password: "",
        usergroup: "",
        costPrice:"",

      },

      // 分页列表 
      currentPage: 1, // 当前页
      total: 0, // 数据总条数
      pageSize: 3, // 每页条数


      // 验证的字段 修改表单的验证规则
      rules: {
        // 验证用户名
        username: [
          { required: true, message: "卡号不能为空", trigger: "blur" }, // 非空验证
          { min: 1, max: 20, message: "", trigger: "blur" } // 长度验证
        ],
        // 验证密码
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }, // 非空验证
          { min: 11, max: 12, message: "手机号码位数不对", trigger: "blur" } // 长度验证
        ],
        // 验证用户组
        usergroup: [
          { required: true, message: "请选择用户组", trigger: "change" } // 非空验证
        ]
      }
    };
  },
  // 方法
  methods: {
    

    // 这是编辑修改的函数 ----将你修改后的数据返回到数据库里面
    handleEdit(id) {
       // 把要修改的id 保存到一个变量里面
      this.editId = id;
      // 发送一个ajax 把需要修改的数据的id发送给后端
      this.axios.get(`http://127.0.0.1:3000/member/edituser?id=${id}`)
        .then(response => {
          // 一一对应 把数据回填到模态框里面
          this.editForm.username = response.data[0].marketPrice;
          this.editForm.password = response.data[0].goodsNum;
          this.editForm.usergroup = response.data[0].discount;
          // 回填号数据以后 再弹出模态框
          this.dialogFormVisible = true;
        })
    },


  
// ---------------------------------------------这是商品管理赋值而来的
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
            .get(`http://127.0.0.1:3000/member/deluser?id=${id}`)
            .then(response => {
              // 接收后端返回的错误码 和 提示信息
              let { rstCode, msg } = response.data;  //rstCode必须和后台的子段相对应起来
              // 判断
              if (rstCode ===1) {  // rstCode必须和后台的子段相对应起来
                // 弹出删除成功的提示
                this.$message({   //
                  type: "success",
                  message: msg  //msg也是必须要和后台的子端相对应起来
                });
                // 输出列表（再次调用请求所有用户账号的函数 由于之前已经删除了 所以再次请求 得到的是删除后的数据）
              
                  // this.getGoodsList();  //再次调用
                // this.getAccountListByPage();----分页调用
                 this.getAccountListByPage();


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

// -------------------------------------------------------

    // 取消选择的函数
    toggleSelection() {
      // 取消选择
      this.$refs.userlist.clearSelection();
    },
    // 当选择状态改变 触发这个函数
    handleSelectionChange(val) {
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
      this.axios.post('http://127.0.0.1:3000/member/batchdel', 
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
          // this.getUserList();
          this.getAccountListByPage()
        } else {
          // 失败 弹出错误信息
          this.$message.error(response.data.msg)
        }
      })

    },
    
     getAccountListByPage () {
     
      // 收集当前页码 和 每页显示条数
      let pageSize = this.pageSize;
      let currentPage = this.currentPage;

      // 发送ajax请求 把分页数据发送给后端
      this.axios.get('http://127.0.0.1:3000/member/accountlistbypage', {
        params: {
          pageSize,
          currentPage
        }
      })
        .then(response => {
          console.log('对应页码的数据:', response.data)
          // 接收后端返回的数据总条数 total 和 对应页码的数据 data
          let {total, data} = response.data;
          // 赋值给对应的变量即可
          this.total = total;
          this.tableData = data;
          // 如果当前页没有数据 且 排除第一页
          if ( !data.length && this.currentPage !== 1) {
            // 页码减去 1
            this.currentPage -= 1;
            // 再调用自己
            this.getAccountListByPage();
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

        // 每页显示条数改变 就会触发这个函数
    handleSizeChange(val) {
      // 保存每页显示的条数
      this.pageSize = val;
      // 调用分页函数
      this.getAccountListByPage();
    },


    // 当前页码改变 就会触发这个函数
    handleCurrentChange(val) {
      // 保存当前页码
      this.currentPage = val;
      // 调用分页函数
      this.getAccountListByPage();
    },



     
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
          this.axios.post('http://127.0.0.1:3000/member/saveedit',
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
              // this.getUserList()
              // this.getAccountListByPage
              this.getAccountListByPage();

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
  // 生命周期钩子函数(vue实例创建完成 但是还没有挂载dom 适合请求数据) 只要进入组件 组件就会经历这个周期 会自动触发这个函数
  created() {
  
     // 页面加载 请求一次数据 按照分页请求数据
     this.getAccountListByPage();
  },
  // 过滤器
  filters: {
    // 过滤器
    formatCdate(value) {
      return moment(value).format("YYYY-MM-DD");
    }
  }
};
</script>
<style lang="less">
.user-manage {
  width: 100%;
  display: flex; // 让这个盒子 变为一个可以伸缩的盒子
  flex-direction: column; // 方向是 纵向
  // 主体
  .el-main {
    flex: 1; // 自动增长 撑满
    .el-card {
      .el-card__header {
        font-weight: 600;
        font-size: 20px;
        background-color: #f1f1f1;
        text-align: left;
      }
      .el-card__body {
        .el-dialog {
          .el-dialog__header {
            font-weight: 700;
          }
          .el-dialog__body {
            .el-form {
              width: 80%;
            }
          }
        }
      }
    }
  }
}
</style>


