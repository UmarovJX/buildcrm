<template>
  <main class="app-content">
    <ObjectSort/>
    <!--    <div class="object-cards">-->
    <!--      <object-card v-for="index in 10" :key="index"/>-->
    <!--    </div>-->
    <object-block/>
    <object-block/>
  </main>
</template>

<script>
// import ObjectCard from "@/components/Objects/ObjectCard";
import ObjectSort from "@/components/Objects/ObjectSort";
import ObjectBlock from "@/components/Objects/ObjectBlock";

export default {
  name: "Objects",
  components: {
    // ObjectCard,
    ObjectSort,
    ObjectBlock
  }
}
</script>

<style scoped>
.object-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
</style>