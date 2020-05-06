<template>
<div class="publish-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.query.id ? '编辑文章' : '发布文章' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 表单 -->
    <el-form ref="form" :model="article" label-width="60px" :rules="formRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        <el-tiptap
          v-model="article.content"
          :extensions="extensions"
          placeholder="请输入文章内容"
        />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-radio-group v-model="article.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自定义</el-radio>
        </el-radio-group>
        <!-- template不占位置 -->
        <template v-if="article.cover.type > 0">
          <upload-cover v-for="(cover, index) in article.cover.type" :key="index" v-model="article.cover.images[index]"></upload-cover>
        </template>
      </el-form-item>
      <el-form-item label="频道" prop="channel_id">
        <el-select v-model="article.channel_id" placeholder="请选择频道">
          <el-option v-for="(channel,index) in channels" :key="index" :label="channel.name" :value="channel.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish(false)">发布</el-button>
        <el-button @click="onPublish(true)">存为草稿</el-button>
      </el-form-item>
    </el-form>
    <!-- /表单 -->
  </el-card>
</div>
</template>

<script>
import { getArticleChannels, publishArticle, editArticl, getEditArticle } from '@/api/article'
import { uploadImages } from '@/api/image'
// import this package's styles
import 'element-tiptap/lib/index.css'
import {
  // necessary extensions 重要的扩展
  ElementTiptap,
  Doc,
  Text,
  Paragraph, // 前三个是必须的
  Heading, // 标题文字
  Bold, // 加粗
  Underline, // 下划线
  Italic, // 斜体
  Strike, // 删除线
  Image,
  ListItem,
  BulletList, // 无序列表
  OrderedList, // 有序列表
  CodeBlock,
  Fullscreen, // 全屏
  Preview
} from 'element-tiptap'
// 绑定上传封面的路由
import UploadCover from './components/upload-cover'
export default {
  name: 'PublishIndex',
  components: {
    // 局部注册
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
      article: {
        title: '',
        content: '',
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      channels: [], // 文章频道列表
      // editor extensions
      // they will be added to menubar and bubble menu by the order you declare.
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }), // 5级标题
        new Bold({ bubble: true }), // render command-button in bubble menu. 在气泡菜单中渲染菜单按钮
        new Underline(),
        new Italic(),
        new Strike(), // 删除线
        new Image({
          // 自定义图片上传
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            // 调用接口
            return uploadImages(fd).then(res => {
              return res.data.data.url
            })
          }
        }), // 图片,注意的是需要转换成链接的地址
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new CodeBlock(), // 代码块,文本块
        new Fullscreen(),
        new Preview() // 预览
      ],
      // 验证规则
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', tigger: 'blur' },
          { min: 5, max: 30, message: '请输入字数大于5小于30的文章标题', tigger: 'blur' }
        ],
        content: [
          {
            // 自定义规则
            validator (rule, valid, callback) {
              if (valid === '<p></p>') {
                callback(new Error('请输入文章内容'))
              }
              callback()
            }
          },
          { required: true, message: '请输入文章的内容', tigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择频道' }
        ]
      }
    }
  },
  methods: {
    // 获取文章频道列表
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 发布文章
    onPublish (draft = false) {
      // 验证表单内容
      this.$refs.form.validate(async value => {
        if (!value) {
          // 表单验证失败
          return
        }
        // 判断是编辑文章还是发布文章
        const articleId = this.$route.query.id
        if (articleId) {
          // 有id就是编辑文章
          const res = await editArticl(articleId, this.article, draft)
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$router.push('/article')
          return
        }
        // 表单验证成功 ,提交表单
        const res = await publishArticle(this.article, draft)
        this.$message({
          type: 'success',
          message: `${draft ? '存为草稿' : '发布成功'}`
        })
        this.$router.push('/article')
      })
    },
    // 获取指定文章,渲染界面
    getAticle () {
      getEditArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()

    // 判断加载是不是编辑界面
    if (this.$route.query.id) {
      this.getAticle()
    }
  },
  mounted () {}
}
</script>

<style scoped lang="less"></style>
