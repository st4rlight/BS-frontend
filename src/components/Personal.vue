<template>

</template>

<script>
  import validate_login from "../utils/valiLogin";

    export default {
        name: "Personal",
        beforeMount(){
            validate_login(this);
        }
    }
</script>

<style scoped>

</style>
