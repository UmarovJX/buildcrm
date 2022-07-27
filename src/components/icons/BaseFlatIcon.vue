<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.9757 19.7691V3H9.67357V6.36105H3.13013V19.7692H1.99976V21.9999L12.053 22H22.1062V19.7692L20.9757 19.7691ZM10.9225 18.6507L6.46705 18.6509V16.4142H10.9344L10.9225 18.6507ZM10.9225 15.3016L6.46705 15.3018V13.0651H10.9344L10.9225 15.3016ZM10.9225 11.9466L6.46705 11.9467V9.71606H10.9344L10.9225 11.9466ZM17.6384 18.651H15.4018V16.4144H17.6384V18.651ZM17.6384 15.3019H15.4018V13.0653H17.6384V15.3019ZM17.6384 11.9469H15.4018V9.71622H17.6384V11.9469ZM17.6384 8.59782H15.4018V6.36117H17.6384V8.59782Z" :fill="fill"/>
  </svg>
</template>
<script>
export default {
  name: "BaseFlatIcon",
  props: {
    fill: {
      type: String,
      default: "#9CA3AF"
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    }
  }
}
</script>

