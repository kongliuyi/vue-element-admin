<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">


      <div class="createPost-main-container">


        <el-row>

          <el-col :span="24">      

         <el-form-item label="标题图" prop="imageUri" style="margin-bottom: 40px;" label-width="70px">
          <Upload style="width: 50%;" v-model="postForm.imageUri" />
        </el-form-item>
             


        <!-- <el-form-item label="标题图" style="margin-bottom: 40px;" label-width="70px">
          <div class="imgBody" v-if="postForm.imageUri">
            <i
              class="el-icon-error inputClass"
              v-show="icon"
              @click="deletePhoto()"
              @mouseover="icon = true"
            ></i>
            <img
              @mouseover="icon = true"
              @mouseout="icon = false"
              v-bind:src="postForm.imageUri"
              style="display:inline; width: 195px;height: 105px;"
            >
          </div>
          <div v-else class="uploadImgBody" @click="checkPhoto">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-form-item> -->



            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

         <el-form-item style="margin-bottom: 40px;" label-width="70px" label="摘要:">
             <el-input v-model="postForm.summary" :rows="1" type="textarea" class="article-textarea" autosize placeholder="请输入内容" />
             <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
          </el-form-item>


            <div class="postInfo-container">

              <el-row>
                <el-col :span="4">
                  <el-form-item label="文章类型" label-width="80px" class="postInfo-container-item" prop="type">
                    <el-select v-model="postForm.type" filterable default-first-option remote placeholder="请选择">
                      <el-option v-for="item in blogTypeDictList" :key="+item.code" :label="item.name" :value="+item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item label="文章来源" label-width="80px" class="postInfo-container-item" prop="origin">
                    <el-select v-model="postForm.origin" filterable default-first-option remote placeholder="请选择">
                      <el-option v-for="item in blogOriginalDictList" :key="+item.code" :label="item.name" :value="+item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item label="分类" label-width="60px" class="postInfo-container-item" prop="categoryId">
                    <el-select v-model="postForm.categoryId" filterable default-first-option remote placeholder="请选择">
                      <el-option v-for="item in blogOriginalDictList" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="5">
                  <el-form-item label="标签" label-width="60px" class="postInfo-container-item" prop="blogTagUid">
                    <el-select v-model="tagValue" multiple size="small" placeholder="请选择" filterable>
                      <el-option v-for="item in tagData" :key="item.code" :label="item.content" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->


                <!-- <el-col :span="8">
                  <el-form-item label-width="60px" label="Author:" class="postInfo-container-item">
                    <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="Search user">
                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col> -->

                <!-- <el-col :span="10">
                  <el-form-item label-width="120px" label="Publish Time:" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col> -->



                <!-- <el-col :span="5">
            <el-form-item label="是否发布"  label-width="90px" class="postInfo-container-item" prop="isPublish">
              <el-radio-group v-model="postForm.isPublish" size="small">
                <el-radio v-for="item in blogPublishDictList" :key="item.code" :label="item.name" border>{{item.code}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->



                <!-- <el-col :span="6">
                  <el-form-item label-width="90px" label="Importance:" class="postInfo-container-item">
                    <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                    />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </div>
          </el-col>
        </el-row>



        <el-form-item prop="content " label="内容" style="margin-bottom: 30px;">
           <!-- <tinymce v-model="postForm.content" :height="400" /> -->
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <!-- <el-form-item label="内容" label-width="60px" prop="content">
          <CKEditor  :content="postForm.content" @contentChange="contentChange" :height="400"></CKEditor>
        </el-form-item> -->

        <!-- <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item> -->

        <el-row>
          <el-col :span="5">
            <el-form-item label="是否发布" label-width="90px" class="postInfo-container-item" prop="isPublish">
              <el-radio-group v-model="postForm.isPublish" size="small">
                <el-radio v-for="item in blogPublishDictList" :key="+item.code" :label="+item.code" border>
                  {{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>


          <el-col :span="4.5">
            <el-form-item label="是否置顶" label-width="80px" class="postInfo-container-item" prop="isTop">
              <el-radio-group v-model="postForm.isTop" size="small">
                <el-radio v-for="item in blogTopDictList" :key="+item.code" :label="+item.code" border>
                  {{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="4.5">
            <el-form-item label="网站评论" label-width="120px" class="postInfo-container-item" prop="isOpenComment">
              <el-radio v-for="item in blogOpenCommentDictList" :key="+item.code" v-model="postForm.isOpenComment"
                :label="+item.code" border size="small">{{item.name}}</el-radio>
            </el-form-item>
          </el-col>

        </el-row>

      </div>
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: center;">
      <el-button @click="back">取 消</el-button>
      <el-button type="primary" @click="submitForm">提 交</el-button>
    </div>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import Upload from '@/components/Upload/SingleImage2'
  import MDinput from '@/components/MDinput'
  import Sticky from '@/components/Sticky' // 粘性header组件
 // import CKEditor from "@/components/CKEditor"
  import {  validURL } from '@/utils/validate'
  import { getDictByCodes } from '@/api/admin/dict'
  import { createArticle, getArticle, updateArticle } from '@/api/blog/article'
  import { searchUser } from '@/api/remote-search'
  import { CommentDropdown,  PlatformDropdown,  SourceUrlDropdown } from './Dropdown'

  const defaultForm = {
    //status: 'draft',
    title: '', // 文章题目
    content: '', // 文章内容
    summary: '', // 文章摘要
    //source_uri: '', // 文章外链
    imageUri: '', // 文章图片
    //display_time: undefined, // 前台展示时间
    id: undefined,
    isOriginal: 0, // 是否原创
    isPublish: 0, // 是否发布
    openComment: 0 // 是否启动网站评论
    //platforms: ['a-platform'],
    //comment_disabled: false,
    //importance: 0
  }

  export default {
    name: 'ArticleDetail',
    components: { Tinymce, MDinput, Sticky, CommentDropdown,  PlatformDropdown, SourceUrlDropdown, Upload },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(new Error(rule.field + '为必传项'))
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(new Error('外链url填写不正确'))
          }
        } else {
          callback()
        }
      }
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        formLabelWidth: "120px",
        lineLabelWidth: "120px", //一行的间隔数
        maxLineLabelWidth: "100px",
        userListOptions: [],
        tagData: [], //标签数据
        tagValue: [], //保存选中标签id(编辑时),
        icon: false, //控制删除图标的显示
        interval: null, //定义触发器
        isChange: false, // 表单内容是否改变
        changeCount: 0, // 改变计数器
        blogTypeDictList: [],
        blogOriginalDictList: [],
        blogTopDictList: [],
        blogOpenCommentDictList: [], // 是否启动评论字典
        blogPublishDictList: {}, //博客发布默认值
        rules: {
          image_uri: [{
            validator: validateRequire
          }],
          title: [{
            validator: validateRequire
          }],
          content: [{
            validator: validateRequire
          }],
          source_uri: [{
            validator: validateSourceUri,
            trigger: 'blur'
          }]
        },
        tempRoute: {}
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.summary.length
      },
      displayTime: {
        // set and get is useful when the data
        // returned by the back end api is different from the front end
        // back end return => "2013-06-25 06:59:25"
        // front end need timestamp => 1372114765000
        get() {
          return (+new Date(this.postForm.display_time))
        },
        set(val) {
          this.postForm.display_time = new Date(val)
        }
      }
    },
    created() {
        this.queryDictData() ;
         console.log("this.isEdit):", this.isEdit)
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        console.log("id:", id)
        this.getArticle(id)
      }

      // Why need to make a copy of this.$route here?
      // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
      // https://github.com/PanJiaChen/vue-element-admin/issues/1221
      this.tempRoute = Object.assign({}, this.$route)
    },
    methods: {
      getArticle(id) {
        getArticle(id).then(response => {
          this.postForm = response.data
          this.postForm.id = id;
          // just for test
           //this.postForm.title += `   Article Id:${this.postForm.id}`
           //this.postForm.summary += `   Article Id:${this.postForm.id}`

          // set tagsview title
          this.setTagsViewTitle()

          // set page title
          this.setPageTitle()
        }).catch(err => {
          console.log(err)
        })
      },
      setTagsViewTitle() {
        const title = 'Edit Article'
        const route = Object.assign({}, this.tempRoute, {
          title: `${title}-${this.postForm.id}`
        })
        this.$store.dispatch('tagsView/updateVisitedView', route)
      },
      setPageTitle() {
        const title = 'Edit Article'
        document.title = `${title} - ${this.postForm.id}`
      },
      deletePhoto: function () {
        this.form.photoList = null;
        this.form.fileUid = "";
      },
      back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            console.log('postForm', this.postForm);
            if (this.isEdit) {
        updateArticle(this.postForm).then(() => {
              this.loading = true
              this.$notify({
                title: '修改成功',
                message: '修改文章成功',
                type: 'success',
                duration: 2000
              })
            })

            }else{
          createArticle(this.postForm).then(() => {
              this.loading = true
              this.$notify({
                title: '创建成功',
                message: '创建文章成功',
                type: 'success',
                duration: 2000
              })
            })
          }    
            // this.postForm.status = 'published'
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
        /**
         * 字典查询v
         */
       queryDictData() {
          let codes = 'ARTICLE_TYPE,ARTICLE_ORIGIN,ARTICLE_OPEN_COMMENT,ARTICLE_TOP,ARTICLE_PUBLISH'
            getDictByCodes(codes).then(response => {
               this.blogTypeDictList = response.data.ARTICLE_TYPE.children;
               this.blogOriginalDictList = response.data.ARTICLE_ORIGIN.children;
               this.blogOpenCommentDictList = response.data.ARTICLE_OPEN_COMMENT.children;
               this.blogTopDictList = response.data.ARTICLE_TOP.children;
               this.blogPublishDictList = response.data.ARTICLE_PUBLISH.children;

           })
      },
      // 内容改变，触发监听
      contentChange: function () {
        var that = this;
        if (this.changeCount > 0) {
          that.isChange = true;
          //存放到cookie中，时间10天
          that.form.content = that.$refs.ckeditor.getData(); //获取CKEditor中的内容
          that.form.tagUid = that.tagValue.join(",");
          setCookie("form", JSON.stringify(that.form), 10);
        }
        this.changeCount = this.changeCount + 1;
      },
      //备份form表单
      formBak: function () {
        var that = this;
        that.interval = setInterval(function () {
          if (that.form.title != null && that.form.title != "") {
            //存放到cookie中，时间10天
            that.form.content = that.$refs.ckeditor.getData(); //获取CKEditor中的内容
            that.form.tagUid = that.tagValue.join(",");
            setCookie("form", JSON.stringify(that.form), 10);
          }
        }, 10000);
      },
      draftForm() {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        //this.postForm.status = 'draft'
      },
      getRemoteUserList(query) {
        searchUser(query).then(response => {
          if (!response.data.items) return
          this.userListOptions = response.data.items.map(v => v.name)
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }

</style>
