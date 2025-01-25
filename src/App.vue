<template>
  <div :class="['app', controlsStore.envClass]">
    <Header />

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useControlsStore } from "@/stores/controls";

const controlsStore = useControlsStore();
</script>

<style scoped lang="scss">
.app{
  position: relative;
}
</style>
