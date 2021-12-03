<template>
  <div>
    <component
      :is="componentName"
      :currentPeriod="currentPeriod"
      :selectedGauges="selectedGauges"
      :currentEmissionScenario="currentEmissionScenario"
      :layerType="currentOverlayLayer ? currentOverlayLayer.realLabel : null"
      :dataType="dataType"
      :rgbaColors="rgbaColors"
      @gauge-click="gaugeClick"
      @update-current-center="updateParentCurrentCenter"
      @overlay-is-loaded="$emit('overlay-is-loaded')"
      ref="dynamicLayer"
    ></component>
  </div>
</template>

<script>
/* Base layers | imports */
const UaBasins = () => import("./Overlays/BaseLayers/UaBasins.vue");
/* Climate projections -> Air Temperature/Precipitation | imports */
const AdministrativeOblasts = () =>
  import(
    "./Overlays/ClimateProjections/AirTemperature_Precipitation/AdministrativeOblasts.vue"
  );
const AdministrativeRayons = () =>
  import(
    "./Overlays/ClimateProjections/AirTemperature_Precipitation/AdministrativeRayons.vue"
  );
const TerritorialCommunities = () =>
  import(
    "./Overlays/ClimateProjections/AirTemperature_Precipitation/TerritorialCommunities.vue"
  );
const ClimateProjectionNodes = () =>
  import(
    "./Overlays/ClimateProjections/AirTemperature_Precipitation/ClimateProjectionNodes.vue"
  );
const RiverBasins = () =>
  import(
    "./Overlays/ClimateProjections/AirTemperature_Precipitation/RiverBasins.vue"
  );
const UkraineProjected = () =>
  import(
    "./Overlays/ClimateProjections/AirTemperature_Precipitation/UkraineProjected.vue"
  );
/* *Out Accordion* Historical observations | imports */
const Ukraine1881 = () =>
  import("./Overlays/HistoricalObservations/Ukraine1881.vue");
const MeteorologicalStations = () =>
  import("./Overlays/HistoricalObservations/MeteorologicalStations.vue");

export default {
  name: "AllOverlaysSimple",
  components: {
    UaBasins,
    AdministrativeOblasts,
    ClimateProjectionNodes,
    RiverBasins,
    AdministrativeRayons,
    TerritorialCommunities,
    Ukraine1881,
    MeteorologicalStations,
    UkraineProjected,
  },
  props: {
    selectedGauges: {
      type: Array || null,
      required: true,
    },
    currentOverlayLayer: {
      // type: Object || null,
      required: true,
    },
    currentPeriod: {
      type: String,
      required: true,
    },
    currentEmissionScenario: {
      type: String,
      required: true,
    },
    dataType: {
      type: String,
      required: true,
    },
    rgbaColors: {
      type: Object,
      required: false,
      default: () => {
        return {
          minValueColor: "rgba(7, 47, 97, 1)",
          maxValueColor: "rgba(105, 0, 33, 1)",
        };
      },
    },
  },
  computed: {
    componentName() {
      if (this.currentOverlayLayer) {
        if (
          this.currentOverlayLayer.parentName === "Base layers" &&
          this.currentOverlayLayer.name === "River basins"
        ) {
          return "UaBasins";
        }
        if (
          this.currentOverlayLayer.parentName === "Historical observations" &&
          this.currentOverlayLayer.name === "Ukraine (1881-2020)"
        ) {
          return "Ukraine1881";
        }
        if (
          this.currentOverlayLayer.parentName === "Historical observations" &&
          this.currentOverlayLayer.name ===
            "Meteorological stations (1881-2020)"
        ) {
          return "MeteorologicalStations";
        }
        if (
          this.currentOverlayLayer.parentName ===
            "Climate projections (Euro-CORDEX)" &&
          this.currentOverlayLayer.name === "grid 0.11x0.11°"
        ) {
          return "ClimateProjectionNodes";
        }
        if (
          this.currentOverlayLayer.parentName ===
            "Climate projections (Euro-CORDEX)" &&
          this.currentOverlayLayer.name === "Ukraine"
        ) {
          return "UkraineProjected";
        }
        if (
          this.currentOverlayLayer.parentName ===
            "Climate projections (Euro-CORDEX)" &&
          this.currentOverlayLayer.name === "Administrative oblasts"
        ) {
          return "AdministrativeOblasts";
        }
        if (
          this.currentOverlayLayer.parentName ===
            "Climate projections (Euro-CORDEX)" &&
          this.currentOverlayLayer.name === "Administrative rayons"
        ) {
          return "AdministrativeRayons";
        }
        if (
          this.currentOverlayLayer.parentName ===
            "Climate projections (Euro-CORDEX)" &&
          this.currentOverlayLayer.name === "Territorial communities"
        ) {
          return "TerritorialCommunities";
        }
        if (
          this.currentOverlayLayer.parentName ===
            "Climate projections (Euro-CORDEX)" &&
          this.currentOverlayLayer.name === "River basins"
        ) {
          return "RiverBasins";
        }
      }
      return false;
    },
  },
  methods: {
    gaugeClick(param) {
      this.$emit("gauge-click", param);
    },
    updateParentCurrentCenter(latlng) {
      this.$emit("update-current-center", latlng);
    },
  },
};
</script>

<style></style>
