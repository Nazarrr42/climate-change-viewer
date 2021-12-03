<template>
  <div>
    <l-geo-json
      ref="meteorologicalStations"
      pane="overlayPane"
      :geojson="geoData"
      :options="{
        pointToLayer: createCircles,
      }"
      @click="gaugeClickGeoJson($event.layer, $event.layer.feature.properties)"
    >
    </l-geo-json>
  </div>
</template>

<script>
/* relative imports */
import ClickedGaugesMixin from "../../../../mixins/Map/ClickedGaugesMixin.js";
import geoData from "../../../../../static/UA_meteostations_tmp_1881_2020.geojson";

const overlay = {
  name: "Meteorological stations (1881-2020)",
  parentName: "Historical observations",
};
export default {
  mixins: [ClickedGaugesMixin],
  name: "MeteorologicalStations",
  overlay,
  data() {
    return {
      geoData,
      refName: "meteorologicalStations",
    };
  },
  methods: {
    createTooltip(properties) {
      return `${properties.St_EN}`;
    },
  },
};
</script>

<style lang="scss">
.unselect-icon {
  width: 12px;
  height: 12px;
  background-color: $main-blue;
  border-radius: 50%;
}
</style>
