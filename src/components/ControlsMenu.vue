<template>
  <div class="controls">
    <div class="controls__inner">
      <div class="controls__btns">
        <button
          v-for="(item, index) in controls"
          :key="index"
          :class="['controls-btn', { 'is-active': targetClick === item.name }]"
          @click.stop="onClickMenu(item.name)"
        >
          <component :is="item.icon"></component>
        </button>
      </div>
    </div>

    <transition name="fade">
      <ControlsPopover
        v-if="isOpen"
        :option="targetClick"
        @choose="closeMenu"
        @finish-input="closeMenu"
        v-on-click-outside.bubble="closeMenu"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, markRaw } from "vue";
import PhTextAaBold from "~icons/ph/text-aa-bold?width=256px&height=256px";
import IconParkOutlineMaterial from "~icons/icon-park-outline/material?width=48px&height=48px";
import IonEarthSharp from "~icons/ion/earth-sharp?width=512px&height=512px";
import { vOnClickOutside } from "@vueuse/components";

const isOpen = ref(false);
const targetClick = ref();
const controls = markRaw([
  {
    name: "text",
    icon: PhTextAaBold,
  },
  {
    name: "material",
    icon: IconParkOutlineMaterial,
  },
  {
    name: "env",
    icon: IonEarthSharp,
  },
]);

const onClickMenu = (name) => {
  if (targetClick.value === name && isOpen.value) {
    closeMenu();
  } else {
    isOpen.value = true;
    targetClick.value = name;
  }
};

const closeMenu = () => {
  isOpen.value = false;
  targetClick.value = null;
};
</script>

<style lang="scss" scoped>
.controls {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
}
.controls__inner {
}
.controls__btns {
  display: flex;
  gap: 20px;
}
.controls-btn {
  border-radius: var(--border-radius-xl);
  display: flex;
  background-color: var(--controls-back);
  transition: filter 0.3s, transform 0.3s, border-color 0.3s;
  width: 50px;
  height: 50px;
  position: relative;

  &:not(.is-active):hover {
    filter: brightness(1.2);
    transform: scale(1.1);
  }
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 30px;
    width: min-content;
  }

  &.is-active {
    transform: scale(1.1);
    color: var(--controls-active);
  }
}

// transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, margin-bottom 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  margin-bottom: -10px;
}
</style>
