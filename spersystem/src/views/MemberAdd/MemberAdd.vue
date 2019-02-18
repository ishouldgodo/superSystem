<template>
    <div class="goods-add">
          <el-main>
            <el-card class="box-card">
                <!-- 面板标题 -->
                <div slot="header" class="clearfix">
                    <span>添加会员账号</span>
                </div>

                <!-- 面板内容 -->
                <div class="text item">
                    <!-- 添加账户表单 -->
                    <el-form :model="addGoodsForm" status-icon :rules="rules" ref="addGoodsForm" label-width="100px" class="demo-ruleForm">

                         <!-- 真实姓名 -->
                        <el-form-item label="真实姓名" prop="costPrice">
                            <el-input type="text" v-model.number="addGoodsForm.costPrice"  autocomplete="off"></el-input>
                        </el-form-item> 

                         <!-- 会员卡卡号 -->
                        <el-form-item label="会员卡卡号" prop="marketPrice">
                            <el-input type="text" v-model.number="addGoodsForm.marketPrice" autocomplete="off"></el-input>
                        </el-form-item>
                        


                        <!-- 所属分类 -->
                        <el-form-item label="用户组" prop="cateName">
                               <!-- 条形码 -->
                            <el-select v-model="addGoodsForm.cateName" placeholder="会员等级">
                                <el-option label="青铜会员" value="青铜会员"></el-option>
                                <el-option label="黄金会员" value="黄金会员"></el-option>   
                                <el-option label="铂金会员" value="铂金会员"></el-option>  
                                <el-option label="钻石会员" value="钻石会员"></el-option>  
                                <el-option label="王者会员" value="王者会员"></el-option>                    
                            </el-select>
                        </el-form-item>
                  
                                             
                         <el-form-item label="身份证号" prop="barCode">
                            <el-input type="text" v-model="addGoodsForm.barCode" autocomplete="off"></el-input>
                         </el-form-item>

                          <!-- 会员优惠 -->
                        <el-form-item label="用户状态">
                            <el-radio-group v-model="addGoodsForm.discount">
                                <el-radio label="启用"></el-radio>
                                <el-radio label="禁用"></el-radio>
                            </el-radio-group>
                        </el-form-item>

                      
                        <!-- 手机号码 -->
                        <el-form-item label="手机号码" prop="goodsNum">
                            <el-input type="text" v-model.number="addGoodsForm.goodsNum" autocomplete="off"></el-input>
                        </el-form-item>
                       
                        <!-- 邮箱地址 -->
                        <el-form-item label="邮箱地址" prop="goodsWeight">
                            <el-input type="text" v-model.number="addGoodsForm.goodsWeight" autocomplete="off"></el-input>
                        </el-form-item>


                        <!-- 详细地址地址 -->
                        <el-form-item label="详细地址" prop="salePrice">
                            <el-input type="text" v-model.number="addGoodsForm.salePrice" autocomplete="off"></el-input>
                        </el-form-item>

                         <!-- 邮政编码 -->
                        <el-form-item label="会员积分" prop="unit">
                            <el-input type="text" v-model.number="addGoodsForm.unit" autocomplete="off"></el-input>
                        </el-form-item>

                        <!-- 添加按钮 -->
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('addGoodsForm')">添加</el-button>
                            <el-button @click="resetForm('addGoodsForm')">重置</el-button>
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
  
    const confirmPwd = (rule, value, callback) => {
      // 非空验证
      if (value === "") {
        // 输出不能为空的提示
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addGoodsForm.password) {
       
        callback(new Error("两次密码不一致"));
      } else {
        // 成功提示（绿色勾勾）
        callback();
      }
    };
    return {
      // 登录表单数据对象
      addGoodsForm: {
        cateName: "",
        barCode: "",
        // goodsName: "",
        costPrice: "",
        marketPrice: "",
        salePrice: "",
        goodsNum: "",
        goodsWeight: "",
        unit: "",
        discount: "",
        // promotion: "",
        // goodsDesc: ""
      },
      // 验证的字段
      rules: {
        // 验证分类名称
        cateName: [
          { required: true, message: "账号不能为空", trigger: "blur" }, // 非空验证
          // {
          //   min: 3,
          //   max: 6,
          //   message: "长度必须 3 到 6 个字符",
          //   trigger: "change"
          // } // 长度验证
        ],
        // 条形码
        barCode: [
          { required: true, message: "身份证不能为空", trigger: "blur" } // 非空验证
        ],
        // 商品名称
        // goodsName: [
        //   { required: true, message: "商品名称不能为空", trigger: "blur" } // 非空验证
        // ],
        // 商品进价
        costPrice: [
          { required: true, message: "不能为空", trigger: "blur" } // 非空验证
        ],
        // 市场价
        marketPrice: [
          { required: true, message: "不能为空", trigger: "blur" } // 非空验证
        ],
        // 售价
        salePrice: [
          { required: true, message: "不能为空", trigger: "blur" } // 非空验证
        ],
        // 入库数量
        goodsNum: [
          { required: true, message: "不能为空", trigger: "blur" } // 非空验证
        ],
        // 商品重量
        goodsWeight: [
          { required: true, message: "不能为空", trigger: "blur" } // 非空验证
        ],
        // 单位
        unit: [
          { required: true, message: "不能为空", trigger: "blur" } // 非空验证
        ],
        // 是否打折
        discount: [
          { required: true, message: "不能为空", trigger: "blur" } // 非空验证
        ],
      
      }
    };
  },
  methods: {
    // 表单提交触发的函数
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 获取用户输入的要新增的账号数据，用一个参数对象保存
          let params = {
                cateName: this.addGoodsForm.cateName,
                barCode: this.addGoodsForm.barCode,
                // goodsName: this.addGoodsForm.goodsName,
                costPrice: this.addGoodsForm.costPrice,
                marketPrice: this.addGoodsForm.marketPrice,
                salePrice: this.addGoodsForm.salePrice,
                goodsNum: this.addGoodsForm.goodsNum,
                goodsWeight: this.addGoodsForm.goodsWeight,
                unit: this.addGoodsForm.unit,
                discount: this.addGoodsForm.discount,
                
          };

            // 发送ajax请求  把数据发送给后端
            this.axios
              .post(
                "http://127.0.0.1:3000/member/memberadd",
                qs.stringify(params), // 参数处理
                {
                  headers: { "Content-Type": "application/x-www-form-urlencoded" } // 设置请求头
                }
              )
              .then(response => {
                // 如果请求状态码是1 那么就是请求成功
                if (response.data.rstCode === 1) {
                  // 弹出提示信息
                  this.$message({
                    type: "success",
                    message: response.data.msg
                  });

                  // 跳转到商品管理列表页面--在这里跳
                  this.$router.push("/membermanage");
                } else {
                  // 弹出商品添加失败信息
                  this.$message.error(response.data.msg);
                }
              });
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

}

</script>


<style lang="less">
.goods-add {
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

