<template>
  <div class="header">
    <div class="container">
      <div class="header__inner">
        <router-link :to="{ name: 'Home' }" class="header-logo">
          <span>THE</span>FOREST
        </router-link>

        <nav class="header__menu">
          <ul class="header__list">
            <li
              v-for="item in menu"
              :key="item.label"
              @click="isActive = item.label"
              :class="[
                'header__list-item',
                { 'is-active': isActive === item.label },
              ]"
            >
              <router-link :to="{ name: item.name }">{{
                item.label
              }}</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isActive = ref("About");
const menu = ref([
  {
    label: "About",
    name: "Home",
  },
  {
    label: "Portfolio",
    name: "Home",
  },
  {
    label: "Contact",
    name: "Home",
  },
  {
    label: "Feedback",
    name: "Home",
  },
]);
</script>

<style lang="scss" scoped>
.header {
  font-family: "Play", sans-serif;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin-top: 15px;
  z-index: 100;

  &__inner {
    @include Panel;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-logo {
    display: flex;
    flex-direction: column;
    width: min-content;
    font-size: 30px;
    line-height: 1;
    color: var(--logo-main);
    font-weight: 700;
    letter-spacing: 1px;
    padding: 5px;
    span {
      color: var(--logo-part);
      font-size: 14px;
      margin-bottom: -5px;
    }
  }
}

.header__list {
  display: flex;
  gap: 15px;
}
.header__list-item {
  border-radius: 10px;
  padding: 5px 10px;
  transition: background-color 0.3s;
  &:not(.is-active):hover {
    background-color: var(--menu-hover);
  }
  a {
    font-size: 20px;
    color: var(--menu-link);
  }
  &.is-active {
    background-color: var(--menu-active-back);
    transition: filter 0.3s;
    a {
      color: var(--menu-active-text);
    }
  }
}
</style>
