<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="文章类型" v-model="listQuery.type">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                placeholder="置顶" v-model="listQuery.top">
      </el-input>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

       <router-link :to="'/blog/article/create'">
     <el-button class="filter-item" style="margin-left: 10px;"  type="primary" icon="el-icon-edit">
                新增
            </el-button>
       </router-link>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="center" label="ID"></el-table-column>
      <el-table-column width="180px" align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="来源">
        <template slot-scope="scope">
          <span>{{scope.row.origin}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="阅读数">
        <template slot-scope="scope">
          <span>{{scope.row.readCount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="置顶">
        <template slot-scope="scope">
          <span>{{scope.row.top}}</span>
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
            <router-link :to="'/blog/article/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
               修改
            </el-button>
          </router-link>
          <el-button type="danger" size="mini" @click="deleteArticle(scope.row.id)">
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
  </div>
</template>

<script>
import { searchArticle, updateArticlee, deleteArticle, getArticle } from '@/api/blog/article'
import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: 'articleManagement',
    directives: {
      waves
    },
    data() {
      return {
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 10
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
      this.searchArticle()
    },
    methods: {
      /**
       * 查询列表
       */
      searchArticle() {
        this.listLoading = true
        searchArticle(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.current = 1
        this.searchArticle()
      },
      /**
       * 修改每页显示条数
       */
      handleSizeChange(val) {
        this.listQuery.size = val
        this.searchArticle()
      },
      /**
       * 跳转到指定页
       */
      handleCurrentChange(val) {
        this.listQuery.current = val
        this.searchArticle()
      },

      /**
       * 删除文章
       * @param id
       */
      deleteArticle(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(id).then(() => {
            this.$notify({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchArticle()
          })
        })
      },

      handleDownload() {
        console.log('download')
      }
  }
}
</script>

