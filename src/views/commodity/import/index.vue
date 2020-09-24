<template>
  <div class="main-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('导入淘宝商品')" name="1">
        <el-form :model="form" label-position="top">
          <el-form-item :label="$t('商品链接')">
            <el-row>
              <el-col v-for="(item,index) in form.urlList" :key="index" :span="24">
                <el-input v-model="item.url" size="small" :placeholder="$t('商品链接')" style="width: 50%">
                  <template slot="prepend">{{ `${$t('链接')}${$t('：')}` }}</template>
                </el-input>
                <el-button
                  v-if="index !== form.urlList.length - 1"
                  size="small"
                  type="danger"
                  icon="el-icon-remove-outline"
                  style="vertical-align: top;margin: 0"
                  @click="deleteTemplate(index)"
                >{{ $t('删除') }}</el-button>
                <el-button
                  v-if="index === form.urlList.length - 1"
                  size="small"
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  style="vertical-align: top;"
                  @click="addTemplate()"
                >{{ $t('添加') }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="importGoods">{{ $t('导入商品') }}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('充值')" name="2">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="never">
              {{ this.$t('剩余次数') }}: {{ usableNumber }}
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12" class="recharge-type">
          <el-col v-for="rechargetype in rechargetypeList" :key="rechargetype.id" :span="8">
            <el-card shadow="hover" class="recharge-type-card">
              <span>{{ `${rechargetype.price}${$t('元')} / ${rechargetype.number} ${$t('次')}` }}</span>
              <el-button size="small" type="primary" class="recharge-type-card_btn" @click="onRecharge(rechargetype)">{{ $t('立即充值') }}</el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-dialogDrag center :close-on-click-modal="false" :title="$t('微信充值')" :visible.sync="dialogVisible">
      <div class="dialog-content">
        <div :class="['dialog-content_recode']">
          <span>{{ $t('手机微信扫码，支付') }}{{ currentPrice }}{{ $t('元') }}</span>
          <img :src="qrcode" alt="">
        </div>
        <div :class="['dialog-content_hint']">
          <img class="logo" src="@/assets/images/WePayLogo.png" alt="">
          <img class="hint" src="@/assets/images/wxPayHint.png" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { importGood, importRecharge, importPay } from '@/api/goods'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      activeName: '1',
      form: {
        urlList: [{
          url: ''
        }]
      },
      qrcode: '',
      currentPrice: 0,
      usableNumber: 0,
      dialogVisible: false,
      rechargeLogList: [],
      rechargetypeList: [],
      timer: null,
      outTradeNo: '',
      token: getToken(),
      baseURL: process.env.VUE_APP_BASE_API
    }
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      if (!newValue) {
        clearInterval(this.timer)
      }
    },
    activeName(newValue) {
      localStorage.setItem('active-name', newValue)
    }
  },
  inject: ['reload'],
  created() {
    this.importRecharge()
    const activeName = localStorage.getItem('active-name')
    if (activeName) {
      this.activeName = activeName
    }
  },
  methods: {
    handleClick(value) {
      // console.log(value)
    },
    onRecharge(rechargetype) {
      importPay({
        recharge_type: 'tb_import',
        id: rechargetype.id
      }).then(res => {
        if (res.code === 0) {
          this.dialogVisible = true
          this.qrcode = res.data.qrcode
          this.currentPrice = rechargetype.price
          this.outTradeNo = res.data.out_trade_no
          this.queryPay()
        } else {
          this.$message({
            type: 'error',
            message: this.$t(...res.msg)
          })
        }
      })
    },
    queryPay() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        fetch(`${this.baseURL}/recharge/isPay`, {
          headers: {
            'adm_sign': this.token,
            'Content-Type': 'application/json;charset=UTF-8'
          },
          method: 'POST',
          body: JSON.stringify({
            out_trade_no: this.outTradeNo
          })
        }).then(res => res.json()).then(data => {
          if (data.code === 0) {
            clearInterval(this.timer)
            this.reload()
            this.$message({
              type: 'success',
              message: this.$t(data.msg)
            })
          }
        })
      }, 2000)
    },
    importRecharge() {
      importRecharge().then(res => {
        if (res.code === 0) {
          this.rechargetypeList = res.data.recharge
          this.rechargeLogList = res.data.recharge_log
          this.usableNumber = res.data.usable_number
        } else {
          this.$message({
            type: 'error',
            message: this.$t(...res.msg)
          })
        }
      })
    },
    addTemplate() {
      if (!this.form.urlList[this.form.urlList.length - 1].url) {
        this.$message(`${this.$t('请输入商品链接')}`)
        return
      }
      this.form.urlList.push({
        url: ''
      })
    },
    importGoods() {
      if (!this.form.urlList[0].url) {
        this.$message(`${this.$t('请输入商品链接')}`)
        return
      }
      importGood({
        tb_url: this.form.urlList.map(item => item.url)
      }).then(data => {
        if (data.code === 0) {
          this.$message({
            message: this.$t(...data.msg),
            type: 'success'
          })
          this.form.urlList = [
            {
              url: ''
            }
          ]
        } else {
          this.$message({
            message: this.$t(data.msg),
            type: 'error'
          })
        }
      })
    },
    deleteTemplate(index) {
      this.form.urlList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.recharge-type {
  margin-top: 12px;
  &-card {
    cursor: pointer;
    .el-card__body {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      span {
        margin-bottom: 10px;
      }
    }
  }
}
.dialog-content {
  display: flex;
  align-items: center;
  justify-content: center;
  &_recode {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 4px;
    border: 1px solid #d7dae2;
    border-radius: 4px;
    z-index: 100;
    background: #fff;
    animation: qrcodeShow 0.3s linear forwards;
    img {
      width: 200px;
      height: 200px;
    }
  }
  &_hint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    padding: 10px;
    animation: hintShow 0.3s linear forwards;
    .logo {
      width: 100px;
    }
    .hint {
      width: 200px;
      margin-top: 40px;
    }
  }
  @keyframes hintShow {
    0% {
      transform: translateX(-80px);
    }
    100% {
      transform: translateX(0px);
    }
  }
  @keyframes qrcodeShow {
    0% {
      transform: translateX(80px);
    }
    100% {
      transform: translateX(0px);
    }
  }
}
</style>
