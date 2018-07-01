<template>
  <div class="plan-comp">
    <div class="allconent">
      <div style="text-align: center">
        <el-button type="primary" style="width: 25%;" icon="el-icon-plus" @click="create()">新增收藏</el-button>
      </div>

      <div class="favorite-table" v-if="tableData.length !== 0">
        <el-table :data="tableData" stripe border
                  v-loading="loading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
        >
          <el-table-column type="index" align="center" min-width="150px"></el-table-column>
          <el-table-column label="单词" prop="word" align="center">
              <template slot-scope="scope">
                <a style="font-size: 1.2em">{{ scope.row.word }}</a>
              </template>
          </el-table-column>
          <el-table-column label="意思" prop="meaning" align="center">
              <template slot-scope="scope2">
                  <a style="font-size: 1.2em">{{ scope2.row.meaning }}</a>
              </template>
          </el-table-column>


          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)" plain>编辑</el-button>
              <el-button size="small" type="danger"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-else>
        <h3 style="text-align: center; margin-top: 100px;">暂时还没有收藏哦, 快去添加吧~</h3>
      </template>

      <template>
        <el-dialog width="30%" :title=" edit?'编辑收藏':'添加收藏'" :visible.sync="dialogFormVisible">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="单词">
              <el-input v-model="form.word"></el-input>
            </el-form-item>
            <el-form-item label="意思">
              <el-input v-model="form.meaning"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancle">取 消</el-button>
            <el-button type="primary" @click="handleClick('form')">确 定</el-button>
          </div>
        </el-dialog>
      </template>

    </div>
  </div>
</template>

<script>
  import validate_login from "../utils/valiLogin";
  import Axios from 'axios';
  import getApiPath from "../utils/getApiPath";

  export default {
    name: 'Favorite',
    data: function () {
      const validateWord = ( rule, value, callback ) => {
        if( value === '')
          callback(new Error('请输入单词'));
        else {
          callback();
        }
      };
      const validateMeaning = ( rule, value, callback ) => {
        if( value === '')
          callback(new Error('请输入单词的意思'));
        else {
          callback();
        }
      };

      return {
        loading: false,
        edit: false,
        editIndex: 0,

        tableData: [ ],
        dialogFormVisible: false,
        backupForm: null,

        form: {
          word: '',
          meaning: ''
        },
        rules: {
          word: [
            { validator: validateWord, trigger: 'blur' }
          ],
          meaning: [
            { validator: validateMeaning, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      handleClick: function (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if (this.edit) {
              var path = getApiPath('/favorite/edit_word/' + localStorage.getItem('user_id'));
              var info = {
                 new_word: this.form.word,
                  meaning: this.form.meaning,
                 old_word: this.backupForm.word
              };

              Axios.put(path, info)
                .then((res) => {
                  if (res.status === 200) {
                    this.$message({
                      type: 'success', duration: 1500, message: '修改成功'
                    });

                    this.tableData.splice(this.editIndex, 1, this.form);
                    this.dialogFormVisible = false;
                    this.edit = false;

                  } else
                      throw new Error();
                })
                .catch((err) => {
                  this.$message({
                    type: 'error', duration: 1500, messgae: '修改失败,请检查网络连接'
                  });
                  this.dialogFormVisible = false;
                  this.edit = false;
                });

            } else {  //add
              const path = getApiPath('/favorite/new_word/' + localStorage.getItem('user_id'));

              Axios.post(path, this.form)
                .then((res) => {
                  if (res.status = 200) {
                    this.$message({
                      type: 'success', duration: 1500, message: '添加成功!'
                    });
                    this.tableData.push(this.form);
                    this.dialogFormVisible = false;

                  } else {
                    throw new Error();
                  }
                }).catch(() => {
                this.$message({
                  type: 'error', duration: 1500, message: '添加失败，请检查网络连接'
                });

                this.dialogFormVisible = false;
              });
            }
          }
        });
      },
      handleDelete:function (index, row) {  //删除
        this.$confirm('确认删除?')
          .then( () => {
            const info = {
                 user_id: localStorage.getItem('user_id'),
                    word: row.word
            };

            Axios.put(getApiPath('/favorite/delete'), info)
              .then( ( res ) => {
                if( res.status === 200 ){
                  this.$message({
                    type: 'success', duration: 1500, message: '删除收藏单词成功'
                  });
                  this.tableData.splice(index, 1);

                } else{
                  throw new Error();
                }
              })
              .catch(() => {
                this.$message({
                  type: 'error', duration: 1500, message: '删除失败'
                });
              });
          })
          .catch( () => {});
      },
      handleEdit: function (index, row) { //编辑数据
        this.edit = true;
        this.editIndex = index;
        this.backupForm = JSON.parse(JSON.stringify(row));
        this.form = JSON.parse(JSON.stringify(row));
        this.dialogFormVisible = true;
      },
      handleCancle(){
        this.dialogFormVisible = false;
        if(this.edit)
          this.tableData.splice( this.editIndex, 1, this.backupForm);

        this.edit = false;
      },
      create:function(){  //添加
        this.edit = false;
        this.form = {
              word: '',
           meaning: ''
        };
        this.dialogFormVisible = true;
      },

    },
    beforeMount(){
      validate_login(this);

      this.loading = true;
      Axios.get(getApiPath('/favorite/allwords/') + localStorage.getItem("user_id"))
        .then( (res) => {
          this.tableData = res.data['tableData'];
          this.loading = false;
        })
        .catch ( () => {
          this.$message({
            type: 'error',
            duration: 1500,
            message: '获取用户收藏失败, 请检查网络连接'
          });
          this.loading = false;
        });
    }
  }
</script>

<style scoped>
  .plan-comp{
    width: 75%;
    height: 700px;
    margin: 30px auto;
  }
  .allconent{
    padding: 20px;
    margin-top: 20px;
  }
  .favorite-table{
    margin-top: 20px;
  }
</style>
