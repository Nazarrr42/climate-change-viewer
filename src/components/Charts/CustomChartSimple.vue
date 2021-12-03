<template>
  <div class="chart-wrapper">
    <div ref="contentToExportImg">
      <!-- Для коректного экспорта в фото -->
      <div style="height: 1px"></div>
      <div class="chart-title">
        <strong>
          {{ chartLabel }}
        </strong>
      </div>
      <!-- <div
        style="display: flex; justify-content: flex-end; max-width: fit-content"
      > -->
      <scatter-chart-simple
        :chart-data="defaultChartData"
        :options="defaultScatterChartOptions"
        :height="chartHeight"
        :chart-id="chartId"
        :exportingToImage="exportingToImage"
        :additionalDescriptionHeight="$refs.additionalDescription"
        :chartIsSmoothed="chartIsSmoothed"
        :currentDataMode="currentDataMode"
        :xAxesMinForTicks="defaultScatterChartOptions.scales.xAxes[0].ticks.min"
        :parentIsExportingToImg="parentIsExportingToImg"
        @hide-legend="hideLegend"
        @show-legend="showLegend"
      ></scatter-chart-simple>
      <!-- </div> -->
      <div class="additional-description" ref="additionalDescription">
        {{ currentAdditionalText }}
      </div>
      <div class="control-panel">
        <div class="smoothingInput" ref="smoothingInput">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            style="fill: rgb(57, 61, 63)"
            class="checkmark"
            ref="checkmarkSvg"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
          <input
            type="radio"
            class="chart__checkbox-calm chart__checkbox"
            :class="{ 'chart__checkbox-checked': chartIsSmoothed }"
            @click="chartIsSmoothed = !chartIsSmoothed"
            :v-model="chartIsSmoothed"
            id="is-smothed"
          />

          <label for="is-smothed" class="smoothingCheckbox"
            >5-year moving average</label
          >
        </div>
        <div class="currentDataInput" ref="currentDataInput">
          <input
            type="radio"
            class="chart__radio custom__radio"
            value="defaultData"
            id="defaultDataRadio"
            v-model="currentDataMode"
          />
          <label for="defaultDataRadio" class="currentDataRadio"
            >Absolute values</label
          >
          <input
            type="radio"
            class="chart__radio custom__radio"
            value="anomaliesData"
            id="anomaliesDataRadio"
            v-model="currentDataMode"
          />
          <label for="anomaliesDataRadio" class="currentDataRadio"
            >Anomalies (baseline {{ period }})</label
          >
        </div>
      </div>
    </div>
    <div class="download-icons-block">
      <p class="download-icons-block__title">Download:</p>
      <a :id="chartId + '-' + 'link-1'" class="download-icons-block__link">
        <svg
          @click.stop="exportToImage($event, chartId + '-' + 'link-1')"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="file-image"
          class="svg-inline--fa fa-file-image fa-w-12 active-icon download-icon"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          :style="{ width: `${15 / 13.5}rem`, height: `${20 / 13.5}rem` }"
          viewBox="0 0 384 512"
        >
          <!--  -->
          <path
            fill="currentColor"
            d="M384 121.941V128H256V0h6.059a24 24 0 0 1 16.97 7.029l97.941 97.941a24.002 24.002 0 0 1 7.03 16.971zM248 160c-13.2 0-24-10.8-24-24V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248zm-135.455 16c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.491-48 48-48zm208 240h-256l.485-48.485L104.545 328c4.686-4.686 11.799-4.201 16.485.485L160.545 368 264.06 264.485c4.686-4.686 12.284-4.686 16.971 0L320.545 304v112z"
          ></path>
        </svg>
      </a>

      <a :id="chartId + '-' + 'link-2'" class="download-icons-block__link">
        <svg
          @click.stop="exportToCsv(chartId + '-' + 'link-2')"
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="file-csv"
          class="svg-inline--fa fa-file-csv fa-w-12 active-icon download-icon"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          :style="{ width: `${15 / 13.5}rem`, height: `${20 / 13.5}rem` }"
          viewBox="0 0 384 512"
        >
          <!--  -->
          <path
            fill="currentColor"
            d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm-96 144c0 4.42-3.58 8-8 8h-8c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h8c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8h-8c-26.51 0-48-21.49-48-48v-32c0-26.51 21.49-48 48-48h8c4.42 0 8 3.58 8 8v16zm44.27 104H160c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h12.27c5.95 0 10.41-3.5 10.41-6.62 0-1.3-.75-2.66-2.12-3.84l-21.89-18.77c-8.47-7.22-13.33-17.48-13.33-28.14 0-21.3 19.02-38.62 42.41-38.62H200c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8h-12.27c-5.95 0-10.41 3.5-10.41 6.62 0 1.3.75 2.66 2.12 3.84l21.89 18.77c8.47 7.22 13.33 17.48 13.33 28.14.01 21.29-19 38.62-42.39 38.62zM256 264v20.8c0 20.27 5.7 40.17 16 56.88 10.3-16.7 16-36.61 16-56.88V264c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v20.8c0 35.48-12.88 68.89-36.28 94.09-3.02 3.25-7.27 5.11-11.72 5.11s-8.7-1.86-11.72-5.11c-23.4-25.2-36.28-58.61-36.28-94.09V264c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8zm121-159L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"
          ></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
import { plugins, defaults } from "chart.js";
import ScatterChartSimple from "./ScatterChartSimple.vue";
import { eventEmitter } from "../../main.js";

defaults.global.defaultFontFamily = "'Open Sans', sans-serif";
defaults.global.defaultFontColor = "rgb(57, 61, 63)";
defaults.global.defaultFontSize =
  (9 / 13.5) *
  (parseFloat(document.querySelector(":root").style.fontSize) || 13.5);
defaults.global.defaultColor = "white";

plugins.register({
  beforeDraw: (chart) => {
    const ctx = chart.canvas.getContext("2d");
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
});

export default {
  components: { ScatterChartSimple },
  name: "CustomChartSimple",
  props: {
    period: {
      type: String,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
    },
    chartMode: {
      type: Object,
      required: true,
    },
    chartId: {
      type: String,
      required: true,
    },
    chartHeight: {
      type: Number,
      required: true,
    },
    chartLabel: {
      type: String,
      required: false,
    },
    additionalTexts: {
      type: Object,
      required: true,
    },
    parentIsExportingToImg: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      currentOverlays: [],
      exportingToImage: false,
      chartIsSmoothed: false,
      currentMode: "",
      currentDate: {
        fromDate: null,
        toDate: null,
      },
      currentAdditionalText: "",
      currentDataMode: "defaultData",
      defaultScatterChartOptions: {
        animation: {
          duration: 1000,
        },
        tooltips: {
          enabled: true,
        },
        elements: {
          point: {
            radius: 0,
          },
          line: {
            tension: 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
          position: "top",
          align: "start",
          labels: {
            boxWidth: 20,
            fontSize: 10,
            fontFamily: "'Open Sans', sans-serif",
            useLineStyle: true,
            fontColor: "rgb(57, 61, 63)",
          },
        },
        layout: {
          padding: {
            left:
              (5 / 13.5) *
              (parseFloat(document.querySelector(":root").style.fontSize) ||
                13.5),
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        plugins: {
          filler: {
            propagate: false,
          },
        },
        scales: {
          xAxes: [
            {
              type: "linear",
              position: "bottom",
              ticks: {
                min: 1981,
                autoSkip: false,
                stepSize: 20,
              },
              gridLines: {
                display: true,
                drawBorder: true,
                color: "rgba(57, 61, 63, 0.6)",
                zeroLineColor: "rgba(57, 61, 63, 0.6)",
                lineWidth: 1,
                tickMarkLength: 6,
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              id: "firstOverlay",
              type: "linear",
              position: "left",
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Discharge, m³/s",
                position: "left",
                fontFamily: "'Open Sans', sans-serif",
                fontColor: "rgb(57, 61, 63)",
                fontSize:
                  (11.5 / 13.5) *
                  (parseFloat(document.querySelector(":root").style.fontSize) ||
                    13.5),
                fontStyle: "normal",
                lineHeight: 0.05,
              },
              ticks: {
                maxTicksLimit: 16,
              },
              gridLines: {
                display: true,
                drawBorder: true,
                color: "rgba(57, 61, 63, 0.6)",
                zeroLineColor: "rgba(57, 61, 63, 0.6)",
                lineWidth: 1,
                drawOnChartArea: false,
              },
            },
            {
              id: "secondOverlay",
              type: "linear",
              position: "right",
              scaleLabel: {
                display: true,
                labelString: "Second Overlay",
                position: "left",
                fontFamily: "'Open Sans', sans-serif",
                fontColor: "rgb(57, 61, 63)",
                fontSize:
                  (11.5 / 13.5) *
                  (parseFloat(document.querySelector(":root").style.fontSize) ||
                    13.5),
                fontStyle: "bold",
                lineHeight: 0.05,
              },
              display: false,
              gridLines: {
                display: true,
                drawBorder: true,
                color: "rgba(57, 61, 63, 0.6)",
                zeroLineColor: "rgba(57, 61, 63, 0.6)",
                lineWidth: 1,
                tickMarkLength: 6,
                drawOnChartArea: false,
              },
            },
          ],
        },
        showLine: true,
      },
      defaultChartData: {
        labels: [],
        datasets: [],
      },
      originalChartData: {
        defaultData: {
          labels: [],
          datasets: [],
          isHidden: false,
        },
        movingData: {
          labels: [],
          datasets: [],
          isHidden: true,
        },
        anomaliesData: {
          labels: [],
          datasets: [],
          isHidden: true,
        },
        anomaliesMovingData: {
          labels: [],
          datasets: [],
          isHidden: true,
        },
      },
      currentQueue: [],
      chartsLineColor: [
        //! Цвета обязательно в rgba (для коректной подмены в scatterChart)
        {
          color: "rgba(71, 125, 240, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile975_rcp45"],
        },
        {
          color: "rgba(71, 125, 240, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile025_rcp45"],
        },
        {
          color: "rgba(71, 125, 240, 1)",
          busy: false,
          rerenderBy: "",
          for: ["mean_rcp45"],
        },
        {
          color: "rgba(71, 125, 240, 1)",
          busy: false,
          rerenderBy: "",
          for: ["anomalies_rcp45"],
        },
        {
          color: "rgba(0, 0, 0, 1)",
          busy: false,
          rerenderBy: "",
          for: ["hist"],
        },
        {
          color: "rgba(208, 83, 83, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile975_rcp85"],
        },
        {
          color: "rgba(208, 83, 83, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile025_rcp85"],
        },
        {
          color: "rgba(208, 83, 83, 1)",
          busy: false,
          rerenderBy: "",
          for: ["mean_rcp85"],
        },
        {
          color: "rgba(71, 125, 240, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile975_rcp45"],
        },
        {
          color: "rgba(71, 125, 240, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile025_rcp45"],
        },
        {
          color: "rgba(71, 125, 240, 1)",
          busy: false,
          rerenderBy: "",
          for: ["mean_rcp45"],
        },
        {
          color: "rgba(0, 0, 0, 1)",
          busy: false,
          rerenderBy: "",
          for: ["hist", "hist_moving_anomalies", "hist_moving", "anomalies"],
        },
        {
          color: "rgba(208, 83, 83, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile975_rcp85"],
        },
        {
          color: "rgba(208, 83, 83, 0.15)",
          busy: false,
          rerenderBy: "",
          for: ["quantile025_rcp85"],
        },
        {
          color: "rgba(208, 83, 83, 1)",
          busy: false,
          rerenderBy: "",
          for: ["mean_rcp85"],
        },
        {
          color: "rgba(208, 83, 83, 1)",
          busy: false,
          rerenderBy: "",
          for: ["anomalies_rcp85"],
        },
      ],
      currentChartSettings: {},
    };
  },
  computed: {
    prefixToHist() {
      if (this.period === "1981-2010") {
        return {
          dataPrefix: "era5-land",
          dataTypePrefix: "era5land",
          labelPrefix: "ERA5-Land",
        };
      }
      return {
        dataPrefix: "observed",
        dataTypePrefix: "observed",
        labelPrefix: "Observed",
      };
    },
  },
  methods: {
    isHiddenLabel(label) {
      if (
        !JSON.parse(localStorage.getItem("current-hidden-legend-items")).length
      ) {
        return false;
      }
      if (label.includes("mean") || label.includes("quantile")) {
        if (label.includes("rcp45")) {
          return JSON.parse(
            localStorage.getItem("current-hidden-legend-items")
          ).some((l) => l.includes("(RCP4.5)"));
        }
        if (label.includes("rcp85")) {
          return JSON.parse(
            localStorage.getItem("current-hidden-legend-items")
          ).some((l) => l.includes("(RCP8.5)"));
        }
      }
      if (
        label.includes("hist") ||
        label.includes(this.prefixToHist.dataPrefix)
      ) {
        return JSON.parse(
          localStorage.getItem("current-hidden-legend-items")
        ).some((l) => l.includes("Historical"));
      }
      return JSON.parse(
        localStorage.getItem("current-hidden-legend-items")
      ).find((l) => l === label);
    },
    async exportToImage(e, chartLinkId) {
      this.exportingToImage = true;
      e.preventDefault();
      const options = {
        type: "dataURL",
        imageTimeout: 0,
      };
      this.$refs.contentToExportImg.style.minHeight = `${380 / 13.5}rem`; //   380px / 13.5
      if (this.chartIsSmoothed) {
        this.$refs.checkmarkSvg.style.display = "block";
        this.$refs.checkmarkSvg.setAttribute(
          "width",
          this.$refs.checkmarkSvg.getBoundingClientRect().width
        );
        this.$refs.checkmarkSvg.setAttribute(
          "height",
          this.$refs.checkmarkSvg.getBoundingClientRect().height
        );
        this.$refs.checkmarkSvg.style.width = null;
        this.$refs.checkmarkSvg.style.height = null;
      }
      const canvasURL = await this.$html2canvas(
        this.$refs.contentToExportImg,
        options
      );
      if (this.chartIsSmoothed) {
        this.$refs.checkmarkSvg.style.display = "none";
      }
      let secondTitlePart = `${
        this.defaultScatterChartOptions.scales.yAxes[0].scaleLabel.labelString.split(
          ","
        )[0]
      }`;
      Object.entries(this.originalChartData).forEach((keyValue) => {
        if (this.originalChartData[keyValue[0]].isHidden === false) {
          this.originalChartData[keyValue[0]].datasets.forEach((item) => {
            if (!this.isHiddenLabel(item.label)) {
              if (
                item.realLabel.includes("rcp45") &&
                !secondTitlePart.includes("rcp45")
              ) {
                secondTitlePart += " rcp45";
              }
              if (
                item.realLabel.includes("rcp85") &&
                !secondTitlePart.includes("rcp85")
              ) {
                secondTitlePart += " rcp85";
              }
              if (
                item.realLabel.includes("mean") &&
                !secondTitlePart.includes("rcp45") &&
                !secondTitlePart.includes("rcp85")
              ) {
                secondTitlePart += " rcp45";
              }
              if (
                (item.realLabel.includes("hist") ||
                  this.prefixToHist.dataTypePrefix === "observed") &&
                !secondTitlePart.includes(this.prefixToHist.dataTypePrefix)
              ) {
                secondTitlePart += ` ${this.prefixToHist.dataTypePrefix}`;
              }
            }
          });
        }
      });
      if (this.chartIsSmoothed) {
        if (this.currentDataMode.includes("anomalies")) {
          secondTitlePart += " 5 year moving anomalies average";
        } else {
          secondTitlePart += " 5 year moving average";
        }
      } else if (this.currentDataMode.includes("anomalies")) {
        secondTitlePart += " Anomalies";
      }
      secondTitlePart = secondTitlePart.split(" ").join("_");
      const link = document.querySelector(`#${chartLinkId}`);
      const firstTitlePart = this.chartLabel
        .replace("Oblast", "oblast")
        .split(" ")
        .join("_");
      const title = `${firstTitlePart}_${secondTitlePart}`;
      link.download = `${title}.jpeg`;
      link.href = canvasURL;
      link.click();
      this.exportingToImage = false;
    },
    exportToCsv(chartLinkId) {
      let csvArr = [];
      csvArr.push(["Date"]);
      let secondTitlePart = `${
        this.defaultScatterChartOptions.scales.yAxes[0].scaleLabel.labelString.split(
          ","
        )[0]
      }`;
      Object.entries(this.originalChartData).forEach((keyValue) => {
        if (this.originalChartData[keyValue[0]].isHidden === false) {
          this.originalChartData[keyValue[0]].datasets.forEach((item) => {
            if (!this.isHiddenLabel(item.label)) {
              csvArr[0].push(item.realLabel);
              if (
                item.realLabel.includes("rcp45") &&
                !secondTitlePart.includes("rcp45")
              ) {
                secondTitlePart += " rcp45";
              }
              if (
                item.realLabel.includes("rcp85") &&
                !secondTitlePart.includes("rcp85")
              ) {
                secondTitlePart += " rcp85";
              }
              if (
                item.realLabel.includes("mean") &&
                !secondTitlePart.includes("rcp45") &&
                !secondTitlePart.includes("rcp85")
              ) {
                secondTitlePart += " rcp45";
              }
              if (
                (item.realLabel.includes("hist") ||
                  this.prefixToHist.dataTypePrefix === "observed") &&
                !secondTitlePart.includes(this.prefixToHist.dataTypePrefix)
              ) {
                secondTitlePart += ` ${this.prefixToHist.dataTypePrefix}`;
              }
            }
          });
        }
      });
      if (this.chartIsSmoothed) {
        if (this.currentDataMode.includes("anomalies")) {
          secondTitlePart += " 5 year moving anomalies average";
        } else {
          secondTitlePart += " 5 year moving average";
        }
      } else if (this.currentDataMode.includes("anomalies")) {
        secondTitlePart += " Anomalies";
      }
      secondTitlePart = secondTitlePart.split(" ").join("_");
      csvArr = `${csvArr.join(",")}\n`;
      Object.entries(this.originalChartData).forEach((keyValue) => {
        if (this.originalChartData[keyValue[0]].isHidden === false) {
          for (
            let i = 0;
            i < this.originalChartData[keyValue[0]].labels.length;
            i += 1
          ) {
            const arr = [this.originalChartData[keyValue[0]].labels[i]];
            this.originalChartData[keyValue[0]].datasets.forEach((item) => {
              if (!this.isHiddenLabel(item.label)) {
                if (item.data[i]) {
                  arr.push(item.data[i].y);
                } else {
                  arr.push(null);
                }
              }
            });
            if (arr.slice(1).filter((d) => d !== null).length) {
              csvArr += `${arr.join(",")}\n`;
            }
          }
        }
      });
      const csvData = new Blob([csvArr], { type: "text/csv" });
      const csvUrl = URL.createObjectURL(csvData);
      const firstTitlePart = this.chartLabel
        .replace("Oblast", "oblast")
        .split(" ")
        .join("_");
      const title = `${firstTitlePart}_${secondTitlePart}`;
      const link = document.querySelector(`#${chartLinkId}`);
      link.download = `${title}.csv`;
      link.href = csvUrl;
    },
    generateDateFromLabel(label) {
      let res = label.split("-").map((x) => parseInt(x));
      res = new Date(res[0], res[1] - 1, res[2]);
      return res;
    },
    createDataType(dataType) {
      const { firstScaleLabel, elementsConfig, yAxisID, chartTitle, result } =
        this.currentChartSettings;
      Object.entries(result.data[dataType]).forEach((labelData) => {
        const [label, data] = labelData;
        const legendType =
          label.includes("hist") || dataType.includes("anomalies")
            ? "line"
            : this.chartType;
        this.originalChartData[dataType].labels = data.map((dtLb) => {
          const { x } = dtLb;
          return x;
        });
        this.originalChartData[dataType].datasets.push({
          label: `${result.label} ${label}`,
          realLabel: label.includes("hist")
            ? `${label}_${this.prefixToHist.dataTypePrefix}`
            : label,
          data,
        });
        if (
          this.defaultScatterChartOptions.scales.xAxes[0].ticks.min > data[0].x
        ) {
          this.defaultScatterChartOptions.scales.xAxes[0].ticks.min = data[0].x;
        }
        let chartLabel = `${result.label} ${label}`;
        if (label.includes("mean_rcp45") || label.includes("anomalies_rcp45")) {
          chartLabel = "Middle emissions scenario (RCP4.5)";
        }
        if (label.includes("mean_rcp85") || label.includes("anomalies_rcp85")) {
          chartLabel = "High emissions scenario (RCP8.5)";
        }
        if (label.includes("hist") || label === "anomalies") {
          chartLabel = `Historical ${chartTitle.split(",")[0].toLowerCase()} (${
            this.prefixToHist.labelPrefix
          })`;
        }
        if (!this.originalChartData[dataType].isHidden) {
          let freeColor;
          this.chartsLineColor.forEach((color) => {
            if (!freeColor) {
              freeColor =
                label.includes(
                  color.for.find((type) =>
                    color.for.length > 1 ? label === type : label.includes(type)
                  )
                ) && !color.busy
                  ? color
                  : "";
            }
          });
          freeColor =
            freeColor ||
            this.chartsLineColor.find((color) => color.busy === false);
          this.defaultScatterChartOptions.scales.yAxes[0].scaleLabel.labelString =
            firstScaleLabel;
          const backgroundColor = label.includes("mean")
            ? // eslint-disable-next-line
              freeColor.color
                .split(",")
                .map((x, i) => (i === 3 ? "0.15)" : x))
                .join(",")
            : freeColor.color;
          this.defaultChartData.datasets.push({
            label: chartLabel,
            yAxisID,
            data,
            borderColor: freeColor.color,
            backgroundColor,
            borderWidth: elementsConfig.line.borderWidth,
            showLine: true,
            pointRadius: elementsConfig.point.pointRadius,
            pointHitRadius: elementsConfig.point.pointHitRadius,
            pointHoverRadius: elementsConfig.point.pointHitRadius,
            pointBackgroundColor: elementsConfig.point.pointBackgroundColor
              ? freeColor.color
              : "rgba(0,0,0,0)",
            fill: label.includes("quantile025") ? "-1" : false,
            order: label.includes("mean") ? 1 : 0,
            legend: {
              labels: {
                fontFamily: "'Open Sans', sans-serif",
                type: legendType,
              },
            },
            overlay: this.currentOverlays[this.currentOverlays.length - 1],
          });
          freeColor.busy = true;
          freeColor.rerenderBy = `${result.label} ${label}`;
        }
      });
      if (
        this.currentChartSettings.firstScaleLabel.includes("Precipitation,")
      ) {
        if (this.currentDataMode.includes("anomalies")) {
          this.currentChartSettings.firstScaleLabel = "Precipitation, %";
          this.currentChartSettings.chartTitle = "Precipitation, %";
        } else {
          this.currentChartSettings.firstScaleLabel = "Precipitation, mm";
          this.currentChartSettings.chartTitle = "Precipitation, mm";
        }
      }
    },
    turnOnDataType(dataType) {
      const { firstScaleLabel, elementsConfig, yAxisID, chartTitle } =
        this.currentChartSettings;
      this.originalChartData[dataType].datasets.forEach((dataset) => {
        const label = dataset.realLabel;
        const legendType =
          label.includes("hist") || dataType.includes("anomalies")
            ? "line"
            : this.chartType;
        let chartLabel = dataset.label;
        if (label.includes("mean_rcp45") || label.includes("anomalies_rcp45")) {
          chartLabel = "Middle emissions scenario (RCP4.5)";
        }
        if (label.includes("mean_rcp85") || label.includes("anomalies_rcp85")) {
          chartLabel = "High emissions scenario (RCP8.5)";
        }
        if (label.includes("hist") || label === "anomalies") {
          chartLabel = `Historical ${chartTitle.split(",")[0].toLowerCase()} (${
            this.prefixToHist.labelPrefix
          })`;
        }
        let freeColor;
        this.chartsLineColor.forEach((color) => {
          if (!freeColor) {
            freeColor =
              label.includes(
                color.for.find((type) =>
                  color.for.length > 1 ? label === type : label.includes(type)
                )
              ) && !color.busy
                ? color
                : "";
          }
        });
        freeColor =
          freeColor ||
          this.chartsLineColor.find((color) => color.busy === false);
        this.defaultScatterChartOptions.scales.yAxes[0].scaleLabel.labelString =
          firstScaleLabel;
        const backgroundColor = label.includes("mean")
          ? // eslint-disable-next-line
            freeColor.color
              .split(",")
              .map((x, i) => (i === 3 ? "0.15)" : x))
              .join(",")
          : freeColor.color;
        this.defaultChartData.datasets.push({
          label: chartLabel,
          yAxisID,
          data: dataset.data,
          borderColor: freeColor.color,
          backgroundColor,
          borderWidth: elementsConfig.line.borderWidth,
          showLine: true,
          pointRadius: elementsConfig.point.pointRadius,
          pointHitRadius: elementsConfig.point.pointHitRadius,
          pointHoverRadius: elementsConfig.point.pointHitRadius,
          pointBackgroundColor: elementsConfig.point.pointBackgroundColor
            ? freeColor.color
            : "rgba(0,0,0,0)",
          fill: label.includes("quantile025") ? "-1" : false,
          order: label.includes("mean") ? 1 : 0,
          legend: {
            labels: {
              fontFamily: "'Open Sans', sans-serif",
              type: legendType,
            },
          },
          overlay: this.currentOverlays[this.currentOverlays.length - 1],
        });
        freeColor.busy = true;
        freeColor.rerenderBy = dataset.label;
      });
    },
    generateDefaultChart(parameters) {
      const result = {
        label: parameters.label,
        labels: JSON.parse(JSON.stringify(parameters.labels)),
        data: JSON.parse(JSON.stringify(parameters.data)),
        toDate: parameters.toDate,
        fromDate: parameters.fromDate,
      };
      this.additionalText = parameters.additionalText;
      let yAxisID;
      if (!this.currentOverlays.length) {
        yAxisID = "firstOverlay";
      } else {
        const firstOverlay = this.currentOverlays.find(
          (overlay) => overlay.yAxisID === "firstOverlay"
        );
        if (
          firstOverlay &&
          (firstOverlay.parentName !== parameters.clickedOverlay.parentName ||
            firstOverlay.name !== parameters.clickedOverlay.name)
        ) {
          yAxisID = "secondOverlay";
        } else {
          yAxisID = "firstOverlay";
        }
      }
      if (
        !this.currentOverlays.some(
          (over) =>
            over.parentName === parameters.clickedOverlay.parentName &&
            over.name === parameters.clickedOverlay.name
        )
      ) {
        this.currentOverlays = [
          ...this.currentOverlays,
          {
            parentName: parameters.clickedOverlay.parentName,
            name: parameters.clickedOverlay.name,
            show: parameters.clickedOverlay.show,
            yAxisID,
          },
        ];
      }
      const elementsConfig = {
        point: {
          pointRadius: 0,
        },
        line: {
          showLine: true,
          borderWidth: this.period === "1981-2010" ? 1 : 1.5,
        },
      };
      const firstScaleLabel =
        parameters.chartTitle ||
        this.defaultScatterChartOptions.scales.yAxes[0].scaleLabel.labelString;
      this.currentMode = parameters.mode;
      this.currentChartSettings = {
        firstScaleLabel,
        elementsConfig,
        yAxisID,
        chartTitle: parameters.chartTitle,
        result,
      };
      Object.entries(result.data).forEach((arr) => {
        const dataType = arr[0];
        this.createDataType(dataType);
      });
    },
    clearChart() {
      this.chartsLineColor.forEach((item) => {
        item.busy = false;
        item.rerenderBy = "";
      });
      this.defaultChartData.datasets = [];
      this.defaultChartData.labels = [];
    },
    closeChart() {
      this.clearChart();
      Object.entries(this.originalChartData).forEach((keyValue) => {
        this.originalChartData[keyValue[0]].datasets = [];
        this.originalChartData[keyValue[0]].labels = [];
      });
      this.currentOverlays = [];
      localStorage.setItem("current-hidden-legend-items", JSON.stringify([]));
    },
    rerenderByChart() {
      // this.chartsLineColor.forEach(item => {
      //   item.busy = !!item.rerenderBy;
      // });
      this.chartsLineColor.forEach((item) => {
        item.busy = false;
        item.rerenderBy = "";
      });
      this.defaultChartData.datasets = [];
      this.defaultChartData.labels = [];
      // this.currentOverlays = [];
      Object.entries(this.originalChartData).forEach((keyValue) => {
        this.originalChartData[keyValue[0]].datasets = [];
        this.originalChartData[keyValue[0]].labels = [];
      });
    },
    unselectChartFilter(params) {
      return (chart) => {
        if (chart.label === params.gauge.getGaugeName) {
          if (chart.borderColor) {
            this.chartsLineColor.find(
              (color) => color.color === chart.borderColor
            ).busy = false;
            this.chartsLineColor.find(
              (color) => color.color === chart.borderColor
            ).rerenderBy = "";
          }
          return false;
        }
        return true;
      };
    },
    unselectChart(params) {
      this.defaultChartData.datasets = this.defaultChartData.datasets.filter(
        this.unselectChartFilter(params)
      );
      Object.entries(this.originalChartData).forEach((keyValue) => {
        if (this.originalChartData[keyValue[0]].isHidden === false) {
          this.originalChartData[keyValue[0]].datasets = this.originalChartData[
            keyValue[0]
          ].datasets.filter(this.unselectChartFilter(params));
        }
      });
      const elIndex = this.currentOverlays.findIndex(
        (overlay) =>
          overlay.parentName === params.clickedOverlay.parentName &&
          overlay.name === params.clickedOverlay.name
      );
      this.currentOverlays = this.currentOverlays.filter(
        // eslint-disable-next-line
        (overlay, index) => index !== elIndex
      );
      let hiddenLegendItems = localStorage.getItem(
        "current-hidden-legend-items"
      );
      hiddenLegendItems = JSON.parse(hiddenLegendItems);
      if (hiddenLegendItems.length) {
        const allLabels = [];
        this.defaultChartData.datasets.forEach((dataset) => {
          allLabels.push(dataset.label);
        });
        hiddenLegendItems = hiddenLegendItems.filter((item) =>
          allLabels.includes(item)
        );
        localStorage.setItem(
          "current-hidden-legend-items",
          JSON.stringify(hiddenLegendItems)
        );
      }
    },
    hideLegend() {
      Object.entries(this.originalChartData).forEach((keyValue) => {
        if (this.originalChartData[keyValue[0]].isHidden === false) {
          const processedData = {
            datasets: [],
            labels: JSON.parse(
              JSON.stringify(this.originalChartData[keyValue[0]].labels)
            ),
          };
          this.originalChartData[keyValue[0]].datasets.forEach((dataset) => {
            if (!this.isHiddenLabel(dataset.label)) {
              processedData.datasets.push(JSON.parse(JSON.stringify(dataset)));
            }
          });
          this.defaultChartData.datasets.forEach((dataset) => {
            if (
              processedData.datasets.some(
                (dtset) => dtset.label === dataset.label
              )
            ) {
              dataset.data = processedData.datasets.find(
                (dtset) => dtset.label === dataset.label
              ).data;
              this.defaultChartData.labels = processedData.labels;
            }
          });
        }
      });
    },
    showLegend() {
      Object.entries(this.originalChartData).forEach((keyValue) => {
        if (this.originalChartData[keyValue[0]].isHidden === false) {
          const processedData = {
            datasets: [],
            labels: JSON.parse(
              JSON.stringify(this.originalChartData[keyValue[0]].labels)
            ),
          };
          this.originalChartData[keyValue[0]].datasets.forEach((dataset) => {
            if (!this.isHiddenLabel(dataset.label)) {
              JSON.parse(JSON.stringify(processedData.datasets.push(dataset)));
            }
          });
          this.defaultChartData.datasets.forEach((dataset) => {
            if (
              processedData.datasets.some(
                (dtset) => dtset.label === dataset.label
              )
            ) {
              dataset.data = processedData.datasets.find(
                (dtset) => dtset.label === dataset.label
              ).data;
              this.defaultChartData.labels = processedData.labels;
            }
          });
        }
      });
    },
  },
  watch: {
    "currentChartSettings.firstScaleLabel": function () {
      this.defaultScatterChartOptions.scales.yAxes[0].scaleLabel.labelString =
        this.currentChartSettings.firstScaleLabel;
    },
    "chartMode.option": function () {
      eventEmitter.$emit("update-chart");
    },
    "chartMode.mode": function () {
      eventEmitter.$emit("update-chart");
    },
    currentDataMode(newVal, oldVal) {
      if (!this.chartIsSmoothed) {
        this.originalChartData[newVal].isHidden = false;
        this.originalChartData[oldVal].isHidden = true;
      } else if (oldVal === "defaultData") {
        this.originalChartData.movingData.isHidden = true;
        this.originalChartData.anomaliesMovingData.isHidden = false;
      } else {
        this.originalChartData.movingData.isHidden = false;
        this.originalChartData.anomaliesMovingData.isHidden = true;
      }
    },
    "originalChartData.defaultData.isHidden": function () {
      if (!this.originalChartData.defaultData.isHidden) {
        this.defaultScatterChartOptions.animation.duration = 1000;
        this.clearChart();
        this.turnOnDataType("defaultData");
        if (this.currentChartSettings.firstScaleLabel === "Precipitation, %") {
          this.currentChartSettings.firstScaleLabel = "Precipitation, mm";
          this.currentChartSettings.chartTitle = "Precipitation, mm";
        }
        this.currentAdditionalText = this.additionalTexts.defaultMode;
        if (
          JSON.parse(localStorage.getItem("current-hidden-legend-items"))
            .length > 0 &&
          !this.chartIsSmoothed
        ) {
          localStorage.setItem(
            "current-hidden-legend-items",
            JSON.stringify([])
          );
        }
      }
    },
    "originalChartData.movingData.isHidden": function () {
      if (!this.originalChartData.movingData.isHidden) {
        this.defaultScatterChartOptions.animation.duration = 0;
        this.clearChart();
        this.turnOnDataType("movingData");
        if (this.currentChartSettings.firstScaleLabel === "Precipitation, %") {
          this.currentChartSettings.firstScaleLabel = "Precipitation, mm";
          this.currentChartSettings.chartTitle = "Precipitation, mm";
        }
        this.currentAdditionalText = this.additionalTexts.defaultMode;
        if (
          JSON.parse(localStorage.getItem("current-hidden-legend-items"))
            .length > 0
        ) {
          localStorage.setItem(
            "current-hidden-legend-items",
            JSON.stringify([])
          );
        }
      }
    },
    "originalChartData.anomaliesData.isHidden": function () {
      if (!this.originalChartData.anomaliesData.isHidden) {
        this.defaultScatterChartOptions.animation.duration = 1000;
        this.clearChart();
        this.turnOnDataType("anomaliesData");
        if (this.currentChartSettings.firstScaleLabel === "Precipitation, mm") {
          this.currentChartSettings.firstScaleLabel = "Precipitation, %";
          this.currentChartSettings.chartTitle = "Precipitation, %";
        }
        this.currentAdditionalText = this.additionalTexts.anomaliesMode;
        if (
          JSON.parse(localStorage.getItem("current-hidden-legend-items"))
            .length > 0 &&
          !this.chartIsSmoothed
        ) {
          localStorage.setItem(
            "current-hidden-legend-items",
            JSON.stringify([])
          );
        }
      }
    },
    "originalChartData.anomaliesMovingData.isHidden": function () {
      if (!this.originalChartData.anomaliesMovingData.isHidden) {
        this.defaultScatterChartOptions.animation.duration = 0;
        this.clearChart();
        this.turnOnDataType("anomaliesMovingData");
        if (this.currentChartSettings.firstScaleLabel === "Precipitation, mm") {
          this.currentChartSettings.firstScaleLabel = "Precipitation, %";
          this.currentChartSettings.chartTitle = "Precipitation, %";
        }
        this.currentAdditionalText = this.additionalTexts.anomaliesMode;
        if (
          JSON.parse(localStorage.getItem("current-hidden-legend-items"))
            .length > 0 &&
          !this.chartIsSmoothed
        ) {
          localStorage.setItem(
            "current-hidden-legend-items",
            JSON.stringify([])
          );
        }
      }
    },
    chartIsSmoothed() {
      if (this.chartIsSmoothed) {
        Object.entries(this.originalChartData).forEach((keyValue) => {
          if (
            !keyValue[0].includes("moving") &&
            !keyValue[0].includes("Moving")
          ) {
            this.originalChartData[keyValue[0]].isHidden = true;
          } else if (this.currentDataMode.includes("anomalies")) {
            if (keyValue[0].includes("anomalies")) {
              this.originalChartData[keyValue[0]].isHidden = false;
            }
          } else if (!keyValue[0].includes("anomalies")) {
            this.originalChartData[keyValue[0]].isHidden = false;
          }
        });
        this.originalChartData[this.currentDataMode].isHidden = true;
      } else {
        if (this.currentDataMode.includes("anomalies")) {
          this.originalChartData.anomaliesMovingData.isHidden = true;
        } else {
          this.originalChartData.movingData.isHidden = true;
        }
        this.originalChartData[this.currentDataMode].isHidden = false;
      }
    },
    currentOverlays() {
      if (
        this.currentOverlays.some(
          (overlay) => overlay.yAxisID === "secondOverlay"
        )
      ) {
        this.defaultScatterChartOptions.scales.yAxes[1].display = true;
      } else {
        this.defaultScatterChartOptions.scales.yAxes[1].display = false;
      }
      if (
        this.currentOverlays.some(
          (overlay) => overlay.yAxisID === "firstOverlay"
        )
      ) {
        this.defaultScatterChartOptions.scales.yAxes[0].display = true;
      } else {
        this.defaultScatterChartOptions.scales.yAxes[0].display = false;
      }
      eventEmitter.$emit("update-chart");
    },
  },
  mounted() {
    /* Map actions */
    eventEmitter.$on(
      "generate-default-simple-chart",
      this.generateDefaultChart
    );
    eventEmitter.$on("close-chart", this.closeChart);
    eventEmitter.$on("unselect-chart", this.unselectChart);
    eventEmitter.$on("re-render-chart", this.rerenderByChart);
    this.currentAdditionalText = this.additionalTexts.defaultMode;
    /* Line-Chart actions */
    localStorage.setItem("current-hidden-legend-items", JSON.stringify([]));
  },
};
</script>

<style lang="scss">
.chart-title {
  font-size: $map-chart-title-font-size;
  font-family: "Open Sans", sans-serif;
  color: $main-darkbrown;
  font-weight: 800;
  position: relative;
  top: -3px;
  height: fit-content;
  width: calc(100% - #{$map-chart-close-btn-width} - 6px);
  margin: 0.2142857142857143rem; //  3px / 14
  text-align: center;
}
.download-icons-block__link {
  text-decoration: none;
  color: $main-darkbrown;
  max-width: fit-content;
}
.chart-wrapper {
  min-height: fit-content;
  height: 100%;
}
.control-panel {
  max-width: 100%;
  height: 2.5rem; //  35px / 14
  position: absolute;
  bottom: 1.714285714285714rem; //  24px / 14
  display: flex;
  margin-left: 1.428571428571429rem; //  20px / 14
  align-items: center;
}
.active-icon {
  transition: $control-panel-icon-transition;
}
.active-icon:hover {
  cursor: pointer;
  color: $main-blue;
  transform: $control-panel-icon-hover-transform;
}
.download-icon {
  font-size: $control-panel-download-icon-fontsize;
  margin-right: 0.7142857142857143rem; //  10px / 14
  color: $main-darkbrown;
}
.download-icons-block {
  position: absolute;
  bottom: 0.3571428571428571rem; //  5px / 14
  max-width: fit-content;
  display: flex;
  flex-direction: row;
  margin-top: 2px;
}
.download-icons-block__title {
  font-family: $child-text-font;
  margin-right: 0.7142857142857143rem; //  10px / 14
  font-size: 1rem;
  font-weight: 600;
  color: $main-darkbrown;
}
.additional-description {
  font-size: 0.75rem; //  10.5px / 14
  font-family: "Open Sans", sans-serif;
  color: $main-darkbrown;
  font-weight: 600;
  position: absolute;
  bottom: 4.357142857142857rem; //  61px / 14
  margin: 0 0 1px 1.428571428571429rem; //  20px / 14
  height: fit-content;
}
.chart__checkbox,
.chart__radio {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.chart__checkbox-calm + label::before {
  content: "";
  display: block;
  width: $layers-group-input-size;
  height: $layers-group-input-size;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid $main-darkbrown-opacity;
  background-color: $main-white-opacity2;
  border-radius: $layers-group-elements-margin-right;
  background-repeat: no-repeat;
  background-image: none;
  background-position: center center;
  background-size: 100%;
  cursor: pointer;
  transition: all 0.3s ease-in-out 0s;
}
.chart__checkbox + label {
  user-select: none;
  border: 0 solid;
  border-radius: 0;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
}
.chart__checkbox-checked + label::before {
  border: 1px solid $main-darkbrown;
  background-image: url("../../assets/images/checkmark_icon.svg");
  background-repeat: no-repeat;
  background-size: contain;
}
.chart__checkbox + label::before {
  margin-right: $layers-group-elements-margin-right;
}
.chart__radio + label::before {
  margin-right: $layers-group-elements-margin-right;
}
.smoothingCheckbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: $child-text-font;
  margin-right: 0.7142857142857143rem; //  10px / 14
  font-size: $control-panel-font-size-small;
  font-weight: 600;
  color: $main-darkbrown;
}
.currentDataRadio {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: $child-text-font;
  margin-right: 0.7142857142857143rem; //  10px / 14
  font-size: $control-panel-font-size-small;
  font-weight: 600;
  color: $main-darkbrown;
  white-space: nowrap;
}
.checkmark {
  top: 0.2857142857142857rem; //  4px / 14
  left: 0.0714285714285714rem; //  1px / 14
  position: absolute;
  z-index: 1000;
  display: none;
  width: $layers-group-input-size;
  height: $layers-group-input-size;
  background-image: url("../../assets/images/checkmark_icon.svg");
  background-repeat: no-repeat;
  background-size: auto;
}
.currentDataInput {
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
}
.smoothingInput {
  height: 2.285714285714286rem; //  32px / 14
}
</style>
