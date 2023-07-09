<script>
import { isNUNEZ } from "@/util/inspect";
import material from "@/util/material-colors";
import colorMixin from "@/mixins/colorPickerSwatchesMixin";

let colorMap = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange",
  "brown",
  "blueGrey",
  "black",
];
let colorLevel = [
  "a100",
  "a200",
  "a400",
  "a700",
  "900",
  "800",
  "700",
  "600",
  "500",
  "400",
  "300",
  "200",
  "100",
  "50",
];
let defaultColors = (() => {
  let colors = [];
  colorMap.forEach((type) => {
    let typeColor = [];
    if (type.toLowerCase() === "black" || type.toLowerCase() === "white") {
      typeColor = typeColor.concat(["#000000", "#FFFFFF"]);
    } else {
      colorLevel.forEach((level) => {
        const color = material[type][level];
        if (isNUNEZ(color)) {
          typeColor.push(color.toUpperCase());
        }
      });
    }
    colors.push(typeColor);
  });
  return colors;
})();

export default {
  name: "Swatches",
  mixins: [colorMixin],
  props: {
    palette: {
      type: Array,
      default() {
        return defaultColors;
      },
    },
  },
  computed: {
    pick() {
      return this.colors.hex;
    },
  },
  methods: {
    equal(color) {
      return color.toLowerCase() === this.colors.hex.toLowerCase();
    },
    handlerClick(c) {
      this.colorChange({
        hex: c,
        source: "hex",
      });
    },
  },
};
</script>

<template>
  <div
    role="application"
    aria-label="Swatches color picker"
    class="vc-swatches"
    :data-pick="pick"
  >
    <div class="vc-swatches-box" role="listbox">
      <div
        class="vc-swatches-color-group"
        v-for="(group, $idx) in palette"
        :key="$idx"
      >
        <div
          :class="[
            'vc-swatches-color-it',
            { 'vc-swatches-color--white': c === '#FFFFFF' },
          ]"
          role="option"
          :aria-label="'Color:' + c"
          :aria-selected="equal(c)"
          v-for="c in group"
          :key="c"
          :data-color="c"
          :style="{ background: c }"
          @click="handlerClick(c)"
        >
          <div class="vc-swatches-pick" v-show="equal(c)">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
              <path
                d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vc-swatches {
  width: 320px;
  height: 240px;
  overflow-y: scroll;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.16);
}
.vc-swatches-box {
  padding: 16px 0 6px 16px;
  overflow: hidden;
}
.vc-swatches-color-group {
  padding-bottom: 10px;
  width: 40px;
  float: left;
  margin-right: 10px;
}
.vc-swatches-color-it {
  box-sizing: border-box;
  width: 40px;
  height: 24px;
  cursor: pointer;
  background: #880e4f;
  margin-bottom: 1px;
  overflow: hidden;
  -ms-border-radius: 2px 2px 0 0;
  -moz-border-radius: 2px 2px 0 0;
  -o-border-radius: 2px 2px 0 0;
  -webkit-border-radius: 2px 2px 0 0;
  border-radius: 2px 2px 0 0;
}
.vc-swatches-color--white {
  border: 1px solid #ddd;
}
.vc-swatches-pick {
  fill: rgb(255, 255, 255);
  margin-left: 8px;
  display: block;
}
.vc-swatches-color--white .vc-swatches-pick {
  fill: rgb(51, 51, 51);
}
</style>
