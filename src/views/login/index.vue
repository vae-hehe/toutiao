<template>
<div class="login-container">
  <el-form ref="form" :model="user" class="form" :rules="rules">
    <div class="form-login">
        <img src="./logo_index.png" class="logo">
    </div>
    <el-form-item prop="mobile">
      <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
    </el-form-item>
    <el-form-item prop="agree">
      <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button :loading="loginLoading" type="primary" @click="onLogin()" class="form-btn">登录</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { Login } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: '',
        agree: false
      },
      // checked: false,
      loginLoading: false,
      rules: {
        mobile: [
          // pattern正则表达式
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3|5|6|9]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'change' }
        ],
        agree: [
          // 自定义验证规则
          // 验证通过: callback()
          // 验证失败: callback(new Error('错误信息'))
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选同意'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          // 验证成功
          this.login()
        } else {
          // 验证失败
          return false
        }
      })
    },
    login () {
      // 登录之前,loginLoading开启
      this.loginLoading = true
      // 登录
      Login(this.user).then(res => {
        console.log(res)
        // 登录成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 登录成功之后,将token储存到本地存储中
        // 本地存储中只存储字符串
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 登陆成功之后,关闭
        this.loginLoading = false
        // 成功之后跳转到home
        // this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('登录失败')
        // 登陆成功之后,关闭
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container{
    height: 100%;
    background: url('./login_bg.jpg') no-repeat;
    background-size: cover;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .form{
        min-width: 300px;
        padding: 20px 40px;
        background-color: #fff;
        .logo{
            width: 240px;
            margin-left: 30px;
            margin-bottom: 10px;
        }
        .form-btn{
            width: 100%;
        }
    }
}
</style>
