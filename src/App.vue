<template>
  <div id="app">
    <Header></Header>
    <div style="height: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  name: 'App',
  components: {Header},
  beforeMount(){
      this.$store.dispatch('recoverState');
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
}
.el-table th{
  background:#f4f4f4 !important;
  font-size: large;
}
.my-choices td{
  height: 65px;
}
</style>
