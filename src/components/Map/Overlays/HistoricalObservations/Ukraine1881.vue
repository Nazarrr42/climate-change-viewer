<template>
  <div>
    <l-geo-json
      :geojson="geoData"
      @click="gaugeClickGeoJson($event.layer, $event.layer.feature.properties)"
      :options="style.passive"
      @mouseover="
        createTooltipInLayer($event.layer, $event.layer.feature.properties)
      "
      @mouseout="
        uncreateTooltipInLayer($event.layer, $event.layer.feature.properties)
      "
      ref="ukraine1881"
    ></l-geo-json>
  </div>
</template>

<script>
/* relative imports */
import ClickedMultiPolygonMixin from "../../../../mixins/Map/ClickedMultiPolygonMixin.js";
import geoData from "../../../../../static/UA_country_with_tmp_1881_2020_anomalies.geojson";

const overlay = {
  name: "Ukraine (1881-2020)",
  parentName: "Historical observations",
};

export default {
  name: "Ukraine1881",
  mixins: [ClickedMultiPolygonMixin],
  overlay,
  data() {
    return {
      geoData,
      refName: "ukraine1881",
      layerPrefix: "observed",
    };
  },
};
</script>

<style></style>
