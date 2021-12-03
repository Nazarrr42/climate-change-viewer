/* absolute imports */
import { circleMarker } from "leaflet";
import { LCircleMarker, LGeoJson } from "vue2-leaflet";
/* relative imports */
import {
  getGaugeMarkerStyle,
  findGauge,
} from "../../components/Map/overlayLayersModes.js";
export default {
  props: {
    selectedGauges: {
      type: Array || null,
      required: true,
    },
  },
  data() {
    return {
      style: getGaugeMarkerStyle(this.$options.overlay),
      selectedLayers: [],
      currentSelectedLayerId: null,
      layerIsReady: false,
    };
  },
  methods: {
    isSelectedGauge(properties) {
      return !!this.selectedGauges.find(
        findGauge(this.$options.overlay, properties)
      );
    },
    defineGaugeMarkerStyle(properties) {
      return this.isSelectedGauge(properties)
        ? this.style.active
        : this.style.passive;
    },
    gaugeClickGeoJson(layer, properties) {
      if (this.layerIsReady) {
        this.$nextTick(() => {
          this.$emit("gauge-click", {
            properties,
            clickedOverlay: this.$options.overlay,
          });
        });
        if (this.currentSelectedLayerId) {
          this.$refs[this.refName].mapObject._layers[
            this.currentSelectedLayerId
          ].setStyle(this.style.passive);
        }
        this.currentSelectedLayerId = layer._leaflet_id;
        if (this.isSelectedGauge(properties)) {
          layer.setStyle(this.style.passive);
        } else {
          layer.setStyle(this.style.active);
        }
      }
    },
    defineLayersStyle(layers) {
      layers.forEach((layer) => {
        layer._mapToAdd._layers[layer._leaflet_id].setStyle(
          this.defineGaugeMarkerStyle(layer)
        );
      });
    },
    createCircles(feature, latlng) {
      return circleMarker(latlng, this.style.passive).bindTooltip(
        this.createTooltip(feature.properties)
      );
    },
  },
  watch: {
    selectedGauges() {
      if (this.selectedGauges.length < 1) {
        if (this.currentSelectedLayerId) {
          this.$refs[this.refName].mapObject._layers[
            this.currentSelectedLayerId
          ].setStyle(this.style.passive);
        }
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.layerIsReady = true;
    }, 0);
    this.$emit("overlay-is-loaded");
  },
  components: {
    LCircleMarker,
    LGeoJson,
  },
};
