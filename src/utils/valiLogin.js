import Axios from 'axios';
import getApiPath from './getApiPath';
import getTimestamp from "./getTimestamp";

export default function( _this ){
  var gotoLogin = () => {
    _this.$message({
      type: 'warning',
      duration: 1500,
      message: '请先登录'
    });
    localStorage.clear();
    _this.$store.dispatch('resetState');

    delete Axios.defaults.headers.common['authorization'];

    _this.$router.push('/log_reg/login');
    this.$store.dispatch('changeClicked', {data: '/login'});

  };

  // Default navigation behavior
  if(localStorage['accessToken'] != '' && localStorage['accessToken'] != null && localStorage['accessToken'] != undefined) {
    // Set the authorization
    Axios.defaults.headers.common['authorization']
      = localStorage['accessToken'];

    Axios.get(getApiPath('login/auth'))
      .then((res) => {
        if(res.status !== 200) { gotoLogin(); return; }
        else{
          var duration = getTimestamp() - localStorage.getItem('timestamp');

          // update accessToken
          if( duration > 300 && duration < 600){
            _this.$store.dispatch('changeTimestamp', { 'timestamp': res.data['timestamp']});
            _this.$store.dispatch('changeAccessToken',{ 'accessToken': res.data['accessToken']});

            for( let prop in res.data)
              localStorage.setItem(prop, res.data[prop]);
          }
        }
      });
  } else {
    gotoLogin();
  }
}
