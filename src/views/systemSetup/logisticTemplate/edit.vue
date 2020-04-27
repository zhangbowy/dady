<template>
  <div class="logistic-edit">
    <div class="title-info">
      <card-tag :tag-name="id!=''? '编辑运费模板': '新增运费模板'" />
    </div>
    <div class="form-info">
      <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="模板名称：" prop="express_template_name">
          <el-input v-model="form.express_template_name" style="width: 50%" />
        </el-form-item>
        <el-form-item label="计价方式：">
          <el-radio-group v-model="form.express_template_type">
            <el-radio :label="1">按重量</el-radio>
            <el-radio :label="2">按件数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="运送方式：">
          <span>除指定区域外，区域地区的运费采用“默认运费</span>
          <div class="rules-panel">
            <div class="rules-defaule">
              <span>默认运费</span>
              <el-form-item prop="first_number" style="display:inline-block">
                <el-input v-model="form.first_number" size="mini" type="number">
                  <template slot="append">{{ form.express_template_type==2? '件':'重' }}内</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="first_amount" style="display:inline-block">
                <el-input v-model="form.first_amount" size="mini" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <span>，每增加</span>
              <el-form-item prop="continue_number" style="display:inline-block">
                <el-input v-model="form.continue_number" size="mini" type="number">
                  <template slot="append">{{ form.express_template_type==2?'件':'千克' }}</template>
                </el-input>
              </el-form-item>
              <span>，增加运费</span>
              <el-form-item prop="continue_amount" style="display:inline-block">
                <el-input v-model="form.continue_amount" size="mini" type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="rules-list">
              <div class="rules-list-header">
                <el-row :gutter="20">
                  <el-col :span="4">运送到</el-col>
                  <el-col :span="4">首{{ form.express_template_type==2?'件':'重' }}（{{ form.express_template_type==2?'件':'Kg' }}）</el-col>
                  <el-col :span="4">首费（元）</el-col>
                  <el-col :span="4">续{{ form.express_template_type==2?'件':'重' }}（{{ form.express_template_type==2?'件':'Kg' }}）</el-col>
                  <el-col :span="4">续费（元）</el-col>
                  <el-col :span="4">操作</el-col>
                </el-row>
              </div>
              <div class="item-content">
                <el-row v-for="(item,index) in form.region_rules" :key="index" :gutter="20" class="rules-list-item">
                  <el-col :span="4">
                    {{ item.city_show }}
                    <el-button type="text" @click="editCity(item.region, index)">编辑</el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-input v-model="item.first_number" size="mini" type="number" />
                  </el-col>
                  <el-col :span="4">
                    <el-input v-model="item.first_amount" size="mini" type="number" />
                  </el-col>
                  <el-col :span="4">
                    <el-input v-model="item.continue_number" size="mini" type="number" />
                  </el-col>
                  <el-col :span="4">
                    <el-input v-model="item.continue_amount" size="mini" type="number" />
                  </el-col>
                  <el-col :span="4">
                    <el-button size="mini" type="danger" @click="deleteRules(index)">删除</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="rules-footer">
              <el-button
                type="text"
                icon="el-icon-plus"
                @click="addRules"
              >为指定地区城市设置运费</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="满额包邮：">
          <el-radio-group v-model="form.is_full_amount">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.is_full_amount==1" label="包邮所需金额：" prop="full_amount">
          <el-input v-model="form.full_amount" type="number" style="width: 200px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitForm('form')">保存</el-button>
          <el-button size="small" @click="()=> this.$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加城市弹框 -->
    <add-city
      :is-show="showAddCity"
      :checked-region="checkedRegion"
      @changeShow="changeAddCity"
      @save="addCitySave"
    />

  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
import AddCity from './components/AddCity'
import { expressApi } from '@/api/system'
export default {
  components: {
    CardTag,
    AddCity
  },
  data() {
    const valid_full_amount = (rule, value, callback) => {
      if (value === '' && this.form.is_full_amount === 1) {
        callback(new Error('请输入满额金额'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      showAddCity: false,
      form: {
        express_template_id: '',
        express_template_name: '', // 模板名称
        express_template_type: 1, // 计费类型 1按件2按重量
        first_number: '', // 首重/件以内 (默认)
        first_amount: '', // 首重/件以内 价格 (默认)
        continue_number: '', // 续重、件以内 (默认)
        continue_amount: '', // 续重，件以内 价格 (默认)
        is_full_amount: 1, // 是否满额包邮 1开启 0 关闭
        full_amount: '', // 满金额
        region_rules: [] // 地区规则
      },
      rules: {
        express_template_name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择计费类型', trigger: 'change' }],
        first_number: [{ required: true, message: '请输入', trigger: 'blur' }],
        first_amount: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        continue_number: [{ required: true, message: '请输入', trigger: 'blur' }],
        continue_amount: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        full_amount: [{ validator: valid_full_amount, trigger: 'blur' }]
      },
      // 操作对象
      target: {
        type: '',
        index: 0
      },
      checkedRegion: [],
      labelWidth: '120px'
    }
  },
  created() {
    this.id = this.$route.query.id ? this.$route.query.id : ''
    if (this.id) {
      this.getDetail(this.id)
    }
  },
  methods: {
    getDetail(id) {
      expressApi.expressDetail({
        express_template_id: id
      }).then(res => {
        console.log(res)
        this.form = res.data
      })
    },
    // 添加模板规则
    addRules() {
      this.form.region_rules.push({
        first_number: 1,
        first_amount: '',
        continue_number: 1,
        continue_amount: ''
      })
    },
    // 删除模板规则
    deleteRules(index) {
      this.form.region_rules.splice(index, 1)
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id !== '') {
            this.form.express_template_id = this.id
            expressApi.editExpress(
              this.form
            ).then(res => {
              this.$message({
                type: 'success',
                message: res.msg || '修改成功!'
              })
              this.$router.go(-1)
            })
          } else {
            expressApi.addExpress(
              this.form
            ).then(res => {
              this.$message({
                type: 'success',
                message: res.msg || '修改成功!'
              })
              this.$router.go(-1)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击编辑城市
    editCity(row, index) {
      this.target.index = index
      this.checkedRegion = row
      this.showAddCity = !this.showAddCity
    },
    changeAddCity(value) {
      this.showAddCity = value
    },
    // 添加城市保存
    addCitySave(data) {
      Object.assign(this.form.region_rules[this.target.index], data)
    }
  }
}
</script>
<style lang="scss" scoped>
.logistic-edit{
  padding: 15px;
  .title-info{
    background: #fff;
    border-radius: 10px 10px;
  }
  .form-info{
    padding: 10px;
    background: #fff;
    .rules-panel{
      padding: 0 10px;
      background: #f5f7fa;
      border: 1px solid #f5f7fa;
      border-radius: 8px;
      box-shadow: 0px 5px 20px #cccccc;
      .rules-defaule{
        padding: 10px 0 20px;
        .el-form-item{
          width: 15%;
        }
        span{
          display: inline-block;
          vertical-align: middle;
        }
        .el-input{
          vertical-align: middle;
        }
      }
      .rules-list{
        background: #fff;
         padding: 10px;
        .rules-list-header{
          border-bottom: 1px solid #f5f7fa;
        }
        .item-content{
          .rules-list-item{
            padding: 10px 0;
            border-bottom: 1px solid #f5f7fa;
            &:hover{
              background: #f5f5f5;
            }
          }
        }
      }
    }
  }
}
</style>
