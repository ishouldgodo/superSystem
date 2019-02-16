<template>
    <div class="home">
        <!-- 面板组件 -->
       <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>系统信息</span>
            </div>
            <div class="text item">
                 <!-- 提示信息 -->
                 <el-alert
                    title="商品总数: 500, 已销售总金额: 998.00, 库存商品总价: 9800.00"
                    type="info"
                    show-icon>
                </el-alert>
                <!-- 导入数据 -->
                <el-alert
                    title="导入数据"
                    type="success"
                    show-icon>
                </el-alert>
                <!-- 左右卡片 -->
                <el-row  :gutter="20">
                    <!-- 左 -->
                    <el-col :span="12">
                        <!-- 左侧卡片 -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                            <span>销售排行</span>


                              <!-- 左边的导出导出按钮 -->
                                  <div class="toexcel">
                                      <el-button  @click="exportExcelleft" type="primary" class="button" style="width:70px;position:absolute;top:12px;right:52%">导出</el-button>
                                  </div>

                        </div>
                        <div class="text item">
                            <!-- 左侧表格 -->
                            <el-table
                                class="table"
                                :data="saleData"
                                style="width: 100%">
                                <!-- 商品名称 -->
                                <el-table-column
                                    prop="goodsName"
                                    label="商品名称"
                                    >
                                </el-table-column>
                                <!-- 销量 -->
                                <el-table-column
                                    prop="saleCount"
                                    label="销量"
                                   >
                                </el-table-column>
                            </el-table>
                        </div>
                        </el-card>
                    </el-col>



                    <!-- 右 -->
                    <el-col :span="12">
                          <!-- 右侧卡片 -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                            <span>缺货的商品</span>
                            <!-- 左边的导出导出按钮 -->
                            <div class="toexcel">
                                <el-button  @click="exportExcelright" type="primary" class="button" style="width:70px;position:absolute;top:12px;right:2%">导出</el-button>
                            </div>
                        </div>
                        <div class="text item">
                            <!-- 右侧表格    class="tableright"表示包导出哪一个类的表格  与下面methods中的方法相对应-->
                            <el-table
                                class="tableright"
                                :data="stockoutData"
                                style="width: 100%">
                                <!-- 商品名称 -->
                                <el-table-column
                                    prop="goodsName"
                                    label="商品名称"
                                    >
                                </el-table-column>
                                <!-- 库存 -->
                                <el-table-column
                                    prop="inventory"
                                    label="库存"
                                   >
                                </el-table-column>
                                <!-- 操作 -->
                                <el-table-column
                                    prop="saleCount"
                                    label="操作"
                                   >
                                   <template slot-scope="scope">
                                        <el-button type="text" size="small">入库</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>

    </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      // 销量排行数据
      saleData: [
        {
          goodsName: "海飞丝",
          saleCount: 10
        },
        {
          goodsName: "霸王",
          saleCount: 80
        },
        {
          goodsName: "蒂花之秀",
          saleCount: 50
        },
        {
          goodsName: "飘柔",
          saleCount: 18
        },
        {
          goodsName: "飘柔",
          saleCount: 18
        }
      ],
      // 缺货商品数据
      stockoutData: [
        {
          goodsName: "我的优乐美",
          inventory: 1
        },
        {
          goodsName: "你的娃哈哈",
          inventory: 2
        },
        {
          goodsName: "它的香飘飘",
          inventory: 5
        },
        {
          goodsName: "大家的好迪",
          inventory: 0
        }
      ]
    };
  },

  methods: {
    // 左边导出表格
    exportExcelleft() {
      // 设置当前日期
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let name = year + "" + month + "" + day;
     
      //  .table要导出的是哪一个表格
      var wb = XLSX.utils.table_to_book(document.querySelector(".table"));
  
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          name +"销售排行表"+ ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    
    // 右边导出表
    exportExcelright() {
      // 设置当前日期
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let name = year + "" + month + "" + day;
      // console.log(name)
      /* generate workbook object from table */

      //  .tableright要导出的是哪一个表格 
      var wb = XLSX.utils.table_to_book(document.querySelector(".tableright"));

      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          name +"缺货商品"+ ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

  }

};
</script>
<style lang="less">
.home {
  .el-card {
    .el-card__header {
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      background-color: #f1f1f1;
    }
    .el-card__body {
      .item {
        .el-alert {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>


