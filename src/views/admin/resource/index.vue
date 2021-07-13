<template>
  <div class="app-container">

    <div class="filter-container" >
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称"
        v-model="listQuery.name">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源类型"
        v-model="listQuery.type">
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
      <el-table-column width="180px" align="center" label="资源代码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="资源类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="资源名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="请求地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="请求方式">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="简介">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
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

      <el-table-column width="160px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="90" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.createdBy}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="deleteData(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加或编辑对话框-->
    <el-dialog title="新增/修改" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="120px" status-icon
        style='width: 80%; margin-left:30px;'>
        <el-form-item label="资源代码" prop="code">
          <el-input v-model="temp.code" placeholder="请输入资源代码"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-input v-model="temp.type" placeholder="请输入资源类型"></el-input>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <el-input v-model="temp.url" placeholder="请输入请求地址"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="temp.method" filterable default-first-option remote placeholder="请选择">
            <el-option v-for="item in dictRequestMethod" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="2" placeholder="请输入描述内容"></el-input>
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
  import {
    queryResource,
    createResource,
    updateResource,
    deleteResource,
    getResource
  } from '@/api/admin/resource'
  import { getDictByCodes } from '@/api/admin/dict'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'resourceManagement',
    directives: {
      waves
    },
    data() {
      return {
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          status: 'ok',
          current: 1,
          size: 10
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        authFormVisible: false,
        rules: {
          code: [{
            required: true,
            message: '资源代码必填',
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '资源类型必填',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '资源名称必填',
            trigger: 'blur'
          }],
          url: [{
            required: true,
            message: '请求地址必填',
            trigger: 'blur'
          }],
          method: [{
            required: true,
            message: '请求方式必填',
            trigger: 'blur'
          }]
        },
        checkAll: false,
        isIndeterminate: true,
        temp: {
          code: '',
          type: '',
          name: '',
          url: '',
          method: '',
          description: ''
        },
        downloadLoading: false,
        dictRequestMethod:[]
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
      this.queryResource()
      this.queryDictData()
    },
    methods: {
      /**
       * 查询列表
       */
      queryResource() {
        this.listLoading = true
        queryResource(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.queryResource()
      },
      /**
       * 修改每页显示条数
       */
      handleSizeChange(val) {
        this.listQuery.size = val
        this.queryResource()
      },
      /**
       * 跳转到指定页
       */
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.queryResource()
      },

      /**
       * 弹出新增资源对话框
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
       * 新增资源
       */
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createResource(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '创建成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.queryResource()
            })
          }
        })
      },
      /**
       * 点击更新按钮
       */
      handleUpdate(row) {
        this.temp = Object.assign({}, row); // copy obj
        this.dialogStatus = 'edit';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      /**
       * 更新资源
       */
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateResource(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.queryResource()
            })
          }
        })
      },
      /**
       * 删除资源
       * @param id
       */
      deleteData(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteResource(id).then(() => {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.queryResource()
          })
        })
      },
      /**
       * 获取字典数据
       */
      queryDictData() {
         let codes = 'REQUEST_METHOD'
            getDictByCodes(codes).then(response => {
               this.dictRequestMethod = response.data.REQUEST_METHOD.children
            })
      },
      handleDownload() {
        console.log('download')
      }
    }
  }

</script>
