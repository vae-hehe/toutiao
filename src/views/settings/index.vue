<template>
<div class="settings-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10">
      <el-col :xs="20" :sm="16" :md="16" :lg="14">
        <!-- 表单 -->
        <el-form ref="user-form" :model="user" label-width="80px" :rules="userRules">
          <el-form-item label="编号">
            {{ user.id }}
          </el-form-item>
          <el-form-item label="手机">
            {{ user.mobile }}
          </el-form-item>
          <el-form-item label="媒体名称" prop="name">
            <el-input v-model="user.name" placeholder="请填写媒体名称"></el-input>
          </el-form-item>
          <el-form-item label="媒体介绍" prop="intro">
            <el-input type="textarea" v-model="user.intro" placeholder="请填写媒体介绍"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.email" placeholder="请填写邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitSettings" :loading="loading">保存设置</el-button>
          </el-form-item>
        </el-form>
        <!-- /表单 -->
      </el-col>
       <el-col :xs="4" :sm="8" :md="8" :lg="10">
        <label for="file" class="head-file">
          <el-image
          class="head"
          :src="user.photo"
          fit="fit"/>
          <p>点击更换头像</p>
        </label>
        <!--
          更换头像的步骤是:
          一: 预览图片
          1.给图片框和p标签绑定input的file上传功能,使用label绑定input的id,可以实现
          2.上传图片时候,就会触发input的change事件(当输入框的内容发生改变的时候触发),此时编辑函数 onFileChange ,但是在函数中,如果上传的文件和上一次的文件一样,input的事件就不会被触发,所以要修改 先获取input的DOM元素,改变value值 this.$refs.file.value = '' 这样每次上传文件都会触发
          3.完成了图片上传,但是不能看不到,此时就需要预览图片(显示对话框,展示图片):
            a: 展示弹出层:this.dialogVisible = true, 设置弹出层在蒙版上面 append-to-body
            b: 在对话框中预览图片: 由于不能确定预览的图片是谁,所以,自定义属性:src=previewImage,获取图片的地址
            const file = this.$refs.file.files[0]
            const blobData = window.URl.createObjectURL(file) 得到的是url 就是图片的src
            this.previewImage = bobData 赋值给previewImage就是把url赋值给src ,就能显示图片

            二: 裁切图片
            1.找到cropperjs文档,根据文档先下载包
            2.将图片包裹在盒子中,设置样式
            3.引入包和css,复制粘贴初始化裁切器的代码
            4.裁切器的代码要初始化在完全打开状态的对话框中,因为图片在对话框中,必须在img 完全可见的状态下才能进行初始化,此时需要,对话框完全打开  事件@opened="onDialogOpened"
            5.但是初始化完成之后有一个问题,就是更换完一个图片之后,再换别的图片的时候,图片不会切换
            6.解决办法: 销毁裁切器 destroy 或者使用替换方法 裁切器.replace(新的url)
            7.使用的cropper,需要在data中初始化,在opened中定义this.cropper,在closed中使用this.cropper.destroy 或者 在opened中 if (this.cropper) {
              this.cropper.relace(this.previewImage)
              return
            }
            8.配置选项
            9.提交裁切结果,更新头像 使用cropper的方法(文档) this.cropper.getCroppedCanvas().toBlob(file => {
              const fd = new FormData()
              fd.append('photo', file)  提交给后端
              接口(fd).then(res => {
                this.dialogVisible = false  关闭对话框
                this.user.photo = window.URL.createObjectURL(file)  直接传裁切好的图片,更快
                或者
                this.user.photo = res.data.data.photo 后台返回的数据
              })
            })

            文件上传,把用户的文件对象发送给后端,发送之后马上拿到,需要监听input的change事件
            1.获取DOM元素 const file = this.$refs.file
            2.获取文件对象(在file属性里面) const fileObj = file.files[0]
            3.然后把文件放到FormData中提交给后端
            const fd = new FormData()
            如果是图片文件,处理图片预览
            const blob = window.URL.createObjectURL(fileObj)
            blob数据可以直接赋值给图片的src预览展示
            this.previewImage = blob(vue中)
            document.querySelector('#img).src = blob (在js中)
        -->
        <!-- change 仅在输入框失去焦点或用户按下回车时触发 -->
        <input
          ref="file"
          type="file"
          id="file"
          hidden
          @change="onFileChange"
        >
      </el-col>
    </el-row>
  </el-card>
  <!-- 点击上传头像之后,出现对话框 -->
  <!-- @opened="onDialogOpened" 完全打开的状态才能初始化裁切器,这个时候才有图片的完整状态 -->
  <el-dialog
    title="修改头像"
    :visible.sync="dialogVisible"
    append-to-body
    @opened="onDialogOpened"
    @closed="onDialogClosed"
  >
    <!-- 将图片放到块级元素里面 -->
    <div class="preview-image-wrap">
      <!-- 需要预览的图片 -->
      <img
        :src="previewImage"
        class="preview-image"
        ref="preview-image"
      >
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onUpdatePhoto" :loading="onPhotoLoading">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import { getUserProfile, edituserProfile, editUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        id: null,
        mobile: '',
        name: '',
        intro: '',
        email: ''
      },
      // 表单验证
      userRules: {
        name: [
          { required: true, message: '请填写媒体名称', tigger: 'blur' },
          { min: 1, max: 7, message: '请填写1到7个字之间的媒体名称', tigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请填写媒体介绍', tigger: 'blur' },
          {
            // 自定义规则
            validator (rule, valid, callback) {
              if (!valid) {
                callback(new Error('请填写媒体名称'))
              }
              callback()
            }
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', tigger: 'blur' },
          { pattern: /^\w+@\w+(\.\w+)+$/, message: '请输入正确的邮箱', tigger: 'blur' }
        ]
      },
      loading: false, // 设置点击保存是的加载问题
      dialogVisible: false, // 对话框状态
      previewImage: '',
      cropper: null, // 裁切器实例
      onPhotoLoading: false // 头像loading
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    // 加载个人设置模块
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    // 提交表单
    onSubmitSettings () {
      this.loading = true
      // 表单验证
      this.$refs['user-form'].validate(async valid => {
        if (!valid) {
          // 验证失败
          return this.$message('表单验证失败')
        }
        // 表单验证成功
        try {
          const res = await edituserProfile(this.user)
          this.$message({
            type: 'success',
            message: '保存设置成功'
          })
          this.loading = false
          // 更新头部文字
          globalBus.$emit('update-user', this.user)
        } catch (err) {
          this.$message({
            type: 'danger',
            message: '保存设置失败'
          })
          this.loading = false
        }
      })
    },
    // 修改头像,放输入框内的数据改变的时候触发,实现图片预览
    onFileChange () {
      editUserPhoto().then(res => {
        // 显示弹出层,预览图片,在有文件时使用FormData
        // 处理图片预览
        const file = this.$refs.file

        // 得到的url就是图片src
        const bolbData = window.URL.createObjectURL(file.files[0])

        this.previewImage = bolbData

        // 显示弹出层
        this.dialogVisible = true

        // 解决选择相同文件不触发的input change事件
        this.$refs.file.value = ''
      })
    },
    // 必须在dialog完全打开的时候才能初始化裁切器
    onDialogOpened () {
      // 图片裁切器必须基于 img 进行初始化
      // 注意: img 必须是可见状态才能进行初始化
      // 因为要初始化裁切器,所以一定要在对话框完全打开的状态才行
      // 获取image的DOM节点
      const image = this.$refs['preview-image']

      // 第1次初始化裁切器之后, 如果预览裁切的图片发生了变化,裁切器默认不会更新
      // 如果需要预览图片变化,更新裁切器
      // 方式一: 裁切器.replace() 效率高一点
      // 方式二: 销毁裁切器,重新初始化
      // 初始化裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        // 裁切框的大小
        aspectRatio: 1,
        // 限制裁切框不要超出画布大小
        viewMode: 1,
        // 不能移动画布
        dragMode: 'none',
        // 不允许改变裁切器的大小
        cropBoxResizable: false

        // 移动裁切器的时候会触发
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 对话框关闭,销毁裁切器
      // this.cropper.destroy()
    },

    // 封装Promise
    // 1.创建一个函数
    getCroppedCanvas () {
      // 2. 直接返回一个new的Promise对象
      return new Promise((resolve, reject) => {
        // 3.执行异步操作
        // 4.成功resolve(如果成功要把结果放这里),失败reject
        this.cropper.getCroppedCanvas().toBlob(file => {
          // 成功
          resolve(file)
        })
      })
    },

    // 更新头像
    async onUpdatePhoto () {
      this.onPhotoLoading = true
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      // 提交给后端
      fd.append('photo', file)
      // 请求更新用户头像
      const res = await editUserPhoto(fd)
      // 关闭对话框
      this.dialogVisible = false
      // 更新视图展示
      // 直接把裁切结果的对象转成blob
      // 这个头像就是裁切的头像file
      this.user.photo = window.URL.createObjectURL(file)

      // 把服务端的图片进行展示 有点慢
      // this.user.photo = res.data.data.photo
      this.$message({
        type: 'success',
        message: '更换头像成功'
      })
      this.onPhotoLoading = false
      // 更新头部的头像
      globalBus.$emit('update-user', this.user)
    }
  }
}
</script>

<style scoped lang="less">
.head-file {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.head {
  width: 150px;
  height: 150px;
  border: 1px solid #ccc;
}
.preview-image-wrap {
  /* Ensure the size of the image fit the container perfectly */
  // 确保图片在预览的时候占满整个框,但是框要有高度
  .preview-image {
      display: block;
      /* This rule is very important, please don't ignore this */
      max-width: 100%;
      height: 200px;
  }
}
</style>
