<template>
    <div id="home">
      <h1>hello</h1>
    </div>
</template>

<script>
  import validate_login from "../utils/valiLogin";

    export default {
      name: "Home",
      beforeMount(){
        validate_login(this);
      }
    }
</script>

<style scoped>

</style>
