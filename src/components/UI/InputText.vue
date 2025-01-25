<template>
  <div class="input-text-wrapper">
    <input
      v-model="textInput"
      placeholder="Enter text..."
      v-focus
      :maxlength="maxLengthText"
      @input="onInput"
      class="input-text"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import debounce from "lodash.debounce";
import { useControlsStore } from "@/stores/controls";

const controlsStore = useControlsStore();

let maxLengthText = 6;
const textInput = ref();

const onInput = debounce(() => {
  controlsStore.text = textInput.value;
}, 1000);

onMounted(() => {
  // использование текста после размонтирования 
  textInput.value = controlsStore.text;
});
</script>

<style lang="scss" scoped>
.input-text {
  font-family: "Play", sans-serif;
  letter-spacing: 1px;
  color: var(--popover-input);
  &::placeholder {
    color: var(--popover-input-placeholder);
  }
}
</style>
