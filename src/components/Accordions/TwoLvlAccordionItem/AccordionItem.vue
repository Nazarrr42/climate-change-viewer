<template>
  <div>
    <div v-show="itemType === 'accordion' && !isWrapper">
      <div class="accordion-second-wrapper">
        <div :class="getItemClassName" @click="selectItem()">
          <p class="accordion-item__title">{{ label }}</p>
        </div>
      </div>
    </div>

    <div v-if="itemType === 'select'">
      <div class="accordion-second-wrapper">
        <div
          :class="getItemClassName"
          class="select-item"
          @click="selectItem()"
        >
          <p class="accordion-item__title select-title">
            {{
              $store.getters.getCurrentSelectedOption
                ? $store.getters.getCurrentSelectedOption.name
                : currentSelectedOption.name
            }}
          </p>
          <div class="select-arrow"></div>
        </div>
        <div class="select-wrapper" v-if="showChildren">
          <div
            v-for="(opt, i) in options"
            :key="i"
            class="select-item"
            :class="getAccordionClass(opt)"
            @click="currentSelectedOption = opt"
          >
            <p class="accordion-item__title select-title">{{ opt.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-show="showChildren" style="margin: 0 0 0 1.071428571428571rem">
      <accordion-item
        v-for="(node, i) in nodes"
        :key="i"
        :index="i"
        :ref="'item' + i"
        :nodes="node.nodes"
        :label="node.label"
        :showedLabel="node.showedLabel"
        :chartTitle="node.chartTitle"
        :parentLabel="label"
        :route="node.route || $route.path"
        :itemType="node.itemType"
        :options="node.options"
        :defaultOption="node.defaultOption"
        :overlayNames="node.overlayNames"
        :defaultOverlayNames="node.defaultOverlayNames"
        @add-overlay="addOverlays"
        @remove-overlay="removeOverlays"
      ></accordion-item>
    </div>
  </div>
</template>

<script>
import { eventEmitter } from "../../../main.js";
import AccordionItem from "./AccordionItem.vue";

export default {
  name: "AccordionItem",
  props: {
    label: {
      type: String,
      required: false,
    },
    showedLabel: {
      type: String,
      required: false,
    },
    chartTitle: {
      type: String,
      required: false,
    },
    parentLabel: {
      type: String,
      required: false,
    },
    nodes: {
      required: true,
    },
    route: {
      type: String,
      required: false,
    },
    itemType: {
      type: String,
      required: false,
      default: "accordion",
    },
    options: {
      type: Array,
      required: false,
    },
    defaultOption: {
      required: false,
    },
    overlayNames: {
      type: Array,
      required: false,
    },
    index: {
      type: Number,
      required: false,
    },
    defaultOverlayNames: {
      type: Array,
      required: false,
    },
    isWrapper: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      selectedMainItem: [],
      showChildren: false,
      currentSelectedOption:
        this.$store.getters.getCurrentSelectedOption || this.defaultOption,
      allNodesLabels: [],
      childOverlays: [],
      childShowTips: {},
    };
  },
  components: {
    AccordionItem,
  },
  methods: {
    selectItem() {
      let mode = "default";
      if (!this.showChildren) {
        if (this.overlayNames && this.parentLabel) {
          const sameOverlay = this.$parent.childOverlays.find(
            (overlay) =>
              overlay.name === (this.showedLabel || this.label) &&
              overlay.parentName === this.parentLabel &&
              overlay.realLabel !== this.label
          );
          if (sameOverlay) {
            mode = "similar";
            this.$emit("remove-overlay", {
              parentName: sameOverlay.parentName,
              name: sameOverlay.name,
              index: sameOverlay.index,
              realLabel: sameOverlay.realLabel,
              chartTitle: sameOverlay.chartTitle,
              overlayNames: sameOverlay.overlayNames,
              defaultOverlayNames: sameOverlay.defaultOverlayNames,
              mode,
            });
          }
          this.$emit("add-overlay", {
            parentName: this.parentLabel,
            name: this.showedLabel || this.label,
            realLabel: this.label,
            index: this.index,
            chartTitle: this.chartTitle,
            overlayNames: this.overlayNames,
            defaultOverlayNames: this.defaultOverlayNames,
            mode,
          });
        }
      } else if (this.overlayNames && this.parentLabel) {
        this.$nextTick(() => {
          this.$emit("remove-overlay", {
            parentName: this.parentLabel,
            name: this.showedLabel || this.label,
            index: this.index,
            realLabel: this.label,
            chartTitle: this.chartTitle,
            overlayNames: this.overlayNames,
            defaultOverlayNames: this.defaultOverlayNames,
            mode,
          });
        });
      }

      this.showChildren = !this.showChildren;
    },
    addOverlays(overlay) {
      if (
        !this.childOverlays.some(
          (over) =>
            over.name === overlay.name &&
            over.parentName === overlay.parentName &&
            over.overlayNames.length === overlay.overlayNames.length &&
            over.defaultOverlayNames.length ===
              overlay.defaultOverlayNames.length
        )
      ) {
        this.childOverlays.push(overlay);
        const indexArr = [];
        this.allNodesLabels.forEach((label, i) => {
          if (this.childOverlays.some((over) => over.name === label)) {
            indexArr.push({ index: i, label });
          }
        });
        this.childOverlays = this.childOverlays.sort(
          (over, over2) =>
            indexArr.find((ind) => ind.label === over.name).index -
            indexArr.find((ind) => ind.label === over2.name).index
        );
        if (overlay.mode === "default") {
          this.$store.dispatch(
            "CHANGE_CURRENT_CHILD_OVERLAYS",
            this.childOverlays
          );
          eventEmitter.$emit("accept-overlay", this.childOverlays);
        } else if (overlay.mode === "similar") {
          eventEmitter.$emit("replace-realLabel", {
            realLabel: overlay.realLabel,
            chartTitle: overlay.chartTitle,
          });
        }
      }
    },
    removeOverlays(overlay) {
      const oldLength = this.childOverlays.length;
      this.childOverlays = this.childOverlays.filter((over) => {
        if (over.name === overlay.name) {
          return !(
            over.parentName === overlay.parentName &&
            over.overlayNames.length === overlay.overlayNames.length &&
            over.defaultOverlayNames.length ===
              overlay.defaultOverlayNames.length &&
            over.realLabel === overlay.realLabel
          );
        }
        return true;
      });
      this.$refs[`item${overlay.index}`][0].showChildren = false;
      if (oldLength !== this.childOverlays.length) {
        if (overlay.mode === "default") {
          eventEmitter.$emit("remove-overlay", overlay);
          this.$store.dispatch(
            "REMOVE_OVERLAY_FROM_CURRENT_CHILD_OVERLAYS",
            overlay
          );
        }
      }
    },
    getAccordionClass(opt) {
      const itemClass =
        this.currentSelectedOption === opt ||
        (this.currentSelectedOption.name === opt.name &&
          this.currentSelectedOption.parentName === opt.parentName)
          ? "accordion-active-item"
          : "accordion-item";
      return itemClass;
    },
  },
  computed: {
    getItemClassName() {
      return this.showChildren ? "accordion-active-item" : "accordion-item";
    },
    getItemRouteName() {
      return this.route ? this.route : this.$route.path;
    },
  },
  watch: {
    currentSelectedOption(newVal) {
      if (this.itemType === "select") {
        this.$store.dispatch("CHANGE_CURRENT_SELECTED_OPTION", newVal);
      }
    },
  },
  mounted() {
    if (this.nodes && this.itemType === "accordion") {
      this.nodes.forEach((node) => {
        this.allNodesLabels.push(node.label);
      });
    }
    if (this.isWrapper) {
      this.showChildren = true;
    }
    // if (this.currentSelectedOption) {
    //   this.$store.dispatch(
    //     "CHANGE_CURRENT_SELECTED_OPTION",
    //     this.currentSelectedOption
    //   );
    // }
  },
};
</script>

<style lang="scss" scoped>
a,
.accordion-second-wrapper {
  @include unselected-text();
  display: flex;
  flex-direction: column;
  width: $accordion-width;
  min-width: $accordion-item-minwidth;
  height: $accordion-height;
  font-size: $two-lvl-accordion-text-size;
  margin-bottom: 0.0746268656716418rem;
}
.accordion-item,
.accordion-active-item {
  cursor: pointer;
  width: $accordion-item-width;
  height: $accordion-item-height;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: $accordion-width;
  border-radius: $control-panel-border-radius;
  padding: $accordion-item-padding;
}
.accordion-item {
  background-color: $main-white-opacity2;
  border: $two-lvl-accordion-border;
  color: $accordion-text-color;
}
.accordion-active-item {
  background-color: $main-darkbrown-opacity;
  color: $main-white;
}
.accordion-active-item > .select-title {
  color: $main-white;
}
.accordion-item:hover {
  border: $two-lvl-accordion-hover-border;
  margin: 0px -0.0746268656716418rem 0px -0.0746268656716418rem; //  1px / 13.5
}
.accordion-item__title {
  font-family: $accordion-text-font;
  line-height: $accordion-title-line-height;
}
.select-wrapper {
  position: relative;
  left: 0%;
  display: block;
  align-content: center;
  max-width: $accordion-width;
  max-height: $accordion-width !important;
  // overflow-y: auto;
}
.select-item {
  cursor: pointer;
}
.select-arrow {
  position: absolute;
  left: calc(
    100% - #{$accordion-select-arrow-width} - #{$accordion-item-padding}
  );
  border-left: calc(#{$accordion-select-arrow-width} / 2) solid transparent;
  border-right: calc(#{$accordion-select-arrow-width} / 2) solid transparent;
  border-top: calc(#{$accordion-select-arrow-width} / 2) solid
    $main-darkbrown-opacity;
  transition: $select-arrow-transition;
  transform: rotate(0deg);
}
.accordion-active-item > .select-arrow {
  border-top: calc(#{$accordion-select-arrow-width} / 2) solid
    $main-white-opacity2;
  transform: rotate(180deg);
}
.select-wrapper::-webkit-scrollbar {
  width: 10px;
}
.select-wrapper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(189, 176, 176, 0.3);
  background-color: $main-white;
}
.select-wrapper::-webkit-scrollbar-thumb {
  background-color: $main-brown;
  outline: 1px solid $main-darkbrown;
}
</style>
