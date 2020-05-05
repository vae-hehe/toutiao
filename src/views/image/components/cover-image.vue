<template>
<div class="cover-image">
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="collect" size="mini" @change="onCollectImages(1)">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button type="success" @click="dialogUploadVisible = true" size="mini" style="float: right" v-if="isShowAdd">上传素材</el-button>
    </div>
    <el-row :gutter="10">
      <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(img,index) in image" :key="index" >
        <div class="img-list">
          <el-image
            style="height: 100px"
            :src="img.url"
            fit="fit"
            @click.native="select = index"
          >
          </el-image>
          <div class="mask" v-if="isShowAction">
            <!-- 使用按钮比较好,可以设置loading -->
            <!-- 收藏 -->
            <el-button type="warning" :class="{'el-icon-star-on': img.is_collected, 'el-icon-star-off': !img.is_collected}" circle size="mini" @click="onChangeCollected(img)" :loading="img.loading"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="onDeleteImage(img)" :loading="img.loading"></el-button>
          </div>
          <div class="select" v-if="isShowSelect && select === index"></div>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:20px"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="loadImages"
      background
      layout="prev, pager, next"
      :total="totalCount">
    </el-pagination>
  <!-- 对话框 -->
  <!-- :modal-append-to-body='false' 可以在遮罩层的上面,但是会在别的元素的下面,最好使用append-to-body -->
  <el-dialog title="上传素材"
   :visible.sync="dialogUploadVisible"
   :append-to-body="true"
   width="26.5%"
  >
    <!-- upload 组件本身支持上传的功能
      请求的方式是 POST
      请求的路径是 action 必须写完整的路径
      请求头 headers
      必须有上传的文件字段名 name
    -->
    <el-upload
      class="upload-demo"
      drag
      name="image"
      action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
      :headers="UploadHeaders"
      :show-file-list="true"
      :on-success="uploadSuccessImage"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-dialog>
</div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'CoverImage',
  components: {},
  props: {
    isShowAdd: {
      type: Boolean,
      default: true
    },
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      image: [], // 图片
      currentPage: 1, // 当前显示的页码数,从默认第一页开始
      pageSize: 10, // 每页图片的条数
      totalCount: 0, // 总条数
      dialogUploadVisible: false, // 对话框
      UploadHeaders: { // 请求头
        Authorization: `Bearer ${user.token}`
      },
      select: null // 设置图片都不被选中
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1)
  },
  mounted () {},
  methods: {
    loadImages (page = 1) {
      // 解决筛选之后的页码高亮问题(收藏)
      // 重置高亮页码,防止数据和页码不对应
      this.currentPage = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // 把loading加入到img属性中,本来没有,使的加载的时候,不是所有图片都加载
        const results = res.data.data.results
        results.forEach(img => {
          img.loading = false
        })
        this.image = results
        this.totalCount = res.data.data.total_count
      })
    },
    // 收藏和全部按钮的切换
    onCollectImages (value) {
      this.loadImages(value)
    },
    // 上传文件成功之后
    uploadSuccessImage () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 刷新图片列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '图片上传成功'
      })
    },
    // 收藏图片
    onChangeCollected (img) {
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        if (img.is_collected) {
          this.loadImages()
          this.$message({
            type: 'success',
            message: '收藏成功'
          })
        } else {
          this.loadImages()
          this.$message({
            type: 'success',
            message: '取消收藏成功'
          })
        }
        img.loading = false
      })
    },
    // 删除图片
    onDeleteImage (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadImages(this.currentPage)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        img.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.img-list {
  position: relative;
}
.mask {
  position: absolute;
  bottom: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 25px;
  background: rgba(1, 1, 1, .3);
  z-index: 10000;
}
.select {
    background: url(./selected.png) no-repeat;
    background-size: cover;
    max-width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
