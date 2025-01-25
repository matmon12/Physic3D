<template>
  <div class="popover">
    <InputText
      v-if="option === 'text'"
      @keypress.enter="emits('finishInput')"
    />

    <ul v-else class="popover__list">
      <li
        v-for="item in items[option]"
        :key="item.name"
        :class="[
          'popover__list-item',
          { 'is-active': controlsStore[option] === item.name },
        ]"
      >
        <button @click="chooseOption(item)" class="popover__list-btn">
          <img
            :src="getImageUrl(`${option}/${item.img}`)"
            :alt="item.name"
            class="popover__list-img"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { getImageUrl } from "@/utils";
import { useControlsStore } from "@/stores/controls";

const controlsStore = useControlsStore();

const emits = defineEmits(["choose", "finishInput"]);

const props = defineProps({
  option: {
    type: String,
    required: true,
  },
});

const items = ref({
  material: [
    { name: "emerald", img: "material-0.png" },
    { name: "metal", img: "material-1.png" },
    { name: "blue", img: "material-2.png" },
  ],
  env: [
    { name: "back-3.jpg", img: "env-1.svg", class: "forest" },
    { name: "back-1.jpg", img: "env-2.svg", class: "sea" },
    { name: "back-2.jpg", img: "env-3.svg", class: "mountain" },
  ],
});

const chooseOption = (item) => {
  emits("choose");
  controlsStore[props.option] = item.name;

  if (props.option === "env") {
    controlsStore.envClass = item.class;
  }
};
</script>

<style lang="scss" scoped>
.popover {
  padding: 13px 15px;
  backdrop-filter: blur(10px);
  background-color: var(--popover-back);
  border-radius: var(--border-radius-xl);
  position: absolute;
  bottom: calc(100% + 15px);
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px var(--popover-shadow);
}

.popover__list {
  display: flex;
  gap: 15px;
}
.popover__list-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 0 10px var(--popover-item-shadow);
  transition: transform 0.3s;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 15px;
    height: 2px;
    border-radius: 5px;
    background-color: var(--popover-item-active);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s, bottom 0.3s;
  }

  &:not(.is-active):hover {
    transform: scale(1.1);
  }

  &.is-active {
    transform: scale(1.1);
    &::after {
      opacity: 1;
      bottom: -6px;
    }
  }
}
.popover__list-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
