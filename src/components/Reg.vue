<template>
  <div id="reg">
    <h3>欢迎来到寒来暑往</h3>
    <el-form :model="regForm" status-icon :rules="rules" ref="regForm" class="demo-ruleForm">
      <el-form-item prop="account">
        <el-input
          type="string"
          placeholder="输入您的账号"
          prefix-icon="el-icon-user"
          autofocues
          v-model.number="regForm.account"></el-input>
      </el-form-item>
      <el-form-item prop="mail">
        <el-input
          v-model="regForm.mail"
          placeholder="邮箱地址"
          prefix-icon="el-icon-mail"
          autofocus
          auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="密码"
          prefix-icon="el-icon-lock"
          v-model="regForm.password"
          auto-complete="off"></el-input>
      </el-form-item>
        <div class="row">
          <div class="validate-code">
            <el-input
              v-model="validate_code"
              placeholder="验证码"
              prefix-icon="el-icon-message"
              @keyup.native.enter="submitForm('regForm')"
            ></el-input>
          </div>
          <div class="validate">
            <el-button :disabled="getCodeStatus" :loading="loading" type="info" plain @click="getValiCode('regForm')">{{ getCodeBtn }}</el-button>
          </div>
        </div>
        <div class="row" id="row-text">
          <el-checkbox v-model="agreement">
            <a id="agreement">
              我已经看过条款并什么都同意
            </a>
          </el-checkbox>
        </div>
      <el-form-item id="submit-btn-box">
        <el-button type="primary" plain @click="submitForm('regForm')">注册 / 登录</el-button>
      </el-form-item>
    </el-form>
    <div id="third-party">
      <div id="third-party-title">OR</div>
      <div id="third-party-box">
        <a>
          第三方登录功能正在开发中
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import getApiPath from '../utils/getApiPath'
  import getTimestamp from '../utils/getTimestamp'
  import { mapActions } from 'vuex'

  export default {
    name: "Reg",
    data() {
      var checkAccount = (rule, value, callback) => {
        value = value + '';

        var start = /\d/; //匹配开头数字
        var reg = /^\w+$/; //匹配不能含有非法字符

        if (value === '') {
          callback(new Error('请输入要创建的账户'));
        } else if( start.test(value.charAt(0)) ){
          callback(new Error('账户名不能以数字开头'))
        } else if( value.length > 15) {
          callback(new Error('账户名长度过长'))
        } else if( value.length < 4) {
          callback(new Error('账户名过短'));
        } else if(!reg.test(value)){
          callback(new Error('账户名含有特殊字符'))
        } else{
            Axios.get(getApiPath('reg/userquery/' + value))
              .then((res) => {
                if(res.status === 200) callback(new Error('该账户已被使用'));
                else callback();
              })
              .catch((err) => {
                callback(new Error('无法连接到服务器'));
              });
        }
      };
      var checkMail = (rule, value, callback) => {

        if(localStorage.getItem('mail'))
          if(localStorage.getItem('mail') !== this.regForm.mail)
            if(localStorage.getItem("validate_code")) {
              localStorage.removeItem("mail");
              localStorage.removeItem("validate_code");
            }

        var reg = /^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/;
        if (value === '') {
          callback(new Error('请输入邮箱地址'));
        } else if ( !reg.test(value) ){
          callback(new Error('邮箱地址格式不正确'));
        } else{
          Axios.get(getApiPath('reg/mailquery/' + value ))
            .then((res) => {
              if(res.status === 200) callback(new Error('该邮箱已被使用'));
              else callback();
            })
            .catch((err) => {
              callback(new Error('无法连接到服务器'));
            });
        }
      };
      var checkPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if( value.length < 6){
          callback(new Error('密码长度过短'));
        } else{
          callback();
        }
      };
      return {
        loading: false,
        validate_code: '',
        agreement: false,
        getCodeBtn: '获取验证码',
        getCodeStatus: false,
        regForm: {
          account: '',
          password: '',
          mail: ''
        },
        rules: {
          account: [
            { validator: checkAccount, trigger: 'blur' }
          ],
          mail: [
            { validator: checkMail, trigger: 'blur' }
          ],
          password: [
            { validator: checkPass, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      ...mapActions(['changeIsLogin', 'changeAccount', 'changeTimestamp', 'changeAccessToken']),
      getValiCode(formName){
        this.$refs[formName].validate((valid) => {
            if(valid){
              //disable the button 1 minute
              this.getCodeStatus = true;
              var time = 60;
              this.getCodeBtn = '处理中';
              this.loading = true;


              Axios.post(getApiPath('reg/validate'), {'mail' : this.regForm.mail })
                .then( (res)=> {
                  if(res.status === 200){
                    localStorage.setItem('validate_code', btoa(res.data['validate_code']));
                    localStorage.setItem('mail', this.regForm.mail);

                    this.$message.info('验证码已发送到您的邮箱');
                    this.loading = false;

                    var timer = setInterval(() => {
                      time--;
                      this.getCodeBtn = time + ' s';
                      if(time === 0){
                        clearTimeout(timer);
                        this.getCodeStatus = false;
                        this.getCodeBtn = '获取验证码';
                      }
                    }, 1000);

                  } else {
                    this.$message.error('获取验证码失败');
                    this.loading = false;
                  }
                })
                .catch( (err) =>{
                  this.$message.error('获取验证码失败');
                  this.loading = false;
                });
            }else{
              return false;
            }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if( !this.agreement ){
            this.$message.info('您要先同意我们的条款协议哦');
            return false;
          } else if( this.validate_code === ''){
            this.$message.error('请输入验证码');
            return false;
          } else if( this.validate_code.length != 6){
            this.$message.error('验证码错误');
            return false;
          } else if( this.validate_code !== atob(localStorage.getItem('validate_code'))){
            this.$message.error('验证码错误');
            return false;
          }else if (valid) {
            var userinfo = btoa(JSON.stringify({
              account: this.regForm.account,
              passwd: this.regForm.password,
              email: this.regForm.mail,
              timestamp: getTimestamp()
            }));

            Axios.post(getApiPath('reg/register'), {userinfo})
              .then((res) => {
                if(res.status === 200){
                  Axios.post(getApiPath('login/userinfo'), {userinfo})
                    .then( (res) => {
                      if(res.status === 200){

                         this.changeAccount({ 'account': this.regForm.account });
                         this.changeIsLogin({ 'isLogin': true});
                        //  localStorage.setItem('account', this.userInfo.account);
                        //  localStorage.setItem('islogin', true);
                         this.changeTimestamp({ 'timestamp': res.data['timestamp']});
                         this.changeAccessToken({ 'accessToken': res.data['accessToken']});

                        Axios.defaults.headers.common['authorization'] = localStorage['accessToken'];
                        this.$message({
                           type: 'success',
                           duration: 1500,
                           message: '注册成功'
                         });

                        // this.$router.push('/home');
                        document.getElementById("/home").click();

                      } else {
                        this.$message.error('密码错误');
                        return false;
                      }
                    });
                } else {
                  this.$message.error('注册失败');
                  return false;
                }
              })
              .catch( (err) => {
                  this.$message.error('注册失败，请检查网络连接');
              });
          } else {
            this.$message.error('注册失败，请检查网络连接');
            return false;
          }
        });
      }
    },
  }
</script>

<style scoped>
  #reg{
    height: 100%;
    padding: 0 70px;
  }
  #third-party{
    margin-top: 20px;
  }
  #third-party-title{
    position: relative;
    text-align: center;
    color: #cacaca;
  }
  #third-party-title:before{
    left: 0;
    right: 60%;

  }
  #third-party-title:after{
    left: 60%;
    right: 0;
  }

  #third-party-title:after, #third-party-title:before {
    content: "";
    display: inline-block;
    position: absolute;
    border-top: 1px solid #cacaca;
    top: 48%
  }

  #third-party-box{
    padding: 20px;
    color: #cacaca;
    text-align: center;
  }

  h3{
    font-weight: 400;
    padding-top: 40px;
    color: #333;
    font-size: 28px;
    text-align: center;
    margin-top: 0;
  }
  .row{
    justify-content: space-between;
    margin: 15px auto;
    color: #999;
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    position: relative;
  }

  #submit-btn-box{
    position: relative;
    margin: auto;
    width: 100%;
    padding-top: 0;
  }
  .el-button--primary, .el-button--info{
    width: 100%;
  }
  #reg{
    padding: 0 70px;
  }
  .validate {
    width: 38%;
  }
  .validate-code{
    width: 58%;
  }
</style>
