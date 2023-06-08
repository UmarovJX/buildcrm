import Vue from "vue";
import { makeProp as p } from "@/util/props";
import { PROP_TYPE_STRING } from "@/constants/props";
import { v4 } from "uuid";

const COMPONENT_UID_KEY = "_uid";

export const props = {
  id: p(PROP_TYPE_STRING),
};

export const idMixin = Vue.extend({
  props,
  computed: {
    uuid() {
      if (this.id) {
        return this.id;
      }
      return v4() + COMPONENT_UID_KEY;
    },
  },
});
