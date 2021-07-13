<template>
  <div class="app-container">

 <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                v-model="listQuery.name" placeholder="组件名称">
      </el-input>

      <el-button class="filter-item" type="primary" v-btnHas="'menu:search'"   icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" v-btnHas="'menu:add'" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        新增
      </el-button>
    </div>
    
    <!--表格渲染-->
    <el-table  
    :data="list" 
    v-loading.body="listLoading"  
    border fit highlight-current-row style="width: 100%" 
      lazy
      :load="loadNode"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" label="菜单标题"  width="150px" prop="meta.title" />
      <el-table-column prop="meta.icon" label="图标" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.meta && scope.row.meta.icon ? scope.row.meta.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="component" label="组件路径" />
      <el-table-column :show-overflow-tooltip="true" prop="path" label="链接地址" />
      <el-table-column prop="hidden" label="可见" width="75px">
        <template slot-scope="scope">
          <span v-if="scope.row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="90" align="center" label="修改人">
        <template slot-scope="scope">
          <span>{{scope.row.updatedBy}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-btnHas="'menu:modify'" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="danger" size="mini" v-btnHas="'menu:delete'" @click="deleteMenu(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>



        <!--表单渲染-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible" width="580px">
      <el-form ref="dataForm" :inline="true" :model="temp" :rules="rules" size="small" label-width="80px">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="temp.type" size="mini" style="width: 178px">
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
       
        <el-form-item v-show="temp.type === '1'" label="菜单可见" prop="hidden">
          <el-radio-group v-model="temp.hidden" size="mini">
            <el-radio-button label="false">是</el-radio-button>
            <el-radio-button label="true">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.type === '1'" label="菜单标题" prop="title">
          <el-input v-model="temp.meta.title" :style="'width: 178px'" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item v-if="temp.type === '2'" label="按钮名称" prop="title">
          <el-input v-model="temp.meta.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="temp.type === '1'" label="路由地址" prop="path">
          <el-input v-model="temp.path" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number v-model="temp.sort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="temp.type === '1'" label="组件名称" prop="name">
          <el-input v-model="temp.name" style="width: 178px;" placeholder="匹配组件内Name字段" />
        </el-form-item>
        <el-form-item v-show="temp.type === '1'" label="组件路径" prop="component">
          <el-input v-model="temp.component" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item label="上级类目" prop="parentId">
          <treeselect
            v-model="temp.parentId"
            :options="menus"
            :load-options="loadMenus"
            style="width: 450px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" v-btnHas="'menu:create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" v-btnHas="'menu:update'" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryMenu, updateMenu, deleteMenu, getMenu, createMenu, getChildrenMenu }  from '@/api/admin/menu'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS, Treeselect } from '@riophae/vue-treeselect'



export default {
  name: 'Menu',
  components: { Treeselect },
  data() {
    return {
        list: [],
        menus: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10
        },
        props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
 
        },
       temp: {
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        authFormVisible: false,
      rules: {
        title: [
          { required: true, message: '请输入菜单标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.queryMenu()
  },
  methods: {
        /**
       * 查询列表
       */
      queryMenu() {
        this.listLoading = true
        queryMenu(this.listQuery).then(response => {
          this.list = this.mapChildren(response.data.records);
          this.menus =  [{ id: 0, label: '顶级类目', children: this.list }]
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.queryMenu()
      },
      /**
       * 修改每页显示条数
       */
      handleSizeChange(val) {
        this.listQuery.size = val
        this.queryMenu()
      },
      /**
       * 跳转到指定页
       */
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.queryMenu()
      },

      /**
       * 弹出新增菜单列表对话框
       */
      handleCreate() {
        this.temp = {'type': '1', 'meta': {}}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      /**
       * 新增菜单列表
       */
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createMenu(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '创建成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.queryMenu()
            })
          }
        })
      },
       handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      /**
       * 点击更新按钮
       */
      handleUpdate(row) {
        this.temp = Object.assign({}, row);// copy obj
        this.dialogStatus = 'edit';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },

      // handleUpdate(id) {
      //   this.listLoading = true
      //   getMenu(id).then(response => {
      //     this.temp = response.data
      //     this.listLoading = false
      //     this.dialogStatus = 'edit'
      //     this.dialogFormVisible = true
      //   })
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate()
      //   })
      // },
      /**
       * 更新菜单列表
       */
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateMenu(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.queryMenu()
            })
          }
        })
      },
      /**
       * 根据ID删除
       * @param id
       */
      deleteMenu(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu(id).then(() => {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.queryMenu()
          })
        })
      },
    loadNode(tree, treeNode, resolve) {
      console.log("tree:", tree);
      setTimeout(() => {
        getChildrenMenu(tree.id).then(res => {
          resolve(this.mapChildren(res.data))
        })
      }, 100)
    },
     /** 递归树结构*/
    mapChildren(arr) {
      const newArr = []
      arr.forEach(item => {
        if(!item.parentId){
           item.parentId = 0
        }
        const obj = item
        obj.label = obj.meta.title
        obj.children = null
        obj.hasChildren = true
        newArr.push(obj)
      })
      return newArr
    },
    loadMenus({ action, parentNode, callback }) {
      console.log("action:", action === LOAD_CHILDREN_OPTIONS)
      if (action === LOAD_CHILDREN_OPTIONS) {
        getChildrenMenu(parentNode.id).then(res => {
          parentNode.children = res.data.map(function(obj) {
               obj.children = null
               obj.label = obj.meta.title
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
       console.log('action', action === LOAD_CHILDREN_OPTIONS)
    }
  }
}
</script>
