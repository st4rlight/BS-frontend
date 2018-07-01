<template>

</template>

<script>
    export default {
        name: "Empty",
        beforeMount(){
          this.$router.replace({
              path: localStorage.getItem('path'),
              name: localStorage.getItem('path_name')
          })
        }
    }
</script>

<style scoped>

</style>
