<template>
<div class="login-container">
  <el-form ref="form" :model="form" class="form">
    <div class="form-login">
        <img src="./logo_index.png" class="logo">
    </div>
    <el-form-item>
      <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" class="form-btn">登录</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        mobile: '',
        code: '',
        checked: ''
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSubmit () {
      console.log('submit!')
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
