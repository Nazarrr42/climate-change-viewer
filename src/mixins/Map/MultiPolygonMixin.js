/* absolute imports */
import { LTooltip, LPolygon, LGeoJson } from "vue2-leaflet";
/* relative imports */
import {
  getGaugeMarkerStyle,
  findGauge,
} from "../../components/Map/overlayLayersModes.js";
export default {
  data() {
    return {
      style: getGaugeMarkerStyle(this.$options.overlay),
    };
  },
  methods: {
    isSelectedGauge(properties) {
      const res = !!this.selectedGauges.find(
        findGauge(this.$options.overlay, properties)
      );
      return res;
    },
    defineGaugeMarkerStyle(properties) {
      const isSelected = this.isSelectedGauge(properties);
      return isSelected ? this.style.active : this.style.passive;
    },
  },
  mounted() {
    Object.entries(this.$refs[this.refName].mapObject._layers).forEach(
      ([key, value]) => {
        this.$refs[this.refName].mapObject._layers[key].bindTooltip(
          `<b>Basin</b>: ${value.feature.properties.Basin}</br>${
            value.feature.properties.Subbasin
              ? `<b>Subbasin</b>: ${value.feature.properties.Subbasin}`
              : ""
          }`
        );
      }
    );
    this.$emit("overlay-is-loaded");
  },
  components: {
    LTooltip,
    LPolygon,
    LGeoJson,
  },
};
