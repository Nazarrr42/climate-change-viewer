<template>
  <div class="app-wrapper">
    <main class="app-main">
      <div class="app-content"><main-content></main-content></div>
    </main>
    <footer class="app-footer"></footer>
  </div>
</template>

<script>
import MainContent from "./MainContent.vue";

export default {
  components: {
    MainContent,
  },
};
</script>

<style lang="scss">
.app-wrapper {
  width: $main-comp-width;
  height: $main-comp-height;
  min-width: fit-content;
  min-height: $main-content-min-height;
}
.app-main {
  display: flex;
  flex-direction: row;
  width: $main-comp-width;
  height: $main-comp-height;
}
.app-menu {
  // width: $main-menu-width;
  // min-height: $main-comp-menu-minheight;
  width: 0;
}
.app-content {
  min-height: $main-content-min-height;
  width: $main-comp-content-width;
}
.app-footer {
  height: $main-comp-footer-height;
  width: $main-comp-footer-width;
  position: relative;
  bottom: 0;
  left: 0;
}
/* V-Toolip */
.tooltip {
  display: block !important;
  z-index: 10000;
  // font-family: $child-text-font !important;
  // font-size: 13px !important
  font-family: $main-accordion-font !important;
}

.tooltip .tooltip-inner {
  background: $tooltip-background-color;
  color: $tooltip-text-color;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: $tooltip-background-color;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: $tooltip-text-color;
  color: $tooltip-background-color;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba($tooltip-background-color, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: $tooltip-text-color;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
