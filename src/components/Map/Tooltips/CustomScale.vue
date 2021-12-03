<template>
  <div class="wrapper" ref="scale">
    <div class="scale">
      <transition-group name="scale-items" class="custom-table" tag="div">
        <div
          v-for="labelObj in getAllLabels"
          :key="labelObj.id"
          class="label-color-wrapper"
        >
          <div
            class="color-wrapper"
            :style="{
              width:
                labelObj.id === getAllLabels.length - 1
                  ? '0'
                  : '2.285714285714286rem',
              backgroundColor: getAllColors[labelObj.id],
              borderWidth:
                labelObj.id === getAllLabels.length - 1
                  ? '0'
                  : labelObj.id === 0
                  ? '1px'
                  : '1px 1px 1px 0',
            }"
          ></div>
          <div class="label-wrapper" :ref="`label${labelObj.id}`">
            <p>{{ labelObj.label }}</p>
          </div>
        </div>
      </transition-group>
    </div>
    <div class="title">
      <p>{{ title }}</p>
    </div>
    <div class="description">
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomScale",
  props: {
    mode: {
      type: String,
      required: false,
      default: "cold2hot",
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
    stepSize: {
      type: Number,
      required: true,
    },
    minValue: {
      type: Number,
      required: true,
    },
    maxValue: {
      type: Number,
      required: true,
    },
    endValue: {
      type: Number,
      required: true,
    },
    startValue: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      required: true,
    },
    currentEmissionScenario: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      claimedZero: false,
      newMaxValue: this.maxValue,
      newMinValue: this.minValue,
      newStartValue: this.startValue,
      newEndValue: this.endValue,
    };
  },
  computed: {
    getAllLabels() {
      this.updateMaxMinValue();
      const labels = [];
      let id = 0;
      if (this.mode === "cold2hot") {
        for (
          let i = this.newStartValue;
          i <= this.newEndValue;
          i += this.stepSize
        ) {
          labels.push({ label: i, id });
          id += 1;
        }
      } else if (this.mode === "hot2cold") {
        for (
          let i = this.newEndValue;
          i >= this.newStartValue;
          i -= this.stepSize
        ) {
          labels.push({ label: i, id });
          id += 1;
        }
      }
      return labels;
    },
    getAllColors() {
      const colors = [];
      this.getAllLabels.forEach((labelObj, i) => {
        let color = null;
        let correctOpacity;
        const value = this.claimedZero
          ? this.getAllLabels[i + 1].label
          : labelObj.label;
        const biggestValueModule =
          Math.abs(this.newMaxValue) > Math.abs(this.newMinValue)
            ? Math.abs(this.newMaxValue)
            : Math.abs(this.newMinValue);
        if (value > 0) {
          color = this.rgbaColors.maxValueColor.split(",");
          correctOpacity = value / biggestValueModule;
          if (this.mode === "hot2cold") {
            if (this.getAllLabels[i + 1].label === 0) {
              this.claimedZero = true;
            } else {
              this.claimedZero = false;
            }
          }
        } else if (value < 0) {
          color = this.rgbaColors.minValueColor.split(",");
          correctOpacity = Math.abs(value) / biggestValueModule;
          if (this.mode === "cold2hot") {
            if (this.getAllLabels[i + 1].label === 0) {
              this.claimedZero = true;
            } else {
              this.claimedZero = false;
            }
          }
        }
        if (color) {
          color[3] = ` ${correctOpacity})`;
          color = color.join();
        }
        if (value >= this.endValue) {
          this.claimedZero = false;
        }
        colors.push(color);
      });
      return colors;
    },
  },
  methods: {
    optimalValue(value) {
      let res = Math.abs(value);
      if (value % this.stepSize !== 0) {
        const optUnit =
          Number.isInteger(this.stepSize) && Number.isInteger(value) ? 1 : 0.1;
        while (!Number.isInteger((res * 10) / (this.stepSize * 10))) {
          res = res * 10 + optUnit * 10;
          res /= 10;
        }
      }
      return value < 0 ? res * -1 : res;
    },
    changeLabelsPosition() {
      for (let i = 0; i < this.getAllLabels.length; i += 1) {
        this.$refs[`label${i}`][0].style.left = `${
          (this.$refs[`label${i}`][0].clientWidth / 2) * -1
        }px`;
      }
    },
    updateMaxMinValue() {
      this.newMinValue = this.optimalValue(this.minValue);
      this.newMaxValue = this.optimalValue(this.maxValue);
      this.newStartValue = this.optimalValue(this.startValue);
      this.newEndValue = this.optimalValue(this.endValue);
    },
  },
  watch: {
    getAllLabels() {
      this.$nextTick(this.changeLabelsPosition);
    },
  },
  mounted() {
    this.changeLabelsPosition();
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: $main-white;
  max-width: 100%;
  min-height: 100%;
  font-family: $child-text-font;
  color: $main-darkbrown;
  padding: 1.071428571428571rem 0.5714285714285714rem; //  15px / 14, 8px / 14
  border-radius: $control-panel-border-radius-small;
}
.title {
  text-align: center;
  width: 100%;
  font-size: $control-panel-font-size;
}
.description {
  text-align: center;
  width: 100%;
  font-size: $control-panel-font-size-small;
}
.scale {
  max-width: fit-content;
  margin: 0 auto;
}
.custom-table {
  display: flex;
  margin-bottom: 0.3571428571428571rem; //  5px / 14
  padding-left: 1rem; //  14px / 14
  flex-direction: row;
}
.color-wrapper {
  border: 1px solid $main-darkbrown;
  height: 1.357142857142857rem; //  19px / 14
  margin: 0;
  padding: 0;
}
.label-color-wrapper {
  display: flex;
  flex-direction: column;
  font-size: $control-panel-font-size-small;
}
.label-wrapper {
  text-align: start;
  position: relative;
  max-width: fit-content;
}
.scale-items-enter-active {
  transition: all 0.5s ease-in-out;
}
.scale-items-leave-active {
  transition: all 0.5s ease-in-out;
}
.scale-items-enter, .scale-items-leave-to /* .list-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateX(5px);
}
</style>
