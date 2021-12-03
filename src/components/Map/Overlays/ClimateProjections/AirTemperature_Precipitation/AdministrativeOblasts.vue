<template>
  <div>
    <l-geo-json
      :geojson="geoData"
      @click="gaugeClickGeoJson($event.layer, $event.layer.feature.properties)"
      :options="style.passive"
      ref="administrativeOblasts"
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
import geoData from "../../../../../../static/UA_oblasts_simplified_01_with_anomalies.geojson";

const overlay = {
  name: "Administrative oblasts",
  parentName: "Climate projections (Euro-CORDEX)",
};
export default {
  name: "AdministrativeOblasts",
  mixins: [ClickedMultiPolygonMixin],
  overlay,
  data() {
    return {
      geoData,
      refName: "administrativeOblasts",
      layerPrefix: "era5_land",
    };
  },
};
</script>

<style></style>
