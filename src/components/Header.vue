
<template>
  <div class="header">
    <el-menu
      :default-active="this.$route.path"
      mode="horizontal"
      class="el-menu-vertical-demo"
      :router="true"
      style="align-items: center; text-align: center"
    >

      <el-menu-item disabled index="logo">
        <img src="../assets/logo2.png" style="height: 32px;"/>
      </el-menu-item>

        <el-menu-item index="/home" id="/home">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/plan">
          <i class="el-icon-date"></i>
          <span slot="title">计划</span>
        </el-menu-item>
        <el-menu-item index="/recite">
          <i class="el-icon-location-outline"></i>
          <span slot="title">背诵</span>
        </el-menu-item>
        <el-menu-item index="/review">
          <i class="el-icon-location"></i>
          <span slot="title">复习</span>
        </el-menu-item>
        <el-menu-item index="/exam">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">考核</span>
        </el-menu-item>
        <el-menu-item index="/personal">
          <i class="el-icon-setting"></i>
          <span slot="title">自定义</span>
        </el-menu-item>
        <el-menu-item index="/favorite">
          <i class="el-icon-star-off"></i>
          <span slot="title">收藏夹</span>
        </el-menu-item>
        <el-menu-item index="/help">
          <i class="el-icon-share"></i>
          <span slot="title">帮助</span>
        </el-menu-item>



      <el-popover
        placement="bottom"
        width="400"
        trigger="focus">
          <span v-html="dictHtml"></span>
          <el-input style="display: inline-block; width: 150px; margin: 10px 0; padding-right: 200px"
            placeholder="快速查单词"
            prefix-icon="el-icon-search"
            v-model="input"
            slot="reference"
            @keyup.native.enter="getDictHtml"
          >
          </el-input>
      </el-popover>


        <el-menu-item index="/log_reg/login" v-if=" !getIsLogin" style="position: absolute; right: 110px;" id="login">
          <i class="el-icon-user"></i>
          <span slot="title">登陆</span>
        </el-menu-item>
        <el-menu-item index="/log_reg/reg"  style="position: absolute; right: 10px;" v-if=" !getIsLogin">
          <i class="el-icon-message"></i>
          <span slot="title">注册</span>
        </el-menu-item>

      <div style="display: inline-block; position: absolute; right: 30px;" v-else>
        <el-menu-item index="">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link" style="font-size: 1.2em; margin-left: 10px">
              <img src="../assets/mylogo.jpg" style="height: 48px; margin-right: 10px">
             {{ getAccount }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>修改资料(开发中)</el-dropdown-item>
              <el-dropdown-item disabled>用户设置(开发中)</el-dropdown-item>
              <el-dropdown-item disabled>移动端(开发中)</el-dropdown-item>
              <el-dropdown-item divided command="logout">_ _退出登陆_ _</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </div>

    </el-menu>
  </div>
</template>


<script>
  import { mapGetters, mapActions } from 'vuex';
  import getApiPath from '../utils/getApiPath';
  import Axios from 'axios';


  export default {
    name: 'Header',
    computed: {
      ...mapGetters(['getIsLogin', 'getAccount', 'getClicked']),
    },
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        input: '',
        dictHtml: ''
      };
    },
    methods: {
      ...mapActions(['changeClicked', 'recoverState', 'resetState']),
      handleCommand(command) {
        if(command === 'logout'){
          localStorage.clear();
          this.resetState;

          this.$message({
            type: 'success',
            duration: 1500,
            message: '注销成功，下次见~'
          });

          this.$router.push('/log_reg/login');

        }
      },
      getDictHtml(){
        Axios.get(getApiPath('/recite/getHtml/' + this.input))
          .then( (res) => {
            this.dictHtml = res.data['rawHtml'];
            // this.$alert( res.data['rawHtml'], '有道词典', {
            //   dangerouslyUseHTMLString: true
            // });
          })
          .catch( (err) => {
            this.$message({
              type:'error', duration: 1500, message: '获取有道词典释义失败'
            })
          });
      },


    },
    beforeMount(){

    }
  }
</script>

<style>
.el-menu-item{
  display: inline-block;
}
</style>
