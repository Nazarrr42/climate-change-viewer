<template>
  <div class="wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: $main-content-color;
  width: $main-content-width;
  height: $main-content-height;
  min-height: $main-content-min-height;
}
</style>
