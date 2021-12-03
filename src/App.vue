<template>
  <div id="app">
    <main-component id="content"></main-component>
  </div>
</template>

<script>
import MainComponent from "./components/MainComponent.vue";

export default {
  name: "basin_management_tool",
  data() {
    return {};
  },
  components: { MainComponent },
  mounted() {
    const root = document.querySelector(":root");
    const screenWidth = window.screen.width; // Для сайта
    if (screenWidth < 1280 && screenWidth >= 1024) {
      root.style.fontSize = "11px";
    } else if (screenWidth < 1024 && screenWidth > 800) {
      root.style.fontSize = "10px";
    } else if (screenWidth <= 800) {
      root.style.fontSize = "9px";
    }
  },
};
</script>

<style lang="scss">
/* CSS */
:root {
  font-size: 13.5px;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
*:focus {
  outline: $main-darkbrown auto 5px;
}
#app {
  // height: max-content;
  min-height: $main-content-min-height;
  // max-width: $app-width;
  min-width: fit-content;
  background-color: $app-background-color;
}
body::-webkit-scrollbar {
  width: 10px;
}
body::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: $main-white;
}
body::-webkit-scrollbar-thumb {
  background-color: $main-brown;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  outline: 0px solid $main-darkbrown;
}
</style>
