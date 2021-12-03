<template>
  <div>
    <l-geo-json
      :geojson="uaBasins"
      :options="style.passive"
      ref="uaBasins"
    ></l-geo-json>
  </div>
</template>

<script>
/* relative imports */
import MultiPolygonMixin from "../../../../mixins/Map/MultiPolygonMixin.js";
import uaBasins from "../../../../../static/UA_basins_simplified_01.geojson";

const overlay = {
  name: "River basins",
  parentName: "Base layers",
};

export default {
  name: "UaBasins",
  mixins: [MultiPolygonMixin],
  overlay,
  data() {
    return {
      uaBasins,
      refName: "uaBasins",
    };
  },
};
</script>

<style>
.uaBasins-polygon {
  cursor: default !important;
}
</style>
