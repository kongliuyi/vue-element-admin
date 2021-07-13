<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="编码" v-model="listQuery.code">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="名称" v-model="listQuery.name">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                 icon="el-icon-edit">
        新增
      </el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="center" label="ID"></el-table-column>

      <!-- <el-table-column align="center" label="编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="详情">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否启用" align="center" prop="status">
        <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :disabled="scope.row.id === 1"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.status)" />
        </template>
      </el-table-column>  

        <el-table-column align="center" label="显示顺序">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
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
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteDict(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="listQuery.current"
                     :page-sizes="[10, 20, 30, 50]"
                     :page-size="listQuery.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right"
               label-width="120px" status-icon
               style='width: 80%; margin-left:30px;'>

       <!-- <el-form-item label="服务名称" label-width="60px" class="postInfo-container-item" prop="serviceName">
          <el-select v-model="postForm.serviceName" filterable default-first-option remote placeholder="请选择">
             <el-option v-for="item in serviceNameList" :key="item.key"   :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="编码" prop="code">
          <el-input v-model="temp.code" placeholder="请输入字典编码"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入字典名称"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" filterable default-first-option remote placeholder="请选择">
            <el-option v-for="item in dictStatus" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="2" placeholder="请输入描述内容"></el-input>
        </el-form-item>

         <el-form-item label="缓存有效时间" prop="accessValidity">
          <el-input v-model="temp.accessValidity" placeholder="请输入缓存有效时间"></el-input>
        </el-form-item>

        <el-form-item label="显示顺序" prop="order">
          <el-input v-model="temp.order" placeholder="请输入显示顺序"></el-input>
        </el-form-item>

      </el-form>
      <!--对话框动作按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">保存</el-button>
      </div>
    </el-dialog>

  
  </div>
</template>

<script>
  import { queryDict, updateDict, deleteDict, getDict, createDict, getDictByCodes } from '@/api/admin/dict'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'dictManagement',
    directives: {
      waves
    },
    data() {
      return {
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          status: true,
          current: 1,
          size: 10
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        rules: {
          code: [{ required: true, message: '字典编码必填', trigger: 'blur' }],
          name: [{ required: true, message: '字典名称必填', trigger: 'blur' }],
          status: [{ required: true, message: '状态必选择', trigger: 'blur' }],
          sort: [{ required: true, message: '显示顺序必填', trigger: 'blur' }],
          accessValidity: [{ required: true, message: '缓存有效时间必填', trigger: 'blur' }]
        },
        checkAll: false,
        temp: {
          name: '',
          description: ''
        },
        downloadLoading: false,
        dictStatus:[{code: true, name:"启用"},{code: false, name:"禁用"}]
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          deleted: 'info',
          ok: 'success'
        }
        return statusMap[status]
      }
    },
    created() {
      // 获取字典
      //this.queryDictData()

      this.queryDict()
    },
    methods: {
      /**
       * 查询列表
       */
      queryDict() {
        this.listLoading = true
        queryDict(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.queryDict()
      },
      /**
       * 修改每页显示条数
       */
      handleSizeChange(val) {
        this.listQuery.size = val
        this.queryDict()
      },
      /**
       * 跳转到指定页
       */
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.queryDict()
      },

      /**
       * 弹出新增数据字典对话框
       */
      handleCreate() {
        this.temp = {}
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      /**
       * 新增数据字典
       */
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createDict(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '创建成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.queryDict()
            })
          }
        })
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
      /**
       * 更新数据字典
       */
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateDict(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.queryDict()
            })
          }
        })
      },
      /**
       * 数据字典状态更新
       */
      changeEnabled(row, status) {
        // let temp = {}
        // temp.parentId = temp.parentId
        // temp.parentId = temp.parentId
        // temp.status = status
           row.status = status
            updateDict(row).then(() => {
              let title = status ? '已启用' : '已禁用'
              let message = status ? '启用成功' : '禁用成功'
              this.$notify({
                title: title,
                message: message,
                type: 'success',
                duration: 2000
              })
            })
      },
      /**
       * 根据ID删除数据字典
       * @param id
       */
      deleteDict(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDict(id).then(() => {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.queryDict()
          })
        })
      },

      handleDownload() {
        console.log('download')
      }
    }
  }
</script>

