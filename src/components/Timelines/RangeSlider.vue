<template>
  <div style="height: 100%; width: 100%" ref="main">
    <div
      class="slider-tooltip"
      ref="tooltipPanel"
      :style="{ left: tooltipPosition }"
    >
      {{ tooltipValue }}
    </div>
    <input
      type="range"
      min="0"
      :max="endValue"
      v-model="inputValue"
      @input="changeValue()"
      @change="autoInsert()"
      :disabled="disabled"
    />
    <div class="historicalTooltip" ref="historicalTooltip"></div>
    <div class="slider-marks-step" ref="realSteps">
      <div
        v-for="(positionAndLabel, i) in positionAndLabels"
        :key="i"
        class="slider-mark-step"
        :ref="'mark' + i"
      ></div>
    </div>
    <!-- Из-за недостатка html2canvas нам нужно заменять svg элементы на блочные при экспорте в фото -->
    <div class="slider-marks-step-tricky" ref="trickySteps">
      <div
        v-for="(positionAndLabel, i) in positionAndLabels"
        :key="i"
        class="slider-mark-step-tricky"
        :ref="'mark-tricky' + i"
      ></div>
    </div>
    <div
      class="slider-thumb-tricky"
      ref="sliderThumb"
      :style="{ left: thumbPosition }"
    ></div>
  </div>
</template>
<!--  -->
<script>
export default {
  name: "RangeSlider",
  props: {
    labels: {
      type: Object,
      required: true,
    },
    endValue: {
      type: Number,
      required: true,
    },
    value: {
      required: true,
    },
    tooltipMode: {
      type: String,
      required: false,
      default: "default",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isExportingToJpeg: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      inputValue: 0,
      tooltipPanelWidth: 0,
    };
  },
  computed: {
    tooltipValue() {
      if (this.tooltipMode === "historical") {
        const desciption =
          parseInt(this.closestLabelValue.split("-")[1]) <= 2021
            ? "Historical"
            : "Projected";
        return `${this.closestLabelValue} (${desciption})`;
      }
      return this.closestLabelValue;
    },
    currentLabelValue() {
      return this.labels[this.inputValue];
    },
    closestLabelValue() {
      return this.labels[this.getClosest];
    },
    positionAndLabels() {
      return Object.entries(this.labels);
    },
    currentIndex() {
      return this.positionAndLabels.findIndex(
        (positionAndLabel) => parseInt(positionAndLabel[0]) === this.getClosest
      );
    },
    currentRootFontSize() {
      return parseFloat(document.querySelector(":root").style.fontSize) || 13.5;
    },
    tooltipPosition() {
      // Тестовый вариант расчёта позиции подсказки при изменении положения ползунка
      // eslint-disable-next-line
      return `${
        9 -
        (this.currentIndex >= this.positionAndLabels.length / 2
          ? ((this.currentIndex - 1) * -3) / this.currentRootFontSize
          : this.currentIndex < Math.floor(this.positionAndLabels.length / 3)
          ? (this.currentIndex + 2) * -0.4
          : ((this.currentIndex - 1) * -8.4) / this.currentRootFontSize) +
        (((this.$refs.main ? this.$refs.main.clientWidth : 540) - 24) *
          (100 / 100 / this.endValue) *
          this.inputValue -
          this.tooltipPanelWidth / 2)
      }px`;
    },
    thumbPosition() {
      return `${
        parseFloat(this.tooltipPosition.split("px")[0]) +
        (this.tooltipPanelWidth / 2 - 8)
      }px`;
    },
    getClosest() {
      let currentMinValue = parseInt(this.inputValue);
      let minValueStep = 0;
      while (!this.labels[currentMinValue] && currentMinValue >= 0) {
        minValueStep += 1;
        currentMinValue -= 1;
      }
      let currentMaxValue = parseInt(this.inputValue);
      let maxValueStep = 0;
      while (
        !this.labels[currentMaxValue] &&
        currentMaxValue <= this.endValue
      ) {
        maxValueStep += 1;
        currentMaxValue += 1;
      }
      if (this.labels[currentMinValue] && this.labels[currentMaxValue]) {
        return minValueStep > maxValueStep ? currentMaxValue : currentMinValue;
      } else if (this.labels[currentMinValue]) {
        return currentMinValue;
      } else if (this.labels[currentMaxValue]) {
        return currentMaxValue;
      }
      return null;
    },
  },
  methods: {
    changeValue() {
      if (this.currentLabelValue) {
        this.$emit("input", this.currentLabelValue);
      }
    },
    calculateMarkLeft(position, i) {
      const correctPosition =
        11 -
        (i >= this.positionAndLabels.length / 2 ? i * 1.8 : i * 1.6) +
        (this.$refs.main.clientWidth - 24) *
          (100 / 100 / this.endValue) *
          position;
      return `${correctPosition}px`;
    },
    autoInsert() {
      if (!this.currentLabelValue) {
        const closestVal = this.getClosest;
        if (closestVal < this.inputValue) {
          while (this.inputValue - closestVal !== 0) {
            this.inputValue -= 1;
          }
        } else {
          while (closestVal - this.inputValue !== 0) {
            this.inputValue = parseInt(this.inputValue) + 1;
          }
        }
        this.changeValue();
      }
    },
    generateScale() {
      this.positionAndLabels.forEach((positionAndLabel) => {
        if (positionAndLabel[1] === this.value) {
          this.inputValue = parseInt(positionAndLabel[0]);
        }
      });
      this.positionAndLabels.forEach((positionAndLabel, i) => {
        const markLeft = this.calculateMarkLeft(positionAndLabel[0], i);
        this.$refs[`mark${i}`][0].style.left = markLeft;
        this.$refs[`mark-tricky${i}`][0].style.left = markLeft;
      });
      const histEnd = this.positionAndLabels.findIndex(
        (positionAndLabel) => positionAndLabel[1] === "2011-2020"
      );
      if (histEnd === this.positionAndLabels.length - 1) {
        this.$refs.historicalTooltip.style.width = `${
          this.$refs.main.clientWidth - 2
        }px`;
        this.$refs.historicalTooltip.style.borderRadius = "10px";
      } else {
        this.$refs.historicalTooltip.style.width = `${
          parseFloat(this.$refs[`mark${histEnd}`][0].style.left) + 6
        }px`;
        this.$refs.historicalTooltip.style.borderRadius = "10px 0px 0px 10px";
      }
    },
  },
  watch: {
    labels() {
      this.$nextTick(() => this.generateScale());
    },
    endValue() {
      this.$nextTick(() => this.generateScale());
    },
    isExportingToJpeg() {
      if (this.isExportingToJpeg) {
        this.$refs.sliderThumb.style.opacity = 1;
        this.$refs.trickySteps.style.visibility = "visible";
        this.$refs.realSteps.style.visibility = "hidden";
      } else {
        this.$refs.sliderThumb.style.opacity = 0;
        this.$refs.trickySteps.style.visibility = "hidden";
        this.$refs.realSteps.style.visibility = "visible";
      }
    },
  },
  mounted() {
    this.tooltipPanelWidth = this.$refs.tooltipPanel.clientWidth;
    this.generateScale();
    const { width } = window.screen; // Для сайта
    // Медиа-запросы для лучшего вида
    if (width <= 1025 && width > 800) {
      this.$refs.tooltipPanel.style.top = "-25px";
    } else if (width <= 800) {
      this.$refs.tooltipPanel.style.top = "-20px";
    }
    if (width <= 1080) {
      this.$refs.historicalTooltip.style.top = "0.75px";
    } else if (width >= 1440) {
      this.$refs.historicalTooltip.style.top = "0.5px";
    }
  },
};
</script>

<style lang="scss" scoped>
input[type="range"] {
  height: 100%;
  border-radius: calc(#{$map-discret-slider-height} / 2);
  -webkit-appearance: none;
  width: 100%;
  border: 1px solid $main-darkbrown;
  border-width: 1px 0.5px 1px 2px;
}
input[type="range"]:focus {
  input[type="range"]::-webkit-slider-thumb {
    box-shadow: 1px 1px 3px $main-blue;
  }
  outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: $map-discret-slider-height;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 1px 1px 1px $main-darkbrown;
  background: $main-white;
  border-radius: calc(#{$map-discret-slider-height} / 2);
  border: 1px solid $main-darkbrown;
}
input[type="range"]::-webkit-slider-thumb {
  box-shadow: 1px 1px 2px $main-darkbrown;
  height: calc(#{$map-discret-slider-height} - 1px);
  width: $map-discret-slider-height;
  border-radius: 50%;
  background: $main-brown;
  cursor: pointer;
  position: relative;
  z-index: 5;
  -webkit-appearance: none;
  margin-top: 0px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: $main-white;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: $map-discret-slider-height;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 1px 1px 1px $main-darkbrown;
  background: $main-white;
  border-radius: calc(#{$map-discret-slider-height} / 2);
  border: 1px solid $main-darkbrown;
}
input[type="range"]::-moz-range-thumb {
  box-shadow: 1px 1px 2px $main-darkbrown;
  border: 0px solid $main-darkbrown;
  height: calc(#{$map-discret-slider-height} - 1px);
  width: calc(#{$map-discret-slider-height} - 1px);
  border-radius: 50%;
  background: $main-white;
  cursor: pointer;
}
input[type="range"]::-ms-track {
  width: 100%;
  height: $map-discret-slider-height;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type="range"]::-ms-fill-lower {
  background: $main-white;
  border: 1px solid $main-darkbrown;
  border-radius: 16px;
  box-shadow: 1px 1px 1px $main-darkbrown;
}
input[type="range"]::-ms-fill-upper {
  background: $main-white;
  border: 1px solid $main-darkbrown;
  border-radius: 16px;
  box-shadow: 1px 1px 1px $main-darkbrown;
}
input[type="range"]::-ms-thumb {
  margin-top: 1px;
  box-shadow: 1px 1px 2px $main-darkbrown;
  border: 0px solid $main-darkbrown;
  height: calc(#{$map-discret-slider-height} - 1px);
  width: calc(#{$map-discret-slider-height} - 1px);
  border-radius: 50%;
  background: $main-white;
  cursor: pointer;
}
input[type="range"]:focus::-ms-fill-lower {
  background: $main-white;
}
input[type="range"]:focus::-ms-fill-upper {
  background: $main-white;
}
.slider-mark-step-tricky {
  width: 1px;
  margin-right: 1px;
  position: relative;
  height: calc(#{$map-discret-slider-height} - 1px);
  border-radius: 0%;
  background-color: $main-darkbrown;
  // width: 2px;
  // position: relative;
  // height: 19px;
  // border-radius: 0%;
  // background-image: url("../../assets/images/stick.svg");
  // background-repeat: no-repeat;
  // background-size: contain;
}
.slider-mark-step {
  width: 1.5px;
  // width: 2px;
  position: relative;
  height: calc(#{$map-discret-slider-height} - 1px);
  border-radius: 0%;
  background-color: $main-darkbrown;
}
.slider-marks-step,
.slider-marks-step-tricky {
  pointer-events: none;
  height: calc(#{$map-discret-slider-height} - 1px);
  position: relative;
  top: calc(
    #{$map-discret-slider-height} - ((#{$map-discret-slider-height} * 2) +
          0.2557142857142857rem)
  ); //  3.5px / 13.5
  width: 100%;
  display: flex;
}
.slider-marks-step-tricky {
  visibility: hidden;
  position: absolute;
  top: 0;
}
.slider-tooltip {
  position: absolute;
  background-color: $main-white;
  border: 1px solid $main-darkbrown;
  border-radius: calc(#{$map-discret-slider-height} / 2);
  width: fit-content;
  padding: 0.0714285714285714rem 0.3571428571428571rem 0.1428571428571429rem; //  1px / 14 5px / 14
  color: $main-darkbrown;
  // font-size: 12.5px;
  font-size: $control-panel-font-size-small;
  top: -30px;
  white-space: nowrap;
}
.slider-tooltip::after {
  content: "";
  display: block;
  position: absolute;
  top: calc(#{$map-discret-slider-height} - 0.0714285714285714rem); //  1px / 14
  left: calc(50% - 0.3571428571428571rem); //  5px / 14
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.4285714285714286rem 0.3571428571428571rem 0
    0.3571428571428571rem; //  6px 5px 0 5px
  border-color: $main-darkbrown transparent transparent transparent;
}
.historicalTooltip {
  background-color: $main-blue;
  height: calc(#{$map-discret-slider-height} - 1.5px);
  pointer-events: none;
  border-radius: 0.5714285714285714rem 0px 0px 0.5714285714285714rem; //  8px / 14
  position: absolute;
  top: 0.5px;
  left: 0.5px;
  transition: width 0.5s ease-in-out 0s;
}
// @media (max-width: 1080px) {
//   .historicalTooltip {
//     top: 0.75px;
//   }
// }
// @media (max-width: 1280px) {
//   .historicalTooltip {
//     top: 0.5px;
//   }
// }
// @media (max-width: 1366px) {
//   .historicalTooltip {
//     top: 1px;
//   }
// }
// @media (max-width: 1440px) {
//   .historicalTooltip {
//     top: 1px;
//   }
// }
// @media (min-width: 1600px) {
//   .historicalTooltip {
//     top: 0.5px;
//   }
// }
.slider-thumb-tricky {
  height: calc(#{$map-discret-slider-height} - 1px);
  width: $map-discret-slider-height;
  border-radius: 50%;
  background: $main-brown;
  cursor: pointer;
  position: absolute;
  top: 1px;
  z-index: 6;
  -webkit-appearance: none;
  margin-top: 0px;
  opacity: 0;
  pointer-events: none;
  box-shadow: 1px 1px 2px $main-darkbrown;
}
</style>
