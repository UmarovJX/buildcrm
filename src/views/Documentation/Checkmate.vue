<template>
<main class="checkmate">
  <DocHeader title="checkmate"/>
  <div class="checkmate-content">
    <ChessSquareCard :apartments="apartments"/>
  </div>
</main>
</template>

<script>
import DocHeader from "@/views/Documentation/DocHeader";
import ChessSquareCard from "@/components/Objects/View/Tabs/ChessSquareCard";
export default {
  name: "Checkmate",
  components: {ChessSquareCard, DocHeader},
  data(){
    return {
      apartments: [{
        name: "test1",
      },
        {
          name: "test2"
        }]
    }
  }
}
</script>

<style scoped>

</style>