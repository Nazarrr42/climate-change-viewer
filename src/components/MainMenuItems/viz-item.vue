<template>
  <!-- <div class="viz-wrapper" :style="{ width: screenWidth + 'px' }"> -->
  <div
    class="viz-wrapper"
    :style="{ width: '100vw', minWidth: screenWidth + 'px' }"
  >
    <custom-map-simple
      :mapData="mapsData.mapOfUkraine"
      :mapHeight="'100%'"
      :mapWidth="'100%'"
      @set-current-gauge-date="setDate($event)"
      class="viz-map"
    >
    </custom-map-simple>

    <two-lvl-accordion
      class="viz-accordion"
      :data="accordionData"
    ></two-lvl-accordion>

    <!-- <timeline-calendar class="viz-timeline"></timeline-calendar> -->
  </div>
</template>

<script>
/* Timeline */
// import TimelineCalendar from "../Timelines/TimelineCalendar.vue";
/* Accordion */
import TwoLvlAccordion from "../Accordions/TwoLvlAccordion.vue";
// import accordionDataJSON from "../Accordions/accordion-data.json";
// import accordionDataJSON from "../Accordions/accordion-data-simple.json";
import accordionDataJSON from "../Accordions/accordion-data-site.json";
/* Map */
// import CustomMap from "../Map/CustomMap.vue";
import CustomMapSimple from "../Map/CustomMapSimple.vue";
import mapsData from "../Map/maps-data.json";

export default {
  name: "viz-item",
  data() {
    return {
      maxScreenWidth: null,
      accordionData: [],
      mapsData: {},
    };
  },
  components: {
    TwoLvlAccordion,
    /* CustomMap, */ CustomMapSimple /* , TimelineCalendar */,
  },
  created() {
    // this.screenWidth = window.screen.width - 70;
    this.screenWidth = window.screen.width; // Для сайта
    // this.screenHeight = window.screen.height; // Для сайта
    // if (screenWidth <= 1024) {

    // }
    this.accordionData = accordionDataJSON.vizItem.twoLvlAccordionData;
    this.mapsData = mapsData.vizItem;
  },
};
</script>

<style lang="scss">
.viz-wrapper {
  height: calc(100vh - 10px);
  min-height: $main-content-min-height; // Для сайта
  // min-width: calc(100vw - 70px);
  min-width: 100vw; // Для сайта
}
.viz-map {
  position: relative;
  top: 0;
  left: 0px;
  z-index: 0;
  overflow: hidden;
  min-height: $main-content-min-height;
}
.viz-accordion {
  position: absolute;
  top: $viz-control-position-top;
  left: 1px;
  z-index: 1;
  max-height: calc(100vh - 165px);
}
.viz-timeline {
  position: absolute;
  top: $viz-control-position-top;
  left: 500px;
  z-index: 1;
}
.viz-accordion::-webkit-scrollbar {
  width: 10px;
}
.viz-accordion::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(189, 176, 176, 0.3);
  background-color: $main-white;
}
.viz-accordion::-webkit-scrollbar-thumb {
  background-color: $main-brown;
  outline: 1px solid $main-darkbrown;
}
</style>
