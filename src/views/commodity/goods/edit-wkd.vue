<template>
  <div class="goods-edit">
    <div class="title-info">
      <card-tag :tag-name="id!=''? '编辑商品': '新增商品'" />
    </div>
    <!-- 表单部分 -->
    <div class="form-info">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="1">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top" size="small">
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="基本信息" /></div>
              <div class="block-content">
                <el-form-item label="商品标题" prop="title">
                  <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="商品原价" prop="price">
                  <el-input v-model="form.price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品现价" prop="cur_price">
                  <el-input v-model="form.cur_price">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品图片">
                  <!-- <el-input v-model="form.stock">
                <template slot="append">件</template>
              </el-input> -->
                  <img-upload
                    :img-data="form.image_path"
                    :pic-max="picMax"
                    @chooseImg="imageChoose"
                    @changePsit="changeImg"
                  />
                </el-form-item>
                <el-form-item label="商品库存">
                  <el-input v-model="form.stock">
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="基础销量">
                  <el-input v-model="form.basicSales">
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="region">
                  <el-select v-model="form.region" multiple placeholder="请选择商品分类" style="width: 50%">
                    <el-option label="手机" value="1" />
                    <el-option label="箱包" value="2" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="商品规则" /></div>
              <div class="block-content" />
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="物流信息" /></div>
              <div class="block-content">
                <el-form-item label="物流设置">
                  <el-radio-group v-model="form.logisticsType">
                    <el-radio :label="0" style="margin-right: 0">统一运费： </el-radio>
                    <el-input v-model="form.freight" style="width: 25%; margin-right: 30px">
                      <template slot="append">元</template>
                    </el-input>
                    <el-radio :label="1">包邮</el-radio>
                    <el-radio :label="2" style="margin-right: 0">物流模板：  </el-radio>
                    <el-select v-model="form.logistics" placeholder="请选择物流模板" :disabled="form.logisticsType!=2">
                      <el-option label="顺丰速运" value="1" />
                      <el-option label="圆通快递" value="2" />
                    </el-select>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="form-content-item">
              <div class="block-title"><card-tag tag-name="商品详情" /></div>
              <el-form-item>
                <mavon-editor ref="editor" v-model="form.detail" @save="saveDetail" @change="updateDetail" />
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品规格" name="2">
          <el-form :model="form" label-width="150px" :inline-message="true">
            <el-form-item label="商品规格：" prop="otherWeb">
              <div v-for="(item,index) in form.sku_show" :key="index" class="m-custom-box">
                <el-row v-if="form.sku_show.length>0">
                  <div
                    v-if="!is_bp"
                    style="position:absolute;right:10px;cursor:pointer;z-index:1001"
                    @click="deleteSpcifications(index)"
                  >
                    <el-button icon="el-icon-error" circle size="mini" style="cursor:pointer" />
                  </div>
                  <el-form-item label="规格名：" prop="property_name">
                    <template>
                      <el-select
                        v-model="item.property_name"
                        style="width:150px;margin-right:10px;"
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请输入规格名"
                        size="small"
                        :disabled="is_bp"
                        @focus="showproperty(index)"
                        @change="(v)=>{propertyChange(v,index)}"
                      >
                        <el-option
                          v-for="listItem in loading.propertyList"
                          :key="listItem.property_id"
                          :label="listItem.property_name"
                          :value="listItem.property_name"
                        />
                      </el-select>
                    </template>
                    <i
                      v-if="index>0"
                      class="el-icon-delete"
                      @click.stop="deleteSpcifications(index)"
                    />
                  </el-form-item>
                </el-row>
                <el-row v-if="form.sku_show.length>0">
                  <el-form-item label="规格值：" prop="values">
                    <div v-for="(smallItem,smallIndex) in item.values" :key="smallIndex">
                      <el-col :span="6">
                        <el-select
                          v-model="smallItem.name"
                          style="width:150px;margin-right:10px;"
                          filterable
                          allow-create
                          default-first-option
                          placeholder="请输入规格值"
                          :disabled="is_bp"
                          size="small"
                          @focus="showpropertyValue(index,smallIndex)"
                          @change="(v)=>{propertyValueChange(v,index,smallIndex)}"
                        >
                          <el-option
                            v-for="listItem in loading.propertyValueList[index]"
                            :key="listItem.property_value_id"
                            :label="listItem.property_value"
                            :value="listItem.property_value"
                          />
                        </el-select>
                        <!-- sku图片 -->
                        <i
                          v-if="!is_bp"
                          class="el-icon-delete"
                          @click.stop="deleteSpcificationsitem(smallIndex,index)"
                        />
                        <ImgUp
                          v-if="index==0"
                          :ref="'imgUp'+smallIndex"
                          style="margin-top:10px;"
                          :pic-max="1"
                          modal="one"
                          :is-bp="is_bp"
                          @imgSelected="(v)=>{selectedImg(v,smallIndex)}"
                        />
                      </el-col>
                    </div>
                    <el-col v-if="!is_bp" :span="6">
                      <el-button
                        v-if="!is_bp"
                        type="text"
                        size="small"
                        class="addSpeci"
                        @click.stop="addSpcificationsitem(index)"
                      >添加规格值</el-button>
                    </el-col>
                  </el-form-item>
                </el-row>
              </div>
              <el-row>
                <el-button
                  v-if="!is_bp"
                  size="mini"
                  :disabled="form.sku_show.length>6"
                  @click.stop="addSpcifications"
                >添加规格项目</el-button>
              </el-row>
            </el-form-item>
            <el-form-item label="规格明细：">
              <div v-if="form.sku_show.length>0" class="m-custom-box">
                <table style="width:100%; text-align:center">
                  <tr style="padding:0">
                    <th
                      v-for="(item,index) in form.sku_show"
                      :key="index"
                      style="width:10%"
                      v-html="item.property_name"
                    />
                    <th>
                      <span class="requireStar">*</span>价格（元）
                    </th>
                    <th>
                      <span class="requireStar">*</span>库存
                    </th>
                    <th>规格编码</th>
                    <th v-if="issupplier">供货价</th>
                    <th>成本价</th>
                    <th style="width:10%">销量</th>
                    <th width="60px">会员价格</th>
                    <th
                      v-if="ischannel && form.commission.is_channel_commission_type==1"
                      width="60px"
                    >渠道商价格</th>
                  </tr>
                  <tr v-for="(item,index) in form.sku_list" :key="index">
                    <!-- <td v-if="item['props_'+SmallIndex].show_name" v-html="item['props_'+SmallIndex].show_name" v-for="(SmallItem,SmallIndex) in form.sku_show" :rowspan="form.sku_show[SmallIndex]?form.sku_show[SmallIndex].rowspan:0" :key="SmallIndex"></td> -->
                    <!--item.props_0&&item.props_0.show_name  form.sku_show[0].rowspan form.sku_show[1].rowspan form.sku_show[2].rowspan-->
                    <td
                      v-if="1"
                      :rowspan="form.sku_show[0]?1:0"
                      v-html="item.props_0.show_name"
                    />
                    <td
                      v-if="(item.props_1&&item.props_1.show_name) || (item.props_2&&item.props_2.show_name) || (item.props_3&&item.props_3.show_name) || (item.props_4&&item.props_4.show_name)"
                      :rowspan="form.sku_show[1]?1:0"
                      v-html="item.props_1.show_name"
                    />
                    <td
                      v-if="(item.props_2&&item.props_2.show_name) || (item.props_3&&item.props_3.show_name) || (item.props_4&&item.props_4.show_name)"
                      :rowspan="form.sku_show[2]?1:0"
                      v-html="item.props_2.show_name"
                    />
                    <td
                      v-if="(item.props_3&&item.props_3.show_name) || (item.props_4&&item.props_4.show_name)"
                      :rowspan="form.sku_show[3]?1:0"
                      v-html="item.props_3.show_name"
                    />
                    <td
                      v-if="item.props_4&&item.props_4.show_name"
                      :rowspan="form.sku_show[4]?1:0"
                      v-html="item.props_4.show_name"
                    />
                    <td>
                      <!-- 价格 -->
                      <el-form-item
                        :prop="'sku_list['+index+'].price'"
                        :rules="rules.item_price"
                        label-width="0"
                      >
                        <el-input
                          v-model="item.price"
                          class="detailInput"
                          size="mini"
                          @keyup.native="PositiveFloatNumBer(item,'price')"
                          @change.native="changePrice(item.price)"
                        />
                      </el-form-item>
                    </td>
                    <td>
                      <!-- 库存 -->
                      <el-form-item
                        :prop="'sku_list['+index+'].num'"
                        :rules="rules.item_num"
                        label-width="0"
                      >
                        <el-input
                          v-model="item.num"
                          class="detailInput"
                          size="mini"
                          :disabled="is_bp"
                          @keyup.native="onlyPositiveNumBer(item,'num')"
                        />
                      </el-form-item>
                    </td>
                    <td>
                      <!-- 规格编码 -->
                      <el-form-item label-width="0">
                        <el-input
                          v-model="item.sku_no"
                          class="detailInput"
                          size="mini"
                          :disabled="is_bp"
                        />
                      </el-form-item>
                    </td>
                    <td v-if="issupplier">
                      <!-- 供货价 -->
                      <el-form-item label-width="0">
                        <el-input
                          v-model="item.supplier_price"
                          class="detailInput"
                          size="mini"
                          :disabled="is_bp"
                          @keyup.native="PositiveFloatNumBer(item,'supplier_price')"
                        />
                      </el-form-item>
                    </td>
                    <td>
                      <!-- 成本价 -->
                      <el-form-item label-width="0">
                        <el-input
                          v-model="item.original_price"
                          class="detailInput"
                          size="mini"
                          :disabled="is_bp"
                          @keyup.native="PositiveFloatNumBer(item,'original_price')"
                        />
                      </el-form-item>
                    </td>
                    <td>{{ item.sales_num?item.sales_num:0 }}</td>
                    <!-- 会员添加按钮 -->
                    <td>
                      <el-button type="text" @click="moneyVip(item,index)">添加</el-button>
                    </td>
                    <!-- 渠道商添加按钮 -->
                    <td>
                      <el-button
                        v-if="ischannel && form.commission.is_channel_commission_type==1"
                        type="text"
                        @click="priceVi(item,index)"
                      >添加</el-button>
                    </td>
                  </tr>
                  <el-dialog title="会员价格" :visible.sync="moneyVips" width="400px">
                    <div>
                      <el-form ref="form" label-width="120px">
                        <el-form-item
                          v-for="(item,i) in temp_user_price"
                          :key="item.rank_id"
                          :label="item.rank_name+'：'"
                        >
                          <el-input
                            :key="i"
                            v-model="temp_user_price[i].price"
                            style="width:90%"
                          />
                          <span style="margin-left:10px;">元</span>
                        </el-form-item>
                      </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="moneyVips = false">取 消</el-button>
                      <el-button type="primary" @click="sureEditSkuVip()">确 定</el-button>
                    </span>
                  </el-dialog>

                  <el-dialog title="渠道商价格" :visible.sync="priceVip" width="400px">
                    <div>
                      <el-form ref="form" label-width="120px">
                        <el-form-item :label="this.form.channel_alias.alias1+'：'">
                          <el-input v-model="tempForm.modelPrice.modelPrice1" style="width:90%" />
                          <span style="margin-left:10px;">元</span>
                        </el-form-item>
                        <el-form-item :label="this.form.channel_alias.alias2+'：'">
                          <el-input v-model="tempForm.modelPrice.modelPrice2" style="width:90%" />
                          <span style="margin-left:10px">元</span>
                        </el-form-item>
                        <el-form-item :label="this.form.channel_alias.alias3+'：'">
                          <el-input v-model="tempForm.modelPrice.modelPrice3" style="width:90%" />
                          <span style="margin-left:10px">元</span>
                        </el-form-item>
                        <el-form-item
                          v-show="form.is_show_channel_level"
                          :label="this.form.channel_alias.alias4+'：'"
                        >
                          <el-input v-model="tempForm.modelPrice.modelPrice4" style="width:90%" />
                          <span style="margin-left:10px">元</span>
                        </el-form-item>
                        <el-form-item
                          v-show="form.is_show_channel_level"
                          :label="this.form.channel_alias.alias5+'：'"
                        >
                          <el-input v-model="tempForm.modelPrice.modelPrice5" style="width:90%" />
                          <span style="margin-left:10px">元</span>
                        <!-- v-model="form.sku_list.modelPrice.modelPrice5" -->
                        </el-form-item>
                      </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="priceVip = false">取 消</el-button>
                      <el-button type="primary" @click="sureEditSku()">确 定</el-button>
                    </span>
                  </el-dialog>
                </table>
                <div>
                  <span>批量设置：</span>
                  <span v-if="!SetModal">
                    <el-button type="text" size="small" @click="SetModal='price'">价格</el-button>
                    <el-button v-if="!is_bp" type="text" size="small" @click="SetModal='num'">库存</el-button>
                    <el-button
                      v-if="issupplier && !is_bp"
                      type="text"
                      size="small"
                      @click="SetModal='supplier_price'"
                    >供货价</el-button>
                    <el-button
                      v-if="!is_bp"
                      type="text"
                      size="small"
                      @click="SetModal='cost_price'"
                    >成本价</el-button>
                    <el-button
                      type="text"
                      style="margin-right:10px;"
                      @click="vipsAllset = true"
                    >会员价格</el-button>
                    <el-dialog title="会员价格" :visible.sync="vipsAllset" width="30%">
                      <div>
                        <el-form ref="form" label-width="120px">
                          <el-form-item
                            v-for="(item,i) in allSetvalue"
                            :key="item.rank_id"
                            :label="item.rank_name+'：'"
                            style="margin-bottom:10px"
                          >
                            <el-input :key="i" v-model="item.price" style="width:90%" />
                            <span style="margin-left:10px;">元</span>
                          </el-form-item>
                        </el-form>
                      </div>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="vipsAllset = false">取 消</el-button>
                        <el-button type="primary" @click="setAllVip()">确 定</el-button>
                      </span>
                    </el-dialog>
                    <el-button
                      v-if="ischannel && form.commission.is_channel_commission_type==1"
                      type="text"
                      @click="priceVips = true"
                    >渠道商价格</el-button>
                    <el-dialog title="渠道商价格" :visible.sync="priceVips" width="30%">
                      <div>
                        <el-form ref="form" label-width="120px">
                          <el-form-item
                            style="margin-bottom:10px"
                            :label="this.form.channel_alias.alias1+'：'"
                          >
                            <el-input
                              v-model="tempForm.modelPrice.modelPrice1"
                              style="width:90%;"
                            />
                            <span style="margin-left:10px;">元</span>
                          </el-form-item>
                          <el-form-item
                            style="margin-bottom:10px"
                            :label="this.form.channel_alias.alias2+'：'"
                          >
                            <el-input
                              v-model="tempForm.modelPrice.modelPrice2"
                              style="width:90%"
                            />
                            <span style="margin-left:10px">元</span>
                          </el-form-item>
                          <el-form-item
                            style="margin-bottom:10px"
                            :label="this.form.channel_alias.alias3+'：'"
                          >
                            <el-input
                              v-model="tempForm.modelPrice.modelPrice3"
                              style="width:90%"
                            />
                            <span style="margin-left:10px">元</span>
                          </el-form-item>
                          <el-form-item
                            v-show="form.is_show_channel_level"
                            style="margin-bottom:10px"
                            :label="this.form.channel_alias.alias4+'：'"
                          >
                            <el-input
                              v-model="tempForm.modelPrice.modelPrice4"
                              style="width:90%"
                            />
                            <span style="margin-left:10px">元</span>
                          </el-form-item>
                          <el-form-item
                            v-show="form.is_show_channel_level"
                            style="margin-bottom:10px"
                            :label="this.form.channel_alias.alias5+'：'"
                          >
                            <el-input
                              v-model="tempForm.modelPrice.modelPrice5"
                              style="width:90%"
                            />
                            <span style="margin-left:10px">元</span>
                          <!-- v-model="form.sku_list.modelPrice.modelPrice5" -->
                          </el-form-item>
                        </el-form>
                      </div>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="priceVips = false">取 消</el-button>
                        <el-button type="primary" @click="sureEditSkus()">确 定</el-button>
                      </span>
                    </el-dialog>
                  </span>
                  <span v-if="SetModal">
                    <el-input
                      v-model="SetValue"
                      style="width:66px;margin:0 10px;"
                      type="number"
                      size="small"
                    />
                    <el-button type="text" size="small" @click="SetAll">保存</el-button>
                    <el-button type="text" size="small" @click="cancalSetAll">取消</el-button>
                  </span>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CardTag from '@/components/CardTag'
import { mavonEditor } from 'mavon-editor' // 富文本编辑器
import ImgUpload from '@/components/ImgUpload'
export default {
  components: {
    CardTag,
    mavonEditor,
    ImgUpload
  },
  data() {
    const originalSkuListItem = {
      sku_id: '',
      property_value_id: '',
      sales_num: null,
      price: null,
      modelPrice: {
        modelPrice1: '',
        modelPrice2: '',
        modelPrice3: '',
        modelPrice4: '',
        modelPrice5: ''
      },
      num: null,
      sku_no: null,
      original_price: null,
      supplier_price: null,
      props_0: {
        property_id: '',
        property_name: '',
        value_id: '',
        value_name: '',
        show_name: ''
      },
      props_1: {
        property_id: '',
        property_name: '',
        value_id: '',
        value_name: '',
        show_name: ''
      },
      props_2: {
        property_id: '',
        property_name: '',
        value_id: '',
        value_name: '',
        show_name: ''
      },
      props_3: {
        property_id: '',
        property_name: '',
        value_id: '',
        value_name: '',
        show_name: ''
      },
      props_4: {
        property_id: '',
        property_name: '',
        value_id: '',
        value_name: '',
        show_name: ''
      }
    }
    return {
      id: '',
      picMax: 15,
      activeName: '1',
      is_bp: false,
      loading: {
        GroupList: [],
        CategoryList: [],
        propertyList: [],
        propertyValueList: [],
        freightList: [],
        userRank: [],
        supplierList: []
      },
      issupplier: false,
      ischannel: false,
      priceVip: false,
      moneyVips: false,
      temp_user_price: [],
      tempForm: {
        modelPrice: {
          modelPrice1: '',
          modelPrice2: '',
          modelPrice3: '',
          modelPrice4: '',
          modelPrice5: ''
        }
      },
      tempForms: {
        modelPrice: {}
      },
      SetModal: '',
      vipsAllset: false,
      allSetvalue: [],
      priceVips: false,
      form: {
        title: '', // 标题
        price: '', // 原价
        cur_price: '', // 当前价格
        stock: '', // 库存
        image_path: [],
        basicSales: '', // 基础销量
        region: [],
        date1: '',
        date2: '',
        logisticsType: 0, // 物流类型
        freight: '', // 运费
        logisticsTemplate: '', // 物流模板id
        detail: '',
        channel_alias: [],
        sku_show: [],
        sku_list: [originalSkuListItem]
      },
      rules: {
        title: [
          { required: true, message: '请输入商品', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        price: [
          { type: 'number', required: true, message: '请输入原价', trigger: 'blur' }
        ],
        cur_price: [
          { type: 'number', required: true, message: '请输入现在价', trigger: 'blur' }
        ],
        region: [
          { type: 'array', required: true, message: '请至少选择一个分类', trigger: 'change' }
        ]
      }

    }
  },
  created() {
    this.id = this.$route.query.id ? this.$route.query.id : ''
  },
  methods: {
    onSubmit() {
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    updateDetail(markdown, html) {
      // 此时会自动将 markdown 和 html 传递到这个方法中
      console.log('markdown内容: ' + markdown)
      console.log('html内容:' + html)
    },
    saveDetail(markdown, html) {
      // 此时会自动将 markdown 和 html 传递到这个方法中
      console.log('markdown内容:' + markdown)
      console.log('html内容:' + html)
    },
    // 图片上传模块
    imageChoose(imgArray) {
      this.form.image_path = []
      if (imgArray.length > 0) {
        const that = this
        imgArray.forEach(item => {
          // 这里的this指向前面对象的this
          that.form.image_path.push(item)
        })
        // imgArray.forEach(item => {
        //   // 这里的this指向前面对象的this
        //   that.form.image_path.push(item.image_path);
        // });
      }
      this.$refs.form.validateField('image_path')
      // this.imageModalConfig.visible = false;
    },
    // 拖拽后触发
    changeImg(val) {
      this.form.image_path = val
    },
    addSpcifications() {
      const obj = this.form.sku_show
      const id = 'add' + new Date().getTime()
      const property_invented_id = 'addSSku' + new Date().getTime()
      this.form.sku_list.forEach(item => {
        const property_value_id = item.property_value_id
          ? item.property_value_id.split(',')
          : []
        property_value_id.push(id)
        item.property_value_id = property_value_id.join(',')
      })
      if (obj.length === 0) {
        this.$set(this.form.sku_show, 0, {
          property_name: '',
          property_id: '',
          property_invented_id: property_invented_id,
          values: [
            {
              id: '',
              inventedId: id,
              name: null,
              img: null
            }
          ],
          rowspan: null
        })
      } else if (obj.length < 5 && obj.length !== 0) {
        obj.push({
          property_name: '',
          property_id: '',
          property_invented_id: property_invented_id,
          values: [
            {
              id: '',
              inventedId: id,
              name: null,
              img: null
            }
          ],
          rowspan: null
        })
      }
    },
    // 商品规格-规格值增，减
    deleteSpcificationsitem(index, parentId) {
      let obj = this.form.sku_show[parentId].values
      const newSkuList = []
      const key = obj[index].id || obj[index].inventedId
      if (obj.length > 1) {
        this.form.sku_list.forEach((item, i) => {
          if (item['props_' + parentId].value_id !== key) {
            newSkuList.push(item)
          }
        })
        this.form.sku_list = JSON.parse(JSON.stringify(newSkuList))
        obj = obj.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-edit{
  padding: 15px;
  .title-info{
    background: #fff;
    border-radius: 10px 10px;
  }
  .form-info{
    padding: 10px;
    background: #fff;
    .form-content-item{
      margin-bottom: 20px;
      box-shadow: 0px 10px 20px #f3f4f3;
      .block-content{
        padding: 20px 50px;
        background: #fff;
        .el-input{
          width: 50%;
        }
      }
    }
  }
}
</style>

<style lang="scss">
    .m-custom-box {
      padding: 0 10px;
      .el-row:nth-child(odd) {
        padding-top: 7px;
        background-color: #fff;
      }
    }
    .addSpeci {
      margin-left: 10px;
    }
    .breadMenu {
      padding: 15px 15px 0;
      margin-bottom: 20px;
    }
    .block-form {
      width: 80%;
    }
    .form-title {
      margin: 20px 0 10px;
      padding: 10px;
      background-color: #f8f8f8;
      font-size: 14px;
      font-weight: 700;
    }
    .beforeClass {
      &:before {
        content: "";
        display: inline-block;
        width: 3px;
        height: 12px;
        position: relative;
        top: 1px;
        background: #f60;
        margin-right: 5px;
      }
    }
    .goods-type-box {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      padding: 8px 0;
      width: 115px;
      line-height: 16px;
      border: 1px solid #cacaca;
      border-radius: 2px;

      cursor: pointer;
      &.active {
        position: relative;
        border: 1px solid #38f;
        i {
          position: absolute;
          bottom: 4px;
          right: 4px;
          color: #38f;
        }
        span {
          color: #38f;
        }
      }
      .row {
        text-align: center;
        // .goods-type-name {
        // }
        .goods-type-name.active {
          color: #38f;
        }
        .send-type {
          color: #999;
        }
      }
    }
    .show-more-panel {
      .tips {
        margin-left: 24px;
        color: #999;
      }
      .tips1 {
        color: #999;
        font-size: 12px;
      }
    }
    .tips {
      font-size: 12px;
      color: #999;
    }
    .m-search-box {
      text-align: left;
    }
    .m-btn-box {
      text-align: left;
      margin: 20px 0;
      .searchBtn {
        margin-left: 130px;
      }
      .moreBtn {
        margin-left: 10px;
      }
    }
    .u-two-input {
      display: flex;
      .input {
        width: 80px;
      }
    }

    .el-dialog .el-form-item.form {
      margin-right: 50px;
    }
    .dialog-btn-center {
      text-align: center;
    }
</style>

