<template>
    <div class="plan-comp">
      <div class="allconent">
       <div style="text-align: center">
          <el-button type="primary" style="width: 25%;" icon="el-icon-plus" @click="create()">新建计划</el-button>
       </div>
       <div class="plan-table" v-if="tableData.length !== 0">
        <el-table :data="tableData" stripe border
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    >
          <el-table-column
            type="index"
            align="center">
          </el-table-column>
          <el-table-column label="词库" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{ handleCollect(scope.row.collect_id) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="起始日期" align="center">
            <template slot-scope="scope">
              <span>{{ handleMoment(scope.row.start_date) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束日期"  align="center">
            <template slot-scope="scope">
              <span>{{ handleMoment(scope.row.end_date) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="剩余天数"  align="center" min-width="120px">
            <template slot-scope="scope">
              <el-progress style="width: 65%; display: inline-block" :text-inside="true" :stroke-width="18" :percentage=" handlePercentage( scope.row.start_date, scope.row.end_date ) "></el-progress>
              {{ getLeftDays(scope.row.end_date) }} / {{ getTotalDays( scope.row.start_date, scope.row.end_date ) }}
            </template>
          </el-table-column>
          <el-table-column label="进度"  align="center" min-width="180px">
            <template slot-scope="scope">
              <el-progress style="width: 65%; display: inline-block" :text-inside="true" :stroke-width="18" :percentage=" handleProgress( scope.row.progress, scope.row.total) " color="rgba(142, 113, 199, 0.7)"></el-progress>
              {{ scope.row.progress }} / {{ scope.row.total }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="150px">
            <template slot-scope="scope">
              <el-button size="small"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small"  type="primary" @click="handleReset(scope.$index, scope.row)" plain>重置</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
       <template v-else>
         <h3 style="text-align: center; margin-top: 100px;">暂时还没有计划哦, 点击上面的按钮创建一个新的计划吧~</h3>
       </template>

      <template>
        <el-dialog width="40%" :title=" edit?'编辑计划':'新建计划'" :visible.sync="dialogFormVisible">
          <el-form :model="form" :rules="rules" ref="planForm">
            <el-form-item label="起始日期" :label-width="formLabelWidth" prop="start_date">
              <el-date-picker v-model="form.start_date"
                              type="date"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" :label-width="formLabelWidth" prop="end_date">
              <el-date-picker
                v-model="form.end_date"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="单词集" :label-width="formLabelWidth" prop="collect_id">
                <el-select v-model="form.collect_id" placeholder="请选择" @change="changeTotal">
                  <el-option
                    v-for="(item, index) in collections"
                    :key="index"
                    :label="item.collect"
                    :value="item.collect_id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="剩余天数 / 总天数" :label-width="formLabelWidth">
              <el-progress style="width: 70%; display: inline-block" :text-inside="true" :stroke-width="18" :percentage=" this.handlePercentage( this.form.start_date, this.form.end_date ) "></el-progress>
              {{ getLeftDays( this.form.end_date ) }} / {{ getTotalDays( this.form.start_date, this.form.end_date ) }}
            </el-form-item>
            <el-form-item label="每日单词数" :label-width="formLabelWidth" v-if="!edit">
                <template slot-scope="scope">
                  <el-tag style="font-size: 1.5em" type="primary">{{ handleEachDay() }}</el-tag>
                </template>
            </el-form-item>
            <el-form-item label="当前进度 / 总词数" :label-width="formLabelWidth" v-if="edit">
              <el-progress style="width: 70%; display: inline-block" :text-inside="true" :stroke-width="18" :percentage="handleProgress( this.form.progress, this.form.total )" color="rgba(142, 113, 199, 0.7)"></el-progress>
              {{ this.form.progress }} / {{ this.form.total }}
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancle">取 消</el-button>
            <el-button type="primary" @click="handleClick('planForm')">确 定</el-button>
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
  import moment from 'moment';

  export default {
    name: 'Plan',
    data: function () {
      const validateStart = ( rule, value, callback ) => {
        if( value === '')
          callback(new Error('请选择开始日期'));
        else
          callback();
      };
      const validateEnd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择结束日期'));
        } else {
          var days = this.getTotalDays(this.form.start_date, this.form.end_date);
          if( days < 0 )
            callback(new Error('结束日期不能在开始日期之前'));
          else
            callback();
        }
      };
      const validateCollect = ( rule, value, callback ) => {
        if( value === '')
          callback(new Error('请选择单词集'));
        else {
          for( let item of this.tableData ){
            if( item.collect_id === value ){
              callback(new Error('已有关于该单词集的计划，不能重复创建'));
              return;
            }
          }
          callback();
        }
      };
      return {
        formLabelWidth: '150px',
        loading: false,
        edit: false,
        editIndex: 0,
        collections: JSON.parse(localStorage.getItem('collections')),
        tableData: [ ],
        dialogFormVisible: false,
        backupForm: null,
        form: {
          collect: '',
          plan_id: '',
          collect_id: '',
          start_date: '',
          end_date: '',
          progress: '',
          total: ''
        },
        rules: {
          start_date: [
            { validator: validateStart, trigger: 'blur' }
          ],
          end_date: [
            { validator: validateEnd, trigger: 'blur' }
          ],
          collect_id: [
            { validator: validateCollect, trigger: 'blur' }

          ]
        },
        pickerOptions: {
          disabledDate(time) {
            var now= new Date();
            return time.getTime() < now.getTime();
          }
        }
      }
    },
    methods:{
      handleClick: function (formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if (this.edit) {
              Axios.put(getApiPath('/plan/edit_plan/' + this.form.plan_id), this.form)
                .then((res) => {
                  if (res.status === 200) {
                    this.$message({
                      type: 'success',
                      duration: 1500,
                      message: '修改计划成功'
                    });
                    this.tableData.splice(this.editIndex, 1, this.form);
                    this.dialogFormVisible = false;
                    this.edit = false;

                  } else
                    throw new Error();
                })
                .catch((err) => {
                  this.$message({
                    type: 'error',
                    duration: 1500,
                    messgae: '修改计划失败,请检查网络连接'
                  })
                  this.dialogFormVisible = false;
                  this.edit = false;
                });

            } else {  //Add a plan
              var path = getApiPath('/plan/new_plan/' + localStorage.getItem('user_id'));
              Axios.post(path, this.form)
                .then((res) => {
                  if (res.status = 200) {
                    this.$message({
                      type: 'success',
                      duration: 1500,
                      message: '添加成功!'
                    });
                    this.form.plan_id = res.data['plan_id'];
                    this.tableData.push(this.form);
                    this.dialogFormVisible = false;

                  } else {
                    throw new Error();
                  }
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    duration: 1500,
                    message: '创建计划失败，请检查网络连接'
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
                    account: localStorage.getItem('account'),
                 collect_id: row.collect_id
              };
              Axios.put(getApiPath('/plan/delete/' + row.plan_id), info)
                .then( ( res ) => {
                  if( res.status === 200 ){
                    this.$message({
                      type: 'success', duration: 1500, message: '删除计划成功'
                    });
                    this.tableData.splice(index, 1);

                  } else{
                    throw new Error();
                  }
                })
                .catch(() => {
                  this.$message({
                    type: 'error', duration: 1500, message: '删除计划失败'
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
      handleReset(index, row){
        this.$confirm('该计划的进度将被重置，确定?')
          .then( () => {
            const info = {
              collect_id: row.collect_id,
                 account: localStorage.getItem('account')
            };
            Axios.put(getApiPath('/plan/reset/' + row.plan_id), info)
              .then( ( res ) => {
                if( res.status === 200 ){
                  this.$message({
                    type: 'success', duration: 1500, message: '重置计划成功'
                  });

                  this.$set(this.tableData[index], 'progress', 0);

                } else{
                  throw new Error();
                }
              })
              .catch(() => {
                this.$message({
                  type: 'error', duration: 1500, message: '重置计划失败'
                });
              });
          })
          .catch( () => {});
      },
      create:function(){  //添加
        this.edit = false;
        this.form = {
            plan_id: '' ,
            collect_id: '',
            start_date: new Date(),
            end_date: '',
            progress: 0,
            total: 0
        };
        this.dialogFormVisible = true;
      },

      getLeftDays: function( end_date ){
        if( end_date !== "" && end_date !== null && end_date !== undefined){
          var s2 = new Date( end_date );
          var now = new Date();
          var leftTime = s2.getTime() - now.getTime();
          var leftDays = Math.ceil(leftTime / (1000 * 60 * 60 * 24));

          return ( leftDays + 1 );
        }
        return 0;
      },
      getTotalDays: function( start_date, end_date ){
        if( start_date !== "" && start_date !== null && start_date !== undefined){
          var s1 = new Date( start_date );

          if( end_date !== "" && end_date !== null && end_date !== undefined){
            var s2 = new Date(end_date );
            var totalTime = s2.getTime() - s1.getTime();
            var totalDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24));

            return ( totalDays + 1);
          }
        }
        return 0;
      },

      handlePercentage: function( start_date, end_date ){
        if( this.getTotalDays( start_date, end_date) !== 0 ){
          var num = parseInt(this.getLeftDays( end_date ) / this.getTotalDays( start_date, end_date) * 100);
          return ( num < 0 ) ? 0 : ( ( num > 100) ? 100 : num );
        }
        else
          return 0;
      },
      handleProgress(progress, total){
        var result = parseInt( parseInt(progress) / parseInt(total) * 100 );
        if(isNaN(result))
          return 0;
        else
          return result;
      },
      changeTotal(collect_id){
        for( let item of this.collections) {
          if( item.collect_id === collect_id) {
            this.$set(this.form, 'total', item.total);
            return;
          }
        }
      },
      handleEachDay(){
        var num = this.form.total / this.getTotalDays(this.form.start_date, this.form.end_date);
        if( isNaN(num))
          return 0;
        else
          return Math.ceil(num);
      },
      handleCollect( collect_id ){
        for( let item of this.collections) {
          if( item.collect_id === collect_id) {
            return item.collect;
          }
        }
      },
      handleMoment( date ){
        return moment(date).format('YYYY-MM-DD');
      }
    },
    beforeMount(){
      validate_login(this);
      this.loading = true;
      Axios.get(getApiPath('/plan/allPlans/') + localStorage.getItem("user_id"))
          .then( (res) => {
              this.tableData = res.data['tableData'];
              this.loading = false;
          })
          .catch ( () => {
              this.$message({
                type: 'error',
                duration: 1500,
                message: '获取用户单词计划失败, 请检查网络连接'
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
    margin: 50px auto;
  }
  .allconent{
    padding: 20px;
    margin-top: 20px;
  }
  .plan-table{
    margin-top: 20px;
  }
</style>
