<template>
  <div>
    <!-- <i
      class="fas fa-filter line-legend-panel-icon"
      v-show="legendPanelIconShow"
      @click="legendPanelIconClick()"
    ></i> -->
    <svg
      aria-hidden="true"
      @click="legendPanelIconClick()"
      v-show="legendPanelIconShow"
      focusable="false"
      data-prefix="fas"
      data-icon="filter"
      class="svg-inline--fa fa-filter fa-w-16 line-legend-panel-icon"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      :style="{ width: `${16 / 13.5}rem`, height: `${13 / 13.5}rem` }"
    >
      <path
        fill="currentColor"
        d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"
      ></path>
    </svg>
    <div
      v-show="legendPanelShow"
      :id="chartId + '-line-legend-panel'"
      class="line-legend-panel"
      :style="{ top: legendPanelTop / currentRootFontSize + 'rem' }"
    >
      <!--  -->
      <div
        :ref="chartId + '-line-legendPanelBody'"
        class="line-legend-panel-body"
      ></div>
      <div class="line-legend-panel-arrow-down"></div>
    </div>
    <div :id="chartId" :style="{ height: chartHeightFull + 'px' }">
      <div
        :id="chartId + '-line-legends'"
        class="line-legends"
        v-html="htmlLegend"
      />
      <canvas
        ref="canvas"
        :id="chartId"
        :style="{ height: chartHeightFull + 'px' }"
      >
      </canvas>
    </div>
  </div>
</template>

<script>
import { Scatter, mixins } from "vue-chartjs";
import { eventEmitter } from "../../main.js";

export default {
  name: "ScatterChart",
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      required: true,
    },
    additionalDescriptionHeight: {
      required: true,
    },
    exportingToImage: {
      type: Boolean,
      required: false,
    },
    currentDataMode: {
      type: String,
      required: true,
    },
    xAxesMinForTicks: {
      type: Number,
      required: true,
    },
    parentIsExportingToImg: {
      type: Boolean,
      required: true,
    },
  },
  extends: Scatter,
  data() {
    return {
      legendPanelShow: false,
      legendPanelIconShow: false,
      htmlLegend: null,
      chartHeightRem: 317 / 13.5,
      legendPanelTop: -32,
      hiddenLegendItems: [],
      rendered: true,
    };
  },
  computed: {
    isUniqueLabel() {
      const legendsList = document
        .querySelector(`#${this.chartId}-line-legends`)
        .querySelector("ul");
      const liArrLabel = [];
      legendsList.querySelectorAll("li").forEach((li) => {
        liArrLabel.push(li.querySelector("p").innerText);
      });
      if (this.$refs[`${this.chartId}-line-legendPanelBody`]) {
        this.$refs[`${this.chartId}-line-legendPanelBody`]
          .querySelectorAll("li")
          .forEach((li) => {
            liArrLabel.push(li.querySelector("p").innerText);
          });
      }
      const arrLabel = [];
      this.chartData.datasets.forEach((dataset) => {
        arrLabel.push(dataset.label);
      });
      if (!arrLabel.length) return true;
      return JSON.stringify(liArrLabel) !== JSON.stringify(arrLabel);
    },
    currentRootFontSize() {
      return parseFloat(document.querySelector(":root").style.fontSize) || 13.5;
    },
    chartHeightFull() {
      return (
        (this.currentRootFontSize === 13.5
          ? 13.5
          : this.currentRootFontSize - 0.7) * this.chartHeightRem
      );
    },
  },
  methods: {
    updatechartHeightRem() {
      const legends = document.querySelector(`#${this.chartId}-line-legends`);
      if (!legends) {
        this.chartHeightRem = 317 / 13.5;
        return false;
      }
      if (legends.clientHeight <= 16) {
        this.chartHeightRem =
          317 / 13.5 -
          ((this.additionalDescriptionHeight
            ? this.additionalDescriptionHeight.clientHeight / 13.5
            : 0) +
            18 / 13.5);
      }
      if (legends.clientHeight >= 25) {
        this.chartHeightRem =
          282 / 13.5 -
          (this.additionalDescriptionHeight
            ? this.additionalDescriptionHeight.clientHeight / 13.5
            : 0);
      }
      if (legends.clientHeight >= 40) {
        this.chartHeightRem =
          269 / 13.5 -
          (this.additionalDescriptionHeight
            ? this.additionalDescriptionHeight.clientHeight / 13.5
            : 0);
      }
      if (legends.clientHeight >= 50) {
        this.chartHeightRem =
          257 / 13.5 -
          (this.additionalDescriptionHeight
            ? this.additionalDescriptionHeight.clientHeight / 13.5
            : 0);
      }
      return true;
    },
    updateLegendPanelTop() {
      this.$nextTick(() => {
        const legendPanel = document.querySelector(
          `#${this.chartId}-line-legend-panel`
        );
        if (!legendPanel) {
          this.legendPanelTop = -32;
        } else {
          this.legendPanelTop = -legendPanel.clientHeight - 1;
        }
      });
    },
    legendPanelIconClick() {
      this.legendPanelShow = !this.legendPanelShow;
      this.updateLegendPanelTop();
    },
    isHiddenLabel(label) {
      if (!this.hiddenLegendItems.length) {
        return false;
      }
      return this.hiddenLegendItems.find(
        (li) => li.querySelector("p").innerText === label
      );
    },
    generateHtmlLegend() {
      let hiddenLabels = localStorage.getItem("current-hidden-legend-items");
      hiddenLabels = JSON.parse(hiddenLabels);
      this.hiddenLegendItems = this.hiddenLegendItems.filter((li) =>
        hiddenLabels.includes(li.querySelector("p").innerText)
      );
      const legends = document.querySelector(`#${this.chartId}-line-legends`);
      const legendsList = legends.querySelector("ul");
      if (
        !legendsList.classList.value.split(" ").includes("line-legends-list")
      ) {
        legendsList.classList.add("line-legends-list");
      }
      legendsList.innerHTML = ``;
      const legendPanelBody =
        this.$refs[`${this.chartId}-line-legendPanelBody`];
      legendPanelBody.innerHTML = ``;
      const allLabels = [];
      this.chartData.datasets.forEach((dataset, index) => {
        const chart = this.$data._chart;
        const li = document.createElement("li");
        const spanClass =
          dataset.legend.labels.type === "line"
            ? "legends-li__li-line"
            : "legends-li__li-row";
        li.innerHTML +=
          dataset.legend.labels.type === "line"
            ? `<span class="${spanClass}" style="background-color: ${dataset.borderColor};"></span>
          <p>${dataset.label}</p>`
            : `<div class="${spanClass}" style="background-color: ${dataset.backgroundColor};">
            <span class="legends-li__li-line" style="background-color: ${dataset.borderColor}; margin: 0;"></span>
          </div>
          <p>${dataset.label}</p>`;
        li.classList.add("legend-li");
        allLabels.push(dataset.label);
        if (
          !chart.getDatasetMeta(index).hidden &&
          !this.isHiddenLabel(dataset.label) &&
          !hiddenLabels.includes(dataset.label) &&
          !dataset.label.includes("quantile")
        ) {
          legendsList.appendChild(li);
        } else if (!dataset.label.includes("quantile")) {
          this.hiddenLegendItems = [...this.hiddenLegendItems, li];
          localStorage.setItem(
            "current-hidden-legend-items",
            JSON.stringify(
              this.hiddenLegendItems.map(
                (li) => li.querySelector("p").innerText
              )
            )
          );
          legendPanelBody.appendChild(li);
        }
        const self = this;
        li.addEventListener("click", () => {
          this.rendered = false;
          if (!chart.getDatasetMeta(index).hidden) {
            legendsList.removeChild(li);
            legendPanelBody.appendChild(li);

            self.hiddenLegendItems = [...self.hiddenLegendItems, li];
            localStorage.setItem(
              "current-hidden-legend-items",
              JSON.stringify(
                self.hiddenLegendItems.map(
                  (li) => li.querySelector("p").innerText
                )
              )
            );
            self.$emit("hide-legend");
          } else {
            self.hiddenLegendItems = self.hiddenLegendItems.filter(
              (item) =>
                item.querySelector("p").innerText !==
                li.querySelector("p").innerText
            );
            localStorage.setItem(
              "current-hidden-legend-items",
              JSON.stringify(
                self.hiddenLegendItems.map(
                  (li) => li.querySelector("p").innerText
                )
              )
            );
            legendPanelBody.removeChild(li);
            legendsList.appendChild(li);

            self.$emit("show-legend");
          }
          chart.getDatasetMeta(index).hidden =
            chart.getDatasetMeta(index).hidden === null
              ? !chart.data.datasets[index].hidden
              : null;
          if (li.querySelector("p").innerText.includes("emissions scenario")) {
            chart.getDatasetMeta(index - 1).hidden =
              chart.getDatasetMeta(index - 1).hidden === null
                ? !chart.data.datasets[index - 1].hidden
                : null;
            chart.getDatasetMeta(index - 2).hidden =
              chart.getDatasetMeta(index - 2).hidden === null
                ? !chart.data.datasets[index - 2].hidden
                : null;
          }
          // Находим все наборы данных, которые относятся к текущемо слою
          const indexArr = [];
          self.chartData.datasets.forEach((dtset, index) => {
            if (
              dtset.overlay.parentName === dataset.overlay.parentName &&
              dtset.overlay.name === dataset.overlay.name &&
              dtset.overlay.yAxisID === dataset.overlay.yAxisID
            ) {
              indexArr.push(index);
            }
          });
          let allHiddenForOverlay = true;
          indexArr.forEach((i) => {
            allHiddenForOverlay =
              allHiddenForOverlay && chart.getDatasetMeta(i).hidden;
          });
          // Прямем вторую Y ось, если все наборы данных спрятаны
          chart.scales[dataset.overlay.yAxisID].options.display =
            !allHiddenForOverlay;

          if (!self.hiddenLegendItems.length) {
            self.legendPanelShow = false;
          }
          self.legendPanelIconShow = !!self.hiddenLegendItems.length;
          self.updateChart();
          self.updatechartHeightRem();
        });
        chart.getDatasetMeta(index).hidden =
          this.isHiddenLabel(dataset.label) ||
          hiddenLabels.includes(dataset.label)
            ? !chart.data.datasets[index].hidden
            : null;
      });
      if (allLabels.length) {
        // this.hiddenLegendItems = this.hiddenLegendItems.filter(item =>
        //   allLabels.includes(item.querySelector("p").innerText));
        let hiddenArr = this.hiddenLegendItems.map(
          (li) => li.querySelector("p").innerText
        );
        hiddenArr = [...new Set(hiddenArr)];
        localStorage.setItem(
          "current-hidden-legend-items",
          JSON.stringify(hiddenArr)
        );
      }
      this.updateChart();
      this.rendered = true;
    },
    updateChart() {
      const chart = this.$data._chart;
      if (chart.height && chart.width) {
        if (this.rendered) {
          chart.scales[`${this.options.scales.yAxes[0].id}`].options.display =
            this.options.scales.yAxes[0].display;
          chart.scales[
            `${this.options.scales.yAxes[0].id}`
          ].options.scaleLabel = this.options.scales.yAxes[0].scaleLabel;
          chart.scales[`${this.options.scales.yAxes[1].id}`].options.display =
            this.options.scales.yAxes[1].display;
          chart.scales[
            `${this.options.scales.yAxes[1].id}`
          ].options.scaleLabel = this.options.scales.yAxes[1].scaleLabel;
          this.updatechartHeightRem();
        }
        try {
          chart.update();
        } catch (e) {
          return e;
        }
      }
      this.updateLegendPanelTop();
      return true;
    },
  },
  watch: {
    "chartData.datasets": function (newVal, oldVal) {
      let newLegendType = "";
      let oldLegendType = "";
      newVal.forEach((dataset) => {
        newLegendType += dataset.legend.labels.type;
      });
      oldVal.forEach((dataset) => {
        oldLegendType += dataset.legend.labels.type;
      });
      if (this.isUniqueLabel || newLegendType !== oldLegendType) {
        this.generateHtmlLegend();
      }
      this.updateChart();
    },
    "options.scales.xAxes": function () {
      const chart = this.$data._chart;
      chart.update();
    },
    xAxesMinForTicks() {
      const chart = this.$data._chart;
      chart.options.scales.xAxes[0].ticks.min = this.xAxesMinForTicks;
      chart.update();
    },
    //         const chart = this.$data._chart;
    //   chart.options.animation.duration = this.options.animation.duration;
    //   chart.update();
    // },
    parentIsExportingToImg(newVal, oldVal) {
      if (oldVal && !newVal) {
        this.updatechartHeightRem();
      }
    },
    "options.animation.duration": function () {
      const chart = this.$data._chart;
      chart.options.animation.duration = this.options.animation.duration;
      chart.update();
    },
    chartData() {
      if (this.isUniqueLabel) {
        this.generateHtmlLegend();
      }
      this.updateChart();
    },
    hiddenLegendItems() {
      if (!this.hiddenLegendItems.length) {
        this.legendPanelShow = false;
      }
      this.legendPanelIconShow = !!this.hiddenLegendItems.length;
    },
    exportingToImage() {
      this.legendPanelIconShow =
        !this.exportingToImage && !!this.hiddenLegendItems.length;
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
    let hiddenLabel = localStorage.getItem("current-hidden-legend-items");
    hiddenLabel = JSON.parse(hiddenLabel);
    hiddenLabel.forEach((label) => {
      const li = document.createElement("li");
      const p = document.createElement("p");
      p.innerText = label;
      li.appendChild(p);
      if (
        !this.hiddenLegendItems.some(
          (li) => li.querySelector("p").innerText === label
        )
      ) {
        this.hiddenLegendItems.push(li);
      }
    });
    if (!localStorage.getItem("current-hidden-legend-items")) {
      localStorage.setItem(
        "current-hidden-legend-items",
        JSON.stringify(
          this.hiddenLegendItems.map((li) => li.querySelector("p").innerText)
        )
      );
    }
    const chart = this.$data._chart;
    this.htmlLegend = this.generateLegend();
    chart.update();
    eventEmitter.$on("update-chart", this.updateChart);
  },
};
</script>

<style lang="scss">
canvas {
  background-color: #fff;
}
.legends-li__li-row {
  width: $line-chart-legend-area-width;
  height: $line-chart-legend-area-height;
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin-right: 2px;
}
.line-legends {
  // margin: 0px 0px 5px 10px;
  margin: 0px 0px 0.3571428571428571rem 0.7142857142857143rem; //  0 0 (5px / 13.5) (10px / 13.5)
  max-width: calc(100% - 16px - 16px);
  color: $main-darkbrown;
}
.line-legends-list {
  list-style: none !important;
  white-space: nowrap !important;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: fit-content;
}
.legends-li__li-line,
.legends-li__li-circle {
  display: inline-block;
  text-align: center;
  margin-right: 2px;
}
.legends-li__li-line {
  width: $line-chart-legend-line-width;
  height: $line-chart-legend-line-height;
}
.legends-li__li-circle {
  min-width: $line-chart-legend-circle-width;
  height: $line-chart-legend-circle-height;
  border-radius: $line-chart-legend-circle-border-radius;
}
.legend-li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: $line-chart-legend-margin;
  font-family: $child-text-font;
  font-size: $line-chart-legend-fontsize;
  cursor: pointer;
}
.line-legend-panel-icon {
  position: absolute;
  right: 1.857142857142857rem; //  26px / 13.5
  // top: 0.2857142857142857rem; //  4px / 13.5
  top: 0.3928571428571429rem; //  5.5px / 13.5
  color: $main-darkbrown;
  transition: $control-panel-icon-transition;
  cursor: pointer;
}
.line-legend-panel-icon:hover {
  color: $main-blue;
  transform: scale(1.1);
}
.line-legend-panel {
  position: absolute;
  display: block;
  right: 0px;
  min-width: 100%;
  min-height: fit-content;
}
.line-legend-panel-body {
  position: relative;
  background-color: $main-white;
  border: 1px solid $main-blue;
  border-radius: $control-panel-border-radius;
  width: 100%;
  height: fit-content;
  display: flex;
  padding: 0.7142857142857143rem; //  10px / 13.5
  color: $main-darkbrown-opacity;
}
.line-legend-panel-arrow-down {
  position: relative;
  width: 0;
  height: 0;
  bottom: 0px;
  left: calc(100% - 3.142857142857143rem); //  44px / 13.5
  border-left: 0.7142857142857143rem solid transparent; //  10px / 13.5
  border-right: 0.7142857142857143rem solid transparent; //  10px / 13.5
  border-top: 0.7142857142857143rem solid $main-blue; //  10px / 13.5
}
</style>
