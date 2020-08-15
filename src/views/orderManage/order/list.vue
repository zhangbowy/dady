<template>
  <div class="order-list main-content">
    <div class="screen-box">
      <div class="screen-item">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input
              v-model.trim="formInline.keywords"
              size="small"
              placeholder="搜索订单号"
              clearable
            />
          </el-form-item>
          <el-form-item label="收货人手机号">
            <el-input
              v-model.trim="formInline.receiver_phone"
              size="small"
              placeholder="收货人手机号"
              clearable
            />
          </el-form-item>
          <el-form-item label="快递单号">
            <el-input
              v-model.trim="formInline.express_number"
              size="small"
              placeholder="快递单号"
              clearable
            />
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select v-model="formInline.order_type" size="small" clearable placeholder="选择订单类型" @change="customCategoryChange">
              <el-option
                v-for="item in orderTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="showCustomCategory" label="定制分类">
            <el-select v-model="formInline.custom_category_id" size="small" clearable placeholder="选择订制分类" @change="customCategoryChange">
              <el-option
                v-for="item in customCategoryList"
                :key="item.custom_category_id"
                :label="item.custom_category_name"
                :value="item.custom_category_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="adminInfo.role_type==1" label="店铺">
            <el-select v-model="formInline.shop_id" size="small" clearable placeholder="选择店铺" @change="customCategoryChange">
              <el-option
                v-for="item in shopsList"
                :key="item.shop_id"
                :label="item.shop_name"
                :value="item.shop_id"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="订单状态">
            <el-select v-model="formInline.status" placeholder="请选择">
              <el-option
                v-for="item in orderCount"
                :key="item.status"
                :label="item._status"
                :value="item.status"
              >
                <span style="float: left">{{ item._status }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.count }}</span>
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="formInline.order_time"
              type="datetimerange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="付款时间">
            <el-date-picker
              v-model="formInline.pay_time"
              type="datetimerange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="doSearch()">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="请选择机器"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div>
        <el-radio-group v-if="machineList.length" v-model="machine_id" size="small">
          <el-radio v-for="machine in machineList" :key="machine.machine_code" :label="machine.machine_code" border>{{ machine.machine_name }}</el-radio>
        </el-radio-group>
        <span v-else>该定制分类没有关联任何机器</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onDialogClick">确 定</el-button>
      </span>
    </el-dialog>
    <div class="content">
      <el-tabs v-model="activeName" v-loading="loading" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in orderCount"
          :key="index"
          :label="`${item._status}(${item.count})`"
          :name="`${item.status}`"
        />
        <div class="tab-content">
          <order-table :data="orderList" @getList="getListData" @checkboxChange="onCheckboxChange" />
        </div>
      </el-tabs>
      <!-- 分页 -->
      <div class="pagination-box">
        <el-button type="primary" class="issued-btn" @click="onIssuedBtnClick">下发机器</el-button>
        <el-pagination
          :total="total"
          :current-page="currentPage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pageSize"
          layout="slot, total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OrderTable from './components/OrderTable'
import { orderApi } from '@/api/order'
import { getList } from '@/api/shop'
import { customCateApi } from '@/api/system'
import { mapGetters } from 'vuex'
export default {
  components: {
    OrderTable
  },
  data() {
    return {
      loading: true,
      formInline: {
        status: '',
        keywords: '',
        receiver_phone: '',
        express_number: '',
        order_type: '',
        shop_id: '',
        order_time: [],
        pay_time: [],
        custom_category_id: ''
      },
      pageSize: 5,
      currentPage: 1,
      total: 2,
      orderList: [],
      shopsList: [],
      machineList: [],
      machine_id: 0,
      orderTypeOption: [{
        value: '1',
        label: '普通订单'
      }, {
        value: '2',
        label: '一般定制'
      }, {
        value: '3',
        label: '特殊定制'
      }, {
        value: '4',
        label: '手绘'
      }],
      statusOption: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '待付款'
      }, {
        value: '2',
        label: '待发货'
      }, {
        value: '3',
        label: '已发货'
      }, {
        value: '4',
        label: '已完成'
      }, {
        value: '5',
        label: '询价中'
      }, {
        value: '6',
        label: '询价回复'
      }, {
        value: '-2',
        label: '已关闭/取消订单'
      }],
      customCategoryList: [],
      multipleSelection: [],
      checkedList: [],
      activeName: '0',
      orderCount: {},
      showCustomCategory: true,
      dialogVisible: false,
      current_custom_category_id: 0
    }
  },
  computed: {
    ...mapGetters([
      'adminInfo'
    ])
  },
  watch: {
    'formInline.order_time': {
      handler(newValue, oldValue) {
        if (newValue === null) {
          this.formInline.order_time = []
        }
      }
    },
    'formInline.pay_time': {
      handler(newValue, oldValue) {
        if (newValue === null) {
          this.formInline.pay_time = []
        }
      }
    },
    current_custom_category_id: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.customCategoryList.forEach(item => {
            if (newValue === item.custom_category_id) {
              this.machineList = item.machine || []
              this.machineList.length && (this.machine_id = this.machineList[0].machine_code)
              return
            }
          })
        }
      }
    }
    // activeName: {
    //   handler(newValue, oldValue) {
    //     // 如果是下发机器，添加定制分类筛选框
    //     if (newValue === '10') {
    //       this.showCustomCategory = true
    //       if (this.formInline.custom_category_id && this.customCategoryList.length) {
    //         this.formInline.custom_category_id = this.customCategoryList[0].custom_category_id
    //       }
    //     } else {
    //       this.showCustomCategory = false
    //     }
    //   }
    // }
  },
  created() {
    this.getOrderCount()
    this.fetchData()
    this.getCustomCategory()
    this.getShopData()
  },
  methods: {
    // 刷新页面
    getListData() {
      this.getOrderCount()
      this.fetchData()
    },
    getShopData() {
      // 获取店铺列表
      getList({
        pageSize: 1000,
        currentPage: 1
      }).then(res => {
        this.shopsList = res.data.data
      }).catch(() => {
      })
    },
    // 请求定制分类
    getCustomCategory() {
      customCateApi.getCategoryList().then(({ data }) => {
        this.customCategoryList = data || []
      })
    },
    // 定制分类改变
    customCategoryChange(value) {
      this.fetchData()
    },
    onCheckboxChange(list) {
      this.checkedList = list
    },
    onDialogClick() {
      if(this.machine_id) {
        orderApi.sendMachine({
          order_id: this.checkedList,
          custom_template_id: this.current_custom_category_id,
          machine_id: this.machine_id
        }).then(data => {
          this.$message({
            message: '下发机器成功',
            type: 'success'
          })
          this.dialogVisible = false
        })
      } else {
        this.dialogVisible = false
      }
      
    },
    // 请求列表数据
    fetchData() {
      orderApi.getList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        status: this.formInline.status,
        order_no: this.formInline.keywords,
        order_type: this.formInline.order_type,
        start_time: this.formInline.order_time[0],
        end_time: this.formInline.order_time[1],
        start_pay_time: this.formInline.pay_time[0],
        end_pay_time: this.formInline.pay_time[1],
        express_number: this.formInline.express_number,
        receiver_phone: this.formInline.receiver_phone,
        shop_id: this.formInline.shop_id,
        custom_category_id: this.formInline.custom_category_id
      }).then(res => {
        this.loading = false
        this.orderList = res.data.data
        this.total = res.data.count
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取各个状态数量统计
    getOrderCount() {
      orderApi.getOrderCount({
        order_no: this.formInline.keywords,
        order_type: this.formInline.order_type,
        express_number: this.formInline.express_number,
        start_time: this.formInline.order_time[0],
        end_time: this.formInline.order_time[1],
        start_pay_time: this.formInline.pay_time[0],
        end_pay_time: this.formInline.pay_time[1],
        receiver_phone: this.formInline.receiver_phone,
        shop_id: this.formInline.shop_id
      }).then(res => {
        this.orderCount = res.data
      })
    },
    // 选项卡点击
    handleClick(tab, event) {
      this.currentPage = 1
      this.formInline.status = tab.name
      this.loading = true
      this.getOrderCount()
      this.fetchData()
    },
    onIssuedBtnClick() {
      if (!this.checkedList.length) {
        this.$message({
          // title: '警告',
          message: '没有选择订单',
          type: 'warning'
        })
      } else {
        const checkedOrderList = this.orderList.filter(item => {
          return this.checkedList.includes(item.id)
        })
        if (checkedOrderList.length) {
          const custom_category_id = checkedOrderList[0].custom_category_id
          let is_same = true
          checkedOrderList.forEach(item => {
            if (item.custom_category_id !== custom_category_id) {
              this.$message({
                // title: '警告',
                message: '必须选择相同的定制分类',
                type: 'error'
              })
              is_same = false
              return
            }
          })
          if (!custom_category_id) {
            this.$message({
              // title: '警告',
              message: '定制分类错误',
              type: 'error'
            })
            return
          }
          if (is_same) {
            this.current_custom_category_id = custom_category_id
            this.dialogVisible = true
          }
        }
      }
    },
    // 执行搜索
    doSearch() {
      this.currentPage = 1
      this.loading = true
      this.getListData()
    },
    // 分页当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list{
  .screen-box{
    padding: 30px 20px 10px;
    .screen-item{
      text-align: left;
    }
  }
  .content{
    background: #fff;
    padding: 10px;
  }
  .issued-btn {
    float: left;
  }
}

</style>
