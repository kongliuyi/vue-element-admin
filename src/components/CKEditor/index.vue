<template>
  <div class="app-container">
    <!-- <textarea id="editor" rows="10" cols="80"></textarea> -->
       <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" rows="10" cols="80"></ckeditor>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn' //中文包
export default {
  name: 'CKEditor',
  props: ["content", "height"],
  mounted() {
    var that = this;

   // this.editor.setData(this.content); //初始化内容

    // 一秒钟通知子组件，ckeditor中内容改变
    // that.editor.on('change', function( event ) {
    //   that.timeout = setTimeout(function() {
    //     that.fun();
    //   }, 1000);
    // });

  },
  created() {
    this.textData = this.content;

  },
  watch: {
    content: function() {
      this.textData = this.content;
    }
  },
  data() {
    return {
      editor: null, //编辑器对象
      textData: this.content, //初始化内容
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
                    // The configuration of the editor.
                }
    }
  },
  methods: {

  }
}

</script>
