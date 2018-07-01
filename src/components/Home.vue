<template>
    <div class="home">
      <div class="allconent">
        <el-row>
          <el-col :span="5">&nbsp;</el-col>


          <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
              <img :src=" info['picture'] " class="image">
              <div style="padding: 14px;">
                <h3 style="cursor: pointer" @click="play">{{ info.content }}</h3>
                <h4>{{ info.note }}</h4>
                <br />
                <div>
                  <strong style="display: block">投稿人的话：</strong>
                  <a>{{ "　　" + info.translation.substring(6, info.translation.length) }}</a>
                </div>


                <div style="text-align: right;margin-top: 50px">
                  <a>(点击英文句子可听发音)</a>
                </div>

                <div >
                  <p><i style="zoom: 1.3" class="el-icon-star-off"></i><a style="margin-left: 10px">{{info.love }}</a></p>
                </div>

              </div>
            </el-card>
          </el-col>

          <el-col :span="7" style="margin-left: 100px">
            <div style="margin-top: 40%; font-size: 1.2em">
              <h1>{{ info.caption }}</h1>
              <strong>{{ info.dateline }}</strong>
              <br />
              <p>
                <em>sid</em>
                <el-tag type="info" style="zoom: 1.2">{{ info.sid }}</el-tag>
              </p>
            </div>
          </el-col>


          <el-col :span="6"></el-col>

        </el-row>
      </div>

      <video v-show="false" id="play" :src="info.tts" controls ></video>

    </div>


</template>

<script>
  import validate_login from "../utils/valiLogin";
  import getApiPath from '../utils/getApiPath';
  import Axios from 'axios';

    export default {
      name: "Home",
      data(){
        return{
           info: '',
           sound: false
        }
      },
      methods:{
        play(){
          document.getElementById('play').play();
        }
      },
      beforeMount(){
        validate_login(this);
        Axios.get(getApiPath('/home/everyday'))
          .then( (res) => {
              if( res.status === 200){
                  this.info = res.data['info'];
              } else{
                throw new Error();
              }
          })
          .catch( (err) => {
              this.$message({
                type: 'error', duration: 1500, message: '获取词霸每日一句失败，请检查网络连接'
              })
          });
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

  .home{
    width: 75%;
    height: 700px;
    margin: 30px auto;
    text-align: left;
  }
  .allconent{
    padding: 20px;
    margin-top: 20px;
  }
</style>
