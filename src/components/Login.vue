<template>
  <div id="login">
    <h3>欢迎来到寒来暑往</h3>
    <div id="login_form">
      <el-form :model="userInfo" status-icon :rules="rules" ref="userInfo" class="demo-ruleForm">
          <el-form-item label="账号" prop="account">
            <el-input
                      prefix-icon="el-icon-user" autofocues
                      placeholder="输入您的用户名"
                      v-model="userInfo.account"
                      auto-complete="off">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="passwd">
            <el-input
              type="password"
              prefix-icon="el-icon-lock"
              v-model.number="userInfo.passwd"
              placeholder="输入您的密码"
              @keyup.native.enter="submitForm('userInfo')">
            </el-input>
          </el-form-item>
        <div class="row">
          <a id="register-text">还没有账号？
            <span @click="gotoReg" style="cursor: pointer">去注册</span>
          </a>
          <a id="forget" style="cursor: pointer">忘记密码？</a>
        </div>
        <el-form-item id="submit-btn-box">
          <el-button type="primary" @click="submitForm('userInfo')" plain>登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
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
  import Axios from 'axios';
  import getApiPath from '../utils/getApiPath';
  import getTimestamp from '../utils/getTimestamp';
  import { mapActions, mapGetters } from 'vuex';
  import validate_login from "../utils/valiLogin";


    export default {
        name: "Login",
        data(){
            var validateAccount = (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入您的账户'));
              } else {
                Axios.get(getApiPath('login/userquery/' + value))
                  .then((res) => {
                    if(res.status !== 200) callback(new Error('请输入正确的账户'));
                    else callback();
                  })
                  .catch((err) => {
                    callback(new Error('无法连接到服务器'));
                  });
              }
            };
            return {
              userInfo: {
                account: '',
                passwd: ''
              },
              rules: {
                account: [
                  { validator: validateAccount, trigger: 'blur' }
                ]
              }
            };
        },
        computed: {
          ...mapGetters(['getAccessToken'])

        },
        methods: {
          ...mapActions(['changeIsLogin', 'changeAccount', 'changeTimestamp', 'changeAccessToken']),

          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.userInfo.passwd === ''){
                  this.$message({
                    message: '请输入您的密码',
                    type: 'warning'
                  });
                  return false;
                }

                var userinfo = btoa(JSON.stringify({
                    account: this.userInfo.account,
                    passwd: this.userInfo.passwd,
                    timestamp: getTimestamp()
                }));
                Axios.post(getApiPath('login/userinfo'), {userinfo})
                     .then( (res) => {
                       if(res.status === 200){
                        //  for( let prop in res.data){
                          //  localStorage.setItem(prop, res.data[prop]);
                        //  }

                         for( let prop in res.data['userinfo'])
                           localStorage.setItem(prop, res.data['userinfo'][prop]);


                         this.changeAccount({ 'account': this.userInfo.account });
                         this.changeIsLogin({ 'isLogin': true});
                        //  localStorage.setItem('account', this.userInfo.account);
                        //  localStorage.setItem('islogin', true);
                         this.changeTimestamp({ 'timestamp': res.data['timestamp']});
                         this.changeAccessToken({ 'accessToken': res.data['accessToken']});

                         Axios.defaults.headers.common['authorization'] = localStorage['accessToken'];

                         this.$message({
                           type: 'success',
                           duration: 1500,
                           message: '登录成功，欢迎回来~'
                         });

                         document.getElementById("/home").click();
                         //  this.$router.push('/home');

                         Axios.get(getApiPath('/login/collections'))
                              .then( (res) => {
                                  localStorage.setItem('collections', JSON.stringify(res.data['collections']));
                              })
                              .catch( () => {
                                  this.$message({
                                    type: 'error',
                                    duration: 1500,
                                    message: '获取单词集失败，请检查网络连接'
                                  });
                                  localStorage.setItem('collections', JSON.stringify([ ]) );
                              });


                       } else {
                         this.$message.error('密码错误');
                         return false;
                       }
                     });
              }
            });
          },
          gotoReg(){
            this.$store.dispatch('changeClicked', {data: '/reg'});
            this.$router.push('/log_reg/reg');
          }
        },
        beforeMount: function(){
          // localStorage.clear();
          // Default navigation behavior
  if(localStorage['accessToken'] != '' && localStorage['accessToken'] != null && localStorage['accessToken'] != undefined) {
            // Set the authorization
            Axios.defaults.headers.common['authorization']
              = localStorage['accessToken'];
            Axios.get(getApiPath('login/auth'))
              .then((res) => {
                if(res.status === 200) {
                  this.$message({
                    type: 'warning',
                    duration: 1500,
                    message: '您已经登录，无需重复登录'
                  });
                  this.$router.go(-1);
                }
              });
          } else{
                localStorage.clear();
                this.$store.dispatch('resetState');

                this.$store.commit('setClicked', {data: '/login'})
                delete Axios.defaults.headers.common['authorization'];
          }
        }
    }
</script>

<style scoped>
  #login{
    height: 100%;
    padding: 0 70px;
  }
  #third-party{
    margin-top: 40px;
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
    margin: 20px 0;
    color: #999;
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    position: relative;
  }
  #register-text{
    float: left;
    font-size: 16px;
    color: #999;
    text-decoration: none;
  }
  #register-text span{
    color: #51A8DD;
  }
  #forget{
    float: right;
    color: #51A8DD;
    text-decoration: none;
    font-size: 16px;
  }
  .el-button--primary{
    width: 100%;
  }
</style>
