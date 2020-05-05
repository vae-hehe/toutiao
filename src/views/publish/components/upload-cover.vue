<template>
<div class="upload-cover">
  <div class="cover-image" @click="isShowDialog">
      <img :src="value" alt="" class="coverImage" ref="upload-image">
  </div>
  <el-dialog
    title="上传素材"
    :visible.sync="dialogVisible"
    append-to-body
  >
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="素材库" name="first">
        <cover-image ref="cover-image" style="width:100%" :is-show-add='false' :is-show-action='false' is-show-select></cover-image>
      </el-tab-pane>
      <el-tab-pane label="上传图片" name="second" class="preview-image-wrap">
        <!-- 获取input的change事件 -->
        <input type="file" ref="file" @change="onChangeImage">
        <!-- 预览图片的位置 -->
        <img :src="previewImage" class="preview-image">
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onUploadImage">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import { uploadImages } from '@/api/image'
import coverImage from '@/views/image/components/cover-image'
export default {
  name: 'UploadCover',
  components: {
    coverImage
  },
  props: ['value'],
  data () {
    return {
      dialogVisible: false, // 对话框隐藏,不显示
      activeName: 'first',
      previewImage: '' // 要预览的图片
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    isShowDialog () {
      this.dialogVisible = true
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 当input改变的时候触发的事件
    onChangeImage () {
      // 获取file文件DOM
      const file = this.$refs.file
      // 获取文件对象
      const fileObj = file.files[0]
      // 获取blob 图片的url
      const blob = window.URL.createObjectURL(fileObj)
      // 预览图片
      this.previewImage = blob
      // 解决当改变一次图片第二再上传相同的不会改变的问题
    //   this.$refs.file.value = ''
    },
    // 点击确定上传图片
    onUploadImage () {
      // 判断是不是上传图片模块,是不是有图片
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        const fd = new FormData()
        fd.append('image', file)
        uploadImages(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 显示图片
          this.$refs['upload-image'].src = res.data.data.url

          // 父子通信
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 上传图片
        // 组价之间通信方式, 父组件直接访问子组件的数据
        const coverImage = this.$refs['cover-image']
        console.log(coverImage)
        // 就是选中的图片的索引
        const select = coverImage.select
        if (select === null) {
          this.$message('请选择图片')
          return
        }
        // 关闭弹出层
        this.dialogVisible = false
        // 显示图片
        this.$emit('input', coverImage.image[select].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cover-image {
    width: 120px;
    height: 150px;
    border: 1px solid #ccc;
    .coverImage {
        max-width: 100%;
        height: 150px;
    }
}
.preview-image-wrap {
    display: flex;
    flex-direction: column;
    .preview-image {
        width: 100px;
        height: 150px;
        margin-top: 10px;
    }
}
</style>
