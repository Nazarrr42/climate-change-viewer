<template>
  <div>
    <l-geo-json
      :geojson="geoData"
      :options="style.passive"
      @click="gaugeClickGeoJson($event.layer, $event.layer.feature.properties)"
      ref="riverBasins"
      @mouseover="
        createTooltipInLayer($event.layer, $event.layer.feature.properties)
      "
      @mouseout="
        uncreateTooltipInLayer($event.layer, $event.layer.feature.properties)
      "
    ></l-geo-json>
  </div>
</template>

<script>
/* relative imports */
import ClickedMultiPolygonMixin from "../../../../../mixins/Map/ClickedMultiPolygonMixin.js";
import geoData from "../../../../../../static/UA_basins_simplified_01_with_anomalies.geojson";

const overlay = {
  name: "River basins",
  parentName: "Climate projections (Euro-CORDEX)",
};
export default {
  name: "RiverBasins",
  mixins: [ClickedMultiPolygonMixin],
  overlay,
  data() {
    return {
      geoData,
      refName: "riverBasins",
      layerPrefix: "era5_land",
    };
  },
};
</script>

<style></style>
