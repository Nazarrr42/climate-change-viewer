<template>
  <div class="accordion-second-wrapper">
    <accordion-item
      v-for="(item, i) in data"
      :key="i"
      :label="item.label"
      :showedLabe="item.showedLabel"
      :nodes="item.nodes"
      :route="item.route"
      :itemType="item.itemType"
      :chartTitle="item.chartTitle"
      :options="item.options"
      :defaultOption="item.defaultOption"
      :overlayNames="item.overlayNames"
      :defaultOverlayNames="item.defaultOverlayNames"
      :isWrapper="!!item.isWrapper"
    ></accordion-item>
  </div>
</template>

<script>
import AccordionItem from "./TwoLvlAccordionItem/AccordionItem.vue";

export default {
  name: "TwoLvlAccordion",
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  components: {
    AccordionItem,
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: $accordion-text-color;
}
.accordion-second-wrapper {
  display: flex;
  flex-direction: column;
  width: $accordion-width;
  min-width: $accordion-item-minwidth;
  height: $accordion-height;
  font-size: $two-lvl-accordion-text-size;
  // overflow-y: auto;
}
</style>
