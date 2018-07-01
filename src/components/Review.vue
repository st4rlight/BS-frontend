<template>
  <div class="recite">
    <div class="my-card">

      <!--选择复习计划-->
      <template v-if=" !start_review ">
        <div class="card">
          <div class="header">
            <h1> {{ remain }} </h1>
          </div>
          <div class="container">
            <p>需要复习的单词数</p>
          </div>
        </div>​

        <div class="my-class">
            <p>选择一个计划开始复习吧~</p>
            <el-select v-model="plan_id" placeholder="选择计划本" style="display: block; maring-top: 20px" @change="handleChange">
              <el-option
                v-for="(item, index) in tableData"
                :key="item.plan_id"
                :label=" item.plan_id + '.   ' + item.collect  + '   ' + item.progress + '/' + item.total "
                :value="item.plan_id"
              >
              </el-option>
            </el-select>
            <el-button type="primary" style="margin-top: 30px; width: 100%" @click=" startReview ">开始复习</el-button>
          </div>
      </template>

      <!--单词页-->
      <template v-if=" start_review && wordList.length !== current_index ">
        <el-card class="box-card"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)">
          <div slot="header" class="clearfix">
            <!-- 导航指示-->
            <i class="el-icon-check" style="float: left; padding: 3px 0"><span> 已完成 {{ current_index }}</span></i>
            <i class="el-icon-arrow-right" style="float: right; padding: 3px 0"><span> 剩余 {{ wordList.length - current_index }}</span></i>
            <br /><br /><br />

            <!--单词-->
            <strong style="font-size: 3em; font-family: 'Microsoft YaHei' "> {{ wordList[current_index].word }}</strong>

            <!--音标-->
            <div style=" margin-top: 20px;">
                <span @click="playSound('ph_am')">美 &nbsp;
                  <el-tag class="ph" type="info">/{{ ph_am }}/</el-tag>
                </span>

              <span @click="playSound('ph_en')" style="margin-left: 20px;">英 &nbsp;
                  <el-tag   class="ph" type="info">/{{ ph_en }}/</el-tag>
                </span>
            </div>

          </div>

          <!--单词意思-->
          <div style="height: 260px" v-if=" !show_circle">
            <div style="float: top; position: relative; top: 45%;">
              <span style="font-size: 2em">{{ wordList[current_index]['meaning'] }} </span>
            </div>
          </div>

          <!--转圈圈-->
          <div style="height: 260px" v-if="show_circle">
            <el-progress
              :show-text="false"
              style="margin: auto 0; top: 20%; zoom: 1.2"
              type="circle"
              :percentage="testNum">
            </el-progress>
          </div>

          <!--按钮-->
          <div class="clearfix" style="margin-top: 20px">
            <template v-if=" !show_circle ">
              <el-button type="info" style="width: 100%" @click="handleNext(false)">下一个</el-button>
            </template>
            <template v-else>
              <el-button type="primary" plain style="width: 45%; display: inline-block" @click="handleNext(false)">认识</el-button>
              <el-button type="info" plain style="width: 45%; display: inline-block" @click="handleDontKnow">不认识</el-button>
            </template>
          </div>

          <!--四个选项-->
          <div style="margin-top: 20px; zoom: 1.3">
            <el-button type="primary" icon="el-icon-edit" @click="checkSpell"></el-button>
            <el-button type="success" icon="el-icon-search" @click="getDictHtml"></el-button>
            <el-button type="warning" icon="el-icon-star-off" :disabled="favorited" @click="handleFavorite"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete"></el-button>
          </div>

        </el-card>
      </template>

      <!--复习完成-->
      <template v-if=" wordList.length === current_index && current_index !== 0">
        <div style="margin-top: 60px">
          <div>
            <i class="el-icon-success finish_icon"></i>
          </div>
          <br /><br /><br /><br />
          <p style="font-size: 2em">恭喜，复习完成~</p>
          <el-button type="primary" style="width: 200px" @click="finish_review">完成</el-button>
        </div>
      </template>

      <!--发音-->
      <video v-show="false" id="ph_am" :src="ph_am_mp3" controls width="400px" heigt="400px"></video>
      <video v-show="false" id="ph_en" :src="ph_en_mp3" controls width="400px" heigt="400px"></video>

    </div>
  </div>
</template>

<script>
  import validate_login from "../utils/valiLogin";
  import getApiPath from "../utils/getApiPath";
  import Axios from 'axios';
  import moment from 'moment';

  export default {
    name: "Review",
    data: function(){
      return{
        testNum: 0,
        tableData: [ ],
        current_index: 0,
        start_review: false,

        wordList: [],
        plan_id: '',
        plan: null, //保存当前背诵的计划的信息

        favorited: false,
        loading: false,
        ph_en: '',
        ph_am: '',
        ph_en_mp3: null,
        ph_am_mp3: null,
        should_play: false,

        show_circle: true,
        timer: null,
        remain: 0
      }
    },
    beforeMount(){
      validate_login(this);

      Axios.get(getApiPath('/plan/allPlans/' + localStorage.getItem('user_id') ))
        .then( (res) => {
          if( res.status === 200) {
            this.tableData = res.data['tableData'];
          } else {
            throw new Error();
          }
        })
        .catch( (err) => {
          this.$message({
            type: 'error',
            duration: 1500,
            message: '获取计划失败'
          })
        });
    },
    methods: {
      handleCircle(){
        this.testNum = 0;
        this.timer = setInterval(() => {
          this.testNum += 1;
          if(this.testNum === 100) {
            clearTimeout(this.timer);
            this.show_circle = false;
            this.should_play = false;
            this.testNum = 0;
          }
        }, 50);
      },

      handleChange(plan_id){
        for( let item of this.tableData ){
          if( item.plan_id = plan_id ){
            this.plan = item;
          }
        }

        var now = new Date();
        var info = {
            progress: this.plan.progress,
             collect: this.plan.collect,
             account: localStorage.getItem('account'),
          collect_id: this.plan.collect_id,
                date: moment(new Date( now.getTime() - 24*60*60*1000*3 ) ).format('YYYY-MM-DD')
        };

        //获取总共该复习的单词数
        Axios.post( getApiPath('/review/need_review_num'), info)
          .then( (res) => {
            if( res.status === 200){
                var total = res.data['num'];

                info = {
                  user_id: localStorage.getItem('user_id'),
                  plan_id: this.plan.plan_id,
                     date: moment(new Date()).format('YYYY-MM-DD')
                };

                Axios.post(getApiPath('/review/review_today'), info)
                  .then( (res) => {
                     if( res.status === 200) {
                        var review_today = res.data['num'];

                        if( total - review_today < 0)
                            this.remain = 0;
                        else
                            this.remain = total - review_today;

                      } else {
                          this.remain = total;
                      }
                  })
                  .catch( (err) => {
                      throw err;
                  })

            } else{
              throw new Error();
            }
          })
          .catch( (err) => {
              this.$message({
                type:'error', duration: 1500, message: '获取信息失败，请检查网络连接'
              })
          });



      },
      startReview(){
        if( this.plan === null || this.plan === undefined || this.plan === ''){
          this.$message({
            type: 'info', duration: 1500, message: "请先选择要复习的计划本"
          });
          return;
        }

        this.loading = true;
        const info = {
            progress: this.plan.progress,
                 num: 20,
             collect: this.plan.collect,
             account: localStorage.getItem('account'),
          collect_id: this.plan.collect_id
        };

        Axios.post(getApiPath('/review/wordList'), info)
          .then( (res) => {
            if( res.status === 200 ){
              this.wordList = res.data['wordList'];
              if( this.wordList.length === 0 ){
                this.$message({
                  type: 'info', duration: 1500, message: '该计划暂时没有需要复习的内容，先去背诵吧~'
                });
                return;
              }

              this.current_index = 0;
              this.getPh();
              this.getFavorited();
              this.start_review = true;

              this.loading = false;
              this.show_circle = true;
              this.handleCircle();

            } else{
              throw new Error();
            }
          })
          .catch( (err) => {
            this.$message({
              type: 'error',
              duration: 1500,
              message: '获取单词信息失败，请检查网络连接'
            });
            this.loading = false;
          });

      },
      getPh(){
        this.loading = true;
        var word = this.wordList[this.current_index]['word'];

        Axios.get(getApiPath('/recite/getPh/' + word))
          .then( (res) =>{
            this.ph_am = res.data['ph_am'];
            this.ph_en = res.data['ph_en'];
            this.ph_en_mp3 = res.data['ph_en_mp3'];
            this.ph_am_mp3 = res.data['ph_am_mp3'];
            this.should_play = true;

            this.loading = false;

          })
          .catch( (err) => {
            this.$message({
              type: 'error',
              duration: 1500,
              message: '获取单词音标失败'
            });
            this.loading = false;
          });
      },
      playSound( id ){
        if( id === 'ph_en' && (this.ph_en_mp3 === null || this.ph_en_mp3 === undefined ))
          return;
        if( id === 'ph_am' && (this.ph_am_mp3 === null || this.ph_am_mp3 === undefined ))
          return;
        document.getElementById(id).play();
      },

      // 四个按钮的功能
      getDictHtml(){
        var word = this.wordList[this.current_index]['word'];
        Axios.get(getApiPath('/recite/getHtml/' + word))
          .then( (res) => {
            this.$alert( res.data['rawHtml'], '有道词典', {
              dangerouslyUseHTMLString: true
            });
          })
          .catch( (err) => {
            this.$message({
              type:'error', duration: 1500, message: '获取有道词典释义失败'
            })
          });
      },
      checkSpell(){
        var back = this.wordList[this.current_index]['word'];
        var star = '';
        for( let i = 0 ; i < back.length; i++)
          star += '*';

        this.$set(this.wordList[this.current_index], 'word', star);

        this.$prompt('', '输入你的拼写', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if( value === back) {
            this.$message({
              type: 'success',
              duration: 1500,
              message: '拼写正确'
            });
            this.$set(this.wordList[this.current_index], 'word', back);

          } else {
            this.$message({
              type: 'warning',
              duration: 1500,
              message: '拼写错误'
            });
            this.$set(this.wordList[this.current_index], 'word', back);
          }
        }).catch(() => {
          this.$set(this.wordList[this.current_index], 'word', back);
        });
      },
      handleFavorite(){
        var info = {
          user_id: localStorage.getItem('user_id'),
          word: this.wordList[this.current_index].word,
          meaning: this.wordList[this.current_index]['meaning']
        };
        Axios.post(getApiPath('/recite/favorite'), info)
          .then( (res) => {
            if( res.status === 200 ){
              this.$message({
                type: 'success', duration: 1500, message: '收藏成功'
              });
              this.favorited = true;
            }
            else
              throw new Error();
          })
          .catch( (err) => {
            this.$message({
              type: 'error', duration: 1500, message: '收藏失败'
            });
            this.favorited = false;
          });
      },
      getFavorited(){
        var info ={
          user_id: localStorage.getItem('user_id'),
          word: this.wordList[this.current_index].word
        };
        Axios.post(getApiPath('/recite/is_favorited'), info)
          .then( (res) => {
            if( res.status === 200)
              this.favorited = true;
            else
              this.favorited = false;
          })
          .catch( (err) => {
            this.favorited = false;
          });
      },

      handleDontKnow(){
        this.show_circle=false;
        if( this.timer !== null && this.timer !==  undefined)
          clearInterval(this.timer);
      },
      handleDelete( ){
        this.handleNext(true);
      },
      handleNext( isDelete ){
          var info = {
             collect_id: this.plan.collect_id,
                   word: this.wordList[this.current_index]['word'],
            recent_time: moment(new Date()).format('YYYY-MM-DD'),
              is_finish: isDelete,
                account: localStorage.getItem('account')
          };
          Axios.post(getApiPath('/review/word_recite_record'), info)
            .then( ( res ) => {
              if( res.status === 200 ){
                this.current_index++;
                if( this.current_index !== this.wordList.length){

                  this.show_circle = true;
                  if( this.timer !== null && this.timer !==  undefined)
                    clearInterval(this.timer);

                  this.handleCircle();
                  this.getPh();
                  this.getFavorited();
                }
              } else{
                throw new Error();
              }
            })
            .catch( ( err ) => {
              this.$message({
                type: 'error', duration: 1500, message: '背诵记录提交失败'
              });
            });
      },
      finish_review(){
        localStorage.setItem('path', '/review');
        localStorage.setItem('path_name', 'review');

          var info = {
            user_id: localStorage.getItem('user_id'),
               date: moment(new Date()).format('YYYY-MM-DD'),
             number: this.wordList.length,
            plan_id: this.plan.plan_id
          };

          Axios.post(getApiPath('/review/record_plan_trace'), info)
            .then( ( res )=>　{
              if(res.status === 200){
                this.$message({
                  type: 'success', duration: 1500, message: '复习记录保存成功'
                });

              } else {
                throw new Error();
              }
            })
            .catch( (err) => {
              this.$message({
                type: 'error', duration: 1500, message: '复习记录保存失败'
              });
            });

          this.$router.replace({
            path: '/empty',
            name: 'empty'
          });
      },
    },
    updated(){
      if(this.should_play) {
        if (this.ph_am_mp3 !== null && this.ph_am_mp3 !== undefined) {
          this.playSound('ph_am');
        } else if (this.ph_en_mp3 !== null && this.ph_en_mp3 !== undefined) {
          this.playSound('ph_en');
        }
        this.should_play = false;
      }
    }
  }
</script>

<style scoped>
  .recite{
    text-align: center;
  }
  .my-card{
    width: 60%;
    text-align: center;
    display: inline-block;
    margin-top: 80px;
    padding: 20px;
  }

  .my-class{
    width: 25%;
    display: inline-block;
    margin: 40px 50px;
    position: relative;
    bottom: 80px;
    text-align: center;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    margin-top: -40px;
    width: 450px;
    display: inline-block;
  }


  .ph {
    font-size: 20px;
    cursor: pointer;
  }
  .finish_icon{
    transform: scale(10);
    color: #67C23A;
    display: block;
  }

  div.card{
    display: inline-block;
    width: 25%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
    margin: 0 15px;
  }
  div.header {
    background-color: #51A8DD;
    color: white;
    padding: 10px;
    font-size: 45px;
  }
  div.container {
    padding: 10px;
  }

</style>
