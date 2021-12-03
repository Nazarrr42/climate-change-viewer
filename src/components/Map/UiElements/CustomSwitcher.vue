<template>
  <div class="rcp-switcher-wrapper">
    <div
      v-for="(item, i) in switcherItems"
      :key="i"
      class="rcp-switcher"
      :class="{
        'left-switcher': i === 0,
        'right-switcher': i === switcherItems.length - 1,
        'right-border': i !== 0 && i !== switcherItems.length - 1,
      }"
      v-tooltip.bottom="item.tooltipText"
    >
      <input
        type="radio"
        :value="item.value"
        v-model="inputValue"
        :id="'switcher-' + i"
        class="custom__radio layers-panel__radio"
      />
      <label :for="'switcher-' + i">{{ item.text }}</label>
    </div>
  </div>
</template>
<script>
export default {
  name: "CustomSwitcher",
  props: {
    value: {
      required: true,
    },
    switcherItems: {
      type: Array,
      required: true,
    },
    defaultValue: {
      required: true,
    },
  },
  data() {
    return {
      inputValue: this.defaultValue,
    };
  },
  watch: {
    inputValue() {
      this.$emit("input", this.inputValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.rcp-switcher-wrapper {
  @include unselected-text();
  font-family: $child-text-font;
  background-color: $main-white;
  color: $main-darkbrown;
  height: $control-panel-height;
  top: $viz-control-position-top;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  border-radius: $layers-group-icon-border-radius;
  border: 1px solid $main-darkbrown-opacity;
  label {
    cursor: pointer;
  }
  font-size: $control-panel-font-size;
}
.rcp-switcher-wrapper:hover {
  border: 1px solid $main-darkbrown;
  .left-switcher {
    border-color: $main-darkbrown;
  }
}
.rcp-switcher {
  padding: 0.3571428571428571rem; //  5px / 14
  border-radius: 0 $layers-group-icon-border-radius 0
    $layers-group-icon-border-radius;
  display: flex;
  justify-content: center;
  align-items: center;
  .layers-panel__radio + label::before {
    margin: 0 auto !important;
  }
}
.rcp-switcher:hover {
  color: $main-white;
  background-color: $main-darkbrown-opacity;
}
.left-switcher {
  border-radius: 0.4285714285714286rem 0px 0px 0.4285714285714286rem; //  6px / 14
  margin-left: -1px;
  border: 1px solid $main-darkbrown-opacity;
  border-width: 0 1px 0 0;
}
.right-border {
  border: 1px solid $main-darkbrown-opacity;
  border-width: 0 1px 0 0;
}
.right-switcher {
  border-radius: 0 0.4285714285714286rem 0.4285714285714286rem 0; //  6px / 14
}
</style>
