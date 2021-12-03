<template>
  <div>
    <l-geo-json
      ref="climateNodes"
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
import ClickedGaugesMixin from "../../../../../mixins/Map/ClickedGaugesMixin.js";
import geoData from "../../../../../../static/Clim_proj_nodes.geojson";

const overlay = {
  name: "grid 0.11x0.11°",
  parentName: "Climate projections (Euro-CORDEX)",
};
export default {
  mixins: [ClickedGaugesMixin],
  name: "ClimateProjectionNodes",
  overlay,
  data() {
    return {
      geoData,
      refName: "climateNodes",
    };
  },
  methods: {
    createTooltip(properties) {
      return `<b>Latitude</b>: ${properties.lat}<br><b>Longitude</b>: ${properties.lon}`;
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
