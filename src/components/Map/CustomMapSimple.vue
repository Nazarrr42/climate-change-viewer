<template>
  <div
    :style="{ height: mapHeight, width: mapWidth }"
    class="map-wrapper"
    ref="mapWrapper"
  >
    <div class="blocker-wrapper" v-show="overlayLayerIsLoading">
      <div class="spinner-wrapper">
        <div class="spinner">
          <div class="spinner-dot"></div>
        </div>
      </div>
    </div>
    <div
      ref="mapToExport"
      class="mapToExport"
      :style="{ pointerEvents: overlayLayerIsLoading ? 'none' : 'auto' }"
    >
      <v-select
        :options="seasons.allSeasons"
        ref="seasonListComp"
        class="select-list gauges-list"
        v-model="seasons.currentSeason"
        v-show="!(isExportingToJpeg && isCurrentLayerWithoutColor)"
      ></v-select>

      <transition name="controlPanel-slide">
        <div
          class="discret-slider"
          v-if="showRangeSlider"
          :class="{ 'd-none': isExportingToJpeg && isCurrentLayerWithoutColor }"
        >
          <range-slider
            v-model="currentTimelineValue"
            :labels="getTimelineSlider.allTimelineValues"
            :endValue="getTimelineSlider.endValue"
            :tooltipMode="getTimelineSlider.tooltipMode"
            :disabled="!mapLoaded"
            :isExportingToJpeg="isExportingToJpeg"
          ></range-slider>
        </div>
      </transition>

      <div
        class="layers-group-wrapper"
        @click="layersPanelShower()"
        v-show="!isExportingToJpeg"
        :class="{ 'layers-group-wrapper-open': showLayersPanel }"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="layer-group"
          class="svg-inline--fa fa-layer-group fa-w-16 layers-group-icon"
          :class="{ 'layers-group-icon-open': showLayersPanel }"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          style="width: 1.771428571428571rem; height: 1.821428571428571rem"
        >
          <!--  width: 24.8px / 14, height: 25.5px / 14 -->
          <path
            fill="currentColor"
            d="M12.41 148.02l232.94 105.67c6.8 3.09 14.49 3.09 21.29 0l232.94-105.67c16.55-7.51 16.55-32.52 0-40.03L266.65 2.31a25.607 25.607 0 0 0-21.29 0L12.41 107.98c-16.55 7.51-16.55 32.53 0 40.04zm487.18 88.28l-58.09-26.33-161.64 73.27c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.51 209.97l-58.1 26.33c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 276.3c16.55-7.5 16.55-32.5 0-40zm0 127.8l-57.87-26.23-161.86 73.37c-7.56 3.43-15.59 5.17-23.86 5.17s-16.29-1.74-23.86-5.17L70.29 337.87 12.41 364.1c-16.55 7.5-16.55 32.5 0 40l232.94 105.59c6.8 3.08 14.49 3.08 21.29 0L499.59 404.1c16.55-7.5 16.55-32.5 0-40z"
          ></path>
        </svg>
      </div>
      <!-- <layer></layer> -->
      <div
        class="map-jpeg-wrapper"
        @click="exportMapToJpeg()"
        v-tooltip.left="'Download map in .jpeg'"
        v-show="!isExportingToJpeg"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="file-image"
          class="svg-inline--fa fa-file-image fa-w-12 layers-group-icon"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          style="width: 1.771428571428571rem; height: 1.821428571428571rem"
        >
          <!--  width: 24.8px / 14, height: 25.5px / 14 -->
          <path
            fill="currentColor"
            d="M384 121.941V128H256V0h6.059a24 24 0 0 1 16.97 7.029l97.941 97.941a24.002 24.002 0 0 1 7.03 16.971zM248 160c-13.2 0-24-10.8-24-24V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248zm-135.455 16c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.491-48 48-48zm208 240h-256l.485-48.485L104.545 328c4.686-4.686 11.799-4.201 16.485.485L160.545 368 264.06 264.485c4.686-4.686 12.284-4.686 16.971 0L320.545 304v112z"
          ></path>
        </svg>
      </div>

      <transition name="controlPanel-slide">
        <custom-switcher
          v-if="
            currentOverlayLayer
              ? currentOverlayLayer.parentName !== 'Historical observations'
              : true
          "
          :class="{ 'd-none': isExportingToJpeg }"
          ref="rcpSwitcher"
          class="rcp-switcher-wrapper"
          :switcherItems="[
            {
              text: 'Middle (RCP4.5)',
              tooltipText: 'Middle emissions scenario',
              value: 'rcp45',
            },
            {
              text: 'High (RCP8.5)',
              tooltipText: 'High emissions scenario',
              value: 'rcp85',
            },
          ]"
          :defaultValue="currentEmissionScenario"
          v-model="currentEmissionScenario"
        ></custom-switcher>
      </transition>

      <transition name="layers-panel-zoom-in-down">
        <div
          v-show="showLayersPanel"
          class="layers-panel"
          :class="{ 'd-none': isExportingToJpeg }"
          ref="layersPanel"
        >
          <span
            class="layers-panel__title layers-panel__title-select"
            @click="showBaseLayersPanel = !showBaseLayersPanel"
          >
            <p>Base layers</p>
            <!--  -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="10"
              ref="layersPanelArrow"
              role="presentation"
              class="layers-panel__arrow"
              :class="{ 'layers-panel__arrow-open': showBaseLayersPanel }"
              :style="{
                transform: showBaseLayersPanel
                  ? `scale(${currentRootFontSize / 17.5}) rotate(180deg)`
                  : `scale(${currentRootFontSize / 17.5})`,
              }"
            >
              <path
                d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z"
              ></path>
            </svg>
          </span>
          <div v-if="showBaseLayersPanel">
            <ul>
              <li
                v-for="(layer, i) in mapData"
                :key="i"
                class="layers-panel__li"
                :class="{ 'layers-panel__li-open': layer === currentMapLayer }"
              >
                <input
                  type="radio"
                  :value="layer"
                  v-model="currentMapLayer"
                  :id="layer.name"
                  class="layers-panel__radio custom__radio"
                  @click="
                    currentMapLayer.visible = false;
                    currentMapLayer = layer;
                    layer.visible = true;
                  "
                />
                <label :for="layer.name">{{ layer.name }}</label>
              </li>
              <li class="layers-panel__li">
                <input
                  type="radio"
                  class="layers-panel__checkbox custom__checkbox"
                  :value="{
                    parentName: 'Base layers',
                    name: 'River basins',
                    show: true,
                    type: 'radio',
                  }"
                  @click="
                    clickOnOverlayLayer('radio', 'River basins', 'Base layers')
                  "
                  id="river-basins"
                  v-model="currentOverlayLayer"
                />
                <label for="river-basins">River basins</label>
              </li>
            </ul>
          </div>

          <div
            v-for="(overlay, i) in dynamicOverlayLayers.concat(
              staticOverlayLayers
            )"
            :key="i"
          >
            <p class="layers-panel__title">{{ overlay.name }}</p>
            <div>
              <ul>
                <li
                  v-for="(overlayChildName, i) in overlay.overlayNames"
                  v-show="overlayChildName.show"
                  :key="i"
                  class="layers-panel__li"
                >
                  <input
                    :type="overlayChildName.type"
                    class="layers-panel__checkbox custom__checkbox"
                    :value="{
                      parentName: overlay.name,
                      name: overlayChildName.name,
                      show: overlayChildName.show,
                      realLabel: overlayChildName.realLabel,
                      chartTitle: overlayChildName.chartTitle,
                      type: overlayChildName.type,
                    }"
                    @click="
                      clickOnOverlayLayer(
                        overlayChildName.type,
                        overlayChildName.name,
                        overlay.name
                      )
                    "
                    :id="`${overlay.name}-${overlayChildName.name}`"
                    v-model="currentOverlayLayer"
                  />
                  <label :for="`${overlay.name}-${overlayChildName.name}`">{{
                    overlayChildName.name
                  }}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>

      <transition name="chart-slide">
        <div
          v-show="showDefaultChart && selectedGauges.length"
          :class="{ 'd-none': isExportingToJpeg }"
          class="chart"
        >
          <svg
            @click="closeChart()"
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="window-close"
            class="svg-inline--fa chart-close-btn fa-window-close fa-w-16"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            :style="{ width: `${16 / 14}rem`, height: `${16 / 14}rem` }"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z"
            ></path>
          </svg>
          <custom-chart-simple
            :key="showDefaultChart"
            :chartType="currentChartType"
            :chartId="'default-line-chart'"
            :chartHeight="parseInt(235)"
            :chartMode="currentChartMode"
            :period="baselinePeriod"
            :additionalTexts="additionalTexts"
            :chartLabel="currentChartLabel"
            :parentIsExportingToImg="isExportingToJpeg"
          ></custom-chart-simple>
        </div>
      </transition>

      <transition name="chart-slide">
        <div v-if="scaleIsShow" class="scale">
          <custom-scale
            :mode="getScaleObj.mode"
            :stepSize="getScaleObj.stepSize"
            :startValue="getScaleObj.startValue"
            :endValue="getScaleObj.endValue"
            :minValue="getScaleObj.minValue"
            :maxValue="getScaleObj.maxValue"
            :title="getScaleObj.title"
            :description="getScaleObj.description"
            :rgbaColors="getScaleObj.rgbaColors"
            :currentEmissionScenario="currentEmissionScenario"
          ></custom-scale>
        </div>
      </transition>

      <l-map
        ref="CustomMap"
        v-if="mapLoaded"
        :zoom="currentMapLayer.zoom"
        :center="mapParams.center"
        :options="getMapOptions"
        style="height: 100%"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
      >
        <l-control-attribution
          position="bottomleft"
          :prefix="false"
          class="custom-leaflet-attribution"
        ></l-control-attribution>
        <l-tile-layer
          v-for="tile in mapData"
          :key="tile.name"
          :url="tile.url"
          :name="tile.name"
          :attribution="tile.attribution"
          :subdomains="tile.subdomains"
          :tms="tile.tms"
          :visible="tile.visible"
          layer-type="base"
        />

        <all-overlays-simple
          :currentOverlayLayer="currentOverlayLayer"
          :selectedGauges="selectedGauges"
          :currentPeriod="currentTimelineValue"
          :currentEmissionScenario="currentEmissionScenario"
          :dataType="seasons.currentSeason.toLowerCase()"
          :rgbaColors="getScaleObj.rgbaColors"
          @gauge-click="gaugeClick"
          @update-current-center="updateMapCenter"
          @overlay-is-loaded="offBlockWrapper()"
        ></all-overlays-simple>
      </l-map>
    </div>
  </div>
</template>

<script>
/* Server import */
import { create } from "axios";
/* Absolute imports */
// import path from "path";
// import Layer from "../../../static";
// import fs from "fs";
import qs from "qs";
/* Vue-Select Import */
import "vue-select/dist/vue-select.css";
/* Map import */
import { latLng, SVG } from "leaflet";
import { LMap, LTileLayer, LControlAttribution } from "vue2-leaflet";
// import spin from "leaflet-spin";
import maxAndMinValues from "../../../static/Max_And_Min_Basin-and-Oblasts.json";
import maxAndMinValuesRCP45 from "../../../static/Max_And_Min_Basin-and-Oblasts_RCP45.json";
import maxAndMinValuesRCP85 from "../../../static/Max_And_Min_Basin-and-Oblasts_RCP85.json";
import staticOverlayLayers from "../../../static/accordion-staticOverlayLayers.json";
import maxAndMinValuesUkraineHistorical from "../../../static/Ukraine_historical_Min_And_Max.json";

/* Helping modules import */
import {
  findGauge,
  findGaugeByGauge,
  filterGauge,
  getGaugeObj,
  getServerParams,
  checkOverlaysSelectedOption,
  getLayerType,
} from "./overlayLayersModes.js";
/* Event emitter import */
import { eventEmitter } from "../../main.js";
/* Timeline import */
const RangeSlider = () => import("../Timelines/RangeSlider.vue");
/* Tooltip import */
const CustomScale = () => import("./Tooltips/CustomScale.vue");
/* Chart import */
const CustomChartSimple = () => import("../Charts/CustomChartSimple.vue");
const AllOverlaysSimple = () => import("./AllOverlaysSimple.vue");
/* UI-elements */
const CustomSwitcher = () => import("./UiElements/CustomSwitcher.vue");

export default {
  props: {
    mapData: {
      type: Array,
      required: true,
    },
    mapHeight: {
      type: String,
      required: true,
    },
    mapWidth: {
      type: String,
      required: true,
    },
  },
  emits: ["unselect-chart", "close-chart", "generate-default-simple-chart"],
  name: "CustomMapSimple",
  data() {
    return {
      currentLayerType: "",
      selectedGauges: [],
      selectedLayers: [],
      mapRenderer: { renderer: new SVG({ padding: 0 }) },
      scaleObj: {},
      currentEmissionScenario: "rcp85",
      currentTimelineValue: "2011-2020",
      showDefaultChart: false,
      currentChartType: "line",
      currentGauge: "Select gauge on a map",
      currentChartMode: { mode: "Daily", option: "Mean" },
      showLayersPanel: false,
      showBaseLayersPanel: false,
      mapLoaded: false,
      seasons: {
        allSeasons: ["Annual", "Winter", "Spring", "Summer", "Autumn"],
        currentSeason: "Annual",
      },
      currentMapLayer:
        this.mapData.find((layer) => layer.visible === true) || this.mapData[0],
      mapParams: {
        center: null,
        currentZoom: null,
        currentCenter: null,
      },
      currentOverlayLayer: {
        parentName: "Base layers",
        name: "River basins",
        show: true,
        type: "radio",
      },
      dynamicOverlayLayers: [],
      staticOverlayLayers: [],
      currentChartLabel: "",
      clickedOverlayLayer: null,
      isExportingToJpeg: false,
      overlayLayerIsLoading: false,
      serverUrl: "http://212.26.138.5:5001/",
      serverKey:
        "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTYyOTQwMjg5NywiaWF0IjoxNjI5NDAyODk3fQ.NRZxQT8LQws7vq5ZQAUZI4OZb37BAvvuvFb1Du8Nr2w",
      overlayMethods: {
        findGauge,
        findGaugeByGauge,
        filterGauge,
        getGaugeObj,
        checkOverlaysSelectedOption,
        getServerParams,
        getLayerType,
      },
      layerLoaded: true,
    };
  },
  computed: {
    showRangeSlider() {
      return this.currentOverlayLayer
        ? this.overlayMethods.getLayerType(this.currentOverlayLayer) !== "gauge"
        : true;
    },
    isCurrentLayerWithoutColor() {
      return ["gauge", "polygon"].includes(
        this.overlayMethods.getLayerType(this.currentOverlayLayer)
      );
    },
    getMapOptions() {
      return Object.assign(this.mapRenderer, this.currentMapLayer.mapOptions);
    },
    getTimelineSlider() {
      if (this.currentOverlayLayer) {
        if (
          this.currentOverlayLayer.parentName === "Historical observations" &&
          this.currentOverlayLayer.name === "Ukraine (1881-2020)"
        ) {
          return {
            tooltipMode: "historical",
            endValue: 168,
            allTimelineValues: {
              6: "1881-1890",
              18: "1891-1900",
              30: "1901-1910",
              42: "1911-1920",
              54: "1921-1930",
              66: "1931-1940",
              78: "1941-1950",
              90: "1951-1960",
              102: "1961-1970",
              114: "1971-1980",
              126: "1981-1990",
              138: "1991-2000",
              150: "2001-2010",
              162: "2011-2020",
            },
          };
        }
      }
      return {
        tooltipMode: "historical",
        endValue: 144,
        allTimelineValues: {
          6: "1981-1990",
          18: "1991-2000",
          30: "2001-2010",
          42: "2011-2020",
          54: "2021-2030",
          66: "2031-2040",
          78: "2041-2050",
          90: "2051-2060",
          102: "2061-2070",
          114: "2071-2080",
          126: "2081-2090",
          138: "2091-2100",
        },
      };
    },
    baselinePeriod() {
      if (this.currentOverlayLayer) {
        if (
          this.currentOverlayLayer.parentName ===
          "Climate projections (Euro-CORDEX)"
        ) {
          return "1981-2010";
        } else if (
          this.currentOverlayLayer.parentName === "Historical observations"
        ) {
          return "1881-1990";
        }
      }
      return "1981-2020";
    },
    getScaleObj() {
      const emissionScenario =
        this.currentEmissionScenario === "rcp85" ? "RCP8.5" : "RCP4.5";
      const rcpValues =
        this.currentEmissionScenario === "rcp85"
          ? this.maxAndMinValuesRCP85
          : this.maxAndMinValuesRCP45;
      if (this.currentOverlayLayer) {
        if (this.currentOverlayLayer.realLabel === "Precipitation") {
          return {
            mode: "cold2hot",
            rgbaColors: {
              maxValueColor: "rgba(7, 47, 97, 1)",
              minValueColor: "rgba(105, 0, 33, 1)",
            },
            stepSize: 5,
            minValue: this.maxAndMinValues.result.minPrecipitation,
            maxValue: this.maxAndMinValues.result.maxPrecipitation,
            startValue: rcpValues.result.minPrecipitation,
            endValue: rcpValues.result.maxPrecipitation,
            title: `Precipitation change over 1981-2010, %`,
            description: `(Historical - ERA5-Land, Projected - ${emissionScenario})`,
          };
        }
        if (this.currentOverlayLayer.realLabel === "Air temperature") {
          return {
            mode: "cold2hot",
            stepSize: 0.5,
            rgbaColors: {
              minValueColor: "rgba(7, 47, 97, 1)",
              maxValueColor: "rgba(105, 0, 33, 1)",
            },
            minValue: this.maxAndMinValues.result.minTemperature,
            maxValue: this.maxAndMinValues.result.maxTemperature,
            startValue: rcpValues.result.minTemperature,
            endValue: rcpValues.result.maxTemperature,
            title: `Air temperature change over 1981-2010, °C`,
            description: `(Historical - ERA5-Land, Projected - ${emissionScenario})`,
          };
        }
        if (
          this.currentOverlayLayer.parentName === "Historical observations" &&
          this.currentOverlayLayer.name === "Ukraine (1881-2020)"
        ) {
          return {
            mode: "cold2hot",
            stepSize: 0.5,
            rgbaColors: {
              minValueColor: "rgba(7, 47, 97, 1)",
              maxValueColor: "rgba(105, 0, 33, 1)",
            },
            minValue: this.maxAndMinValues.result.minTemperature,
            maxValue: this.maxAndMinValues.result.maxTemperature,
            startValue:
              this.maxAndMinValuesUkraineHistorical.result.minTemperature,
            endValue:
              this.maxAndMinValuesUkraineHistorical.result.maxTemperature,
            title: `Air temperature change over ${this.baselinePeriod}, °C`,
            // description: `(Historical - ERA5-Land, Projected - ${emissionScenario})`
          };
        }
      }
      return {
        mode: "cold2hot",
        stepSize: 5,
        rgbaColors: {
          maxValueColor: "rgba(7, 47, 97, 1)",
          minValueColor: "rgba(105, 0, 33, 1)",
        },
        minValue: this.maxAndMinValues.result.minPrecipitation,
        maxValue: this.maxAndMinValues.result.maxPrecipitation,
        startValue: rcpValues.result.minPrecipitation,
        endValue: rcpValues.result.maxPrecipitation,
        title: `Precipitation change over ${this.baselinePeriod}, %`,
        description: `(Historical - ERA5-Land, Projected - ${emissionScenario})`,
      };
    },
    scaleIsShow() {
      return (
        (this.currentOverlayLayer
          ? this.currentOverlayLayer.realLabel === "Precipitation" ||
            this.currentOverlayLayer.realLabel === "Air temperature" ||
            (this.currentOverlayLayer.name === "Ukraine (1881-2020)" &&
              this.currentOverlayLayer.parentName ===
                "Historical observations" &&
              this.currentOverlayLayer.realLabel !== "Precipitation")
          : false) &&
        !["gauge", "polygon"].includes(
          this.overlayMethods.getLayerType(this.currentOverlayLayer)
        )
      );
    },
    additionalTexts() {
      if (this.currentOverlayLayer) {
        if (
          this.currentOverlayLayer.parentName ===
          "Climate projections (Euro-CORDEX)"
        ) {
          return {
            defaultMode:
              "The ensemble mean is represented by line. The uncertainty ranges (values between 2.5 and 97.5 percentiles) are represented by shading.",
            anomaliesMode: "The ensemble mean is represented by line.",
          };
        } else if (
          this.currentOverlayLayer.parentName === "Historical observations"
        ) {
          return {
            defaultMode: "Mean of 155 meteorological stations across Ukraine.",
            anomaliesMode:
              "Mean of 155 meteorological stations across Ukraine.",
          };
        }
      }
      return {};
    },
    currentRootFontSize() {
      return parseFloat(document.querySelector(":root").style.fontSize) || 13.5;
    },
  },
  methods: {
    clickOnOverlayLayer(type, name, parentName) {
      if (this.currentOverlayLayer) {
        if (type === "radio") {
          if (
            this.currentOverlayLayer.parentName === parentName &&
            this.currentOverlayLayer.name === name
          ) {
            this.currentOverlayLayer = null;
          }
        }
      }
    },
    offBlockWrapper() {
      this.overlayLayerIsLoading = false;
    },
    zoomUpdate(zoom) {
      this.mapParams.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.mapParams.currentCenter = center;
    },
    updateMapCenter(center) {
      this.mapParams.center = latLng(center[0], center[1]);
    },
    closeChart() {
      this.showDefaultChart = false;
      this.currentGauge = null;
      this.clickedOverlayLayer = null;
      eventEmitter.$emit("close-chart");
      this.selectedLayers = [];
      this.selectedGauges = [];
    },
    isSelectedGauge(properties, clickedOverlay) {
      const res = !!this.selectedGauges.find(
        this.overlayMethods.findGauge(clickedOverlay, properties)
      );
      return res;
    },
    exportMapToJpeg() {
      this.isExportingToJpeg = true;
      this.$refs.mapToExport.style.cursor = "wait";
      this.$refs.mapToExport.style.pointerEvents = "none";
      const myTiles =
        this.$refs.CustomMap.$el.querySelectorAll("img.leaflet-tile");
      const tilesLeft = [];
      const tilesTop = [];
      for (let i = 0; i < myTiles.length; i += 1) {
        tilesLeft.push(
          parseFloat(myTiles[i].style.left.replace("px", "")) || 0
        );
        tilesTop.push(parseFloat(myTiles[i].style.top.replace("px", "")) || 0);
        myTiles[i].style.left = `${tilesLeft[i]}px`;
        myTiles[i].style.top = `${tilesTop[i]}px`;
      }
      const options = {
        width: this.$refs.mapToExport.clientWidth,
        height: this.$refs.mapToExport.clientHeight,
        windowWidth: document.documentElement.clientWidth,
        imageTimeout: 0,
        useCORS: true,
      };
      this.$nextTick(() => {
        this.$html2canvas(this.$refs.mapToExport, options)
          .then((canvas) => {
            let firstPartOfTitle = "Map";
            let secondPartOfTitle = "";
            if (this.currentOverlayLayer) {
              if (
                ["Air temperature", "Precipitation"].includes(
                  this.currentOverlayLayer.realLabel
                )
              ) {
                firstPartOfTitle += `_${this.currentOverlayLayer.realLabel
                  .split(" ")
                  .join("_")}`;
              } else if (
                this.currentOverlayLayer.parentName ===
                "Historical observations"
              ) {
                firstPartOfTitle += "_Air temperature";
              }
              if (!this.isCurrentLayerWithoutColor) {
                secondPartOfTitle = `_${
                  this.seasons.currentSeason
                }_${this.currentTimelineValue.split("-").join("_")}_${
                  parseInt(this.currentTimelineValue.split("-")[1]) <= 2021
                    ? "Historical"
                    : `Projected_${this.currentEmissionScenario.toUpperCase()}`
                }`;
              }
            }
            const title = `${firstPartOfTitle}${secondPartOfTitle}`;
            const link = document.createElement("a");
            link.download = `${title}.jpeg`;
            this.isExportingToJpeg = false;
            this.$refs.mapToExport.style.cursor = "inherit";
            this.$refs.mapToExport.style.pointerEvents = "auto";
            const canvasURL = canvas.toDataURL("image/jpeg");
            link.href = canvasURL;
            link.click();
          })
          .catch((err) => {
            throw new Error(err);
          });
      });
    },
    unselectGauge(properties, clickedOverlay) {
      let deletedGauge;
      let deletedGaugesArr = [];
      const newSelectedGauges = this.selectedGauges.filter(
        this.overlayMethods.filterGauge(clickedOverlay, properties)
      );
      this.selectedGauges.forEach((gauge, i) => {
        if (!deletedGauge) {
          deletedGauge = gauge === newSelectedGauges[i] ? deletedGauge : gauge;
        }
      });
      deletedGaugesArr = this.selectedGauges.filter(
        this.overlayMethods.findGaugeByGauge(deletedGauge)
      );
      this.selectedGauges = newSelectedGauges;
      deletedGaugesArr.forEach((delGauge) => {
        eventEmitter.$emit("unselect-chart", {
          gauge: delGauge,
          clickedOverlay,
        });
      });
      if (
        !this.selectedGauges.some((gauge) => gauge.overlay === clickedOverlay)
      ) {
        this.clickedOverlayLayer = null;
      }
    },
    selectGauge(properties, clickedOverlay) {
      this.selectedGauges.push(
        this.overlayMethods.getGaugeObj(clickedOverlay, properties)
      );
      this.clickedOverlayLayer = clickedOverlay;
    },
    layersPanelShower() {
      this.showLayersPanel = !this.showLayersPanel;
      this.showBaseLayersPanel = false;
    },
    async requestDataForGauge(params, type) {
      const myAxios = create({
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      const res = await myAxios
        .get(`${this.serverUrl}${type}`, {
          params,
        })
        .then((res) => res.data);
      return res;
    },
    async getGaugeData(gauge) {
      let defaultData = {};
      let movingData = {};
      let anomaliesData = {};
      let anomaliesMovingData = {};
      const labels = [];
      let valueType;
      if (
        this.currentOverlayLayer.parentName ===
        "Climate projections (Euro-CORDEX)"
      ) {
        valueType =
          this.currentOverlayLayer.realLabel === "Precipitation" ? "pr" : "tas";
      }
      if (this.currentOverlayLayer.parentName === "Historical observations") {
        valueType = "tmp";
      }
      const serverParams = this.overlayMethods.getServerParams(gauge);
      const { rcp, type } = serverParams;
      const params = Object.assign(serverParams, {
        value_type: valueType,
        season:
          this.seasons.currentSeason === "Annual"
            ? undefined
            : this.seasons.currentSeason.toLowerCase(),
        key: this.serverKey,
      });
      const serverData = await this.requestDataForGauge(params, type);
      // Absolute values
      const defaultHist = [];
      let defaultRcp85 = [];
      let defaultRcp45 = [];
      let defaultNonRcp = [];
      // Anomalies(Differences) values
      const anomaliesHist = [];
      const anomaliesRcp85 = [];
      const anomaliesRcp45 = [];
      const anomaliesNonRcp = [];
      // Moving values
      const movingHist = [];
      let movingRcp85 = [];
      let movingRcp45 = [];
      let movingNonRcp = [];
      // Anomalies Moving values
      const anomaliesMovingHist = [];
      const anomaliesMovingRcp85 = [];
      const anomaliesMovingRcp45 = [];
      const anomaliesMovingNonRcp = [];

      Object.entries(serverData).forEach((arr) => {
        arr[0] = arr[0].replace("means", "mean");
        const [key] = arr;
        if (key.includes("hist")) {
          if (key.includes("anomalies")) {
            if (key.includes("moving")) {
              anomaliesMovingHist.push(arr);
            } else {
              anomaliesHist.push(arr);
            }
          } else if (key.includes("moving")) {
            movingHist.push(arr);
          } else {
            defaultHist.push(arr);
          }
        } else if (key.includes("rcp45")) {
          if (key.includes("anomalies")) {
            if (key.includes("moving")) {
              anomaliesMovingRcp45.push(arr);
            } else {
              anomaliesRcp45.push(arr);
            }
          } else if (key.includes("moving")) {
            movingRcp45.push(arr);
          } else {
            defaultRcp45.push(arr);
          }
        } else if (key.includes("rcp85")) {
          if (key.includes("anomalies")) {
            if (key.includes("moving")) {
              anomaliesMovingRcp85.push(arr);
            } else {
              anomaliesRcp85.push(arr);
            }
          } else if (key.includes("moving")) {
            movingRcp85.push(arr);
          } else {
            defaultRcp85.push(arr);
          }
        } else if (key.includes("anomalies")) {
          if (key.includes("moving")) {
            anomaliesMovingNonRcp.push(arr);
          } else {
            anomaliesNonRcp.push(arr);
          }
        } else if (key.includes("moving")) {
          movingNonRcp.push(arr);
        } else if (key !== undefined) {
          defaultNonRcp.push(arr);
        }
      });
      // Сортируем массивы так, чтобы quantile975 был перврее quantile025,
      // а means был последним элементом
      defaultRcp45 = [
        ...defaultRcp45.slice(-1),
        defaultRcp45[1],
        defaultRcp45[0],
      ];
      defaultRcp85 = [
        ...defaultRcp85.slice(-1),
        defaultRcp85[1],
        defaultRcp85[0],
      ];

      movingRcp45 = [...movingRcp45.slice(-1), movingRcp45[1], movingRcp45[0]];
      movingRcp85 = [...movingRcp85.slice(-1), movingRcp85[1], movingRcp85[0]];

      if (defaultNonRcp.length > 0) {
        defaultNonRcp = [
          ...defaultNonRcp.slice(-1),
          defaultNonRcp[1],
          defaultNonRcp[0],
        ];
        defaultNonRcp.map((arr) => [`${arr[0]}_${rcp[0]}`, arr[1]]);
      }
      if (movingNonRcp.length > 0) {
        movingNonRcp = [
          ...movingNonRcp.slice(-1),
          movingNonRcp[1],
          movingNonRcp[0],
        ];
        movingNonRcp.map((arr) => [`${arr[0]}_${rcp[0]}`, arr[1]]);
      }

      defaultData = this.generateXY([
        ...defaultHist,
        ...defaultRcp45,
        ...defaultRcp85,
        ...defaultNonRcp,
      ]);
      anomaliesData = this.generateXY([
        ...anomaliesHist,
        ...anomaliesRcp45,
        ...anomaliesRcp85,
        ...anomaliesNonRcp,
      ]);

      movingData = this.generateXY([
        ...movingHist,
        ...movingRcp45,
        ...movingRcp85,
        ...movingNonRcp,
      ]);

      anomaliesMovingData = this.generateXY([
        ...anomaliesMovingHist,
        ...anomaliesMovingRcp45,
        ...anomaliesMovingRcp85,
        ...anomaliesMovingNonRcp,
      ]);
      return {
        defaultData,
        movingData,
        anomaliesData,
        anomaliesMovingData,
        labels,
      };
    },
    generateXY(entries) {
      const res = {};
      entries.forEach((arr) => {
        if (arr) {
          const [key, value] = arr;
          res[key] = value.map((dtLb) => {
            const [x, y] = dtLb.map((num) => parseFloat(num));
            return { x, y };
          });
        }
      });
      return res;
    },
    updateChartType(overlay) {
      this.currentChartType =
        overlay.parentName === "Climate projections (Euro-CORDEX)"
          ? "area"
          : "line";
    },
    async loadChart(gauge, mode) {
      this.updateChartType(gauge.overlay);
      const {
        defaultData,
        anomaliesData,
        movingData,
        anomaliesMovingData,
        labels,
      } = await this.getGaugeData(gauge);
      this.showDefaultChart = true;
      const label = gauge.getGaugeName;
      this.$nextTick(() => {
        // this.$nextTick() используется для корректного ре-рендеринга графика
        if (
          !this.currentChartLabel.includes(`(${this.seasons.currentSeason})`)
        ) {
          this.currentChartLabel +=
            this.seasons.currentSeason === "Annual"
              ? ``
              : ` (${this.seasons.currentSeason})`;
        }
        eventEmitter.$emit("generate-default-simple-chart", {
          label,
          data: {
            defaultData,
            anomaliesData,
            movingData,
            anomaliesMovingData,
          },
          labels,
          clickedOverlay: gauge.overlay,
          mode,
          chartTitle: this.currentOverlayLayer.chartTitle,
          fromDate: gauge.fromDate,
          toDate: gauge.toDate,
        });
      });
      return true;
    },
    updateCurrentOverlayLayer() {
      const checkedOverlaysSelectedOption =
        this.overlayMethods.checkOverlaysSelectedOption(
          this.$store.getters.getCurrentSelectedOption,
          this.dynamicOverlayLayers
        );
      checkedOverlaysSelectedOption.forEach((overlay) => {
        let overlayInAll = this.dynamicOverlayLayers.find(
          (over) => over.name === overlay.parentName
        );
        if (overlayInAll) {
          overlayInAll.overlayNames.find(
            (over) => over.name === overlay.name
          ).show = overlay.show;
          overlayInAll = JSON.parse(
            JSON.stringify(
              overlayInAll.overlayNames.find(
                (over) => over.name === overlay.name
              )
            )
          );
          overlayInAll.parentName = overlay.parentName;
        }
      });
    },
    updateDependentOverlays() {
      if (
        this.dynamicOverlayLayers.find(
          (overlay) =>
            overlay.name === "Climate projections (Euro-CORDEX)" &&
            overlay.realLabel === "Precipitation"
        )
      ) {
        this.staticOverlayLayers.forEach((overlay) => {
          overlay.overlayNames.forEach((over) => {
            over.show = false;
            if (this.currentOverlayLayer) {
              if (
                this.currentOverlayLayer.name === over.name &&
                this.currentOverlayLayer.parentName === overlay.name
              ) {
                this.currentOverlayLayer = null;
              }
            }
          });
        });
      } else {
        this.staticOverlayLayers.forEach((overlay) => {
          overlay.overlayNames.forEach((over) => {
            over.show = true;
          });
        });
      }
    },
    gaugeClick(params) {
      const { properties, clickedOverlay } = params;
      if (this.isSelectedGauge(properties, clickedOverlay)) {
        this.unselectGauge(properties, clickedOverlay);
        return false;
      }
      this.selectGauge(properties, clickedOverlay);
      eventEmitter.$emit("close-chart");
      this.$nextTick(() => {
        if (this.selectedGauges.length < 2) {
          this.loadChart(
            this.selectedGauges[this.selectedGauges.length - 1],
            "generate"
          );
        }
      });
      return true;
      // return params;
    },
    acceptOverlays(childOverlays) {
      const overlays = JSON.parse(JSON.stringify(childOverlays));
      overlays.forEach((overlay) => {
        overlay.overlayNames.forEach((childOverlay) => {
          let anotherShow;
          if (this.currentOverlayLayer) {
            if (
              childOverlay.name === this.currentOverlayLayer.name &&
              overlay.name === this.currentOverlayLayer.parentName &&
              overlay.type === this.currentOverlayLayer.type &&
              childOverlay.show !== this.currentOverlayLayer.show
            ) {
              anotherShow = this.currentOverlayLayer;
            }
            if (anotherShow) {
              childOverlay.show = anotherShow.show;
            }
          }
        });
      });
      this.dynamicOverlayLayers = overlays;
    },
    removeOverlay(overlay) {
      this.dynamicOverlayLayers = this.dynamicOverlayLayers.filter((over) => {
        if (over.name === overlay.name) {
          return over.parentName !== overlay.parentName;
        }
        return true;
      });
      if (this.currentOverlayLayer) {
        if (
          this.currentOverlayLayer.parentName === overlay.name &&
          overlay.overlayNames.some(
            (over) => over.name === this.currentOverlayLayer.name
          )
        ) {
          this.currentOverlayLayer = null;
        }
      }
    },
    replaceOverlayStrParams(strParams) {
      // Здесь мы делаем замену типа слоёв с "Air Temperature" на "Precipitation" и наоборот
      this.dynamicOverlayLayers.forEach((mainOverlay) => {
        mainOverlay.realLabel = strParams.realLabel;
        mainOverlay.defaultOverlayNames.forEach((overlay) => {
          overlay.realLabel = strParams.realLabel;
          overlay.chartTitle = strParams.chartTitle;
        });
        mainOverlay.overlayNames.forEach((overlay) => {
          overlay.realLabel = strParams.realLabel;
          overlay.chartTitle = strParams.chartTitle;
        });
      });
      if (this.currentOverlayLayer) {
        this.currentOverlayLayer.realLabel = strParams.realLabel;
        this.currentOverlayLayer.chartTitle = strParams.chartTitle;
      }
      /* Здесь мы делаем проверку на тип,
      и в определённых случаях отключаем возможность выбора некоторых слоёв */
      this.staticOverlayLayers.forEach((overlay) => {
        overlay.overlayNames.forEach((over) => {
          over.show = strParams.realLabel !== "Precipitation";
        });
      });
    },
  },
  watch: {
    "$store.state.AccordionState.currentSelectedOption": function () {
      this.updateCurrentOverlayLayer();
      this.updateDependentOverlays();
    },
    currentOverlayLayer(newVal, oldVal) {
      if (this.clickedOverlayLayer) {
        if (!this.currentOverlayLayer) {
          this.clickedOverlayLayer = null;
        } else if (
          this.currentOverlayLayer.name !== this.clickedOverlayLayer.name ||
          this.currentOverlayLayer.parentName !==
            this.clickedOverlayLayer.parentName ||
          this.currentOverlayLayer.type !== this.clickedOverlayLayer.type
        ) {
          this.clickedOverlayLayer = null;
        }
      }
      if (this.currentOverlayLayer) {
        this.overlayLayerIsLoading = true;
        if (!this.currentOverlayLayer.show) {
          this.currentOverlayLayer = null;
        } else if (
          this.currentOverlayLayer.parentName === "Historical observations" &&
          this.currentOverlayLayer.name === "Ukraine (1881-2020)"
        ) {
          this.currentTimelineValue = "1881-1890";
        } else if (oldVal !== null) {
          if (
            oldVal.parentName === "Historical observations" &&
            oldVal.name === "Ukraine (1881-2020)"
          ) {
            this.currentTimelineValue = "2011-2020";
          }
        }
      } else if (
        oldVal.parentName === "Historical observations" &&
        oldVal.name === "Ukraine (1881-2020)"
      ) {
        this.currentTimelineValue = "2011-2020";
      }
    },
    "currentOverlayLayer.realLabel": function (newVal, oldVal) {
      if (newVal === "Precipitation") {
        if (
          this.currentOverlayLayer.parentName === "Historical observations" &&
          this.currentOverlayLayer.name === "Ukraine (1881-2020)"
        ) {
          this.currentTimelineValue = "2011-2020";
        }
        this.staticOverlayLayers.forEach((overlay) => {
          overlay.overlayNames.forEach((over) => {
            over.show = false;
            if (this.currentOverlayLayer) {
              if (
                this.currentOverlayLayer.name === over.name &&
                this.currentOverlayLayer.parentName === overlay.name
              ) {
                this.currentOverlayLayer = null;
              }
            }
          });
        });
      }
      if (
        oldVal &&
        newVal &&
        this.selectedGauges[0] &&
        this.currentOverlayLayer
      ) {
        if (
          this.selectedGauges[0].overlay.parentName ===
          this.currentOverlayLayer.parentName
        ) {
          if (newVal !== oldVal) {
            eventEmitter.$emit("close-chart");
            this.selectedGauges.forEach((gauge) => {
              this.loadChart(gauge, "re-render");
            });
          }
        }
      }
    },
    clickedOverlayLayer(newVal, oldVal) {
      if (newVal === null && oldVal !== null) {
        this.closeChart();
        eventEmitter.$emit("close-chart");
      }
    },
    "seasons.currentSeason": function () {
      this.currentChartLabel = this.currentGauge.getGaugeName;
      eventEmitter.$emit("close-chart");
      this.selectedGauges.forEach((gauge) => {
        this.loadChart(gauge, "re-render");
      });
    },
    dynamicOverlayLayers() {
      this.updateDependentOverlays();
      this.updateCurrentOverlayLayer();
    },
    selectedGauges() {
      if (this.selectedGauges.length > 1) {
        this.selectedGauges = [
          this.selectedGauges[this.selectedGauges.length - 1],
        ];
      }
      if (this.selectedGauges.length < 1) {
        this.showDefaultChart = false;
        this.currentGauge = "Select gauge on a map";
        eventEmitter.$emit("close-chart");
      } else {
        this.currentGauge = this.selectedGauges[this.selectedGauges.length - 1];
      }
    },
    currentChartLabel() {
      if (!this.currentChartLabel && this.showDefaultChart) {
        this.showDefaultChart = false;
      }
    },
    currentGauge() {
      if (!this.currentGauge) {
        this.currentGauge = "Select gauge on a map";
      }
      this.currentChartLabel = this.currentGauge.getGaugeName;
    },
  },
  created() {
    this.maxAndMinValues = maxAndMinValues;
    this.maxAndMinValuesRCP45 = maxAndMinValuesRCP45;
    this.maxAndMinValuesRCP85 = maxAndMinValuesRCP85;
    this.staticOverlayLayers = staticOverlayLayers.data;
    this.maxAndMinValuesUkraineHistorical = maxAndMinValuesUkraineHistorical;
  },
  mounted() {
    this.mapParams.center = latLng(
      this.currentMapLayer.center[0],
      this.currentMapLayer.center[1]
    );
    this.mapParams.currentZoom = this.currentMapLayer.zoom;
    this.mapParams.currentCenter = this.currentMapLayer.center;
    this.mapLoaded = true;
    localStorage.setItem("current-hidden-legend-items", JSON.stringify([]));
    this.$store.dispatch("CHANGE_CURRENT_CLICKED_OVERLAY_LAYERS", []);
    this.$store.dispatch("RESET_CURRENT_CHILD_OVERLAYS");
    eventEmitter.$on("remove-overlay", this.removeOverlay);
    eventEmitter.$on("accept-overlay", this.acceptOverlays);
    eventEmitter.$on("replace-realLabel", this.replaceOverlayStrParams);
    // Чтобы достать стрелку из компонента в другой библиотеки, пришлось забраться в такие дебри :(
    const svgArrow = this.$refs.seasonListComp.$refs.actions.querySelector(
      ".vs__open-indicator"
    );
    svgArrow.setAttribute(
      "height",
      0.7142857142857143 * this.currentRootFontSize
    );
    svgArrow.setAttribute("width", 1 * this.currentRootFontSize);
    svgArrow.currentScale = this.currentRootFontSize / 14;
  },
  beforeDestroy() {
    this.closeChart();
  },
  components: {
    LMap,
    // Layer,
    LTileLayer,
    CustomChartSimple,
    AllOverlaysSimple,
    RangeSlider,
    CustomScale,
    CustomSwitcher,
    LControlAttribution,
  },
};
</script>

<style lang="scss" scoped>
.map-wrapper {
  max-height: 100vh;
  pointer-events: auto;
}
.mapToExport,
.blocker-wrapper {
  height: 100%;
  width: 100%;
}
.spinner-wrapper {
  position: absolute;
  z-index: 1000;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
}
.spinner {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: calc(50px / 9) solid $main-darkbrown;
  animation: spin 0.5s ease-in-out infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(360deg) scale(1.1);
  }
}
.spinner-dot {
  width: calc(50px / 9);
  height: calc(50px / 7);
  background-color: $main-brown;
  position: relative;
  top: 3%;
  transform: rotate(227deg);
}
.blocker-wrapper {
  position: absolute;
  z-index: 10000;
  cursor: progress !important;
}
.chart {
  position: absolute;
  top: calc(100% - #{$map-simple-chart-height});
  left: calc(100% - #{$map-simple-chart-width});
  max-width: $map-simple-chart-width;
  width: $map-simple-chart-width;
  height: $map-simple-chart-height;
  min-height: fit-content;
  background-color: $main-white;
  border: $map-chart-border;
  padding: $map-simple-chart-padding;
  border-radius: $control-panel-border-radius;
  z-index: 500;
}
@keyframes chart-slideup {
  0% {
    transform: translateY($map-simple-chart-height);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes chart-slidedown {
  100% {
    transform: translateY($map-simple-chart-height);
  }
}
.chart-slide-enter-active {
  animation: chart-slideup 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
.chart-slide-leave-active {
  animation: chart-slidedown 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
.chart-close-btn {
  position: absolute;
  left: calc(
    #{$map-simple-chart-width} - #{$map-chart-close-btn-width} - #{$map-chart-close-btn-margin-left}
  );
  top: 0.2857142857142857rem; //
  color: $main-darkbrown;
  transition: $control-panel-icon-transition;
  cursor: pointer;
}
.chart-close-btn:hover {
  color: $main-blue;
  transform: $control-panel-icon-hover-transform;
}
.scale {
  width: fit-content;
  height: fit-content;
  border: 1px solid $main-darkbrown-opacity;
  position: absolute;
  bottom: 1.071428571428571rem; //  15px / 14
  left: 1.071428571428571rem; //  15px / 14
  z-index: 500;
  border-radius: $control-panel-border-radius-small;
}
.layers-group-wrapper,
.map-jpeg-wrapper {
  position: absolute;
  z-index: 500;
  background-color: $main-white-opacity2;
  border: $layers-group-icon-border-width solid $main-darkbrown-opacity;
  border-radius: $layers-group-icon-border-radius;
  right: $map-icons-margin-left;
  height: $control-panel-height;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $main-darkbrown-opacity;
  cursor: pointer;
  padding: $layers-group-icon-padding;
}
.map-jpeg-wrapper {
  top: calc(#{$viz-control-position-top} + #{$control-panel-height} + 10px);
}
.layers-group-wrapper {
  top: $viz-control-position-top;
}
.layers-group-wrapper:hover,
.map-jpeg-wrapper:hover {
  color: $main-darkbrown;
  background-color: $main-white;
  border: $layers-group-icon-border-width solid $main-darkbrown;
}
.layers-group-wrapper:hover > .layers-group-icon,
.map-jpeg-wrapper:hover > .layers-group-icon {
  transform: $control-panel-icon-hover-transform;
}
.layers-group-icon {
  font-size: $layers-group-icon-size;
  color: inherit;
  transition: $layers-group-icon-transition;
}
.layers-group-wrapper-open {
  color: $main-darkbrown;
  background-color: $main-white;
  border: $layers-group-icon-border-width solid $main-darkbrown;
}
.layers-group-icon-open {
  transform: $control-panel-icon-hover-transform;
}

.layers-panel {
  position: absolute;
  z-index: 500;
  right: calc(
    #{$layers-group-icon-size} + #{$layers-group-icon-padding} + #{$map-lists-margin-left} +
      0.8571428571428571rem
  ); //  12px / 14
  top: calc(
    #{$viz-control-position-top} + #{$layers-group-icon-size} + #{$layers-group-icon-padding} +
      calc(#{$layers-group-icon-border-width} * 2) + 8px
  );
  border: $layers-group-icon-border-width solid $main-darkbrown;
  border-radius: $layers-group-icon-border-radius;
  min-height: fit-content;
  max-width: fit-content;
  padding: 3px 0 5px 0;
  background-color: $main-white-opacity2;
  font-family: $child-text-font;
  color: $main-darkbrown;
}
.layers-panel__li {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  list-style: none;
  flex-wrap: nowrap;
  font-size: $control-panel-font-size-small;
  padding: $layers-group-padding-top-bottom $layers-group-padding-left-right;
}
.layers-panel__li:hover {
  background-color: $main-darkbrown-opacity;
  color: $main-white;
  border: $layers-group-icon-border-width solid $main-darkbrown;
  border-width: $layers-group-icon-border-width 0;
  margin: -$layers-group-icon-border-width 0;
}
.layers-panel__li-open {
  background-color: $main-darkbrown-opacity;
  color: $main-white;
}
.layers-panel__li > label {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.layers-panel__li > input {
  margin-right: $layers-group-elements-margin-right;
  cursor: pointer;
}
.layers-panel__checkbox + label::before {
  margin-right: $layers-group-elements-margin-right;
}
.layers-panel__radio + label::before {
  margin-right: $layers-group-elements-margin-right;
}
.layers-panel__arrow {
  fill: $main-darkbrown;
  // transform: scale(0.8);
  position: absolute;
  left: calc(
    100% - #{$layers-group-padding-left-right} - #{$layers-group-input-size}
  );
  transition: $select-arrow-transition;
}
.layers-panel__arrow-open {
  fill: $main-darkbrown;
  // transform: rotate(180deg) scale(0.8);
}
.layers-panel__title {
  font-size: $control-panel-font-size;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0
    calc(#{$layers-group-padding-left-right} + #{$layers-group-input-size}) 0
    $layers-group-padding-left-right;
  margin: 2px 0;
  transition: all 0.3s ease-in-out 0s;
}
.layers-panel__title > p {
  margin-right: 2px;
}
.layers-panel__title-select:hover {
  cursor: pointer;
}

.layers-panel-zoom-in-down-enter-active,
.layers-panel-zoom-in-down-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}

.layers-panel-zoom-in-down-enter,
.layers-panel-zoom-in-down-enter-from,
.layers-panel-zoom-in-down-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
@keyframes controlPanel-slidedown {
  0% {
    transform: translateY(
      calc(-1.5 * (#{$viz-control-position-top} + #{$control-panel-height}))
    );
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes controlPanel-slideup {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(
      calc(-1.5 * (#{$viz-control-position-top} + #{$control-panel-height}))
    );
  }
}
.controlPanel-slide-enter-active {
  animation: controlPanel-slidedown 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
.controlPanel-slide-leave-active {
  animation: controlPanel-slideup 0.5s ease-in-out;
  animation-fill-mode: forwards;
}

.select-list {
  position: absolute;
  z-index: 500;
  background-color: $main-white;
  border-radius: $control-panel-border-radius;
  height: $control-panel-height;
  max-height: $control-panel-height;
  color: $main-darkbrown;
}
// .vs--open,
.vs__open-indicator {
  transform: scale(2) !important;
}
.gauges-list {
  top: $viz-control-position-top;
  left: calc(#{$map-gauges-list-width} + #{$map-lists-margin-left});
  width: $map-gauges-list-width;
}
.chart-modes-list {
  top: $viz-control-position-top;
  left: calc(
    #{$timeline-width} + #{$map-gauges-list-width} + #{$map-lists-margin-left} +
      #{$accordion-width} + #{$map-lists-margin-left} + #{$map-lists-margin-left}
  );
  max-width: $map-chart-lists-width;
  width: $map-chart-lists-width;
}
.chart-options-list {
  top: $viz-control-position-top;
  left: calc(
    #{$timeline-width} + #{$map-gauges-list-width} + #{$map-lists-margin-left} +
      #{$accordion-width} + #{$map-lists-margin-left} + #{$map-lists-margin-left} +
      #{$map-chart-lists-width} + #{$map-lists-margin-left}
  );
  width: $map-chart-lists-width;
  max-width: $map-chart-lists-width;
}
.discret-slider {
  position: absolute;
  z-index: 550;
  width: $timeline-width;
  height: $map-discret-slider-height;
  top: calc(
    #{$viz-control-position-top} + #{$control-panel-height} -
      1.285714285714286rem
  );
  font-family: $child-text-font;
  color: $main-darkbrown;
  left: calc(50% - (#{$timeline-width} / 2));
}
.rcp-switcher-wrapper {
  position: absolute;
  z-index: 500;
  top: $viz-control-position-top;
  right: 215px;
}
.d-none {
  display: none !important;
}
// Media querys
@media (max-width: 1279px) {
  .rcp-switcher-wrapper {
    right: 82px;
  }
  .discret-slider {
    left: calc(53.7% - (#{$timeline-width} / 2));
  }
}
@media (max-width: 1024px) {
  .rcp-switcher-wrapper {
    right: 5.857142857142857rem; //  82px / 14
  }
  .discret-slider {
    left: calc(55% - (#{$timeline-width} / 2));
  }
}
@media (max-width: 800px) {
  .rcp-switcher-wrapper {
    right: 5rem; //  70px / 14
  }
  .discret-slider {
    left: calc(55.75% - (#{$timeline-width} / 2));
  }
}
@media (min-width: 1280px) {
  .rcp-switcher-wrapper {
    right: 75px;
  }
  .discret-slider {
    left: calc(55.5% - (#{$timeline-width} / 2));
  }
}
@media (min-width: 1360px) {
  .discret-slider {
    left: calc(54.8% - (#{$timeline-width} / 2));
  }
}
@media (min-width: 1440px) {
  .rcp-switcher-wrapper {
    right: 95px;
  }
  .discret-slider {
    left: calc(54% - (#{$timeline-width} / 2));
  }
}
</style>
