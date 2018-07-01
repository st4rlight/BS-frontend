<template>
    <div id="log_reg">
      <div id="slides">
        <el-row>
          <el-col>
            <el-card :body-style="{ padding: '0px' }">
              <div id="slogan">
                <img src="https://ws1.sinaimg.cn/large/006uM1SFgy1fsuvlmc2xlj318g18fq4u.jpg" class="image">
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div id="login_wrap">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
    export default {
      name: "Log_Reg",
      data() {
        return {
          currentDate: new Date()
        };
      }
    }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  #log_reg{
    display: -ms-flexbox;
    display: flex;
    flex-flow: row nowrap;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: justify;
    justify-content: space-between;
    width: 900px;
    height: 550px;
    margin: 75px auto;
    border-radius: 4px;
    box-shadow: 0 8px 8px 0 rgba(51,51,51,.05), 0 0 8px 0 rgba(51,51,51,.15);
  }

  #slides{
    position: relative;
    height: 100%;
    overflow: hidden;
    display: inline-block;
    width: 50%;
    background-color: #fafafa
  }
  #login_wrap{
    width: 50%;
    height: 100%;
    display: inline-block;
    vertical-align: top;
    background-color: #fff;
  }
  #slogan{
    padding: 50px 0;
    background-color: #fafafa;
  }
</style>
