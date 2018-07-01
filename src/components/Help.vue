<template>
  <div class="help">
      <img class="logo" src="https://ws1.sinaimg.cn/large/006uM1SFgy1fsuvmegwllj30cr0crt9a.jpg">
    <h3>Hi, I'm st4rlight</h3>
      <p><em>a student of ZhengJiang University</em></p>
    <br />
    <p>github <el-tag type="info"><a href="https://github.com/st4rlight">https://github.com/st4rlight</a></el-tag></p>
    <p>个人主页 <el-tag type="info"><a href="http://st4rlight.me">http://st4rlight.me</a></el-tag></p>

    <br />
    <h1>破站仍在施工中 ~</h1>
  </div>
</template>

<script>
    export default {
        name: "Help"
    }
</script>

<style scoped>
  .help{
    width: 75%;
    height: 700px;
    margin: 50px auto;
    text-align: center;
  }
  .logo{
    width: 140px;
    height: 140px;
    border-radius: 70px;
  }
  a:visited{
    text-decoration: none;
    color: gray;
  }
</style>
