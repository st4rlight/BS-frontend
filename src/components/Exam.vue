<template>
  <div class="recite">
    <div class="my-card">

      <!--准备界面-->
      <template v-if=" !start_exam ">
        <div style="text-align: center; margin-top: 40px;">
          <div class="my-class">

            <p>选择单词本，随机出 {{ numOfQuestions }} 道题</p>

            <!--选择单词本-->
            <el-select v-model="collect" placeholder="选择要测验的单词本" style="display: block">
              <el-option
                v-for="(item, index) in collections"
                :key="index"
                :label="item.collect"
                :value="item"
              >
              </el-option>
            </el-select>

            <!--选择试题个数-->
            <el-select v-model="numOfQuestions" placeholder="选择测试单词数" style="display: block; margin-top: 20px;">
              <el-option
                v-for="(item, index) in numOptions"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>

            <el-button type="primary" style="margin-top: 20px; width: 100%" @click=" startExam ">开始测试</el-button>
          </div>
        </div>
      </template>

      <!--单词页面-->
      <template v-if=" start_exam && wordList.length !== current_index ">
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

          <!--四个选择-->
          <div>
            <el-table
              :data="choices"
              style="width: 100%; cursor: pointer"
              :show-header="false"
              class="my-choices"
              @row-click="handleSelect">
              <el-table-column
                align="center"
                prop="label"
                label="选项">
                <template slot-scope="scope">
                  <span style="font-size: 1.3em"> {{ scope.row.meaning }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!--底栏3个图标-->
          <div style="margin-top: 20px; zoom: 1.3">
            <el-button type="primary" icon="el-icon-edit" @click="checkSpell"></el-button>
            <el-button type="success" icon="el-icon-search" @click="getDictHtml"></el-button>
            <el-button type="warning" icon="el-icon-star-off" :disabled="favorited" @click="handleFavorite"></el-button>
          </div>
        </el-card>
      </template>

      <!--测试结果-->
      <template v-if=" wordList.length === current_index && current_index !== 0">
        <div class="card">
          <div class="right">

            <el-popover
              placement="right"
              width="600"
              trigger="click">
              <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page="current_page1"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize1"
                layout="total, sizes, prev, pager, next, jumper"
                :total="rightAnswer.length">
              </el-pagination>
              <el-table :data="rightAnswer.slice((current_page1-1)*pageSize1,current_page1 * pageSize1)">
                <el-table-column property="word" label="单词"></el-table-column>
                <el-table-column property="meaning" label="意思">
                  <template slot-scope="scope">
                    <el-tag type="success" style="zoom: 1.2">{{ scope.row.meaning }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <h1 slot="reference" style="cursor:pointer;">{{ this.rightAnswer.length }}</h1>
            </el-popover>
          </div>
          <div class="container">
            <p>正确数</p>
          </div>

        </div>​
        <div class="card">
          <div class="wrong">
            <el-popover
              placement="left"
              width="600"
              trigger="click">
              <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :current-page="current_page2"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="wrongAnswer.length">
              </el-pagination>
              <el-table :data="wrongAnswer.slice((current_page2-1)*pageSize2,current_page2 * pageSize2)">
                <el-table-column property="word" label="单词"></el-table-column>
                <el-table-column property="meaning" label="意思">
                  <template slot-scope="scope">
                    <el-tag type="success" style="zoom: 1.2">{{ scope.row.meaning }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column property="wrong" label="错选">
                  <template slot-scope="scope2">
                    <el-tag type="danger" style="zoom: 1.2">{{ scope2.row.wrong }}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <h1 slot="reference" style="cursor:pointer;">{{ this.wrongAnswer.length }}</h1>
            </el-popover>
          </div>
          <div class="container">
            <p>错误数</p>
          </div>
        </div>​

        <div style="margin-top: 60px">
          <p style="font-size: 1.5em">总数 <el-tag type="primary" style="zoom: 1.5">{{ this.wordList.length }}</el-tag></p>
          <p>点击上面的数字可以查看具体对错</p>
          <br />
          <el-button type="primary" style="width: 250px" @click="finish_exam">完成</el-button>
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
    name: "exam",
    data: function(){
      return{
        rightData: [],
        wrongData: [],
        pageSize1: 5,
        pageSize2: 5,
        current_page1: 1,
        current_page2: 1,


        numOptions: [20, 40, 60, 80, 100],
        numOfQuestions: 20,

        collections: JSON.parse(localStorage.getItem('collections')),
            collect: '',

         choices: [],
        wordList: [],
        rightAnswer: [],
        wrongAnswer: [],
        current_index: 0,

        start_exam: false,
        favorited: false,
        loading: false,
        should_play: false,

        ph_en: '',
        ph_am: '',
        ph_en_mp3: null,
        ph_am_mp3: null
      }
    },
    methods: {
      handleIndex(index){
          var arr = ['A','B','C','D','E','F','G','H'];
          return arr[index];
      },

      startExam(){
        if( this.collect === null || this.collect === undefined || this.collect === ''){
          this.$message({
            type: 'info', duration: 1500, message: "请先选择要测试的单词本"
          });
          return;
        }

        this.loading = true;
        const info = {
            collect: this.collect.collect,
             number: this.numOfQuestions
        };

        Axios.post(getApiPath('/exam/wordList'), info)
          .then( (res) => {
            if( res.status === 200 ){
              this.wordList = res.data['wordList'];

              if( this.wordList.length === 0 ){
                throw new Error();
              }

              this.current_index = 0;
              this.getPh();
              this.getFavorited();
              this.prepareChoices(3);

              this.start_exam = true;
              this.loading = false;

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
      handleSelect(row, event, column){
        if( row.word === this.wordList[this.current_index].word)
          this.rightAnswer.push( JSON.parse(JSON.stringify(row)) );
        else{
          var right_word = this.wordList[this.current_index];

          var temp = JSON.stringify({
                 id:  right_word.id,
               word:  right_word.word,
            meaning:  right_word.meaning,
              wrong:  row.meaning
          });

          this.wrongAnswer.push( (JSON.parse( temp) ));
        }

        this.current_index++;
        if( this.current_index !== this.wordList.length){
          this.getPh();
          this.getFavorited();
          this.prepareChoices(3);

        } else{

          //背诵完毕，保存记录
          var info = {
               user_id: localStorage.getItem('user_id'),
            collect_id: this.collect.collect_id,
             total_num: this.wordList.length,
             right_num: this.rightAnswer.length,
             wrong_num: this.wrongAnswer.length,
          };
          Axios.post(getApiPath('/exam/record_exam_trace'), info)
            .then( ( res )=>　{
              if(res.status === 200){
                this.$message({
                  type: 'success', duration: 1500, message: '测试记录保存成功'
                });

              } else {
                throw new Error();
              }
            })
            .catch( (err) => {
              this.$message({
                type: 'error', duration: 1500, message: '测试记录保存失败'
              });
            });
        }
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
      getDictHtml(){
        var word = this.wordList[this.current_index]['word'];
        Axios.get(getApiPath('/recite/getHtml/' + word))
          .then( (res) => {
            this.$alert( res.data['rawHtml'], '有道词典', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              callback: action => {}

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
      prepareChoices( num ){
        var info = {
              index: this.wordList[this.current_index].id,
            collect: this.collect.collect,
             number: num
        };

        Axios.post(getApiPath('/exam/wrongChoices'), info)
            .then( (res) => {
                if( res.status === 200 ){
                    this.choices = res.data['choices'];
                    var rightPosition = parseInt( Math.random() * ( num + 1));
                    this.choices.splice(rightPosition, 0 , this.wordList[this.current_index]);

                } else{
                    throw new Error();
                }
            })
            .catch( (err) => {
                this.$message({
                      type: 'error',
                  duration: 1500,
                   message: '获取试题失败.请检查网络连接'
                });
            });


      },

      playSound( id ){
        if( id === 'ph_en' && (this.ph_en_mp3 === null || this.ph_en_mp3 === undefined ))
          return;
        if( id === 'ph_am' && (this.ph_am_mp3 === null || this.ph_am_mp3 === undefined ))
          return;
        document.getElementById(id).play();
      },
      finish_exam(){
        localStorage.setItem('path', '/exam');
        localStorage.setItem('path_name', 'exam');

        this.$router.replace({
          path: '/empty',
          name: 'empty'
        });
      },

      //used for paging
      handleSizeChange1: function (size) {
        this.pageSize1 = size;
      },
      handleCurrentChange1: function(currentPage){
        this.current_page1 = currentPage;
      },
      handleSizeChange2: function (size) {
        this.pageSize2 = size;
      },
      handleCurrentChange2: function(currentPage){
        this.current_page2 = currentPage;
      }

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
    },
    beforeMount(){
      validate_login(this);
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
    margin-top: 60px;
    padding: 20px;
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
  .my-class{
    width: 25%;
    display: inline-block;
    margin: auto 50px;
    position: relative;
    bottom: 80px;
    text-align: center;
  }

  /*for el-card*/
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
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

  div.card{
    display: inline-block;
    width: 25%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
    margin: 0 15px;
  }
  div.right {
    background-color: #67C23A;
    color: white;
    padding: 10px;
    font-size: 45px;
  }
  div.wrong {
    background-color: #F56C6C;
    color: white;
    padding: 10px;
    font-size: 45px;
  }
  div.container {
    padding: 10px;
  }


</style>
