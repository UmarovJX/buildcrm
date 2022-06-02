<template>
  <div class="navigation-content d-flex">
    <div class="navigation-content-head w-100">
      <div class="d-flex align-items-center justify-content-center">
        <!--    LEFT DOUBLE ICON    -->
        <circle-button-generator>
          <base-left-double-icon/>
        </circle-button-generator>

        <!--    LEFT ICON    -->
        <circle-button-generator>
          <base-left-icon/>
        </circle-button-generator>

        <!--   MAIN CONTENT     -->
        <div>
          Navigation
        </div>

        <!--   RIGHT ICON     -->
        <circle-button-generator>
          <base-right-icon/>
        </circle-button-generator>

        <!--    RIGHT DOUBLE ICON    -->
        <circle-button-generator>
          <base-right-double-icon/>
        </circle-button-generator>
      </div>
    </div>
  </div>
</template>

<script>
import BaseLeftIcon from "@/components/icons/BaseLeftIcon";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import BaseLeftDoubleIcon from "@/components/icons/BaseLeftDoubleIcon";
import BaseRightDoubleIcon from "@/components/icons/BaseRightDoubleIcon";
import CircleButtonGenerator from "@/components/Elements/Buttons/CircleButtonGenerator";

export default {
  name: "CalendarNavigation",
  components: {
    BaseLeftDoubleIcon,
    BaseLeftIcon,
    CircleButtonGenerator,
    BaseRightIcon,
    BaseRightDoubleIcon
  },
  methods: {

  }
}
</script>

<style scoped>

</style>