<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="分类名称" v-model="listQuery.name">
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

      <el-table-column width="180px" align="center" label="分类名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="分类名称简介">
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
          <el-button type="danger" size="mini" @click="deleteCategory(scope.row.id)">
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类简介" prop="description">
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
  import { searchCategory, updateCategory, deleteCategory, getCategory, createCategory } from '@/api/blog/category'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'categoryManagement',
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
          name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
        },
        checkAll: false,
        resources: [],
        isIndeterminate: true,
        temp: {
          name: '',
          description: ''
        },
        downloadLoading: false
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
      this.searchCategory()
    },
    methods: {
      /**
       * 查询列表
       */
      searchCategory() {
        this.listLoading = true
        searchCategory(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.searchCategory()
      },
      /**
       * 修改每页显示条数
       */
      handleSizeChange(val) {
        this.listQuery.size = val
        this.searchCategory()
      },
      /**
       * 跳转到指定页
       */
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.searchCategory()
      },

      /**
       * 弹出新增分类对话框
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
       * 新增分类
       */
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createCategory(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '创建成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.searchCategory()
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
       * 更新分类
       */
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateCategory(this.temp).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: '编辑成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
              this.searchCategory()
            })
          }
        })
      },
      /**
       * 删除分类
       * @param id
       */
      deleteCategory(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCategory(id).then(() => {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchCategory()
          })
        })
      },

      handleDownload() {
        console.log('download')
      }
    }
  }
</script>

