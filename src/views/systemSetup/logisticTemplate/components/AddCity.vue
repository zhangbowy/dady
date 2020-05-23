<template>
  <div class="add-city">
    <el-dialog title="城市选择" :visible.sync="isShow" :before-close="hiddenDialog" @close="hiddenDialog">
      <div class="content">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="search-box">
              <el-input
                v-model="filterText"
                size="small"
                placeholder="输入关键字进行过滤"
              />
            </div>
            <el-tree
              ref="cityTree"
              :data="cityModal.cityTree"
              :props="cityModal.treeProp"
              :default-expanded-keys="defaultExpandedLeft"
              node-key="id"
              show-checkbox
              class="filter-tree"
              :default-checked-keys="defaultChecked"
              :filter-node-method="filterNode"
              @check-change="handleCheckChange"
            />
          </el-col>
          <el-col :span="12">
            <div class="checked-citys">
              <el-tree
                ref="checkedTree"
                :data="cityModal.showTree"
                :props="cityModal.treeProp"
                :default-expanded-keys="defaultExpanded"
                node-key="id"
              >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button
                      type="text"
                      size="mini"
                      class="el-icon-delete"
                      @click.stop="() => remove(node, data)"
                    />
                  </span>
                </span>
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="chooseCityConfirm">确 定</el-button>
        <el-button size="mini" @click="hiddenDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import getCityData from '@/api/common'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    checkedRegion: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterText: '',
      defaultChecked: [],
      defaultExpandedLeft: [],
      defaultExpanded: [],
      // 城市树形
      cityModal: {
        cityTree: [],
        treeProp: {
          label: 'name',
          children: 'children'
        },
        showTree: []
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.cityTree.filter(val)
    },
    checkedRegion: {
      deep: true,
      handler(newValue) {
        setTimeout(() => {
          this.$refs.cityTree.setCheckedKeys(newValue)
        })
      }
    }
  },
  created() {
    this.getCityData()
  },
  methods: {
    // 请求城市列表
    getCityData() {
      getCityData().then(res => {
        this.cityModal.cityTree = res.data
      })
    },
    // 关键词过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 右侧删除
    remove(node, data) {
      console.log(node)
      console.log(data)
      this.defaultExpanded = []
      // 判断是不是父元素
      if (data.pid !== 100000) {
        const parent = node.parent
        // 判断子元素是否只剩最后一个
        if (parent.data.children.length === 1) {
          console.log(1)
          this.$refs.cityTree.setChecked(parent.data.id, false, true)
        } else {
          console.log(2)
          this.$refs.cityTree.setChecked(data.id, false)
          this.defaultExpanded.push(node.parent.data.id)
          this.defaultExpandedLeft.push(node.parent.data.id)
        }
      } else {
        console.log(3)
        this.$refs.cityTree.setChecked(data.id, false, true)
      }
    },
    // 城市选择
    handleCheckChange(node) {
      // 获取所有选中元素
      const allCheckNode = this.$refs.cityTree.getCheckedNodes()
      this.cityModal.showTree = []
      // 获取半选中元素
      const halfCheckNode = this.$refs.cityTree.getHalfCheckedNodes()
      for (const item of halfCheckNode) {
        if (item.pid === 100000) {
          this.cityModal.showTree.push(Object.assign({}, item, { children: [], isHalf: true }))
        }
      }
      for (const item of allCheckNode) {
        if (item.pid === 100000) {
          this.cityModal.showTree.push(Object.assign({}, item, { children: [] }))
        } else {
          for (const obj of this.cityModal.showTree) {
            if (obj.id === item.pid) {
              obj.children.push(Object.assign({}, item))
            }
          }
        }
      }
    },
    chooseCityConfirm() {
      let str = ''
      for (const item of this.cityModal.showTree) {
        if (item.isHalf) {
          for (const child of item.children) {
            str += `${child.name},`
          }
        } else {
          str += `${item.name},`
        }
      }
      this.$emit('save', { region: this.$refs.cityTree.getCheckedKeys(), city_show: str.substring(0, str.length - 1) })
      this.$emit('changeShow', false)
      this.getCityData()
      this.cityModal.showTree = []
    },
    hiddenDialog() {
      this.$emit('changeShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .checked-citys{
    border-radius: 5px;
    padding: 5px;
    border: 1px solid #409eff
  }
</style>
