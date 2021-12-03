<template>
  <div>
    <l-geo-json
      :geojson="geoData"
      @click="gaugeClickGeoJson($event.layer, $event.layer.feature.properties)"
      @mouseover="
        createTooltipInLayer($event.layer, $event.layer.feature.properties)
      "
      @mouseout="
        uncreateTooltipInLayer($event.layer, $event.layer.feature.properties)
      "
      :options="style.passive"
      ref="territorialCommunities"
    ></l-geo-json>
  </div>
</template>

<script>
/* relative imports */
import ClickedMultiPolygonMixin from "../../../../../mixins/Map/ClickedMultiPolygonMixin.js";
import geoData from "../../../../../../static/UA_terhromads_en_with_anomalies.geojson";

const overlay = {
  name: "Territorial communities",
  parentName: "Climate projections (Euro-CORDEX)",
};

export default {
  name: "TerritorialCommunities",
  overlay,
  mixins: [ClickedMultiPolygonMixin],
  data() {
    return {
      geoData,
      refName: "territorialCommunities",
      layerPrefix: "era5_land",
    };
  },
};
</script>

<style></style>
